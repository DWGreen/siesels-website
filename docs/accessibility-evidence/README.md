# Browser accessibility evidence

Chrome 155, axe-core 4.11.4; desktop 1440px and mobile 390px. Numbers in parentheses count affected elements in that scan, not unique site-wide defects. `region` and some landmark rules are best-practice checks. Stripe findings need separate integration validation. Image-background contrast and third-party frames remain incomplete.

| Route | Desktop: 1440px | Mobile: 390px |
| --- | --- | --- |
| `/` | region (11) | region (9) |
| `/about` | No automated violations | No automated violations |
| `/events` | No automated violations | No automated violations |
| `/locations` | No automated violations | No automated violations |
| `/contact` | No automated violations | No automated violations |
| `/specials` | No automated violations | No automated violations |
| `/holiday-meats` | No automated violations | No automated violations |
| `/party-platters` | region (2) | region (3) |
| `/turkey-reservations` | color-contrast (4) | aria-prohibited-attr (1), color-contrast (1) |
| `/turkey-breast-reservations` | color-contrast (4) | aria-prohibited-attr (2), color-contrast (1) |
| `/ham-reservations` | color-contrast (3) | aria-prohibited-attr (1), color-contrast (1) |
| `/roast-reservations` | color-contrast (3) | aria-prohibited-attr (2), color-contrast (1) |
| `/turducken` | No automated violations | aria-prohibited-attr (1) |
| `/gift-cards` | aria-hidden-focus (1), color-contrast (2), frame-title (1), landmark-main-is-top-level (1), landmark-no-duplicate-main (1), landmark-unique (1) | aria-hidden-focus (1), color-contrast (2), frame-title (1), landmark-main-is-top-level (1), landmark-no-duplicate-main (1), landmark-unique (1) |
| `/steak-101` | color-contrast (28) | color-contrast (28) |
| `/sandwiches` | No automated violations | No automated violations |
| `/sandwiches/menu` | No automated violations | No automated violations |
| `/sandwiches/checkout` | aria-hidden-focus (1), frame-title (1) | aria-hidden-focus (1), frame-title (1) |
| `/sandwiches/order-placed` | No automated violations | No automated violations |
| `/order-confirmation` | No automated violations | No automated violations |
| `/cooking` | color-contrast (1), landmark-unique (2), select-name (1) | color-contrast (2), landmark-unique (1), select-name (1) |
| `/cooking/my-recipes` | landmark-unique (1), select-name (1) | select-name (1) |
| `/cooking/my-menu` | landmark-unique (1), select-name (7) | select-name (7) |
| `/cooking/shoppinglist` | landmark-unique (1) | No automated violations |

## Supplemental coverage

- `/sandwiches/build?productId=89`: quantity select has no accessible name (1440px and 390px).
- `/sandwiches/customize?productId=124`: quantity select has no accessible name (1440px and 390px).
- `/cooking/2510` and `/cooking/collections/hearty-soups-for-autumn`: contrast and sidebar landmark findings (390px).
- Parameterless build/customize URLs return 404 and are excluded from the table; their scans remain in the raw evidence for transparency.
- Keyboard/dialog and 320px results are in `keyboard-and-reflow.json`; supplemental scripts corrected an initial Specials opener mismatch. See the main audit for the interpretation.

[Full audit and limitations](../accessibility-audit.md)
