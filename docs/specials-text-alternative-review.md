# Specials text alternative — implementation review

Recipes are outside the current scope.

## Proposed visible addition

Directly below the currently selected flyer and its existing “View Full Ad” controls, add a collapsed native disclosure labeled **Read this ad as text**. Opening it shows a text heading, the flyer’s effective dates, and a single-column list of products with prices, units, descriptions, and relevant notices. Text uses the existing black/gray colors on white. The disclosure has a thin existing brown border and normal page spacing; the flyer, category buttons, viewer, and their layout remain unchanged.

The disclosure follows the selected category/page. Keep it open when changing ads, updating its content to the newly selected flyer. The full-size image viewer stays unchanged. A concise image alternative identifies each ad and page, rather than trying to contain every offer.

## Source and publishing

The authoritative source for this initial transcription is the four image files currently under `public/images/specials`. They show **June 26–July 9, 2026** for the weekly ad and **June 13–14, 2026** for the weekend ad. These dates must not be represented as October/current prices. The second weekend image has no printed dates; the text will explicitly identify its date range as inherited from the paired weekend ad.

Store typed text content beside each image in `src/data/specials.ts`. Whenever a flyer is replaced, update its title, alternative, effective dates, offers, and notices in the same change. No OCR service, automatic price extraction, or fabricated expiry rule is introduced.

## Review status

The user explicitly approved “Apply the disclosure below each flyer.” The disclosure is now implemented, with typed text stored beside each flyer. Existing placeholder flyer captions were corrected to identify the pictured specials. See `specials-publishing.md` for the recurring update workflow.
