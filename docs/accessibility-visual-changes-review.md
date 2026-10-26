# Accessibility visual changes — review before implementation

Status: **secondary text contrast, focus indicators, and the specials text disclosure were explicitly approved and implemented. Other visual/content proposals remain deferred.**

The user requested review before appearance changes. Approvals cover the documented contrast/focus updates and, subsequently, the specials text disclosure described in section 3. Other appearance changes remain subject to review.

## 1. Secondary text contrast — approved and implemented

| Location | Current appearance | Proposed change | Reason |
| --- | --- | --- | --- |
| Reservation counts; Gift Cards count/helper copy | `text-neutral-500` (`#737373`) on cream | `text-neutral-600` (darker gray) | Browser measured 4.46:1; normal text needs 4.5:1. |
| Steak 101 category/“Learn more” labels | `text-neutral-400` (`#a1a1a1`) | `text-neutral-600` | Current ratio is 2.58:1 on white; target at least 4.5:1. |
| Recipe sidebar empty-state/storage text | `text-neutral-500` on neutral-100 | `text-neutral-600` | Current ratio is 4.34:1. |

Implemented on the failing reservation/Gift Cards count/helper text and recipe sidebar text. All 14 targeted desktop/mobile scans now report no color-contrast violations. The current Steak 101 category/“Learn more” styling was already burgundy and passed; it was preserved. Font sizes, spacing, backgrounds, images, and disabled/decorative text were not changed. Image-background contrast still needs manual checks.

## 2. Visible keyboard focus — approved and implemented

Proposed: add a **2px solid focus ring with a 2px offset**, using burgundy/dark contrast on light surfaces and white on dark surfaces. Apply only when `:focus-visible`, so ordinary pointer interactions retain their current appearance.

Targets: footer newsletter field, sandwich quantity selectors, checkout/customer fields, cart controls, recipe search controls, and any other controls that remove outlines without a sufficiently visible replacement. Native focus styles that already work should remain.

This indicator change is now approved. It uses the browser’s `:focus-visible` heuristic; browsers may also show it on editable fields focused by pointer. It does not reserve space or change element dimensions. Existing working native focus styles elsewhere remain in place.

## 3. Specials text alternative — approved and implemented

Keep the existing flyer presentation. Proposed addition: a “Specials in text” section below the flyer containing product, price, unit, and effective dates, populated from the same weekly publishing workflow. A collapsible section would reduce visual length but must use a keyboard-accessible disclosure.

The user subsequently approved the documented “Read this ad as text” disclosure beneath each flyer. It is implemented with native details/summary, visually transcribed offers from the four checked-in images, their printed dates, and notices. Text follows the selected flyer, retaining disclosure state across selection changes. See [the reviewed design](specials-text-alternative-review.md) and [publishing workflow](specials-publishing.md). No automatic content synchronization is configured.

## 4. Page heading/landmark hierarchy — typography decisions deferred

The nested Gift Cards main landmark was corrected by changing only its wrapper tag. Its secondary heading and the Party Platters content heading now use h2, retaining all explicit classes. Before/after browser measurements at desktop and mobile confirmed identical typography and dimensions, so these semantic corrections required no appearance change. Other heading-level cleanup should retain all explicit classes or be reviewed if it affects appearance.

## 5. Image alternatives — content review

Event image alternatives were corrected after visually checking the actual assets. This is a nonvisual screen-reader correction: no image, visible caption, or layout was replaced. If new visible captions are desired, those remain a separate review item.

## 6. Remaining visual verification

No blanket hero overlay, image crop, font-size, footer spacing, or dialog size changes are authorized by this document. Image/texture contrast, zoom/reflow, sticky-header/cookie overlap, and third-party Stripe appearance may require additional proposals after verification. Do not treat these as approved changes.

## Nonvisual work authorized and in progress

- Shared dialog focus containment, Escape dismissal, background isolation, and opener focus restoration.
- Accessible names for selectors and selected state on existing buttons.
- Screen-reader announcement of checkout errors.
- Correct ARIA on decorative/menu indicators and distinct names for sidebars.
- Landmark structure changes retaining existing classes/layout.
- Page-specific browser document titles.

See [the audit](accessibility-audit.md) for findings and browser evidence. Implementation/verification status is tracked separately in [remediation progress](accessibility-remediation.md).

Browser verification and screenshots: [contrast/focus implementation record](accessibility-remediation.md#approved-contrast-and-focus-pass). Specials disclosure approval is recorded above; other layout proposals remain deferred. Recipes are outside the current remediation scope at the user’s request.
