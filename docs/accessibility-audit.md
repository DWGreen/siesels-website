# Live-browser accessibility audit — October 26, 2026

## Remediation update

The first nonvisual remediation pass is recorded in [accessibility-remediation.md](accessibility-remediation.md). Approved contrast/focus changes and still-deferred visual proposals are recorded in [accessibility-visual-changes-review.md](accessibility-visual-changes-review.md). The findings below are the original audit baseline, not a claim that repaired issues remain open.

## Result

The local site at `http://localhost:3000` was accessed and tested in an isolated **Chrome 155** browser with **axe-core 4.11.4**, using desktop and mobile viewport layouts. This replaces the earlier source-only coverage statement below. The site has confirmed accessibility defects and should not currently be described as WCAG 2.2 AA conformant.

**No application code was changed and no orders, payments, contact requests, or newsletter submissions were sent.** Testing used a fresh browser profile, not the user's personal browser session.

### Coverage

- **24 valid base routes at both 1440px and 390px: 48 axe scans.** 26 of those scans reported at least one automated violation or best-practice finding. A clean automated scan is not evidence that a page fully passes WCAG.
- Additional real product routes: `/sandwiches/build?productId=89` and `/sandwiches/customize?productId=124`, at both desktop and mobile widths.
- Additional recipe detail `/cooking/2510` and collection `/cooking/collections/hearty-soups-for-autumn`, mobile.
- Open-state checks: mobile navigation, turkey, turkey breast, roast, ham, gift-card quantity picker, specials viewer, Steak 101 overlay, and recipe advanced search.
- Keyboard input exercised Tab, Escape, and focus return; inspected actual focus styles. Used Chrome viewport emulation, not physical iPhone/Safari testing.
- 320px checks on Home, About, Party Platters, turkey breast, ham, roast, Turducken, Gift Cards, and Contact. No document-level horizontal overflow or out-of-viewport controls/headings were detected by these targeted checks. This does not prove 200% text resize/400% browser zoom conformance.
- Captured and visually inspected mobile screenshots, including the turkey-breast dialog after focus escaped, Steak 101 modal, Party Platters at 320px, and the footer.
- Bare `/sandwiches/build` and `/sandwiches/customize` return 404 without product IDs; those four desktop/mobile scans are excluded from the valid base-route counts. Valid product-ID URLs were subsequently tested. Their 404-only landmark/skip-link findings should not be confused with valid product-page failures.

## Confirmed browser findings

### B01 — High: keyboard focus leaves open dialogs; some do not close with Escape

| UI | Actual observed behavior |
| --- | --- |
| Mobile menu | Initial focus correctly enters Close. After 11 Tabs it reaches the cookie button outside the modal. Escape closes the menu, but focus does not return to Open menu. |
| Turkey picker | Initial focus enters the select. After 3 Tabs, focus escapes into the obscured pickup form. Escape leaves the picker open. |
| Turkey breast picker | Initial focus enters the select. After 4 Tabs, focus escapes into the obscured pickup form. Escape leaves the picker open. |
| Roast picker | Clicking Add opens it while focus stays on the opener behind the overlay. Focus is still outside after Tab; Escape leaves it open. |
| Gift-card quantity picker | Focus enters the quantity input, escapes after 3 Tabs, and Escape leaves the picker open. |
| Ham picker | **Passed this limited interaction check:** focus stayed inside for 35 Tabs; Escape closed it and returned focus to Add A Ham. This is not a claim that every ham modal requirement passes. |
| Specials viewer | The actual flyer viewer was opened in the supplemental check. Focus remains on the flyer opener behind the viewer. Escape does close it. |
| Steak 101 | Overlay opens but has no dialog semantics and leaves focus on the underlying card. Escape does not close the visible overlay. |
| Recipe Advanced Search | Overlay renders without dialog semantics; source inspection still identifies missing focus/Escape handling. Its automated scan also has incomplete duplicate-ID/label checks needing follow-up. |

