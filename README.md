# vivekkhimani.github.io

Personal site. Jekyll, built by GitHub Pages directly. There is no build step to
run and no `node_modules`; push to `master` and it deploys.

## Adding things

**A post.** Drop a markdown file in `_posts/` named `YYYY-MM-DD-some-slug.md`.
It lands at `/writing/some-slug/`. Front matter needs `title`; `summary` and
`tags` are optional. Copy `_drafts/TEMPLATE.md` to start. Anything left in
`_drafts/` is never published, so half-written posts are safe to commit.

**Photos.**

```
python tools/photos.py add joshua-tree ~/Pictures/jt/*.HEIC \
    --title "Joshua Tree" --date 2025-03-15 --place joshua \
    --note "Ryan Mountain, then a night in an Airstream."
```

Takes HEIC straight off an iPhone, or JPEG, or PNG, and always writes JPEG and
WebP.

Resizes to three widths as WebP and JPEG, strips EXIF including GPS, records the
dimensions the layout needs before images load, and writes `_albums/joshua-tree.md`.
Re-run with the same slug to add more; existing photos are left alone. Add a
`cap:` to any photo in that file if it wants a caption.

    pip install Pillow pillow-heif

`--place` takes an id from `_data/places.yml` and cross-links the album with its
marker on the map.

**A place on the map.** Add an entry to `_data/places.yml`. That file drives both
`/travel` and the album cross-links.

**Work, papers, projects, CV.** `_data/work.yml`, `publications.yml`,
`projects.yml`, `education.yml`. All of it is content, none of it is markup.

## Reading

`_data/books.json` is generated. `.github/workflows/goodreads.yml` pulls the
Goodreads shelves once a day and commits when something changed. Goodreads
retired its API in 2020, but per-shelf RSS still works without a key. Run it by
hand with `python tools/goodreads.py`.

## Local preview

```
bundle install
bundle exec jekyll serve
```

`Gemfile` pins the `github-pages` gem, so a local build matches what deploys.
If Ruby complains about `Invalid US-ASCII character`, set `LANG=C.UTF-8`.

## Layout

```
_data/        content: places, work, publications, projects, education, books
_posts/       writing            _drafts/   unpublished
_albums/      one file per photo album, written by tools/photos.py
_layouts/     base, page, post, album       _includes/  nav, footer, gallery
photos/       resized derivatives
assets/       css/site.css is the whole stylesheet; js/ is map + gallery
tools/        goodreads.py, photos.py
```

`v1/`, `portfolio-details/` and `assets/vendor/` are the old site. They carry no
front matter, so Jekyll copies them through byte for byte and every old link
keeps working.
