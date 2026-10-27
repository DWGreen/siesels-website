"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

export default function ConsentMap({ name, query }: { name: string; query: string }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const update = () => setAllowed(CookieConsent.acceptedCategory("maps"));
    update();
    window.addEventListener("cc:onConsent", update);
    window.addEventListener("cc:onChange", update);
    return () => {
      window.removeEventListener("cc:onConsent", update);
      window.removeEventListener("cc:onChange", update);
    };
  }, []);

  const size = "h-[240px] w-full sm:h-[350px] md:h-[400px]";
  if (!allowed) {
    return <div className={`${size} flex flex-col items-center justify-center gap-4 bg-neutral-100 p-6 text-center text-brand-black`}>
      <p>Google Maps is blocked until you allow optional map cookies. You can still use the address and directions link below.</p>
      <button type="button" onClick={() => CookieConsent.showPreferences()} className="min-h-11 border-2 border-brand-black px-5 py-2 font-bold underline underline-offset-4">Manage map consent</button>
    </div>;
  }
  return <iframe title={`Map of ${name}`} src={`https://www.google.com/maps?q=${query}&output=embed`} className={size} loading="lazy" referrerPolicy="no-referrer" allowFullScreen />;
}