The first `/specials` entry in the raw keyboard log accidentally matched Open menu; it is **not** evidence about the flyer viewer. The actual flyer viewer is recorded in `supplemental-scans.json` and was visually inspected.

Related WCAG concerns: Keyboard, Focus Order, Name/Role/Value. Use a shared accessible modal implementation; see A01 below. Screenshot: [turkey breast focus escaped](accessibility-evidence/turkey-breast-focus-escaped.png).

### B02 — High: insufficient text contrast, measured in the rendered browser

| Area | Foreground / background | Measured ratio | Required for this text |
| --- | --- | --- | --- |
| Turkey, turkey breast, ham, roast selection count | `#737373` / `#faf8f3` | **4.46:1** | 4.5:1 |
| Gift Cards count and optional-field helper text | `#737373` / `#faf8f3` | **4.46:1** | 4.5:1 |
| Steak 101 category labels / Learn more text | `#a1a1a1` / white | **2.58:1** | 4.5:1 |
| Recipe sidebar helper/empty-state text | `#737373` / `#f5f5f5` | **4.34:1** | 4.5:1 |

Reservation/Gift Cards failures are small but still below the threshold; Steak 101 is a larger shortfall. Darken the affected secondary text. Source examples: `SteakGrid.tsx:217`, `SteakGrid.tsx:243`, `RecipeBoxSidebar.tsx:463`, and reservation count styles.

Axe could not automatically determine contrast on many image/wood/texture backgrounds. Those are **incomplete**, not passing, results. The measured ratios above are solid-background cases that axe reported as violations.

### B03 — High: selectors have no accessible name

Confirmed `select-name` violations on:

- Build Your Own quantity: `/sandwiches/build?productId=89` (desktop and mobile).
- BLTA customization quantity: `/sandwiches/customize?productId=124` (desktop and mobile).
- Recipe search/filter select on `/cooking`.
- Recipe collection/filter select on `/cooking/my-recipes`.
- Seven day selectors on `/cooking/my-menu`.

Connect labels/legends or accessible names to the actual controls. See `SandwichBuilder.tsx:730`, `ProductCustomization.tsx:830`, `RecipeSearchBar.tsx`, `MyRecipesPage.tsx:144`, and `MyMenuPage.tsx:395`.

### B04 — High: shared footer email field has no visible keyboard focus indicator

After actual keyboard input, the focused newsletter field matched `:focus-visible`, but its computed outline style was `none`, box shadow was `none`, and border was unchanged. This confirms the source finding rather than merely inferring it. [Footer screenshot](accessibility-evidence/footer-focus-mobile.png).

The source-only findings for other `outline-none` controls remain applicable; only the footer's computed keyboard-focus state was explicitly checked in this browser pass.

### B05 — Medium: the scrolling arrow cues use prohibited ARIA labeling

On all five reservation routes at mobile width, axe reports `aria-prohibited-attr` on the scroll cue's `<span aria-label="Scroll left/right">`. A generic span does not support that naming usage. The desktop cues are absent when the menu fits, so this mainly appears in mobile scans.

Fix by making the decorative arrows `aria-hidden="true"` and relying on the already named keyboard-scrollable container, or providing a correctly modeled accessible instruction. Keep the drag-direction visual behavior. Source: `src/components/reservations/ReservationNavigation.tsx`, `ScrollArrows`.

### B06 — Medium: landmarks and content placement

- Gift Cards has a main landmark nested inside the layout's main: axe confirms `landmark-main-is-top-level`, `landmark-no-duplicate-main`, and `landmark-unique`. Use a section/div for the inner wrapper.
- Recipe pages have multiple complementary landmarks without distinguishing names (`landmark-unique`). Label Recipe Box and the other sidebar distinctly. This is a navigation/best-practice issue, not automatically a standalone WCAG failure.
- Home's Instagram section is outside main/footer landmarks, and Party Platters' hero is outside main: axe reports `region`. Move the content within the appropriate landmark. `region` is an axe best-practice finding, not automatically a WCAG AA failure.

### B07 — Medium: route titles remain generic

