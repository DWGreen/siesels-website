"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

export function CookiePreferencesButton() {
  return <button type="button" onClick={() => CookieConsent.showPreferences()} className="min-h-11 px-2 underline underline-offset-4">Cookie settings</button>;
}

export default function CookiePreferences() {
  useEffect(() => {
    void CookieConsent.run({
      mode: "opt-in",
      revision: 1,
      autoShow: true,
      hideFromBots: false,
      cookie: { name: "siesels_consent", expiresAfterDays: 180, sameSite: "Lax" },
      guiOptions: {
        consentModal: { layout: "box", position: "bottom right", equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: "box", equalWeightButtons: true, flipButtons: false },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        maps: { enabled: false },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "Your privacy choices",
              description: 'We use essential storage for shopping, saved recipes, and your privacy choices. Google Maps is optional and stays blocked until you allow it. <a href="/privacy">Privacy &amp; cookies</a>.',
              acceptAllBtn: "Accept optional cookies",
              acceptNecessaryBtn: "Reject optional cookies",
              showPreferencesBtn: "Choose settings",
            },
            preferencesModal: {
              title: "Cookie settings",
              acceptAllBtn: "Accept optional cookies",
              acceptNecessaryBtn: "Reject optional cookies",
              savePreferencesBtn: "Save my choices",
              closeIconLabel: "Close cookie settings",
              sections: [
                { title: "You control optional services", description: 'You can change your choice at any time using Cookie settings in the footer. Rejecting optional services does not prevent shopping or making reservations. See our <a href="/privacy">privacy and cookie notice</a>.' },
                { title: "Essential storage (always on)", linkedCategory: "necessary", description: "Stores your consent choice for 180 days, shopping cart, requested recipe features, and WooCommerce shopping sessions. Payment pages use Stripe to process payments and prevent fraud. These services are not advertising cookies." },
                { title: "Google Maps", linkedCategory: "maps", description: "Allows embedded maps to connect to Google. Google receives your IP address, browser information, and map interactions, and may use cookies or recognize a signed-in Google account. Disabled until you opt in. Revoking consent removes embedded maps; it cannot undo data already sent to Google." },
              ],
            },
          },
        },
      },
    });
  }, []);
  return null;
}
