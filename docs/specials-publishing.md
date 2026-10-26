# Updating specials flyers and their text alternatives

Each flyer entry in `src/data/specials.ts` owns both the image reference and its `textAlternative`. The Specials page renders the selected entry below its flyer in a native “Read this ad as text” disclosure. Keep both versions synchronized when publishing.

1. Replace the appropriate image in `public/images/specials/biweekly` or `public/images/specials/weekend`.
2. Update that entry’s `title` and concise `alt` so they identify the actual flyer, page, and date range.
3. Update `textAlternative.heading`, `effectiveDates`, and every offer’s name, price/unit, package size, grade/brand, and description. Include advertised notices, availability limits, special hours, and relevant store details. Do not omit an offer merely because it appears in a small panel.
4. Use the dates printed on the ad. If dates are only on its paired page, explicitly say so; do not invent dates or relabel old offers as current.
5. Compare the opened text disclosure with every panel of the new flyer. Verify price decimals, per-pound versus each pricing, sizes, phone numbers, and dates.
6. Check Weekly and Weekend categories and both pages, including a narrow mobile viewport. Use Enter/Space to open and close the disclosure. Its open state should persist while changing ads; its content should always follow the selected ad.

The initial content was visually transcribed from the four checked-in flyers, which advertise June/July 2026 dates. Updating these flyer files later without updating their text will leave an inaccurate alternative. No automatic OCR or content synchronization service is configured.
