"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import type { HamReservationProduct, HamReservationVariation } from "@/services/hamReservations";
import { reservationStoreLocations } from "@/data/storeLocations";
import { useReservationOrdering } from "@/hooks/useReservationOrdering";
import { getReservationOrderingStatus } from "@/utils/reservationOrdering";

type SelectedHam = { productId: number; variationId: number; quantity: number };
type Props = { products: HamReservationProduct[] };

const hamImage = "/images/hand-drawn/ham.webp";
const fieldClass = "mt-2 block w-full min-w-0 border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal";
const addClass = "inline-flex cursor-pointer items-center justify-center gap-2 bg-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50";

function variationSelections(variation: HamReservationVariation): Record<string, string> {
  return Object.fromEntries(variation.attributes.map(({ attribute, value }) => [attribute, value]));
}

function attributeNames(product: HamReservationProduct) {
  return [...new Set(product.variations.flatMap(variation => variation.attributes.map(({ attribute }) => attribute)))];
}

function matchesSelections(variation: HamReservationVariation, selections: Record<string, string>, names: string[]) {
  return names.every(name => variation.attributes.some(({ attribute, value }) => attribute === name && value === selections[name]));
}

function todayDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export default function HamReservationsClient({ products }: Props) {
  const router = useRouter();
  const ordering = useReservationOrdering("ham");
  const [items, setItems] = useState<SelectedHam[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [pickupDate, setPickupDate] = useState("");
  const [storeLocationId, setStoreLocationId] = useState(reservationStoreLocations[0]?.id ?? "");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const dialogRef = useRef<HTMLElement>(null);
  const sizeRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sizeRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setPickerOpen(false);
      }
      if (event.key !== "Tab") return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), select:not(:disabled), input:not(:disabled), [tabindex="0"]'
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [pickerOpen]);

  function maximumQuantity(product: HamReservationProduct, variation: HamReservationVariation, lines = items) {
    if (!variation.stockManaged || !variation.inStock || variation.stockQuantity === null ||
      !Number.isFinite(variation.stockQuantity)) return 0;
    const parentStock = product.variations.find(entry => entry.usesParentStock)?.stockQuantity;
    const stock = variation.usesParentStock
      ? Math.min(variation.stockQuantity, parentStock ?? 0)
      : variation.stockQuantity;
    const otherQuantity = variation.usesParentStock
      ? lines.reduce((total, item) => item.productId === product.id && item.variationId !== variation.id &&
        product.variations.some(entry => entry.id === item.variationId && entry.usesParentStock)
        ? total + item.quantity : total, 0)
      : 0;
    return Math.max(0, Math.floor(stock) - otherQuantity);
  }

  function remainingQuantity(product: HamReservationProduct, variation: HamReservationVariation, lines = items) {
    return maximumQuantity(product, variation, lines) -
      (lines.find(item => item.productId === product.id && item.variationId === variation.id)?.quantity ?? 0);
  }

  const availableProducts = products.filter(product => product.variations.some(variation => remainingQuantity(product, variation) > 0));
  const pickerProduct = products.find(product => product.id === productId);
  const pickerAttributes = pickerProduct ? attributeNames(pickerProduct) : [];
  const pickerVariation = pickerProduct?.variations.find(variation => matchesSelections(variation, selections, pickerAttributes));
  const pickerAvailable = Boolean(pickerProduct && pickerVariation && remainingQuantity(pickerProduct, pickerVariation) > 0);
  const selectedCount = items.reduce((total, item) => total + item.quantity, 0);

  function openPicker() {
    const first = availableProducts[0];
    if (!first) return;
    changeProduct(first.id);
    setPickerOpen(true);
  }

  function changeProduct(nextProductId: number) {
    const product = products.find(entry => entry.id === nextProductId);
    const first = product?.variations.find(variation => remainingQuantity(product, variation) > 0);
    if (!product || !first) return;
    setProductId(product.id);
    setSelections(variationSelections(first));
  }

  function changeAttribute(attribute: string, value: string, index: number) {
    if (!pickerProduct) return;
    const nextSelections = { ...selections, [attribute]: value };
    const prefix = pickerAttributes.slice(0, index + 1);
    const matching = pickerProduct.variations.find(variation =>
      matchesSelections(variation, nextSelections, prefix) && remainingQuantity(pickerProduct, variation) > 0);
    if (matching) setSelections(variationSelections(matching));
  }

  function addHam() {
    if (!ordering.isOpen || !pickerProduct || !pickerVariation || !pickerAvailable || submittingRef.current) return;
    setItems(current => {
      if (remainingQuantity(pickerProduct, pickerVariation, current) <= 0) return current;
      const existing = current.find(item => item.productId === pickerProduct.id && item.variationId === pickerVariation.id);
      return existing
        ? current.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { productId: pickerProduct.id, variationId: pickerVariation.id, quantity: 1 }];
    });
    setPickerOpen(false);
    setError(null);
  }

  function updateQuantity(product: HamReservationProduct, variation: HamReservationVariation, quantity: number) {
    if (!Number.isFinite(quantity) || submittingRef.current) return;
    setItems(current => {
      const maximum = maximumQuantity(product, variation, current);
      if (maximum < 1) return current.filter(item => item.productId !== product.id || item.variationId !== variation.id);
      const bounded = Math.min(maximum, Math.max(1, Math.floor(quantity)));
      return current.map(item => item.productId === product.id && item.variationId === variation.id ? { ...item, quantity: bounded } : item);
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    setError(null);
    const currentOrdering = getReservationOrderingStatus("ham");
    if (!currentOrdering.isOpen) {
      setError(currentOrdering.message);
      return;
    }
    if (!items.length) {
      setError("Add at least one ham to your reservation.");
      return;
    }
    if (items.some(item => {
      const product = products.find(entry => entry.id === item.productId);
      const variation = product?.variations.find(entry => entry.id === item.variationId);
      return !product || !variation || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > maximumQuantity(product, variation);
    })) {
      setError("One of your ham selections is no longer available in that quantity.");
      return;
    }
    if (!customerName.trim() || !email.trim() || pickupDate < todayDate() ||
      !reservationStoreLocations.some(location => location.id === storeLocationId)) {
      setError("Enter your contact details and choose a valid pickup date and location.");
      return;
    }
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ham-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate,
          storeLocationId,
          customer: { name: customerName.trim(), email: email.trim(), phone: phone.trim() },
          items: items.map(({ productId, variationId, quantity }) => ({ productId, variationId, quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(typeof result.message === "string" ? result.message : "Unable to submit ham reservation.");
        return;
      }
      router.push(`/sandwiches/checkout/success?reservation=ham&order_id=${encodeURIComponent(String(result.order_id ?? ""))}&order_key=${encodeURIComponent(String(result.order_key ?? ""))}`);
    } catch {
      setError("Unable to submit reservation. Please try again.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[url('/images/textures/footer-bg.png')] bg-cover bg-bottom opacity-[0.12]" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-7 border-b-2 border-[#2d2d2d] pb-6">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">Holiday Orders</p>
              <h2 className="mt-2 font-heading text-3xl font-bold uppercase leading-tight sm:text-4xl">Holiday Ham Reservations</h2>
              <p className="mt-3 max-w-2xl font-serif text-sm leading-6 text-neutral-700">Reserve your holiday ham for pickup at Siesel&apos;s Meats or Iowa Meat Farms.</p>
              {ordering.message && <p role="status" className="mt-4 font-heading text-base font-bold text-[#9d321e]">{ordering.message}</p>}
            </div>
            <Image src="/images/hand-drawn/pig.webp" alt="Hand-drawn holiday ham illustration" width={520} height={300} className="mx-auto w-full max-w-sm object-contain md:justify-self-end" priority />
          </div>
          <ol className="mt-6 grid gap-4 border-t border-[#b8aa97] pt-5 sm:grid-cols-3">
            {[
              ["01", "Choose your ham", "Select size, options and quantity"],
              ["02", "Select your pickup date", "Let us know when to prepare it"],
              ["03", "Reserve online", "We’ll confirm your reservation"],
            ].map(([number, title, caption]) => (
              <li key={number} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#9d321e] font-heading text-xs font-bold text-white">{number}</span>
                <span><strong className="block font-heading text-xs font-bold uppercase tracking-[0.12em]">{title}</strong><span className="mt-1 block font-serif text-xs text-neutral-600">{caption}</span></span>
              </li>
            ))}
          </ol>
        </header>

        <form onSubmit={submit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
          <section className="min-w-0 border border-[#b8aa97] bg-[#faf8f3] p-4 sm:p-6" aria-labelledby="ham-selections-title">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#b8aa97] pb-3">
              <div>
                <h2 id="ham-selections-title" className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Your Hams</h2>
                <p aria-live="polite" className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">{selectedCount} ham{selectedCount === 1 ? "" : "s"}</p>
              </div>
              <button type="button" onClick={openPicker} disabled={!ordering.isOpen || isSubmitting || !availableProducts.length} className={addClass}><Plus aria-hidden="true" className="h-4 w-4 shrink-0" /> Add A Ham</button>
            </div>

            {items.length === 0 ? (
              <div className="flex min-h-[270px] flex-col items-center justify-center px-3 py-8 text-center">
                <Image src={hamImage} alt="Holiday ham from Siesel's Meats" width={360} height={240} className="mb-5 h-40 w-full max-w-64 object-cover" />
                <h3 className="font-serif text-xl font-bold uppercase">Holiday Hams</h3>
                <button type="button" onClick={openPicker} disabled={!ordering.isOpen || isSubmitting || !availableProducts.length} className={`${addClass} mt-5`}><Plus aria-hidden="true" className="h-4 w-4 shrink-0" /> Add A Ham</button>
                {!availableProducts.length && <p role="status" className="mt-4 max-w-sm font-serif text-sm text-neutral-600">Holiday ham options are currently unavailable. Please check back soon.</p>}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(item => {
                  const product = products.find(entry => entry.id === item.productId);
                  const variation = product?.variations.find(entry => entry.id === item.variationId);
                  if (!product || !variation) return null;
                  const maximum = maximumQuantity(product, variation);
                  const attributes = variation.attributes.map(({ value }) => value).join(" / ");
                  const label = [product.name, attributes].filter(Boolean).join(" / ");
                  return (
                    <div key={`${item.productId}-${item.variationId}`} className="flex flex-wrap items-center justify-between gap-4 border border-[#d8cec0] bg-white p-4 sm:px-5">
                      <div className="min-w-0"><h3 className="break-words font-heading text-base font-bold uppercase">{product.name}</h3>{attributes && <p className="mt-1 break-words font-serif text-sm text-neutral-600">{attributes}</p>}</div>
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label={`Decrease ${label} quantity`} disabled={isSubmitting || item.quantity <= 1} onClick={() => updateQuantity(product, variation, item.quantity - 1)} className="grid h-10 w-10 cursor-pointer place-items-center border border-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-35"><Minus aria-hidden="true" className="h-4 w-4" /></button>
                        <input aria-label={`Quantity for ${label}`} type="number" min={1} max={maximum} step={1} disabled={isSubmitting} value={item.quantity} onChange={event => updateQuantity(product, variation, event.target.valueAsNumber)} className="h-10 w-16 border border-[#2d2d2d] bg-white text-center font-heading text-base font-bold" />
                        <button type="button" aria-label={`Increase ${label} quantity`} disabled={isSubmitting || item.quantity >= maximum} onClick={() => updateQuantity(product, variation, item.quantity + 1)} className="grid h-10 w-10 cursor-pointer place-items-center border border-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-35"><Plus aria-hidden="true" className="h-4 w-4" /></button>
                        <button type="button" aria-label={`Remove ${label}`} disabled={isSubmitting} onClick={() => setItems(current => current.filter(entry => entry.productId !== product.id || entry.variationId !== variation.id))} className="grid h-10 w-10 cursor-pointer place-items-center text-neutral-500 hover:text-[#9d321e] disabled:opacity-35"><X aria-hidden="true" className="h-5 w-5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="min-w-0 self-start border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Pickup &amp; Contact</h2>
            <fieldset disabled={isSubmitting} className="mt-5 min-w-0 space-y-4">
              <legend className="sr-only">Pickup and contact details</legend>
              <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Pickup location
                <select required value={storeLocationId} onChange={event => setStoreLocationId(event.target.value)} className={fieldClass}>
                  <option value="" disabled>Select a store</option>
                  {reservationStoreLocations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
              </label>
              <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Pickup date
                <input required type="date" min={todayDate()} value={pickupDate} onChange={event => setPickupDate(event.target.value)} className={fieldClass} />
              </label>
              <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Name
                <input required autoComplete="name" value={customerName} onChange={event => setCustomerName(event.target.value)} className={fieldClass} />
              </label>
              <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Email
                <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className={fieldClass} />
              </label>
              <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Phone
                <input type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} className={fieldClass} />
              </label>
            </fieldset>
            {error && <p role="alert" className="mt-5 border border-red-700 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
            <button type="submit" disabled={!ordering.isOpen || isSubmitting || !items.length} className="mt-6 w-full cursor-pointer bg-[#9d321e] px-5 py-4 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#762415] disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Submitting Reservation..." : "Reserve My Hams"}</button>
            <p className="mt-4 font-serif text-xs leading-5 text-neutral-600">No payment is collected online. Your reservation will be sent directly to our meat department for preparation.</p>
          </aside>
        </form>

        {pickerOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 pb-[env(safe-area-inset-bottom)] sm:items-center sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget) setPickerOpen(false); }}>
            <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="ham-picker-title" className="max-h-[90svh] w-full overflow-y-auto border-2 border-neutral-950 bg-[#faf8f3] p-6 sm:max-w-lg">
              <div className="flex items-center justify-between gap-4">
                <h2 id="ham-picker-title" className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Add A Holiday Ham</h2>
                <button type="button" onClick={() => setPickerOpen(false)} aria-label="Close ham picker" className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center"><X aria-hidden="true" className="h-5 w-5" /></button>
              </div>
              <div className="mt-5 space-y-4">
                <label className="block font-heading text-xs font-bold uppercase tracking-[0.1em]">Size
                  <select ref={sizeRef} aria-describedby="ham-size-help" value={productId ?? ""} onChange={event => changeProduct(Number(event.target.value))} className={fieldClass}>
                    {products.map(product => {
                      const available = availableProducts.some(entry => entry.id === product.id);
                      return <option key={product.id} value={product.id} disabled={!available}>{product.name}{!available ? " (Unavailable)" : ""}</option>;
                    })}
                  </select>
                  <span id="ham-size-help" className="mt-2 block font-body text-xs font-normal normal-case tracking-normal text-neutral-600">Choose your ham size.</span>
                </label>
                {pickerAttributes.map((attribute, index) => {
                  const compatible = pickerProduct?.variations.filter(variation =>
                    matchesSelections(variation, selections, pickerAttributes.slice(0, index))) ?? [];
                  const options = [...new Set(compatible.flatMap(variation =>
                    variation.attributes.filter(entry => entry.attribute === attribute).map(({ value }) => value)))];
                  const helpId = `ham-attribute-${index}-help`;
                  return (
                    <label key={attribute} className="block font-heading text-xs font-bold uppercase tracking-[0.1em]">{attribute}
                      <select aria-describedby={helpId} value={selections[attribute] ?? ""} onChange={event => changeAttribute(attribute, event.target.value, index)} className={fieldClass}>
                        {options.map(option => {
                          const available = Boolean(pickerProduct && compatible.some(variation =>
                            variation.attributes.some(entry => entry.attribute === attribute && entry.value === option) &&
                            remainingQuantity(pickerProduct, variation) > 0));
                          return <option key={option} value={option} disabled={!available}>{option}{!available ? " (Unavailable)" : ""}</option>;
                        })}
                      </select>
                      <span id={helpId} className="mt-2 block font-body text-xs font-normal normal-case tracking-normal text-neutral-600">Choose {attribute} for your selected ham.</span>
                    </label>
                  );
                })}
              </div>
              {!pickerAvailable && <p role="status" className="mt-4 font-serif text-sm text-[#9d321e]">This selection is unavailable in an additional quantity.</p>}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPickerOpen(false)} className="cursor-pointer border border-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em]">Cancel</button>
                <button type="button" onClick={addHam} disabled={!ordering.isOpen || isSubmitting || !pickerAvailable} className={addClass}><Plus aria-hidden="true" className="h-4 w-4 shrink-0" /> Add Ham</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}