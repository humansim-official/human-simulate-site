# HUMAN SIMULATE official website

Buildless static HTML, CSS, and JavaScript for GitHub Pages.

## Files

- `index.html`: Japanese home page, featured games, news, works, links, and streaming guidelines.
- `en/index.html`: English home page.
- `recruit.html`, `en/recruit.html`: recruitment information.
- `style.css`, `script.js`: shared styles, mobile navigation, and manual featured-game selection.
- `assets/images/`: shared images, including the optimized OL game visuals.

## Local preview

Run from the project folder:

```sh
python -m http.server 8123 --bind 127.0.0.1
```

Open `http://127.0.0.1:8123/`. No build or dependency installation is required.

## Publishing

Repository: https://github.com/humansim-official/human-simulate-site

Public site: https://humansim-official.github.io/human-simulate-site/

Place the site files at the root of the `main` branch.
The existing GitHub Pages workflow builds and publishes that branch.
Relative asset and language links support both a domain root and a project subdirectory.
This repository is for the website only; game files and production assets are managed separately.

Do not upload `.preview/`: it contains local source backups, source-image inspection
copies, and verification screenshots. It is excluded from Git and the delivery ZIP.

## Updating Tonari no OL-san

Both home pages contain the work card at `id="work-ol"`.
The Japanese description is the author's supplied copy; the English page translates it.
The English heading uses a romanized title, not a confirmed English release title.

The store and preview pages are currently under review. When real URLs are available:

1. Replace the `release-notice` block in both home pages with the appropriate links.
2. Use the existing `button button--chip` style, `target="_blank"`, and `rel="noopener noreferrer"`.
3. Update the status in `feature-ol` and add a dated news item.

The feature uses manual selection, with no autoplay. Its buttons support mouse,
touch, Left/Right arrows, and Home/End keys. Without JavaScript, the first feature
and all work cards remain readable, and the navigation remains available.

GA4 measurement ID `G-D9LKPD24TH` is retained once on each of the four pages.
Existing store links, contact information, and streaming guideline text are retained.
