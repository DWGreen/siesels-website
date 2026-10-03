"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { CheckoutCustomerValues } from "@/components/checkout/CheckoutCustomerForm";
import CheckoutPaymentForm, { useCheckoutPaymentMethod } from "@/components/checkout/CheckoutPaymentForm";
import { getRuntimeStripePromise } from "@/lib/stripeRuntime";
import { MAX_GIFT_CARD_QUANTITY } from "@/config/giftCards";

type GiftCardLine = { productId: number; quantity: number };
type Props = { products: Product[] };

function GiftCardOrderForm({ products }: Props) {
  const router = useRouter();
  const createPaymentMethod = useCheckoutPaymentMethod();
  const [lines, setLines] = useState<GiftCardLine[]>([]);
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [pickerQuantity, setPickerQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [customer, setCustomer] = useState<CheckoutCustomerValues>({ fullName: "", email: "", phone: "", address1: "", city: "", state: "", postcode: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLines = lines.flatMap(line => {
    const product = products.find(entry => entry.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const orderTotal = selectedLines.reduce((sum, line) => sum + (Number(line.product.price) || 0) * line.quantity, 0);

  function openQuantityPicker(product: Product) {
    setPickerProduct(product);
    setPickerQuantity(1);
  }

  function addGiftCards() {
    if (!pickerProduct) return;
    const existing = lines.find(line => line.productId === pickerProduct.id);
    const currentQuantity = existing?.quantity ?? 0;
    const nextQuantity = Math.min(MAX_GIFT_CARD_QUANTITY, currentQuantity + Math.min(pickerQuantity, MAX_GIFT_CARD_QUANTITY - currentQuantity));
    setLines(current => existing
      ? current.map(line => line.productId === pickerProduct.id ? { ...line, quantity: nextQuantity } : line)
      : [...current, { productId: pickerProduct.id, quantity: nextQuantity }]);
    setPickerProduct(null);
  }

  function updateQuantity(productId: number, quantity: number) {
    const bounded = Math.min(MAX_GIFT_CARD_QUANTITY, Math.max(1, Math.floor(quantity || 1)));
    setLines(current => current.map(line => line.productId === productId ? { ...line, quantity: bounded } : line));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Add at least one gift card to your order.");
      return;
    }
    setIsSubmitting(true);
    try {
      const paymentMethodId = await createPaymentMethod({ name: customer.fullName, email: customer.email, phone: customer.phone });
      const response = await fetch("/api/gift-cards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, recipientName, recipientEmail, fromName, giftNote, customer, paymentMethodId }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message ?? "Unable to place gift card order.");
        return;
      }
      router.push(`/sandwiches/checkout/success?order_id=${encodeURIComponent(String(result.order_id ?? ""))}&order_key=${encodeURIComponent(String(result.order_key ?? ""))}`);
    } catch (submitError) {
      console.error("Gift card checkout failed:", submitError);
      setError(submitError instanceof Error ? submitError.message : "Unable to place gift card order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm outline-none focus:border-[#9d321e]";

  return (
    <>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <article key={product.id} className="flex h-full flex-col">
            {product.image ? (
              <Image src={product.image.thumbnailSrc ?? product.image.src} alt={product.image.alt || product.name} width={600} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="block h-auto w-full object-contain" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center font-heading text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Gift Card image unavailable</div>
            )}
            <div className="mt-4 flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 font-heading text-lg font-bold uppercase leading-tight">{product.name}</h2>
                <button type="button" onClick={() => openQuantityPicker(product)} disabled={(lines.find(line => line.productId === product.id)?.quantity ?? 0) >= MAX_GIFT_CARD_QUANTITY} className="inline-flex shrink-0 items-center gap-1.5 bg-neutral-950 px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-45">
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" /> Add To Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="mt-12 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(290px,0.8fr)]">
        <div className="space-y-7">
          <section className="border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-7">
            <div className="flex items-end justify-between gap-4 pb-2">
              <div><h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Your Gift Cards</h2><p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{itemCount} card{itemCount === 1 ? "" : "s"}</p></div>
              <p className="font-heading text-sm font-bold uppercase">${orderTotal.toFixed(2)}</p>
            </div>
            {selectedLines.length === 0 ? (
              <p className="py-8 text-center font-serif text-sm text-neutral-600">Your gift card order is empty.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {selectedLines.map(line => (
                  <div key={line.productId} className="flex flex-wrap items-center justify-between gap-4 border border-[#d8cec0] bg-white p-4">
                    <div><h3 className="font-heading text-sm font-bold uppercase">{line.product.name}</h3><p className="mt-1 font-serif text-sm text-neutral-600">${(Number(line.product.price) * line.quantity).toFixed(2)}</p></div>
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label={`Decrease ${line.product.name} quantity`} disabled={line.quantity <= 1} onClick={() => updateQuantity(line.productId, line.quantity - 1)} className="grid h-9 w-9 place-items-center border border-neutral-950 disabled:opacity-35"><Minus className="h-4 w-4" /></button>
                      <input aria-label={`${line.product.name} quantity`} type="number" min={1} max={MAX_GIFT_CARD_QUANTITY} value={line.quantity} onChange={event => updateQuantity(line.productId, Number(event.target.value))} className="h-9 w-14 border border-neutral-950 bg-white text-center font-heading font-bold" />
                      <button type="button" aria-label={`Increase ${line.product.name} quantity`} disabled={line.quantity >= MAX_GIFT_CARD_QUANTITY} onClick={() => updateQuantity(line.productId, line.quantity + 1)} className="grid h-9 w-9 place-items-center border border-neutral-950 disabled:opacity-35"><Plus className="h-4 w-4" /></button>
                      <button type="button" aria-label={`Remove ${line.product.name}`} onClick={() => setLines(current => current.filter(item => item.productId !== line.productId))} className="ml-1 grid h-9 w-9 place-items-center text-neutral-500 hover:text-[#9d321e]"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 font-serif text-xs text-neutral-600">Limit: {MAX_GIFT_CARD_QUANTITY} of each denomination per order. Recipient details below apply to every card in this order.</p>
          </section>

          <section className="border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-7">
            <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Gift Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">To<input required maxLength={100} autoComplete="off" value={recipientName} onChange={event => setRecipientName(event.target.value)} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Recipient email<input required type="email" maxLength={254} autoComplete="off" value={recipientEmail} onChange={event => setRecipientEmail(event.target.value)} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] sm:col-span-2">From<input required maxLength={100} autoComplete="off" value={fromName} onChange={event => setFromName(event.target.value)} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] sm:col-span-2">Gift note <span className="font-normal normal-case tracking-normal text-neutral-500">(optional, 200 characters max)</span><textarea maxLength={200} value={giftNote} onChange={event => setGiftNote(event.target.value)} className={`${inputClass} min-h-24 resize-y`} /></label>
            </div>
          </section>

          <section className="border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-7">
            <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Purchaser Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] sm:col-span-2">Full name<input required autoComplete="name" value={customer.fullName} onChange={event => setCustomer({ ...customer, fullName: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Email<input required type="email" autoComplete="email" value={customer.email} onChange={event => setCustomer({ ...customer, email: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Phone<input required type="tel" autoComplete="tel" value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em] sm:col-span-2">Billing address<input required autoComplete="address-line1" value={customer.address1} onChange={event => setCustomer({ ...customer, address1: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">City<input required autoComplete="address-level2" value={customer.city} onChange={event => setCustomer({ ...customer, city: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">State<input required autoComplete="address-level1" value={customer.state} onChange={event => setCustomer({ ...customer, state: event.target.value })} className={inputClass} /></label>
              <label className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">ZIP code<input required autoComplete="postal-code" inputMode="numeric" value={customer.postcode} onChange={event => setCustomer({ ...customer, postcode: event.target.value })} className={inputClass} /></label>
            </div>
          </section>
        </div>

        <aside className="self-start border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-7 lg:sticky lg:top-8">
          <p className="font-heading text-sm font-bold uppercase">Order total: ${orderTotal.toFixed(2)}</p>
          <div className="mt-5 border border-neutral-950 bg-white p-4"><CheckoutPaymentForm /></div>
          {error && <p role="alert" className="mt-5 border border-red-700 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
          <button type="submit" disabled={lines.length === 0 || isSubmitting} className="mt-6 w-full bg-neutral-950 px-5 py-4 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Submitting Order..." : "Purchase Gift Cards"}</button>
          <p className="mt-4 font-serif text-xs leading-5 text-neutral-600">Gift card details will be saved with your order. Digital delivery is not enabled yet.</p>
        </aside>
      </form>

      {pickerProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-6" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPickerProduct(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="gift-card-quantity-title" className="w-full border-2 border-neutral-950 bg-[#faf8f3] p-6 sm:max-w-md">
            <div className="flex items-start justify-between gap-4"><div><p className="font-heading text-[10px] font-bold uppercase tracking-[0.18em] text-[#9d321e]">{pickerProduct.name}</p><h2 id="gift-card-quantity-title" className="mt-1 font-heading text-xl font-bold uppercase">How Many?</h2></div><button type="button" aria-label="Close quantity picker" onClick={() => setPickerProduct(null)} className="grid h-9 w-9 place-items-center"><X className="h-5 w-5" /></button></div>
            <label className="mt-5 block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Quantity<input autoFocus type="number" min={1} max={MAX_GIFT_CARD_QUANTITY - (lines.find(line => line.productId === pickerProduct.id)?.quantity ?? 0)} value={pickerQuantity} onChange={event => setPickerQuantity(Math.min(MAX_GIFT_CARD_QUANTITY - (lines.find(line => line.productId === pickerProduct.id)?.quantity ?? 0), Math.max(1, Number(event.target.value) || 1)))} className="mt-2 block h-12 w-full border border-neutral-950 bg-white px-3 text-center font-heading text-lg font-bold" /></label>
            <p className="mt-2 font-serif text-xs text-neutral-600">Maximum {MAX_GIFT_CARD_QUANTITY} per denomination.</p>
            <div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setPickerProduct(null)} className="border border-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em]">Cancel</button><button type="button" onClick={addGiftCards} className="bg-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white">Add To Cart</button></div>
          </section>
        </div>
      )}
    </>
  );
}

export default function GiftCardOrderClient({ products }: Props) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    getRuntimeStripePromise().then(stripe => {
      if (!stripe) throw new Error("Stripe could not initialize.");
      if (active) setStripePromise(Promise.resolve(stripe));
    }).catch(error => {
      if (active) setStripeError(error instanceof Error ? error.message : "Stripe could not initialize.");
    });
    return () => { active = false; };
  }, []);
  if (stripeError) return <p role="alert" className="border border-red-700 bg-red-50 p-5 text-sm text-red-900">{stripeError}</p>;
  if (!stripePromise) return <p role="status" className="p-5 text-sm text-neutral-700">Loading secure payment form...</p>;
  return <Elements stripe={stripePromise}><GiftCardOrderForm products={products} /></Elements>;
}