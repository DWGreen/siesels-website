# Accessibility remediation — first pass

Date: October 26, 2026.

Current scope/status: approved contrast/focus changes and specials text disclosures are implemented. Recipes are excluded from further work at the user’s request. Earlier pass sections below retain their historical findings; the latest implementation details appear at the end.

Authorization: fix issues that preserve the current appearance; document visual changes for review before implementing them. See [visual changes awaiting review](accessibility-visual-changes-review.md). Original audit results remain unchanged as historical evidence.

## Implemented without intentional appearance changes

### Dialogs / keyboard access (A01, B01)

Added `useAccessibleModal` for shared keyboard/focus behavior, retaining each dialog's current classes, dimensions, and appearance. It:

- Moves initial focus inside (preserving existing input autofocus).
- Wraps Tab/Shift+Tab and prevents programmatic background focus.
- Makes sibling content inert while the dialog is open, including nested reservation forms and portal-based viewers.
- Supports Escape and restores focus to the invoking control.
- Restores prior page scrolling and prior inert attributes on cleanup.

Applied to mobile navigation, turkey, turkey breast, roast, ham, gift-card quantity, specials viewer, Steak 101, recipe Add to Menu, advanced recipe search, and recipe rating. Added dialog names/roles where absent. Updated ham's existing behavior to use the shared implementation.

**Chrome verification:** mobile menu, turkey, turkey breast, roast, ham, gift-card quantity, Steak 101, and advanced search held focus through 35 Tabs, closed with Escape, and returned focus to their opener. Supplemental checks verified the specials viewer, Add to Menu, and recipe rating, including focus containment and restoration. The image-only specials opener has empty text content in the raw output; a separate element inspection confirmed focus returns to the actual flyer button.

No focus-ring styling was added; the separately proposed styling remains unapproved. Existing native indicators may appear when focus is now correctly placed inside dialogs.

### Control names / selected states (A03, A06, B03)

- Associated sandwich builder/customization quantity labels with unique select IDs.
- Named recipe category, saved-recipe sort, and per-day Add Recipe selectors.
- Exposed selected categories/slides/days using `aria-pressed` on existing buttons.
- Named the Choose Day group and made its label valid without altering layout.
- Added button semantics and Space handling to the existing link-style Add to Menu trigger, preserving its current styling.

### Announcements / ARIA (A05, B05)

- Main checkout error message now uses `role="alert"`.
- Existing directional arrow graphic now has an image role with an accessible drag-direction name, instead of invalid naming on a generic span. Animation, gradient, positioning, and colors are unchanged.
- Recipe sidebars have distinct accessible landmark names.
- Logo alt text is explicit for linting; rendered alternatives are unchanged.

### Structure / titles / alternatives (A07–A09, B06–B07)

- Removed the nested Gift Cards main landmark using a div with identical classes.
- Placed the Party Platters hero inside its existing main landmark; retained hero props and styles.
- Added a named region around the existing Home Instagram section without changing its positioning/styles.
- Added route-specific browser titles for About, Locations, Contact, Specials, Steak 101, Gift Cards, Sandwiches, and Recipes, plus saved recipes, weekly menu, shopping list, checkout/order receipt, and actual recipe/collection titles. Recipe data is request-cached to avoid fetching twice for metadata and rendering.
- Corrected event image alternatives after inspecting the four underlying images. No visible captions or images changed.

## Verification

- TypeScript: passed.
- Targeted tests: **12 passed across 6 files**, including 3 new modal behavior tests for focus trapping, inert background cleanup, opener restoration after React autofocus, and programmatic focus containment.
- Full suite: **61 passed, 1 failed (62 total)**. The failure is in unchanged `src/utils/reservationOrdering.test.ts:10`: it expects October 14 as the minimum pickup date despite the current configured November 18 pickup start. Reservation date rules/tests were not changed for this accessibility task.
- Shared modal hook lint: passed. A broader touched-file lint check also encountered the existing `RecipeDetailView.tsx` `react-hooks/set-state-in-effect` error (`setDisplayRating(recipe.rating)`); verified that statement is present in HEAD. It is not introduced by this change. Do not claim a clean repository-wide lint run.
- Targeted rendered axe rescan at 390px:

