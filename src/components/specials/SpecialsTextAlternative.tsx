import { useId } from "react";
import type { SpecialImage } from "@/data/specials";

export default function SpecialsTextAlternative({ image }: { image: SpecialImage }) {
  const headingId = useId();
  const text = image.textAlternative;

  return (
    <details className="border border-[#b8aa97] bg-white p-4 sm:p-6">
      <summary className="cursor-pointer font-heading text-lg font-bold text-brand-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e]">
        Read this ad as text
      </summary>
      <section aria-labelledby={headingId} className="mt-5 space-y-5 font-serif text-base leading-relaxed text-neutral-700">
        <header>
          <h4 id={headingId} className="font-heading text-2xl font-bold text-brand-black">{text.heading}</h4>
          <p className="mt-2 font-bold">{text.effectiveDates}</p>
          {text.introduction ? <p className="mt-3">{text.introduction}</p> : null}
        </header>
        <ul className="space-y-5">
          {text.offers.map(offer => (
            <li key={offer.name}>
              <h5 className="font-heading text-xl font-bold text-brand-black">{offer.name}</h5>
              <p className="font-bold">{offer.price}</p>
              <p>{offer.details}</p>
            </li>
          ))}
        </ul>
        {text.notices?.length ? (
          <div className="space-y-3">
            {text.notices.map(notice => <p key={notice}>{notice}</p>)}
          </div>
        ) : null}
      </section>
    </details>
  );
}
