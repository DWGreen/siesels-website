# Updating specials flyers and their text alternatives

Each flyer entry in `src/data/specials.ts` owns both the image reference and its `textAlternative`. The Specials page renders the selected entry below its flyer in a native “Read this ad as text” disclosure. Keep both versions synchronized when publishing.

1. Replace the appropriate image in `public/images/specials/biweekly` or `public/images/specials/weekend`.
2. Update that entry’s `title` and concise `alt` so they identify the actual flyer, page, and date range.
3. Update `textAlternative.heading`, `effectiveDates`, and every offer’s name, price/unit, package size, grade/brand, and description. Include advertised notices, availability limits, special hours, and relevant store details. Do not omit an offer merely because it appears in a small panel.
4. Use the dates printed on the ad. If dates are only on its paired page, explicitly say so; do not invent dates or relabel old offers as current.
5. Compare the opened text disclosure with every panel of the new flyer. Verify price decimals, per-pound versus each pricing, sizes, phone numbers, and dates.
6. Check Weekly and Weekend categories and both pages, including a narrow mobile viewport. Use Enter/Space to open and close the disclosure. Its open state should persist while changing ads; its content should always follow the selected ad.

The initial content was visually transcribed from the four checked-in flyers, which advertise June/July 2026 dates. Updating these flyer files later without updating their text will leave an inaccurate alternative. No automatic OCR or content synchronization service is configured.

## Guided ad view

The lightbox defaults to guided view when `guidedRegions` are available. Each region
has a visitor-facing `label` and `x`, `y`, `width`, and `height` bounds expressed as
percentages of the original image. The origin is the top-left corner; coordinates
must stay within 0–100, including x + width and y + height.

For each new flyer, ask AI to visually inspect the original image and update both
its text alternative and its guided regions. Include every item, with its photo,
description, and complete price/unit in the crop. Order regions in a natural
reading sequence. Wide feature panels can stay wide; do not crop away their price.
These bounds are authored data, not automatic image detection at runtime.

Check every crop in the viewer on desktop and mobile, then toggle guided view off
to check the full-page view. Check item navigation, page navigation, and closing
with Escape. Pages without regions fall back to the full ad automatically.

Guided navigation combines all regions in category page order into one sequence.
The item controls cross page boundaries in either direction, with a combined item
count. Full-ad mode uses the same navigation area for page controls instead.