Chrome confirmed identical inherited site-wide document titles on About, Locations, Contact, Specials, Steak 101, Gift Cards, sandwich pages, and cooking pages. Add page-specific metadata titles. The visible hero heading does not replace the browser document title.

### B08 — Content: specials flyers still need equivalent HTML

The live page loads the image flyer with the generic alternative, while product names/prices/dates are embedded in the image. Automated axe scans do **not** detect whether a nonempty alt conveys the flyer contents; the absence of an axe violation here is not a pass. A02 below remains a priority content issue.

## Third-party findings requiring validation

Gift Cards and sandwich checkout each report:

- `aria-hidden-focus` on Stripe's generated `.__PrivateStripeElement-input`.
- `frame-title` on a generated Stripe `cardButton…` iframe.
- `frame-tested` incomplete results for cross-origin frame contents.

These were actually observed, but should be investigated in a loaded/valid payment state with Stripe's supported integration. Do **not** patch Stripe's private generated markup or assume the report proves a merchant-authored defect. No payment was submitted and no end-to-end screen-reader assessment of Stripe was completed.

Google Maps frames also have `frame-tested` incomplete results. Outer iframe titles exist; full third-party content behavior remains unverified.

## Remaining limits

This is now a rendered-browser audit, not just a source scan, but it is **not a complete conformance certification**:

- No VoiceOver/NVDA run or physical mobile-device testing.
- Did not submit orders, payments, emails, or contact forms; paid confirmation details were not audited with a real order key. `/order-confirmation` was tested in its no-credentials fallback state.
- No fully populated cart/payment error journey; checkout error announcements remain source-confirmed rather than reproduced through a transaction.
- Dynamic recipe details and collections were sampled, not every database record.
- Image-background contrast, third-party frames, custom control announcements, hover/focus state contrast, full target-size/spacing, text spacing, 200% text resize, and actual 400% browser zoom still need dedicated checks. Do not infer they pass from axe silence or the 320px results.
- First-visit cookie banner was present during much of the audit. It can cover content, as screenshots show; a dedicated focused-control occlusion sweep is still needed before calling 2.4.11 a pass or failure site-wide.
- Activating the skip link did not move `document.activeElement` onto main in the recorded Chrome check. This alone is not a failure: fragment navigation may still reposition the sequential focus starting point. Verify the next Tab destination before changing it.
- Some advanced recipe-search checks were marked incomplete (`duplicate-id-aria`, `form-field-multiple-labels`); investigate rather than count those as confirmed failures.

## Evidence and route results

- [Desktop/mobile route matrix](accessibility-evidence/README.md)
- [Raw base-route axe results](accessibility-evidence/route-scans.json)
- [Keyboard and 320px checks](accessibility-evidence/keyboard-and-reflow.json)
- [Open viewer / recipe / footer checks](accessibility-evidence/supplemental-scans.json)
- [Valid product routes and keyboard focus checks](accessibility-evidence/product-and-focus-scans.json)
- [Steak 101 open modal screenshot](accessibility-evidence/steak-modal-mobile.png)
- [Party Platters 320px screenshot](accessibility-evidence/party-platters-320.png)

Raw results include duplicate shared-component findings across routes/viewports and the separately identified parameterless 404 scans. They must not be summed as unique defects. Repeated body text, public product IDs, and generated Stripe frame IDs are test evidence, not customer submissions.

## Recommended next work

1. Fix shared dialog semantics/focus handling and visible focus rings.
2. Label the confirmed selectors; correct the reservation cue ARIA.
3. Darken the failing text colors.
4. Add text versions of specials, route-specific titles, and landmark cleanup.
5. Validate Stripe separately and run assistive-technology/manual checks, then rescan repaired states.

---

# Earlier source audit (retained for file-level remediation details)

The source findings below predate the browser pass. Read browser confirmations and limits above first.

# Accessibility audit — October 26, 2026

## Scope and limits

Baseline: WCAG 2.2 Level AA. This is a source-code audit, not a certification of conformance.

