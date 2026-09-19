# cf132 — Neutral pilots and portrait cleanup

- Added Neutral to pilot identity, saved records and reload validation, with a silver UI accent.
- Facial-hair thumbnail generation now preserves aspect ratio; the UI contains the complete image instead of cropping it.
- Removed the remaining pale perimeter from female and male asymmetrical styles. All five fitted layer dimensions and alpha masks remain identical; no placement changed.

Verified Neutral selection/save/reload and beard previews on desktop and portrait phone. Browser test completed without page errors. The cleanup is reproducible through tests/import-fitted-pilots.py. Original PSDs remain unchanged.
