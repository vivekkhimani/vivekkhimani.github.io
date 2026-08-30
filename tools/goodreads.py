#!/usr/bin/env python3
"""Pull Goodreads shelves into _data/books.json.

Goodreads retired its public API in December 2020 and issues no new keys, but
per-shelf RSS still works without one. Fetching at build time rather than in the
browser avoids a CORS proxy and keeps the page rendering if Goodreads is down.

    python tools/goodreads.py            # writes _data/books.json
    python tools/goodreads.py --stdout   # prints instead, for a dry run
"""
from __future__ import annotations

import argparse
import html
import json
import pathlib
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

FEED = "https://www.goodreads.com/review/list_rss/{user}?shelf={shelf}&page={page}"
# Goodreads shelf name -> the key templates read. Hyphens break Liquid dot access.
SHELVES = {"currently-reading": "reading", "read": "read", "to-read": "queue"}
MAX_PAGES = 20
ROOT = pathlib.Path(__file__).resolve().parent.parent


def text(item: ET.Element, tag: str) -> str:
    el = item.find(tag)
    return (el.text or "").strip() if el is not None and el.text else ""


def parse_date(raw: str) -> str | None:
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z"):
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


SIZE_RE = re.compile(r"\._S[XY]\d+_(?=\.[a-zA-Z]+$)")


def cover(item: ET.Element, height: int) -> str:
    """Ask Goodreads for a cover bounded to `height` pixels.

    The feed hands back thumbnails, and half the covers carry no size token at
    all, which serves the full scan and runs to a couple of hundred KB each.
    """
    url = text(item, "book_large_image_url") or text(item, "book_medium_image_url")
    if not url:
        return ""
    token = f"._SY{height}_"
    if SIZE_RE.search(url):
        return SIZE_RE.sub(token, url)
    stem, dot, ext = url.rpartition(".")
    return f"{stem}{token}{dot}{ext}" if dot else url


BR_RUN = re.compile(r"(?:\s*<br\s*/?>\s*)+", re.I)
TAG = re.compile(r"<[^>]+>")


def review_paragraphs(raw: str) -> list[str]:
    """Split a Goodreads review into paragraphs.

    Reviews come back as plain text with <br> for line breaks and nothing else.
    Any other markup is dropped rather than trusted, and the result is stored as
    plain strings so the template escapes it like any other text.
    """
    if not raw:
        return []
    parts = (html.unescape(TAG.sub("", chunk)).strip() for chunk in BR_RUN.split(raw))
    return [p for p in parts if p]


def fetch_shelf(user: str, shelf: str) -> list[dict]:
    books: list[dict] = []
    for page in range(1, MAX_PAGES + 1):
        url = FEED.format(user=user, shelf=shelf, page=page)
        with urllib.request.urlopen(url, timeout=30) as response:
            items = ET.fromstring(response.read()).findall(".//item")
        if not items:
            break
        for item in items:
            rating = text(item, "user_rating")
            book_id = text(item, "book_id")
            books.append({
                "id": book_id,
                "title": text(item, "title"),
                "author": " ".join(text(item, "author_name").split()),
                # Two crops: the shelf grid renders at about 92px, the
                # currently-reading cards at about four times that.
                "cover": cover(item, 475),
                "coverSmall": cover(item, 300),
                "link": f"https://www.goodreads.com/book/show/{book_id}",
                "rating": int(rating) if rating.isdigit() and rating != "0" else None,
                "avgRating": text(item, "average_rating") or None,
                "published": text(item, "book_published") or None,
                "readAt": parse_date(text(item, "user_read_at")),
                "addedAt": parse_date(text(item, "user_date_added")),
                "review": review_paragraphs(text(item, "user_review")),
            })
    return books


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--user", help="Goodreads numeric user id (default: from _config.yml)")
    ap.add_argument("--stdout", action="store_true", help="print instead of writing the file")
    args = ap.parse_args()

    user = args.user
    if not user:
        config = (ROOT / "_config.yml").read_text()
        for line in config.splitlines():
            if line.startswith("goodreads_user:"):
                user = line.split(":", 1)[1].strip().strip('"\'')
                break
    if not user:
        print("no goodreads_user in _config.yml and none given", file=sys.stderr)
        return 1

    data = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "profile": f"https://www.goodreads.com/user/show/{user}",
        "shelves": {},
    }
    for shelf, key in SHELVES.items():
        books = fetch_shelf(user, shelf)
        if key == "read":
            # Newest finish first. Falls back to date added where a finish date
            # was never recorded, which is true of most backfilled entries.
            books.sort(key=lambda b: b["readAt"] or b["addedAt"] or "", reverse=True)
        data["shelves"][key] = books
        print(f"{shelf:18s} {len(books):4d}", file=sys.stderr)

    payload = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    if args.stdout:
        sys.stdout.write(payload)
        return 0

    out = ROOT / "_data" / "books.json"
    if out.exists() and json.loads(out.read_text()).get("shelves") == data["shelves"]:
        print("no change", file=sys.stderr)
        return 0
    out.write_text(payload)
    print(f"wrote {out.relative_to(ROOT)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