Reviewed shared header/footer/hero components, reservation flows, gift cards, specials, contact, sandwich ordering/checkout, recipe UI, About, events, and page/layout structure. ESLint scanned 257 source files. An additional pass enabled the full recommended `eslint-plugin-jsx-a11y` ruleset and returned 18 findings, manually triaged below. Counts are lint messages, not unique WCAG failures.

At the time of the initial source audit, the network sandbox could not reach localhost:3000. The later browser pass above succeeded with authorized local-network access and supersedes that coverage limitation. No production UI was changed during either audit.

## Priority 1 — fix first

### A01. Modal keyboard and focus handling is incomplete

**Evidence:**

- `src/components/layout/MobileMenu.tsx:30`: moves focus to Close and supports Escape, but does not trap Tab within the panel, make background content inert while open, or restore focus to the opener on dismissal. `inert={!isOpen}` protects the closed panel, not the background while open.
- `src/components/turkey-reservations/TurkeyReservationsClient.tsx:262` and `src/components/turkey-breast-reservations/TurkeyBreastReservationsClient.tsx:278`: declare modal dialogs and autofocus a select but lack Escape handling, focus containment, and focus restoration.
- `src/components/roast-reservations/RoastReservationsClient.tsx:234`: modal dialog lacks initial focus placement, Escape handling, focus containment, and restoration.
- `src/components/gift-cards/GiftCardOrderClient.tsx:175`: quantity picker requires the same modal review.
- `src/components/specials/SpecialsImageViewer.tsx:56`: supports Escape, but does not move focus into the viewer, trap focus, or restore it.
- `src/components/steak-101/SteakGrid.tsx:65`: overlay also lacks dialog role/name, Escape handling, and focus management.
- Recipe overlays: `src/components/recipes/AddToMenuDialog.tsx:60`, `AdvancedRecipeSearch.tsx:72`, and `RecipeDetailView.tsx:767` require the same correction; Advanced Search and recipe rating also lack dialog semantics.

**Impact:** keyboard or screen-reader users may continue navigating the obscured page, miss the popup, or lose their place after closing it. The roast picker can open with focus still outside the displayed modal.

**Relevant criteria:** 2.1.1 Keyboard, 2.4.3 Focus Order, 4.1.2 Name/Role/Value. Exact failures vary by dialog and should be reproduced in the browser. Missing Escape alone is an ARIA-pattern issue, not automatically a WCAG failure.

**Remediation:** share a native `<dialog>`/`showModal()` implementation or a proven accessible dialog primitive. Set a name and sensible initial focus, contain focus, support Escape, block the background, and restore focus to the opener. Ham's picker already implements initial focus, a Tab loop, Escape, and restoration; keep those behaviors and verify background screen-reader isolation there too.

### A02. Specials flyers lack an equivalent text version

**Evidence:** `src/data/specials.ts:18` supplies generic alt text such as “Current restaurant special 1 of 2”; `src/components/specials/SpecialsGallery.tsx:172` renders the flyer with that alt text. Visually inspected `public/images/specials/biweekly/specials1.jpg`: the image contains product names, prices, sale dates, and descriptions that are not present as equivalent HTML on the Specials page.

**Impact:** screen-reader users cannot obtain the advertised offers. Zooming the image does not supply a text alternative.

**Relevant criteria:** 1.1.1 Non-text Content; assess 1.4.5 Images of Text as well.

**Remediation:** publish equivalent structured HTML offers with names, prices, units, and effective dates alongside each flyer. Keep concise descriptive alt text referencing that text version. Do not put an entire flyer into a huge alt attribute. Include this in the recurring specials publishing workflow.

### A03. Quantity selectors are not programmatically labeled

**Evidence:** `src/components/sandwich-builder/SandwichBuilder.tsx:730` and `src/components/customization/ProductCustomization.tsx:830` render “Quantity” in a label, followed by a sibling select without `id`, `htmlFor`, or an ARIA name.

**Impact:** assistive technology cannot reliably identify the selectors' purpose.

**Relevant criteria:** 1.3.1 Info and Relationships, 4.1.2 Name/Role/Value.