| Route | Remaining automated findings in latest rescan |
| --- | --- |
| Home | None |
| Party Platters | None |
| Gift Cards | Existing contrast and Stripe-generated `aria-hidden-focus` |
| Turkey Breast | Existing contrast only |
| Cooking | Existing contrast only |
| My Recipes | None |
| My Menu | None |
| Build Your Own (product 89) | None |
| BLTA customization (product 124) | None |

“None” means no axe violations in the sampled state, not full WCAG conformance. The third-party frame finding varied across loads; its absence from the latest snapshot does not establish resolution.

- Repeated nine 320px checks: no document overflow or out-of-viewport headings/controls found by the targeted check.
- Browser checks did not submit payments, orders, contact requests, ratings, or saved menu items.

Evidence: [post-change route scans and remaining dialogs](accessibility-evidence/remediation-scans.json), [post-change keyboard and reflow checks](accessibility-evidence/remediation-keyboard-and-reflow.json).

## Waiting for visual review — not implemented

1. Darker secondary text on reservation counts, Gift Cards, Steak 101, and recipe sidebar copy.
2. Visible keyboard focus rings on fields/controls currently missing them.
3. An HTML text equivalent for specials flyers: design and ongoing content workflow.
4. Further heading typography, hero/texture contrast, reflow, or cookie-banner layout changes if follow-up testing demonstrates a need.

Detailed appearance proposals: [accessibility-visual-changes-review.md](accessibility-visual-changes-review.md).

## Still open / separate validation

- Stripe private generated controls and cross-origin payment/frame behavior: use supported Stripe configuration and assistive-technology validation, not DOM patching.
- VoiceOver/NVDA and physical mobile testing; full zoom/text-spacing and focus-occlusion checks.
- Dynamic states beyond the sampled products/recipes, validation errors tied to individual fields, and completed order receipts.
- The source audit's visual/content issues remain open until the proposals are approved and implemented.

No claim of full accessibility compliance is made by this remediation pass.

## Second nonvisual pass

User clarification: behavior and inertness can change; colors, layout, and visual styling must remain unchanged.

Implemented:

- Shared native-validation semantics on the four reservation forms, Gift Cards, and Contact. Invalid controls receive `aria-invalid` and a hidden, linked description containing the browser's native validation message. Existing helper descriptions are retained. Messages clear after correction and are removed on unmount. No visible error containers/styles were added.
- Contact checks its existing required/email/minimum-message constraints before sending. Uses the browser's native validation interaction; it does not change the page's layout or styling. Success/failure announcements use appropriate polite/assertive semantics.
- Mobile menu automatically closes when the viewport reaches the desktop breakpoint, releasing inert content and scroll locking. The opener is connected to the panel with `aria-controls`.
- Sandwich modifier choices and ingredient inclusion expose pressed state; the existing builder choices already exposed it and were retained.
- Sandwich category/cart selection and recipe saved-state buttons expose their state without adding tab roles or changing keyboard conventions.
- Repeated recipe Remove/View more buttons include their context in their accessible names, retaining the visible words.
- Recipe rating success/failure messages are announced. While the rating modal is open, its error is also described inside the active modal with screen-reader-only text, rather than relying on an inert message behind it. Existing visible error placement/colors remain unchanged.

Verification:

- TypeScript passed.
- 14 targeted tests passed across 7 files, including new native-validation and invalid-contact tests.
- Changed validation hook and selected touched components passed the targeted lint check. The earlier repository-wide lint/test limitations remain as documented above; this is not a claim those unrelated failures were resolved.
- Chrome: untouched contact fields were not marked invalid; attempting an empty request described all four required fields; correcting First Name removed its error. All outbound requests were blocked during this check and none was attempted.
- Chrome: opening the mobile menu made background content inert and locked scrolling; resizing to desktop closed the menu, removed main-content inertness, and restored scrolling.
- Axe: Contact and both real sandwich configuration routes had no violations in the sampled state. Turkey Breast retained only the intentionally deferred contrast finding.

Evidence: [second-pass browser checks](accessibility-evidence/nonvisual-pass-two.json).

Still deferred: colors/focus-ring styling, visible specials alternatives, and the other visual proposals. Native validation descriptions address browser-detectable field errors; unknown server-specific errors still use summaries and should not be arbitrarily assigned to a field. Stripe internals and assistive-technology testing remain separate follow-up work.

