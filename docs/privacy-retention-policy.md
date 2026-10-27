# Proposed customer-data retention and privacy-request policy

Prepared October 26, 2026 for Iowa Meat Farms / Siesel's Meats. Local California pickup orders. **Draft for business adoption; periods below are proposed, not configured deletion jobs or claims about current backend behavior.** The website's public privacy/cookie notice is at `/privacy`.

## Ownership and scope

Designate a shop manager as privacy owner, a backup, and a monitored email address before adopting this policy. Until a dedicated address is approved, the public notice gives both shop phone numbers and the contact page. Verify contact-form delivery before relying on that form. Cover WooCommerce/WordPress, Stripe, contact-form providers and webhooks, email, paper exports, staff downloads, hosting logs, and backups. Avoid collecting birth dates, government identifiers, or full card numbers for ordinary pickup orders.

## Proposed retention schedule

| Records | Proposed duration / starting point | Required action before adoption |
| --- | --- | --- |
| Completed pickup orders and accounting records | 7 years after transaction | Accountant must confirm required tax/audit periods and minimum fields. Restrict access; remove optional notes earlier when no longer needed. |
| Unfulfilled reservations without a payment/accounting obligation | 90 days after scheduled pickup or cancellation | Confirm refund, dispute, and customer-service requirements; paid transactions follow accounting schedule. |
| Abandoned carts and failed/unpaid checkouts | 30 days after last activity | Confirm WooCommerce sessions, pending orders, and related scheduled cleanup; distinguish paid failures/disputes. |
| Contact messages | 12 months after resolution | Apply to form submissions, email copies, webhook destinations, and staff exports. Transfer records needed for disputes to a restricted case file with a documented end date. |
| Newsletter subscription details | Until unsubscribe or 24 months without engagement | Confirm provider and tracking practices first; retain a minimal suppression record as needed to honor opt-outs. Cookie acceptance is not newsletter permission. |
| Application and access logs | 30 days | Verify host/CDN defaults; redact request bodies, credentials, and personal details. Retain specific security evidence longer only for a documented incident. |
| Backups | 90-day rolling window | Confirm host/database/provider schedules; keep backups restricted, let deleted data age out, and reapply deletion records after a restore. |
| Privacy-request record | 24 months after resolution | Keep only request type, dates, verification outcome, actions, and response evidence. Confirm any applicable statutory period. |
| Browser consent record | 180 days | Implemented as `siesels_consent`; new consent revision needed if optional purposes change. |
| Browser cart | Until cleared; currently no automatic expiry | Decide whether to add a 30-day expiry. No expiry has been implemented in this change. |
| Browser recipe box | 30-day application expiry, checked on next feature use | Browser bytes remain until the feature checks expiry or site data is cleared. |
| Stripe-held payment records | Provider/legal retention | Verify Stripe's current terms and deletion capabilities; do not promise that deleting a WooCommerce order deletes Stripe's records. |

Apply documented legal holds before scheduled deletion. Review this schedule annually and when payment, marketing, or hosting providers change. Do not enable a blanket WooCommerce auto-delete rule that could remove required accounting evidence.

## Handling a privacy request

1. Record the date, request type (access, correction, deletion, consent, or sale/sharing opt-out), and a safe reply channel. Never request a full card number or identity document by ordinary email.
2. Acknowledge promptly; use an internal target of 10 business days. Determine applicable law and any required acknowledgment/response periods. If CCPA applies, verify its deadlines and permitted extensions; use a 45-calendar-day fulfillment target and explain any lawful extension before the original deadline.
3. Verify identity proportionately using existing order/contact details or control of the email associated with the relevant records. Do not require identity verification simply to reject optional cookies or exercise a sale/sharing opt-out. Confirm authorized-agent authority where relevant.
4. Search WooCommerce orders/customers/reservations/gift-card records, form submissions, relevant mailboxes, the newsletter provider, staff exports, and provider systems. Never disclose another customer's information. Export WordPress personal data where appropriate, and check custom plugin records separately.
5. Explain what can be corrected/deleted and what must be retained for accounting, fraud prevention, disputes, or another applicable exception. Limit access to retained records and remove unnecessary fields. Coordinate eligible deletions with service providers. Explain backup aging honestly.
6. Respond through the verified channel and record completion. Never penalize customers for making a request. Escalate refusals, exemptions, sensitive disclosures, and disputes to the privacy owner.

Cookie withdrawal is immediate through footer Cookie settings for embedded maps. It does not delete order records or recall data already transmitted. Optional maps remain off by default for everyone; no advertising sale/sharing technology was identified in the application source. If ads or analytics are introduced, reassess sale/sharing, GPC handling, opt-out links, notice text, and consent wiring before release.

## Facts still needed

- Legal business entity/entities, privacy owner/email, and adopted retention periods.
- Whether CCPA coverage thresholds or related-entity provisions apply: current adjusted revenue threshold is $26,625,000; also assess 100,000-consumer/household buying/selling/sharing and 50% revenue from sale/sharing. Do not infer coverage simply from website traffic.
- Hosting/CDN, production WordPress plugins, backups, form/newsletter providers, processor contracts, and storage locations.
- Confirmation of any tracking injected outside this repository. Serving local pickup customers does not by itself prove every jurisdictional rule is inapplicable.

## References

- [California privacy-policy guidance (CalOPPA)](https://oag.ca.gov/sites/all/files/agweb/pdfs/cybersecurity/making_your_privacy_practices_public.pdf)
- [California Attorney General CCPA overview](https://oag.ca.gov/privacy/ccpa)
- [Adjusted CCPA monetary thresholds](https://cppa.ca.gov/regulations/cpi_adjustment.html)