**Remediation:** connect each label to a unique select ID, or wrap the select in its label. These selectors also remove the focus outline without adding a replacement; fix that at the same time.

### A04. Some controls have no usable visible keyboard focus indicator

**Evidence:**

- `src/components/layout/Footer.tsx:70`: newsletter email input removes the outline and supplies no focus-specific border/ring/background replacement.
- Quantity selects mentioned in A03 use `outline-none` without a replacement.
- `src/components/checkout/CheckoutCustomerForm.tsx:26`: removes the outline; only changes white to `#f5f5f5`. That color change is approximately 1.09:1, too subtle to rely on as a clear focus indicator.
- `src/components/cart/CartProductCard.tsx:115`: removes the outline and relies on a subtle background change; verify and replace with a clear ring.

**Impact:** keyboard users can lose track of the currently focused control.

**Relevant criteria:** 2.4.7 Focus Visible; assess 1.4.11 Non-text Contrast for the indicator.

**Remediation:** add consistent, high-contrast `focus-visible` rings with appropriate offsets on both light and dark backgrounds. Do not remove existing outlines without a replacement. Check custom selects and all checkout fields, not just buttons.

## Priority 2 — address in the same remediation pass

### A05. Main checkout validation/payment errors are not announced

**Evidence:** `src/components/checkout/CheckoutClient.tsx:472` conditionally renders `checkoutMessage` in a plain div without a live region, alert role, or focus movement. Separate Stripe configuration/loading messages do have alert/status roles, so this specifically concerns the primary checkout error block.

**Impact:** a screen-reader user may submit and not know an error appeared.

**Relevant criteria:** 4.1.3 Status Messages; review 3.3.1 Error Identification and field-specific associations too.

**Remediation:** announce submission failures via an alert/error summary; connect field errors with `aria-describedby` and `aria-invalid` where applicable. Keep success/loading announcements polite. Contact form and reservation error blocks already provide live semantics.

### A06. Some selected controls communicate their state only visually

**Evidence:** `src/components/specials/SpecialsGallery.tsx:77` changes category button colors without `aria-pressed` or tab semantics. `src/components/recipes/AddToMenuDialog.tsx:133` changes the selected day visually without exposing its state. Its “Choose Day” label at line 117 is also not attached to a control/group.

**Relevant criteria:** 1.3.1 Info and Relationships, 4.1.2 Name/Role/Value.

**Remediation:** use `aria-pressed` for category toggle buttons, or implement a complete tab pattern. Use a fieldset/legend with native radio buttons for mutually exclusive days, or correctly implement an equivalent radio group. Do not add tab roles without the corresponding keyboard behavior.

### A07. Gift Cards nests one main landmark inside another

**Evidence:** `src/app/gift-cards/layout.tsx:9` contains a main landmark, and `src/app/gift-cards/page.tsx:11` renders another main inside it. There are also two level-one headings from the hero and page body; multiple h1s alone are not automatically a WCAG failure.

**Impact:** landmark navigation becomes misleading and the document structure is invalid.

**Remediation:** retain the layout's main and change the inner wrapper to a section/div; use an appropriate heading level for its title. Validate the rendered landmark/heading tree on all layout-driven pages.

### A08. Several routes inherit the generic home-page document title

**Evidence:** `src/app/layout.tsx:51` defines a site-wide title. About, Contact, Locations, Steak 101, Specials, Sandwiches, and Cooking page/layout sources do not define route-specific titles.

**Impact:** browser tabs/history and screen-reader page announcements do not clearly distinguish these pages.

**Relevant criterion:** 2.4.2 Page Titled.

**Remediation:** add descriptive metadata titles for each route, including dynamic recipe/collection details. Verify the final rendered title after navigation rather than just checking the visible hero heading.

### A09. Some image descriptions do not match their subjects

**Evidence:** `src/app/events/page.tsx:48` describes the smoked ham image as “Steak cooking on a hot grill”; other event images reuse vague/generic descriptions. Hero images often reuse butcher descriptions regardless of the image being rendered.