## Third nonvisual pass

Implemented without changing classes, colors, layout, or visible copy:

- Browse and advanced-search selects now use per-instance IDs, avoiding duplicate IDs and multiple labels pointing at the wrong select while the dialog is open.
- Advanced search match choices share a unique native radio name/value group; left/right arrow keys now select within that group. Main search instances also have independent group names and an accessible group name.
- The main recipe search input has an explicit accessible name instead of relying only on its disappearing placeholder.
- Dialog focus containment now excludes controls with a negative tab index. Regression coverage verifies that existing inert background attributes are preserved after closing.

Verification:

- TypeScript and targeted lint passed.
- Six targeted tests passed: four modal behavior/cleanup tests and two search association/grouping tests.
- Chrome: advanced search has no duplicate IDs, each select has exactly one appropriate label, and Arrow Right changes Every Word to Any Word. The open dialog's axe scan reported no violations; image-background contrast remains incomplete.
- Verified actual next-Tab destinations after activating Skip to main content on About, Turkey Breast, and Cooking. Header navigation is skipped correctly. About proceeds to the footer because its main content has no interactive controls; this is expected. No skip-link code change was necessary. This resolves the earlier uncertainty based only on `document.activeElement` immediately after fragment navigation.

Evidence: [third-pass browser checks](accessibility-evidence/nonvisual-pass-three.json).

Visual proposals remain unapplied. Screen-reader/physical-device testing, third-party Stripe validation, image-background contrast, and the documented visual items remain outstanding.

## Approved contrast and focus pass

The user explicitly approved “Apply contrast and focus fixes.” Layout, spacing, imagery, and the specials presentation were not included in that approval and remain unchanged.

Implemented:

- Darkened the failing reservation count text, Gift Cards count/optional-note helper text, and recipe sidebar helper/empty-state text from `text-neutral-500` to `text-neutral-600`.
- Kept the current Steak 101 burgundy labels and links: these had already been updated since the original audit and now passed, so no additional color change was needed there.
- Added 2px focus-visible outlines with a 2px offset to the identified fields/selectors that previously suppressed outlines: footer, contact, checkout/customer fields, cart quantity, recipe search, sandwich quantity, and Gift Cards inputs.
- Used existing Tailwind focus utilities; no custom global CSS rule was retained. Light-surface outlines are burgundy; the footer outline is white. Browser `:focus-visible` heuristics may also apply to editable fields clicked by pointer.
- Added an accessible name to the main navigation, resolving the remaining desktop cooking-page duplicate-navigation landmark warning without a visual change.

Verification:

- 14 targeted axe route/viewport scans (seven routes at 1440px and 390px) showed no remaining `color-contrast` violations. The targeted pages were turkey, turkey breast, ham, roast, Gift Cards, Steak 101, and Cooking.
- Chrome confirmed a solid 2px outline and 2px offset on the footer field, contact field, both real sandwich quantity selectors, and recipe search. Before/after focus dimensions were identical on all five inspected controls.
- TypeScript and whitespace checks passed. These are style changes; browser checks were used rather than adding implementation-mirroring CSS tests.
- The first custom-CSS focus approach did not render in the served development stylesheet and was replaced before completion. The evidence linked below records the final working Tailwind implementation.

Remaining findings: Stripe-generated `aria-hidden-focus` still appears on Gift Cards. A recipe `image-redundant-alt` best-practice warning varies with loaded content and needs contextual review. Some image/texture contrast checks remain incomplete, so these passing solid-color scans are not a blanket conformance claim. The prior full-suite pickup-date expectation failure is unchanged.

Evidence: [rendered scans and focus measurements](accessibility-evidence/contrast-and-focus-fixes.json), [footer focus screenshot](accessibility-evidence/footer-approved-focus.png), [contact focus screenshot](accessibility-evidence/contact-approved-focus.png).

Still deferred: visible specials text alternative/design, broader typography/layout changes, third-party Stripe validation, and assistive-technology/physical-device testing.

## Semantic follow-up and Stripe review

