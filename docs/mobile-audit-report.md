# Mobile Audit Report

Tested in Playwright at a 375×812 iPhone-class viewport (360px usable layout width because the test browser shows a scrollbar), DPR 2, against `localhost:3000` (dev server). Each page was checked with an automated DOM audit for horizontal overflow, tap target size, input font size, fixed elements, and image loading, then reviewed visually from full-page screenshots.

Screenshots are in [docs/mobile-audit/](mobile-audit/):

- `tile_*.jpg` files show up to 4 consecutive slices of a page side by side, read left to right.
- `vp_*.jpg` files are single-viewport captures of a specific state.

Two passes have been completed:

- **Phase 1:** static page scan.
- **Phase 2:** ordering flow, interactive states, cooking detail pages, and re-checks at 320px.

> Note: blank grey boxes in some screenshots are lazy-loaded images that had not finished loading when the screenshot was taken in dev mode. They are not reported as bugs unless confirmed separately.

---

## Summary by priority

| # | Priority | Issue | Pages | Status |
|---|----------|-------|-------|--------|
| 1 | P0 | Hero images download at 3840px wide (about 1 MB) on phones | All pages | Fixed (R1); source compression open (#15) |
| 2 | P0 | Master Meat Cutters badge sits off-screen to the left | Interior pages | Fixed (R1, follow-up) |
| 3 | P0 | Form inputs under 16px make iOS Safari zoom in on focus | All forms | Fixed (R1) |
| 4 | P0 | Ordering pages scroll sideways (oversized headings) | Checkout, Builder, Customizer | Fixed (R1) |
| 18 | P0 | Cooking sidebar renders before the content | /cooking, /cooking/[id], collections | Fixed (R3) |
| 5 | P1 | Tap targets smaller than 44x44px | Global, Checkout, Cooking, Contact | Fixed (R1-R3) |
| 6 | P1 | Specials tab row cut off | /specials | Fixed (R3) |
| 7 | P1 | Fixed cart bar has no safe-area padding | /sandwiches | Fixed (R1) |
| 8 | P1 | No safe-area handling; `min-h-screen` (100vh) | Fixed/bottom UI, page wrappers | Fixed (R1, R4) |
| 9 | P1 | Closed nav drawer focusable / exposed | All pages | Fixed (R1) |
| 10 | P1 | `src/app/icon.svg` is about 4.3 MB | All pages | Open: needs a decision |
| 19 | P1 | Customizer and builder controls too small | Builder, Customizer | Fixed (R2) |
| 20 | P1 | Builder "Add to Cart" hard to reach, no hint when disabled | Builder, Customizer | Fixed (R2) |
| 21 | P1 | Forms lack autocomplete; checkout has placeholder-only fields | Checkout, Turkey, Roast, Contact | Fixed (R2) |
| 22 | P1 | Contact info not tappable; no directions links | /contact, Home, /locations | Fixed (R1, R3) |
| 23 | P1 | Specials full-ad viewer doesn't enlarge | /specials | Fixed (R3) |
| 11 | P2 | Nested `<main>` and two `<h1>`s per page | Interior pages | Fixed (R4) |
| 12 | P2 | Footer newsletter input collapsed | All pages | Fixed (R1) |
| 13 | P2 | Instagram grid leaves an empty cell | Home | Fixed (R3) |
| 14 | P2 | Copyright reads "(c)2026Iowa" | All pages | Fixed (R2) |
| 15 | P2 | Large source images (hero 57 MB, steaks 191 MB) | Asset pipeline | Open: needs a decision |
| 24 | P2 | My Menu day cards waste about 1,400px | /cooking/my-menu | Fixed (R3) |
| 25 | P2 | Nav drawer focus; Sandwiches, Cooking and Contact missing from nav | All pages | Focus fixed (R1); nav content needs a decision |
| 16 | P3 | Very long single-column pages | /steak-101 | Fixed (R4) |
| 26 | P3 | `routes.ts` import and dead route; duplicate `MenuClient` | Code hygiene | Fixed (R2) |
| 17 | Verify | Google Maps iframes blank in test browser | Home, Locations | Verify on device |
| 27 | Verify | Stripe card field blank in test browser | /sandwiches/checkout | Verify on device (HTTPS) |

---

## Detailed findings

### 1. Hero images are oversized on mobile (P0)

- [src/components/sections/Hero.tsx](../src/components/sections/Hero.tsx) and [src/components/sections/InteriorHero.tsx](../src/components/sections/InteriorHero.tsx) use `<Image fill priority>` without a `sizes` prop.
- The browser requested `/_next/image?url=/images/hero/hero_image.png&w=3840`, which is 1,010,086 bytes. The home hero was still grey (`complete=false`) 3 seconds after load. On a cellular connection it will take longer.
- The source PNGs are 2.4–3.1 MB each (`hero_image.png`, `tri-tip-black.png`, and others).
- **Fix:** add `sizes="100vw"` to both hero components. Convert hero PNGs to JPG/WebP. Delete unused `*_old*.png` files from `public/images/hero`.

Screenshot: [tile_home_0.jpg](mobile-audit/tile_home_0.jpg)

### 2. Master Meat Cutters badge is clipped or off-screen (P0)

In `InteriorHero`, the logo is positioned with `absolute right-full mr-3 size-[96px]` against the title. On narrow screens, the title spans most of the width, which pushes the logo past the left edge:

| Page | Logo left / right (px) |
|------|------------------------|
| /sandwiches | −92 / 4 (fully invisible) |
| /turkey-reservations | −41 / 55 |
| /events | −20 / 76 |
| /about | −12 / 84 |

- **Fix:** below `lg`, place the logo above the title in normal flow, or hide it (`hidden lg:block`). Alternatively, shrink it to about 56px and anchor it inside the padding.

Screenshots: [tile_about_0.jpg](mobile-audit/tile_about_0.jpg), [tile_sandwiches_0.jpg](mobile-audit/tile_sandwiches_0.jpg), [tile_turkey-reservations_0.jpg](mobile-audit/tile_turkey-reservations_0.jpg)

### 3. Inputs under 16px trigger iOS zoom (P0)

iOS Safari zooms the page in whenever a user focuses an input with `font-size < 16px`, and it does not zoom back out. This is one of the most common reasons a site "feels broken" on iPhone.

| Page | Inputs affected |
|------|-----------------|
| Footer (every page) | Newsletter email: 14px |
| /contact | All text, email, tel, select, and textarea fields: 14px |
| /turkey-reservations, /roast-reservations | date, name, email, phone: 14px |
| /sandwiches/checkout | Customer fields: 14px; quantity `<select>`: 12px |
| /cooking | Filter selects: 14px |
| /cooking/my-menu | Day/meal selects: 12px |
| /cooking/my-recipes | Search and sort: 14px |
| /cooking/shoppinglist | "Add custom item": 14px |

- **Fix:** use `text-base` (16px) on all form controls below `sm`, for example `text-base sm:text-sm`. Or add a global rule in [src/app/globals.css](../src/app/globals.css): `@media (max-width: 639px) { input, select, textarea { font-size: 16px; } }`.

### 4. Ordering pages scroll sideways (P0)

**Root cause (confirmed in phase 2):** page titles use `text-5xl … tracking-[0.28em]` (48px with very wide letter-spacing). One long word such as "CHECKOUT" or "SANDWICHES" can't wrap, so the text spills out of its box. Subtotal labels (`text-2xl` with wide tracking) do the same.

| Page | Viewport | Page width | Overflowing text |
|------|----------|------------|------------------|
| /sandwiches/checkout | 360 | 393 | H1 "CHECKOUT" (369px in a 312px box) |
| /sandwiches/build?productId=89 | 360 | **518** | H1 "SANDWICHES" (494 in 312); "SUBTOTAL: $9.99" (307 in 272) |
| /sandwiches/customize?productId=124 | 360 | **485** | H1 "SANDWICHES" (461 in 312); "SUBTOTAL: $11.99" (328 in 272) |
| /sandwiches at 320px | 320 | 320 | "SUBTOTAL: $11.99" clipped (254 in 232) |

Knock-on effect: once the page is wider than the screen, the user can pan sideways. That reveals the off-canvas mobile nav drawer (positioned with `translate-x-full`) next to the page content. See the left column of [tile_sandwiches_customize_0.jpg](mobile-audit/tile_sandwiches_customize_0.jpg) and [tile_sandwiches_build_0.jpg](mobile-audit/tile_sandwiches_build_0.jpg). On a real phone this looks like a broken layout, and the browser may zoom out to fit.

Files using the pattern (`tracking-[0.28em]`):

- [src/components/checkout/CheckoutClient.tsx](../src/components/checkout/CheckoutClient.tsx#L396-L404)
- [src/components/sandwich-builder/SandwichBuilder.tsx](../src/components/sandwich-builder/SandwichBuilder.tsx#L600) and [line 851](../src/components/sandwich-builder/SandwichBuilder.tsx#L851)
- [src/components/customization/ProductCustomization.tsx](../src/components/customization/ProductCustomization.tsx#L685), [line 912](../src/components/customization/ProductCustomization.tsx#L912), and [line 1026](../src/components/customization/ProductCustomization.tsx#L1026)
- [src/app/sandwiches/MenuClient.tsx](../src/app/sandwiches/MenuClient.tsx#L342) and [src/app/sandwiches/menu/MenuClient.tsx](../src/app/sandwiches/menu/MenuClient.tsx#L342)

**Fix:**

- Use `text-3xl tracking-[0.12em] sm:text-5xl sm:tracking-[0.28em] md:text-7xl` for these titles.
- Use `text-lg tracking-[0.15em] sm:text-2xl` for subtotal labels.
- As a safety net, add `overflow-x: clip` on `body`, or `overflow-x-clip` on the root layout wrapper.

Screenshots: [tile_sandwiches_checkout_0.jpg](mobile-audit/tile_sandwiches_checkout_0.jpg), [vp_build_top.jpg](mobile-audit/vp_build_top.jpg), [vp_build_bottom.jpg](mobile-audit/vp_build_bottom.jpg), [tile_sandwiches_customize_0.jpg](mobile-audit/tile_sandwiches_customize_0.jpg)

### 5. Tap targets too small (P1)

Apple recommends at least 44×44px and Google at least 48×48px. Measured:

| Element | Size |
|---------|------|
| Header hamburger "Open menu" | 28×28 |
| Footer Instagram / Facebook icons | 24×24 |
| Footer nav links (Specials, Turkey Reservations, …) | about 20px tall, stacked tightly |
| Checkout remove-item "✕" | 28×28 |
| Checkout quantity select | 55×29 |
| Cooking filter checkboxes | 13×13 |
| Cooking pagination buttons | 28×28 |
| Cooking "View Collection" link | 147×16 |
| Cooking "+ recipe" links | about 17px tall |
| Shopping list display checkboxes | 13×13 |
| Contact consent checkbox | 13×16 |

- **Fix:** add padding or `min-h-11 min-w-11` to icon buttons. Wrap checkboxes in full-height `<label>` rows. Add vertical padding (`py-2`) to footer links.

### 6. Specials tab row is clipped (P1)

- The "Weekend Two Day Only Specials" tab runs from x=217 to x=552 in a 360px viewport. It is cut off with no fade or arrow to show the row scrolls.
- **Fix:** let the tabs wrap or stack (`flex-wrap` / `grid-cols-1`) on mobile, or shorten the labels.
- The weekly ad flyer is also hard to read at phone width. Make "View Full Ad" (pinch-zoom viewer) more prominent on mobile.

Screenshot: [tile_specials_0.jpg](mobile-audit/tile_specials_0.jpg)

### 7. Fixed cart bar on sandwich menu (P1)

- **Verified in phase 2:** content coverage is handled. [src/app/sandwiches/MenuClient.tsx](../src/app/sandwiches/MenuClient.tsx#L520-L555) reserves `pb-28` and swaps the floating bar for a static bar near the end of the list.
- **Remaining issue:** the floating wrapper (`fixed bottom-0 left-0 right-0 z-40 px-6`) has no `pb-[env(safe-area-inset-bottom)]`, so the iPhone home indicator overlaps the "View Cart" button.
- At 320px the "SUBTOTAL" text in this bar overflows its box (see #4).

Screenshot: [vp_sandwiches_bottom.jpg](mobile-audit/vp_sandwiches_bottom.jpg)

Screenshots: [tile_sandwiches_0.jpg](mobile-audit/tile_sandwiches_0.jpg), [tile_sandwiches_1.jpg](mobile-audit/tile_sandwiches_1.jpg)

### 8. No safe-area handling (P1)

- `safe-area`, `svh`, and `dvh` are not used anywhere in `src/`. Bottom sheets (the turkey/roast "Add turkey" sheet), the fixed cart bar, and the mobile nav drawer all need `env(safe-area-inset-bottom)` padding.
- Every page wrapper uses `min-h-screen` (100vh). On iOS this is taller than the visible area while the URL bar is showing. Use `min-h-svh` or `min-h-dvh`.
- `viewport-fit=cover` must be set in the Next `viewport` export for the inset values to be non-zero.

### 9. Mobile nav drawer always in the accessibility tree (P1)

- The drawer (`fixed inset-y-0 right-0 … translate-x-full`) is rendered with `role="dialog"` even when closed, and only moved off-screen.
- Its links stay tabbable and are announced by VoiceOver while closed.
- **Fix:** add `inert` and `aria-hidden` when closed, or conditionally render it.

### 10. 4.3 MB favicon (P1)

- [src/app/icon.svg](../src/app/icon.svg) is about 4.3 million characters (an embedded base64 raster).
- Browsers fetch it on first visit, which costs a lot of mobile data.
- **Fix:** replace it with a small PNG/ICO (32/180/192/512px) or a true vector SVG.

### 11. Duplicate landmarks and headings (P2)

- These pages render a `<main>` from the layout and another `<main>` from the client component:
  - [src/app/turkey-reservations/layout.tsx](../src/app/turkey-reservations/layout.tsx) plus `TurkeyReservationsClient`
  - Roast reservations
  - Sandwiches
  - Cooking
  - Order placed
- Every interior page also has two `<h1>`s: the hero title and the page title.
- **Fix:** change the inner `<main>` to `<div>`/`<section>`, and make one of the headings an `<h2>`.

### 12. Footer newsletter row (P2)

- The email input renders at about 20px tall next to a much taller "Sign Up" button. It also uses a 14px font (see #3).
- **Fix:** give the input a matching height (`h-11`), or stack the input and button full-width on mobile.

Screenshot: [tile_home_2.jpg](mobile-audit/tile_home_2.jpg)

### 13. Home Instagram grid (P2)

- Five images in a 2-column grid leave an empty last cell.
- **Fix:** show 4 or 6 images on mobile, or make the last image span both columns.

Screenshot: [tile_home_1.jpg](mobile-audit/tile_home_1.jpg)

### 14. Copyright spacing (P2)

- The footer text reads "©2026Iowa Meat Farms…". Add a space after the year.

### 15. Heavy source assets (P2)

- `public/images/steaks` is 191 MB, `hero` 57 MB, `hand-drawn` 25 MB, and `features` 21 MB.
- `features/cow.png` is 3.5 MB.
- `next/image` resizes these at request time, but cold-cache requests on Amplify will be slow. Large originals also slow down builds and deploys.
- **Fix:** pre-compress originals (max about 2400px, JPG/WebP) and remove `_old` variants.

### 16. Long single-column pages (P3)

- `/steak-101` is about 7,800px tall on mobile because each steak card is full width.
- **Fix:** consider a 2-column card grid below `sm`, or collapsible sections.

Screenshots: [tile_steak-101_0.jpg](mobile-audit/tile_steak-101_0.jpg) through [tile_steak-101_3.jpg](mobile-audit/tile_steak-101_3.jpg)

### 17. Google Maps embeds (verify)

- Both map iframes (300×350px) were blocked (`ERR_ABORTED`) in the test browser, so they showed as blank boxes.
- Confirm on a real device.
- Consider a static map image with a "Get directions" link on mobile. That avoids scroll-trapping and about 1 MB of map JS per embed.

Screenshots: [tile_locations_0.jpg](mobile-audit/tile_locations_0.jpg), [tile_home_1.jpg](mobile-audit/tile_home_1.jpg)

---

### 18. Cooking sidebar is stacked above the content (P0)

On mobile, the cooking sidebar is rendered first in full: My Recipes, the 7-day My Menu with every day empty, My Shopping List, and Add to Shopping List. The actual page content comes after it:

| Page | Where the main content starts |
|------|-------------------------------|
| /cooking | First recipe heading ("Eating healthy never tasted so good") at **2,924px** (about 3.6 screens down) |
| /cooking/3522 (recipe detail) | Title band shows at about 600px, then the sidebar; "Ingredients" at **2,408px**, "Directions" at 2,974px |

The main purpose of a recipe page is the recipe, so this is the biggest problem in the cooking section on phones.

**Fix:** on mobile, put the content first and the sidebar after it (`order-last lg:order-first`), or collapse the sidebar into an accordion or a "My Recipe Box" button/drawer. Hide empty days ("No recipes planned") on mobile.

Screenshots: [tile_cooking_0.jpg](mobile-audit/tile_cooking_0.jpg), [tile_cooking_3522_0.jpg](mobile-audit/tile_cooking_3522_0.jpg)

### 19. Customizer and builder controls too small (P1)

- `/sandwiches/customize` NO / REGULAR / EXTRA segment buttons measure 34×23, 71×23, and 54×23px with 10px text. These are the main controls on the page.
- `/sandwiches/build` option rows (bread, meats, cheese, …) are 312×26px.
- The quantity `<select>` uses a 14px font, which triggers iOS zoom.
- **Fix:** use at least 40–44px tall segments with `text-xs`/`text-sm`, and full-row tappable option labels.

Screenshot: [tile_sandwiches_customize_0.jpg](mobile-audit/tile_sandwiches_customize_0.jpg) (third column)

### 20. Builder "Add to Cart" hard to reach (P1)

- `/sandwiches/build` is about 4,300px tall on mobile.
- The Subtotal / Cancel / Add to Cart block is only at the very bottom. Add to Cart is disabled (greyed out) until the required steps are done, but nothing says which step is missing.
- **Fix:** add a sticky bottom action bar with the subtotal and "Add to Cart" (with safe-area padding). When the button is disabled, show "Choose a bread to continue" or scroll to the first incomplete step.

Screenshot: [vp_build_bottom.jpg](mobile-audit/vp_build_bottom.jpg)

### 21. Forms don't support autofill (P1)

No inputs on these forms have `autocomplete` attributes:

| Page | Notes |
|------|-------|
| /sandwiches/checkout | No `<label>`s (placeholder only); no `name`, no `autocomplete`, ZIP has no `inputMode="numeric"` |
| /turkey-reservations, /roast-reservations | name, email, and phone have no `autocomplete` |
| /contact | No `autocomplete` on any field |

On a phone this means typing every field by hand, and placeholder text disappears once the user starts typing.

**Fix:**

- Add `autoComplete` values: `name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-level2`, `address-level1`, `postal-code`.
- Add `inputMode="numeric"` on ZIP.
- Add visible (or `sr-only`) `<label>`s at checkout.

### 22. Contact info not tappable (P1)

- On `/contact`, "Iowa Meat Farms: (619) 281-5766", "Siesel's Meats: (619) 275-1234", and "info@bestmeatssandiego.com" are plain `<p>` text. There are 0 `tel:` and 0 `mailto:` links. Home and Locations do have `tel:` links.
- No page has a "Get directions" link (0 links to Google/Apple Maps).
- **Fix:** wrap these in `tel:` and `mailto:` links. Add a directions link per location.

### 23. Specials full-ad viewer doesn't enlarge (P1)

- "View Full Ad" opens a modal, but the ad is still about 300px wide on a phone, the same as inline. The flyer text can't be read.
- The prev/next arrows sit on top of the ad.
- The helper text says "Click outside image to close", which is wrong wording for touch.
- The sticky site header stays undimmed above the modal.
- **Fix:**
  - On mobile, allow pinch-zoom/pan inside the viewer, or link to the full-resolution image so the OS image viewer opens.
  - Raise the modal's `z-index` above the header.
  - Change "Click" to "Tap".

Screenshot: [vp_specials_viewer.jpg](mobile-audit/vp_specials_viewer.jpg)

### 24. My Menu wasted space (P2)

- Each day card on `/cooking/my-menu` has `min-h-[340px]` but holds about 130px of content when empty. That adds roughly 1,400px of blank space over 7 days.
- **Fix:** use `lg:min-h-[340px]` only.

Screenshot: [tile_cooking_my-menu_0.jpg](mobile-audit/tile_cooking_my-menu_0.jpg)

### 25. Mobile nav drawer behaviour (P2)

Verified in phase 2:

- The drawer opens.
- The body scroll locks (`overflow: hidden`).
- Escape closes it.

Issues:

- Focus is not moved into the drawer and is not trapped (`activeElement` stays on `BODY`).
- The drawer has no Home, Sandwiches/Order Online, Cooking/Recipes, or Contact links. The desktop header doesn't have them either. If these sections are meant to be live, phone users can't find them except through the footer (Contact only). Confirm whether this is intentional.
- See also #9 (the drawer is focusable while closed).

Screenshot: [vp_nav_open.jpg](mobile-audit/vp_nav_open.jpg)

### 26. Code hygiene found during the audit (P3)

- [src/utils/routes.ts](../src/utils/routes.ts#L1) imports `SandwichBuilder` but never uses it. This can pull a large client component into every bundle that imports `routes`.
- `routes.cart` points to `/sandwiches/cart`, which doesn't exist.
- [src/app/sandwiches/MenuClient.tsx](../src/app/sandwiches/MenuClient.tsx) and [src/app/sandwiches/menu/MenuClient.tsx](../src/app/sandwiches/menu/MenuClient.tsx) are duplicates, so every mobile fix has to be made twice.

### 27. Stripe card field (verify)

- On `/sandwiches/checkout`, the Stripe iframe is mounted (278×19) but showed as an empty box in the test browser over HTTP.
- Confirm on a real phone over HTTPS. If it is blank there too, check the `CardElement` style options (font size at least 16px for iOS).

Screenshot: [vp_checkout_payment.jpg](mobile-audit/vp_checkout_payment.jpg)

---

## Fix log

### Round 1 — Phase A (global fixes)

Re-verified in Playwright at 360px and 320px:

| # | Status | Change |
|---|--------|--------|
| 1 | Fixed | `sizes="100vw"` on [Hero.tsx](../src/components/sections/Hero.tsx) and [InteriorHero.tsx](../src/components/sections/InteriorHero.tsx). Hero now loads `w=640` instead of `w=3840`. Source images are not yet compressed. |
| 2 | Fixed | The `InteriorHero` badge is stacked and centred above the title below `lg`; the `lg:` layout is unchanged. Measured L148–R212 at 360px. |
| 3 | Fixed | Unlayered rule in [globals.css](../src/app/globals.css): inputs, selects and textareas are 16px below `sm`. |
| 4 | Fixed | Responsive titles and subtotals in Checkout, SandwichBuilder, ProductCustomization, and both MenuClients. `scrollWidth === viewport` on every ordering page at 360 and 320. |
| 7, 8 | Partly fixed | `viewportFit: "cover"` viewport export; safe-area bottom padding on the floating cart bar, turkey/roast sheets, and nav drawer. Still open: `min-h-screen` → `svh`. |
| 9, 25 | Partly fixed | Drawer is `inert` and `aria-hidden` when closed, focuses the close button on open, and its icon tap targets are larger. The hamburger is 44×44. Still open: nav content question. |
| 5 | Partly fixed | Footer links have `py-2` on mobile; footer and drawer social icons get a 44px hit area. |
| 12 | Fixed | The newsletter input was collapsed by `flex-1` in column layout; it is now `w-full sm:flex-1` (48px tall). Added `autoComplete="email"`. |
| 22 | Partly fixed | Contact page phone numbers and email are `tel:`/`mailto:` links. Directions links are still to do. |

Screenshot after the fixes: [after_build.jpg](mobile-audit/after_build.jpg)

**Follow-up (hero badge):** below `lg`, [InteriorHero.tsx](../src/components/sections/InteriorHero.tsx) now places the badge to the left of the top decorative line, the same way the home hero places it beside "EXPERT". The title sits between the two lines on its own. The badge is 80px on screens ≥360px and 64px below that. At `lg` the large badge still sits beside the title. Comparison: [hero_compare.jpg](mobile-audit/hero_compare.jpg)

### Round 2 — Phase B (ordering flow)

| # | Status | Change |
|---|--------|--------|
| 19 | Fixed | [EditableIngredientList.tsx](../src/components/customization/EditableIngredientList.tsx): NO/REGULAR/EXTRA are now 40px tall with 12px text and `aria-pressed`. On phones they stack under the ingredient name as a full-width segment (measured 83–90×40). Builder option rows ([BuilderOptionCard.tsx](../src/components/sandwich-builder/BuilderOptionCard.tsx)) are 44px tall with `aria-pressed`. |
| 20 | Fixed | The Subtotal / Cancel / Add to Cart bar in [SandwichBuilder.tsx](../src/components/sandwich-builder/SandwichBuilder.tsx) and [ProductCustomization.tsx](../src/components/customization/ProductCustomization.tsx) is now `sticky bottom-0`, with safe-area padding and full-width buttons on phones. The builder shows a hint such as "Required: Select Your Bread" until the required steps are done. |
| 21 | Fixed | Checkout fields have `name`, `autoComplete`, `aria-label`, and `inputMode="numeric"` on ZIP. State and ZIP share a row on phones. Turkey/roast fields have `name`/`email`/`tel` autocomplete. Contact form fields have `given-name`/`family-name`/`email`/`tel`, and the opt-in checkbox row is 44px. |
| 5 | Fixed (checkout) | Cart item remove button is 40×40 and the quantity select is 40px tall on phones; the Edit link has vertical padding. |
| 26 | Fixed | `/sandwiches/menu` now imports the shared [MenuClient](../src/app/sandwiches/MenuClient.tsx), and the duplicate file was deleted. Removed the unused `SandwichBuilder` import and the dead `routes.cart`. |
| 14 | Fixed | Copyright now reads "©2026 Iowa Meat Farms". JSX had dropped the space at the line break. |

Screenshot: [after_phase_b.jpg](mobile-audit/after_phase_b.jpg) (builder sticky bar on the left, customizer controls on the right)

### Round 3 — Phase C (content pages)

| # | Status | Change |
|---|--------|--------|
| 18 | Fixed | [RecipeBoxSidebar.tsx](../src/components/recipes/RecipeBoxSidebar.tsx) uses `order-last lg:order-none`, so on phones it renders after the content (all three layouts). Empty menu days are hidden on phones and replaced by "No recipes planned this week." Results: /cooking first recipe content 2,924 → **1,392px**; recipe "Ingredients" 2,408 → **1,201px**. |
| 24 | Fixed | [MyMenuPage.tsx](../src/components/recipes/MyMenuPage.tsx) day cards use `lg:min-h-[340px]` only. The page is 4,267 → 3,269px. |
| 5 | Fixed (cooking) | A global mobile rule makes checkboxes and radios 20px. Shopping list and match-mode labels are 44px rows. Slideshow pager buttons are 40×40 on phones. |
| 6 | Fixed | [SpecialsGallery.tsx](../src/components/specials/SpecialsGallery.tsx): tabs stack full width on phones (both 16–344px). |
| 23 | Fixed | [SpecialsImageViewer.tsx](../src/components/specials/SpecialsImageViewer.tsx) is portalled to `<body>` at `z-[100]`, so it now covers the header, and is a proper `dialog`. Changes: body scroll lock, Escape to close, and tap image or "Tap image to zoom" for a 250%-wide pannable view (loads a larger image). Arrows are pushed to the frame edges and the outer padding is tighter on phones. **Note:** the current flyer source is only 937px wide, so zoom is limited by the source resolution. Uploading flyers at about 2000px+ wide would make the zoomed text crisp. |
| 22 | Fixed | [Locations.tsx](../src/components/sections/Locations.tsx): a "Get Directions" button (Google Maps directions URL) per location, maps are 240px tall on phones (was 350), and phone links have tap padding. |
| 13 | Fixed | [InstagramGallery.tsx](../src/components/sections/InstagramGallery.tsx): an odd last tile is hidden below `md` (4 shown in the 2-column grid; all 5 on desktop). Images are `loading="lazy"`. |

Screenshots: [after_viewer_compare.jpg](mobile-audit/after_viewer_compare.jpg) (viewer fit on the left; the right side was captured before the zoomed image finished loading), [after_viewer_zoom.jpg](mobile-audit/after_viewer_zoom.jpg) (zoomed and panned)

All pages re-checked at 360px: `scrollWidth === viewport`. `tsc --noEmit` is clean.

### Round 4 - Phase D (structure and polish)

| # | Status | Change |
|---|--------|--------|
| 11 | Fixed | Inner `<main>` elements changed to `<div>` in MenuClient, checkout success, order placed, Turkey/Roast clients, and six recipe components. Secondary page titles demoted from `<h1>` to `<h2>` (checkout, builder, customizer, menu, cart, turkey, roast, cooking headers, my-recipes, collection). Visual styles are unchanged. Every audited route now has exactly **1 `<main>` and 1 `<h1>`**. |
| 8 | Fixed | `min-h-screen` changed to `min-h-svh` on all page wrappers and full-height sections (the debug page is excluded). |
| 16 | Fixed | [SteakGrid.tsx](../src/components/steak-101/SteakGrid.tsx): a 2-column card grid on phones, with compact card padding and typography below `sm`. Cards are top-aligned (`flex flex-col`), and image `sizes` were updated to 50vw. Steak 101 is 7,829 to **4,530px** tall. Screenshot: [after_steak.jpg](mobile-audit/after_steak.jpg) |

Full re-check of all 21 routes at 360px: `scrollWidth === viewport` everywhere, and `tsc --noEmit` is clean.

### Round 5 — assets and decisions

| # | Status | Change |
|---|--------|--------|
| 10 | Fixed | `src/app/icon.svg` (4.3 MB) renamed to `src/app/icon_old.svg` as a backup. Next.js no longer serves it (`/icon.svg` → 404). The page `<head>` now links only the existing `favicon.ico` (15 KB), `icon.png` (19 KB) and `apple-icon.png` (62 KB). |
| 15 | Partly fixed (hero) | Originals are backed up to `image-originals/hero/`, which is git-ignored and not deployed; they are also still in git history. The 4 hero PNGs were converted to **near-lossless WebP** (`cwebp -near_lossless 60`): max per-pixel difference 2/255, PSNR ≈ 47 dB, so visually identical. Code references were updated. The 5 hero JPEGs were optimised **losslessly** with `jpegtran -optimize -progressive` (metadata stripped, pixels untouched). See the size table below. |
| 25 | Resolved | Sandwiches are intentionally not in the nav for now. |

Hero image sizes:

| File | Before | After |
|------|--------|-------|
| hero_image (home) | 3,025 KB PNG | 1,265 KB WebP |
| tri-tip-black (Steak 101) | 3,216 KB PNG | 1,206 KB WebP |
| steak-101-new (About) | 3,149 KB PNG | 1,335 KB WebP |
| locs (Locations) | 2,163 KB PNG | 1,079 KB WebP |
| sandwiches (Sandwiches) | 3,841 KB JPEG | 1,035 KB WebP (q95, full 3686×2182, PSNR 44 dB vs the JPEG) |
| rib-roasts.jpg | 1,219 KB | 1,136 KB |
| turkey-reservation.jpg | 506 KB | 471 KB |
| events_new.jpg | 439 KB | 390 KB |
| butcher.jpg | 188 KB | 178 KB |
| **Total** | **17.7 MB** | **8.1 MB** |

Visitors' browsers still receive the `next/image`-optimised version (for example, the home hero at 640w is 39 KB). The smaller sources mainly speed up first (cold-cache) requests on Amplify and shrink the deploy.

### Still open

- **#15 (rest):** the unused `*_old*` / duplicate files in `public/images/hero` (about 25 MB) and the 191 MB `public/images/steaks` folder have not been touched.
- **#25:** Cooking/Recipes and Contact are also not in the header or phone menu (Contact is in the footer). Confirm whether that is intentional too.
- **#17, #27:** verify Google Maps and the Stripe card field on a real phone over HTTPS.

---

## Pages with no layout overflow detected

These pages had `scrollWidth === viewport width` at both 360px and 320px:

`/`, `/about`, `/contact`, `/events`, `/locations`, `/specials`, `/steak-101`, `/turkey-reservations`, `/roast-reservations`, `/sandwiches`, `/sandwiches/menu`, `/sandwiches/order-placed`, `/cooking`, `/cooking/my-recipes`, `/cooking/my-menu`, `/cooking/shoppinglist`, `/cooking/3522`, `/cooking/collections/fall-in-love-with-salad`.

Exceptions are listed in #4.

Phase 2 also cleared these concerns:

- The grey strip below the footer in some full-page tiles is a screenshot artifact. The footer ends exactly at `scrollHeight`.
- The turkey/roast "Add turkey/roast" bottom sheet opens correctly and locks scroll. It still needs safe-area padding (#8).

---

## Audit checklist

- [x] Pin down the checkout overflow (H1 "CHECKOUT" letter-spacing; see #4)
- [x] Fixed cart bar coverage on `/sandwiches` (handled; only safe-area missing)
- [x] Visual review of checkout, cooking, my-menu, my-recipes, shopping list, and roast tiles
- [x] `/sandwiches/build?productId=89` and `/sandwiches/customize?productId=124`
- [x] Mobile nav drawer open state, turkey bottom sheet, recipe detail, collection page
- [x] Specials full-ad viewer
- [x] 320px overflow re-test
- [ ] On a real device: Google Maps embeds, Stripe card field, and iOS input zoom after fixes
- [ ] Re-run this audit after fixes to confirm `scrollWidth === viewport` everywhere

---

## Suggested fix plan

**Phase A — global fixes (most impact for least effort):**

1. `sizes="100vw"` on `Hero` and `InteriorHero`. Compress hero images. (#1)
2. `InteriorHero` badge: `hidden lg:block`, or stack it above the title. (#2)
3. A global 16px font size for form controls below `sm`. (#3)
4. Responsive title and subtotal typography for the ordering flow, plus `overflow-x-clip` on the root wrapper. (#4)
5. Drawer: `inert` when closed, focus on open; replace the 4.3 MB `icon.svg`. (#9, #10, #25)
6. `viewport-fit=cover` plus safe-area padding on fixed/bottom UI; `min-h-svh`. (#7, #8)

**Phase B — ordering flow:**

7. Bigger customizer and builder controls; a sticky Add to Cart bar with a hint when it's disabled. (#19, #20)
8. `autocomplete`, labels, and `inputMode` on the checkout, reservation, and contact forms. (#21)
9. Deduplicate `MenuClient`; clean up `routes.ts`. (#26)

**Phase C — content pages:**

10. Cooking: content first, sidebar collapsed; tighten the My Menu cards. (#18, #24)
11. Contact: `tel:` and `mailto:` links, plus directions links. (#22)
12. Specials: a zoomable full-ad viewer; fix the tab row. (#6, #23)
13. Tap targets, footer newsletter row, Instagram grid, copyright spacing. (#5, #12–#14)

**Phase D — polish:**

14. Asset cleanup, Steak 101 layout, nested `<main>`/`<h1>`. (#11, #15, #16)