**Relevant criterion:** 1.1.1 Non-text Content where the image is informative.

**Remediation:** write meaningful image-specific alternatives, or use `alt=""` for genuinely decorative images when neighboring text already conveys everything necessary. Review event and hero image props against actual assets; do not treat a nonempty alt attribute as sufficient by itself.

## Lint findings requiring judgment, not automatic fixes

- `MeatArticleLogo.tsx:12` is a false positive: alt text is included in the spread logo configuration. Making `alt={logos[brand].alt}` explicit would make the linter understand it, but the rendered image is not missing an alternative.
- Autofocus inside a deliberately opened modal is not automatically a failure. Proper initial focus is desirable; implement it as part of the shared dialog behavior.
- `ReservationNavigation.tsx:47` intentionally makes the horizontal scroll container keyboard-focusable. Do not remove its tab stop just to satisfy the generic lint warning; validate its name and arrow-key scrolling in a browser.
- Backdrop click handlers are supplementary when a keyboard-operable Close button/Escape exists. Adding a button role to a full-screen backdrop is not the correct general fix for these lint messages.
- `AddToMenuDialog.tsx:37` uses an anchor as a button. Replace it with a native button for correct semantics and Space activation.

## Positive foundations

- Root document has `lang="en"` and a visible-on-focus skip link.
- Most public pages use `main#main-content`.
- Most reservation inputs use wrapping labels, and quantity/remove controls have accessible names.
- Reservation menus expose the selected page with `aria-current="page"` and support keyboard scrolling.
- Reservation arrow animations respect reduced motion. Gift-card hover animation also checks reduced motion.
- Most external links use `rel="noopener noreferrer"`; social links have accessible names.
- Location map iframes have titles.

## Browser/manual checks still required

1. Keyboard-only full journeys: header/menu, every reservation picker, sandwich customization, checkout, gift cards, specials zoom, and recipe overlays. Verify focus order, visible focus, Escape, restoration, and that sticky headers/cookie banners do not obscure the focused control.
2. VoiceOver/Safari and NVDA/Firefox or Chrome: headings, landmarks, dialogs, errors, dynamic category state, WooCommerce/Stripe payment fields, and third-party content.
3. Actual contrast on image/texture backgrounds: white hero text (including pages using zero overlay), footer text/links, hover/focus/disabled states, placeholders, and error states. No rendered contrast result is claimed here.
4. Reflow at 320 CSS pixels, 200% text resizing, and 400% zoom. Check the two-column footer, large hero titles/logos, tables, reservation dialogs and quantity rows, and navigation. `body { overflow-x: hidden }` can conceal overflow rather than solve it.
5. Measure WCAG 2.2 target size/spacing (24px or applicable exceptions), especially small desktop social icons, footer links, recipe actions, and close buttons. Do not assume every control must be 44px under AA.
6. Assess ongoing blinking scroll arrows against 2.2.2 Pause, Stop, Hide; a reduced-motion media query alone should not be assumed to satisfy every user's need to pause ongoing cues. Verify they do not create a flash hazard. Do not classify this as a confirmed failure without evaluating the interaction.
7. Validate skip-link focus movement in target browsers; add `tabIndex={-1}`/scroll offsets to the destination if necessary. Check cookie-banner keyboard behavior and first-visit overlap.
8. Run axe/Lighthouse on rendered routes with dialogs both closed and open. Repeat on all WooCommerce-driven product states, empty/unavailable results, errors, and completed orders.

## Recommended order

1. Shared dialog behavior and form focus indicators.
2. Quantity labels and checkout error announcements.
3. Text equivalents for specials flyers (requires an ongoing content process).
4. Selected-state semantics, titles, and landmark/alt cleanup.
5. Browser and assistive-technology verification, then regression tests for repaired interactions.

## Reference baseline

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI modal dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

The 18 raw expanded lint messages were saved during the audit to `/tmp/siesels-accessibility-expanded.json`; they are not the authoritative issue list. This document records the manually triaged findings.
