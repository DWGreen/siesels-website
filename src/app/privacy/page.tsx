import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferences";

export const metadata: Metadata = { title: "Privacy & cookies | Iowa Meat Farms & Siesel’s Meats" };

export default function PrivacyPage() {
  return <div className="flex min-h-svh flex-col">
    <Header />
    <main id="main-content" className="flex-1 bg-white px-5 py-12 text-brand-black">
      <article className="mx-auto max-w-3xl space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_a]:underline [&_a]:underline-offset-4">
        <h1 className="font-heading text-4xl font-bold">Privacy &amp; cookies</h1>
        <p>Last updated: October 26, 2026</p>
        <p>This notice describes information handled by the Iowa Meat Farms and Siesel&apos;s Meats website and the choices available to you.</p>
        <h2>Information you provide</h2>
        <p>When you place an order, purchase a gift card, or reserve products, we use your name, email, phone number, order details, pickup choices, and any billing details requested to fulfill your request and communicate with you. Our WooCommerce order system receives these details. Stripe processes payment details through its secure payment form; our website receives payment identifiers and status rather than your full card number.</p>
        <p>Contact forms collect the details you enter, such as your name, email, phone, preferred location, and message. Depending on the form configuration, these are delivered through our form service. Newsletter permission is a separate choice from cookie consent. Recipe ratings send the recipe identifier and your vote to our recipe service.</p>
        <h2>Essential cookies and browser storage</h2>
        <p>We use the following storage for shopping, features you request, and remembering your privacy choices. Blocking this storage in your browser may prevent those features from working.</p>
        <ul className="list-disc space-y-3 pl-6">
          <li><strong>siesels_consent:</strong> a first-party cookie recording your consent settings and notice version for 180 days. You can change your settings below.</li>
          <li><strong>WooCommerce session cookies:</strong> wc_cart_token and wc_cart_nonce, plus token/nonce pairs beginning wc_turkey_reservation, wc_turkey_breast_reservation, wc_ham_reservation, wc_roast_reservation, and wc_gift_card. These support shopping and reservation sessions. They are HTTP-only session cookies; browsers with session restoration may retain them after closing.</li>
          <li><strong>siesels-sandwich-cart:</strong> local storage holding your cart items. It has no automatic expiry and can be removed through your browser&apos;s site-data settings or by clearing your cart.</li>
          <li><strong>bianchinis-recipe-box:</strong> local storage for saved recipes, shopping lists, and menus. The application checks its 30-day expiry when you next use the recipe feature; your browser may retain the data until that check or until you clear site data.</li>
          <li><strong>Stripe:</strong> payment pages connect to Stripe for payment processing, authentication, and fraud prevention. Stripe may set cookies such as __stripe_mid and __stripe_sid. The exact storage and duration depend on the payment features used. See <a href="https://stripe.com/privacy" rel="noreferrer" target="_blank">Stripe&apos;s privacy policy</a> and <a href="https://stripe.com/cookie-settings" rel="noreferrer" target="_blank">cookie information</a>.</li>
        </ul>
        <h2>Optional Google Maps</h2>
        <p>Embedded Google Maps stays blocked until you opt in. If enabled, Google receives connection details such as your IP address, browser information, and map interactions, and may use cookies or associate activity with your Google account. See <a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">Google&apos;s privacy policy</a>. You can use our addresses and directions links without enabling embedded maps. Following an external link takes you to that provider&apos;s website.</p>
        <CookiePreferencesButton />
        <p>Rejecting optional cookies leaves embedded maps blocked. Withdrawing consent removes the embeds from this page and other open pages when they update their settings; it does not erase information already sent to Google or cookies on Google&apos;s domains. You can remove those cookies using your browser controls.</p>
        <h2>Other connections and technical information</h2>
        <p>Our website host and service providers receive network information, including IP addresses, requested pages, and browser headers, to deliver and secure the website. Recipe images may load from our content provider, DW Green, which receives connection information. Fonts are served by the website. Social media and Instacart links take you to external sites when selected.</p>
        <p>The current application does not include advertising pixels or audience analytics tags. Cookie settings control optional embedded maps; they do not prevent information needed to fulfill an order or contact request from reaching the relevant service providers. The application does not use advertising tags to sell or share browsing information for cross-context behavioral advertising. A Global Privacy Control signal does not enable any optional service. Browser Do Not Track signals do not change essential shopping or payment processing.</p>
        <h2>Retention, access, and questions</h2>
        <p>Browser-storage durations are listed above. Order, payment, and contact records are separate from browser storage; clearing cookies does not delete these records. Their retention depends on the service, fulfillment needs, and applicable recordkeeping requirements.</p>
        <p>To ask about your information, request access, correction, or deletion, or ask about retention, <Link href="/contact">contact the shops</Link>, call Iowa Meat Farms at <a href="tel:+16192815766">(619) 281-5766</a>, or Siesel&apos;s Meats at <a href="tel:+16192751234">(619) 275-1234</a>. We may need to verify your request, and some records may need to be retained to meet legal obligations. Available rights depend on applicable law.</p>
        <p>When we change this notice, we update the date above. If optional services or their purposes change, we will request a new consent choice.</p>
      </article>
    </main>
    <div className="bg-footer-texture"><Footer /></div>
  </div>;
}