- Removed duplicate thumbnail alternative text from Healthy Choices links: each link already contains the visible recipe title, which remains its accessible name. Separate image-only recipe links retain their alternative text.
- Changed the secondary Gift Cards and Party Platters content headings from h1 to h2, retaining every explicit class. Each page now has one main h1 from its hero. Browser measurements confirmed identical font, size, margins, padding, width, and height at 1440px and 390px.
- Six targeted axe scans: Cooking and Party Platters passed at both widths; Gift Cards reported only the existing Stripe-generated `aria-hidden-focus` finding. Automated passes do not resolve incomplete image-background contrast or replace assistive-technology testing.
- TypeScript passed. Targeted lint completed with existing image-element warnings only.

Evidence: [semantic follow-up scans and appearance comparisons](accessibility-evidence/semantic-follow-up.json).

### Stripe finding remains open

The offending node is the Stripe-generated `.__PrivateStripeElement-input`, with `aria-hidden="true"` and a nonnegative tab index. This was reproduced at both widths. No private Stripe DOM attributes, focus behavior, or payment functionality were modified.

A [Stripe contributor's response to the matching issue](https://github.com/stripe/stripe-js/issues/422#issuecomment-1429571904) directs underlying Stripe.js accessibility problems to Stripe Support; the closed issue is not evidence that this site's finding is resolved. Follow-up should include Stripe Support review and keyboard/screen-reader testing of the payment flow. No support message has been sent. Any proposed replacement payment component needs a separate implementation and appearance review.

Still outstanding: specials text alternative and its publishing source/design, manual image/texture contrast review, screen-reader/physical-device testing, and third-party payment validation. These changes do not establish full accessibility conformance.

## Text-spacing and focus-occlusion pass

Checked Home, Contact, Turkey Breast, Party Platters, and Cooking at 1440px, 390px, and 320px (15 route/viewport combinations). Applied temporary browser-only text-spacing overrides: 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing. No document-level horizontal overflow was detected. The clipping heuristic flagged intentionally screen-reader-only labels and some recipe titles; these are review candidates, not confirmed failures or a complete text-spacing pass. No production typography changes were applied.

A separate keyboard check, allowing scrolling to settle, confirmed that the first-visit cookie banner covered focused mobile Contact links and fields. Nine-point hit testing corroborated coverage; the initial screenshot was also visually inspected. Added focus-scroll handling to the shared header: keyboard-focused page controls scroll into the space between the sticky header and cookie banner. The handler retains focus, ignores dialogs/header controls, and does not change banner dimensions, layout, colors, or dismissal behavior.

The repeated 35-Tab mobile Contact check found no fully covered controls after the fix (seven before). TypeScript and Header lint passed. No forms, orders, or messages were submitted. This sampled check does not establish site-wide focus-occlusion conformance or replace physical-device/screen-reader testing.

Evidence: [spacing and initial focus candidates](accessibility-evidence/spacing-and-focus-checks.json), [confirmed before/after focus checks](accessibility-evidence/focus-occlusion-comparison.json).

## Specials text alternatives

Recipes are outside the current scope at the user’s request. The user explicitly approved the [documented disclosure design](specials-text-alternative-review.md).

Added a native, initially collapsed “Read this ad as text” disclosure below the selected flyer. Its expanded state persists as visitors change categories/pages, while its content follows the selected image. All four image entries now include typed offer text, prices/units, descriptions, printed effective dates, and relevant notices. Concise image alternatives and captions identify the actual ads instead of the previous unrelated placeholder captions.

The transcription includes 21 priced offers across four flyers, plus notices about pies, party trays, prepared sides, holiday hours, and the printed store/contact details. The checked-in images advertise June/July 2026 dates; these were preserved rather than presented as newly valid October offers. Dates for the second weekly/weekend pages explicitly refer to their paired ad. These dates and prices need to be updated with the images when new ads are published.

See [the publishing workflow](specials-publishing.md). No automatic OCR or synchronization service is configured. Future changes must update each image and its text together.

Verification: TypeScript and targeted new-component/data lint passed. Browser checks exercised Space activation, persistent disclosure state, and all four selected ads at desktop/mobile widths. All eight expanded-ad axe scans reported no violations after category transitions settled. [Rendered checks and axe results](accessibility-evidence/specials-text-alternatives.json); [visually inspected mobile disclosure](accessibility-evidence/specials-text-mobile.png). Automated checks do not establish transcription accuracy; the content was visually compared with the checked-in images. No recipes, ordering, or payment flows were changed.
