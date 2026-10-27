import Link from "next/link";

export default function CollectionNotice({ contact = false }: { contact?: boolean }) {
  return <p className="col-span-full text-sm leading-relaxed text-neutral-700">
    {contact
      ? "We use your contact details and message to respond to your request. Promotional emails are a separate, optional choice. "
      : "We use your contact details, selections, and pickup information to fulfill your order or reservation. Payment details, when needed, are processed by Stripe. "}
    <Link href="/privacy" className="font-semibold underline underline-offset-4">Read our privacy and cookie notice</Link> for details and privacy request options.
  </p>;
}
