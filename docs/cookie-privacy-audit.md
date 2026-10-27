# Cookie and data-flow audit

Source audit performed October 26, 2026. Scope: Next.js application source and dependencies in this repository. Business context: California shops, local pickup orders. **This is not a production-browser network capture or a legal certification.** Production host/CDN injections, actual Stripe cookies, remote image responses, WordPress plugins, backend retention, and processor contracts require verification.

## Findings and controls

| Feature | Storage / destination / information | Treatment |
| --- | --- | --- |
| Old banner | `react-cookie-consent` default cookie `CookieConsent`; dismiss-only notice in Header, no blocking | Replaced with self-hosted `vanilla-cookieconsent` 3.1.0 (MIT, free, no CMP account or pageview fees). Old consent is deliberately not reused. A legacy cookie may remain until browser expiry; it does not authorize optional services. |
| New manager | First-party `siesels_consent`, 180 days; choices, notice revision, timestamps and consent identifier | Essential. Explicit opt-in, accept/reject with equal button weight, category settings, footer reopening, revision 1. Consent evidence stays in the browser; no central consent-log service is included. |
| Embedded maps | Two Google Maps iframes in `Locations`; Google sees IP/browser/map activity and may use cookies/account identifiers | No iframe element is rendered before map consent. Reject leaves it absent; withdrawal unmounts it. Addresses and external directions links remain available. `loading="lazy"` alone was not a consent control. |
| WooCommerce sessions | `wc_cart_token`, `wc_cart_nonce`; `_token`/`_nonce` pairs with prefixes `wc_turkey_reservation`, `wc_turkey_breast_reservation`, `wc_ham_reservation`, `wc_roast_reservation`, `wc_gift_card` | HTTP-only, SameSite=Lax, Secure in production, session lifetime. Operational shopping/reservation storage; not gated by optional-map consent. Root CartProvider currently synchronizes a cart session even on ordinary page visits; review lazy session creation if stricter minimization is desired. |
| Sandwich cart | `siesels-sandwich-cart` localStorage: items/options, no automatic expiry | Operational cart persistence, disclosed. Consider expiry and lazy creation in follow-up; currently writes even an empty cart. |
| Recipe box | `bianchinis-recipe-box` localStorage: saved IDs, menus, shopping list, expiresAt | Requested recipe feature. 30-day logical expiry checked at next load. Hook currently saves an empty state on first feature visit; review lazy storage creation. |
| Stripe | Browser SDK and Elements on checkout/gift cards/debug page, payment/fraud device information; server-side payment API calls | Changed SDK imports to `/pure`, which loads only when `loadStripe` is called. Payment initialization still occurs on payment-page mount; necessary payment/fraud handling is separate from map consent. Third-party cookie names/durations must be verified at runtime; Stripe documents `__stripe_mid`, `__stripe_sid`, and other feature-dependent cookies, including some state-dependent analytics. No global promise that all Stripe storage is exempt is made by this audit. |
| Orders/reservations/gift cards | Browser → first-party API → WooCommerce/Stripe; names, email, phone, order/pickup data, billing fields, payment identifiers | Fulfillment processing, disclosed. Privacy notice links added at the start of collection forms. Cookie rejection must not disable order fulfillment. |
| Contact form | Names, email, phone, message, subject, location, newsletterOptIn → configured Ninja Forms, WordPress REST, or webhook | Removed full-payload logging in disabled mode. Existing disabled mode still returns success without delivering; configure and test before relying on contact form for requests. Optional newsletter checkbox is separate from cookie consent. |
| Footer newsletter | Email input has no name/action or submission integration | No working mailing-list integration found here. Identify provider and implement separate marketing permission before enabling delivery. |
| Recipes and ratings | Server CMS/DB/service requests; submitted recipe ID/vote; direct remote recipe `<img>` URLs can disclose visitor IP/browser to image host (including DW Green) | Content delivery rather than an identified analytics integration. Verify remote response cookies and provider role at runtime. Some mapper fallbacks use HTTP; fix content origins/HTTPS separately. |
| Fonts | `next/font/google` | Build-time font download; self-hosted browser assets. No runtime Google Fonts tag found. |
| Instagram/Facebook/Instacart | Ordinary outbound links, local gallery images | No embedded social SDK/pixel found. Provider receives information when visitor follows its link. |
| CMS product/modifier descriptions | Backend HTML is rendered via `dangerouslySetInnerHTML` in several catalog components | Actual production content can introduce external images/embeds not visible in this source audit; include CMS-rendered markup in the browser scan. |
| Hosting/security logs | First-party origin, hosting/CDN, backend error logs | IPs, URLs and browser headers may be retained. Provider configuration and actual retention not established by source scan. |

