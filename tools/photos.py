#!/usr/bin/env python3
"""Add a photo album to the site.

Resizes to three widths as both WebP and JPEG, strips GPS out of EXIF, records
dimensions the justified layout needs before images load, and writes the album
page. Photos straight off a phone are 3 to 6 MB each and carry the exact
coordinates they were taken at, including the ones taken at home.

    python tools/photos.py add joshua-tree ~/Pictures/jt/*.HEIC
    python tools/photos.py add joshua-tree ~/Pictures/jt/*.jpg --title "Joshua Tree" \
        --date 2025-03-15 --place joshua --note "Ryan Mountain, then a night in an Airstream."

Takes whatever the camera produced, HEIC included, and always writes JPEG and
WebP. Re-running with the same slug adds new photos and leaves existing ones
alone. Captions are optional: edit `cap:` in _albums/<slug>.md afterwards for any
photo that wants one.

    pip install Pillow pillow-heif
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys
from datetime import date

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("needs Pillow:  pip install Pillow")

# iPhones shoot HEIC by default and Pillow cannot read it on its own.
try:
    from pillow_heif import register_heif_opener

    register_heif_opener()
    HEIF = True
except ImportError:
    HEIF = False

HEIF_SUFFIXES = {".heic", ".heif"}

ROOT = pathlib.Path(__file__).resolve().parent.parent
WIDTHS = (320, 640, 1280, 2000)
JPEG_QUALITY = 82
WEBP_QUALITY = 80


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def titleize(slug: str) -> str:
    return slug.replace("-", " ").title()


def capture_date(img: Image.Image) -> date | None:
    exif = img.getexif()
    for tag in (36867, 306):  # DateTimeOriginal, DateTime
        raw = exif.get(tag)
        if raw:
            try:
                return date(int(raw[0:4]), int(raw[5:7]), int(raw[8:10]))
            except (ValueError, IndexError):
                pass
    return None


def derive(src: pathlib.Path, out_dir: pathlib.Path, stem: str):
    """Write each width of one photo, never upscaling.

    Returns (full_w, full_h, widths_written, capture_date). Only widths that were
    actually written go in the manifest, so a srcset descriptor never claims a
    size the file does not have.
    """
    with Image.open(src) as img:
        taken = capture_date(img)
        # Honour the orientation flag, then drop EXIF entirely on the way out.
        img = ImageOps.exif_transpose(img).convert("RGB")
        full_w, full_h = img.size

        widths = [w for w in WIDTHS if w <= full_w] or [full_w]
        if full_w not in widths and full_w < max(WIDTHS):
            widths.append(full_w)  # keep the native size as the largest option

        for width in widths:
            h = max(1, round(full_h * width / full_w))
            resized = img.resize((width, h), Image.LANCZOS) if width != full_w else img
            target = out_dir / str(width)
            target.mkdir(parents=True, exist_ok=True)
            resized.save(target / f"{stem}.jpg", "JPEG",
                         quality=JPEG_QUALITY, optimize=True, progressive=True)
            resized.save(target / f"{stem}.webp", "WEBP", quality=WEBP_QUALITY, method=5)
    return full_w, full_h, sorted(widths), taken


def read_existing(page: pathlib.Path) -> tuple[str, list[str]]:
    """Split an album page into (front matter, body) if it already exists."""
    if not page.exists():
        return "", []
    parts = page.read_text().split("---\n", 2)
    return (parts[1], parts[2].splitlines()) if len(parts) >= 3 else ("", [])


def add(args: argparse.Namespace) -> int:
    slug = slugify(args.slug)
    sources = [pathlib.Path(p).expanduser() for p in args.photos]
    missing = [str(p) for p in sources if not p.is_file()]
    if missing:
        sys.exit("not found: " + ", ".join(missing))

    if not HEIF and any(p.suffix.lower() in HEIF_SUFFIXES for p in sources):
        sys.exit("these are HEIC files, which Pillow cannot read on its own.\n"
                 "  pip install pillow-heif")

    out_dir = ROOT / "photos" / slug
    page = ROOT / "_albums" / f"{slug}.md"
    front, body = read_existing(page)

    known = set(re.findall(r"\{\s*f:\s*([\w.\-]+)", front))
    entries, dates, skipped = [], [], 0

    for src in sorted(sources):
        stem = slugify(src.stem)
        if stem in known:
            skipped += 1
            continue
        w, h, widths, taken = derive(src, out_dir, stem)
        if taken:
            dates.append(taken)
        # `src` is the plain fallback for browsers that ignore srcset.
        fallback = max([x for x in widths if x <= 1280], default=widths[0])
        sizes = "[" + ", ".join(str(x) for x in widths) + "]"
        entries.append(f"  - {{f: {stem}, w: {w}, h: {h}, s: {sizes}, src: {fallback}}}")
        print(f"  {src.name}  {w}x{h}  -> {', '.join(str(x) for x in widths)}")

    if not entries:
        print(f"nothing new for {slug} ({skipped} already present)")
        return 0

    if page.exists():
        # Append to the photos list already in the front matter.
        text = page.read_text()
        text = text.rstrip("\n")
        head, sep, tail = text.partition("\n---\n")
        head = head + "\n" + "\n".join(entries)
        page.write_text(head + sep + tail + "\n")
    else:
        when = args.date or (min(dates).isoformat() if dates else date.today().isoformat())
        page.parent.mkdir(parents=True, exist_ok=True)
        lines = [
            "---",
            f"title: {args.title or titleize(slug)}",
            f"date: {when}",
            f"dir: {slug}",
        ]
        if args.place:
            lines.append(f"place: {args.place}   # id from _data/places.yml")
        if args.note:
            lines.append(f"note: {args.note}")
        lines += ["photos:"] + entries + ["---", ""]
        page.write_text("\n".join(lines))

    print(f"\n{len(entries)} added, {skipped} skipped")
    print(f"  photos/{slug}/")
    print(f"  _albums/{slug}.md")
    print("\nEXIF stripped, including GPS. Review the page, then commit.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("add", help="add photos to an album, creating it if needed")
    a.add_argument("slug", help="album slug, e.g. joshua-tree")
    a.add_argument("photos", nargs="+", help="source image files")
    a.add_argument("--title", help="album title (default: derived from the slug)")
    a.add_argument("--date", help="YYYY-MM-DD (default: earliest capture date)")
    a.add_argument("--place", help="id from _data/places.yml, links the album to the map")
    a.add_argument("--note", help="one line shown under the album title")
    a.set_defaults(func=add)
    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
