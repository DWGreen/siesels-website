# Image optimization

Run `node scripts/optimize-images.cjs` from the repository root to preview savings;
add `--write` to generate replacements and update direct references in `src`.
The script uses Sharp, installed with Next.js. It only processes referenced raster
assets over 200 KB and skips specials flyers, logos, animated images, and previously
optimized files. Dynamically constructed paths need a separate manual review.

Photos use WebP quality 80, with a maximum width of 1600 pixels (2400 for heroes).
Illustrations and holiday product images use quality 85; transparency is preserved.
Images are never enlarged. Only conversions saving at least 10% are retained.
Output URLs contain a content hash to avoid stale browser and optimizer caches.

Original files are backed up under `image-originals/` before removal from `public`.
That directory is ignored by Git: these backups exist only in the local checkout.
Committed originals also remain recoverable from Git history. Keep master artwork
in a separate durable asset archive when adding new images.

`image-optimization-report.json` records the most recent write pass. Its byte
savings describe source assets, not measured browser transfers: Next.js still
creates responsive variants on demand for components using `next/image`.

Visually review photography, transparent artwork, and any embedded text before
publishing. Specials flyers retain their existing files and dimensions for zoom.