No Google Analytics, Google Tag Manager, Meta pixel, Hotjar, Clarity, reCAPTCHA, or other audience tracking integration was identified in the current application source. This does not establish that none is injected in production.

## Legal implementation boundary

California is the primary context supplied by the owner. CalOPPA privacy disclosure can matter even if a business is below CCPA thresholds. CCPA applicability depends on business facts; California consent/opt-out requirements are not interchangeable with UK/EEA cookie opt-in rules. The implementation conservatively blocks the identified optional embed for all visitors. A GPC signal cannot enable maps, and there is no identified advertising/sale/sharing integration to switch off. If such integrations are added, wire and test GPC/opt-out handling explicitly rather than assuming this manager handles every tracker automatically.

The public `/privacy` notice describes observed application behavior, storage, providers, and phone/contact routes. The internal proposed retention/request policy is in `docs/privacy-retention-policy.md`. The business must verify the notice against production practices and adopt a retention schedule. No production settings, deletion schedules, or third-party contracts were changed.

## Validation and production follow-up

Automated tests use the actual consent library: initial map blocking, rejection, acceptance, settings reopening, withdrawal, and saved choice behavior. TypeScript and scoped ESLint checks accompany the change.

Before calling the deployment verified, use a clean browser profile on the actual deployment:

1. Clear all site data; visit home, locations, recipes, reservations, checkout and gift cards without submitting orders/payments. Capture network requests, Set-Cookie headers, cookies, localStorage and sessionStorage. Record host/CDN-injected scripts and direct remote-image responses.
2. Confirm no Google Maps iframe/request before consent, after reject, or with a saved rejection. Accept maps, check requests, withdraw, reload, and confirm blocking resumes. Test with JavaScript disabled: no optional map should render.
3. Record actual Stripe cookies/storage and their purposes on payment routes; check no Stripe script/network request appears merely from non-payment-page imports. Review any Stripe analytics features and Link settings separately before classifying all storage as essential.
4. Test keyboard navigation, visible focus, modal focus containment/return, screen reader labels, 320px width and zoom. CookieConsent includes modal focus management; production visual/accessibility checks remain necessary.
5. Test new/repeat visitors, cookie expiry, consent revision, and GPC enabled. Essential checkout/reservations must work after rejection.
6. Check production contact delivery and identify newsletter provider; ensure owner can actually receive and fulfill privacy requests. Verify host/CDN/WordPress plugins, processor retention, and automatic cleanup settings. Do not place test purchases without authorization.

## Sources

- [CookieConsent installation](https://cookieconsent.orestbida.com/essential/getting-started.html)
- [CookieConsent configuration and consent revisions](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- [Stripe.js explicit/pure loading](https://github.com/stripe/stripe-js)
- [Stripe privacy and cookie information](https://stripe.com/legal/privacy-center)
- [California privacy-policy guidance](https://oag.ca.gov/sites/all/files/agweb/pdfs/cybersecurity/making_your_privacy_practices_public.pdf)
- [CCPA applicability and opt-out overview](https://oag.ca.gov/privacy/ccpa)
- [Current adjusted revenue threshold](https://cppa.ca.gov/regulations/cpi_adjustment.html)
- [ICO guidance on storage/access technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/)
