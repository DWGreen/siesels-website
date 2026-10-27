"use client";

import CollectionNotice from "@/components/privacy/CollectionNotice";

import { useAccessibleValidation } from "@/hooks/useAccessibleValidation";

import { useAccessibleModal } from "@/hooks/useAccessibleModal";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { RoastReservationProduct, RoastReservationVariation } from "@/services/roastReservations";
import ReservationArticle from "@/components/reservations/ReservationArticle";
import PickupStoreSelector from "@/components/reservations/PickupStoreSelector";
import { useReservationOrdering } from "@/hooks/useReservationOrdering";
import { getReservationOrderingStatus, getReservationPickupDateBounds } from "@/utils/reservationOrdering";

type Props = { products: RoastReservationProduct[] };
type SelectedRoast = {
  productId: number;
  variationId: number;
  grade: "USDA Prime" | "USDA Choice";
  seasoning: "Plain" | "Seasoned" | null;
  quantity: number;
};

export default function RoastReservationsClient({ products }: Props) {
  const validationProps = useAccessibleValidation();
  const router = useRouter();
  const ordering = useReservationOrdering("roast");
  const pickupDateBounds = getReservationPickupDateBounds("roast");
  const [pickupDate, setPickupDate] = useState("");
  const [storeLocationId, setStoreLocationId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SelectedRoast[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const modalRef = useAccessibleModal<HTMLElement>(pickerOpen, () => setPickerOpen(false));
  const [pickerProductId, setPickerProductId] = useState<number | "">("");
  const [pickerVariationId, setPickerVariationId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const availablePairs = products.flatMap(product =>
    [...product.variations].sort((first, second) => second.grade.localeCompare(first.grade) ||
      (first.seasoning ?? "").localeCompare(second.seasoning ?? ""))
      .filter(variation => variation.stockManaged && variation.inStock && (variation.stockQuantity ?? 0) > 0)
      .map(variation => ({ product, variation }))
  );
  const pickerProduct = products.find(product => product.id === pickerProductId);
  const pickerVariations = [...(pickerProduct?.variations ?? [])].sort((first, second) =>
    second.grade.localeCompare(first.grade) || (first.seasoning ?? "").localeCompare(second.seasoning ?? ""));
  const pickerVariation = pickerVariations.find(variation => variation.id === pickerVariationId);
  const pickerGrades = [...new Set(pickerVariations.map(variation => variation.grade))];
  const seasoningVariations = pickerVariations.filter(variation => variation.grade === pickerVariation?.grade);
  const pickerSeasonings = [...new Set(seasoningVariations.flatMap(variation => variation.seasoning ? [variation.seasoning] : []))];
  function variationAvailable(variation: RoastReservationVariation) {
    return variation.stockManaged && variation.inStock && (variation.stockQuantity ?? 0) >
      (items.find(item => item.variationId === variation.id)?.quantity ?? 0);
  }
  const pickerPairAvailable = Boolean(
    pickerProduct && pickerVariation && variationAvailable(pickerVariation) &&
    availablePairs.some(pair => pair.product.id === pickerProduct.id && pair.variation.id === pickerVariation.id)
  );

  function openPicker() {
    const firstPair = availablePairs.find(pair => variationAvailable(pair.variation));
    setPickerProductId(firstPair?.product.id ?? "");
    setPickerVariationId(firstPair?.variation.id ?? "");
    setPickerOpen(true);
  }

  function changePickerProduct(productId: number) {
    setPickerProductId(productId);
    const product = products.find(item => item.id === productId);
    const sorted = [...(product?.variations ?? [])].sort((first, second) =>
      second.grade.localeCompare(first.grade) || (first.seasoning ?? "").localeCompare(second.seasoning ?? ""));
    setPickerVariationId(sorted.find(variationAvailable)?.id ?? sorted[0]?.id ?? "");
  }

  function changePickerGrade(grade: string) {
    const variations = pickerVariations.filter(variation => variation.grade === grade);
    const next = variations.find(variation => variation.seasoning === pickerVariation?.seasoning && variationAvailable(variation)) ??
      variations.find(variationAvailable) ?? variations[0];
    setPickerVariationId(next?.id ?? "");
  }

  function addRoast() {
    if (!pickerProduct || !pickerVariation || !pickerPairAvailable) return;
    const currentQuantity = items.find(item => item.variationId === pickerVariation.id)?.quantity ?? 0;
    const stock = pickerVariation.stockQuantity ?? 0;

    setItems(current => {
      const existing = current.find(item => item.variationId === pickerVariation.id);
      if (existing) {
        return current.map(item => item.variationId === pickerVariation.id
          ? { ...item, quantity: Math.min(stock, item.quantity + 1) }
          : item);
      }
      return [...current, {
        productId: pickerProduct.id,
        variationId: pickerVariation.id,
        grade: pickerVariation.grade,
        seasoning: pickerVariation.seasoning,
        quantity: Math.min(stock, currentQuantity + 1),
      }];
    });
    setPickerOpen(false);
  }

  function updateQuantity(variation: RoastReservationVariation, quantity: number) {
    const bounded = Math.min(variation.stockQuantity ?? 0, Math.max(0, Math.floor(quantity)));
    setItems(current => bounded === 0
      ? current.filter(item => item.variationId !== variation.id)
      : current.map(item => item.variationId === variation.id ? { ...item, quantity: bounded } : item));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const currentOrdering = getReservationOrderingStatus("roast");
    if (!currentOrdering.isOpen) {
      setError(currentOrdering.message);
      return;
    }
    if (items.length === 0) {
      setError("Add at least one roast to your reservation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/roast-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupDate, storeLocationId, customer: { name: customerName, email, phone }, notes, items }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.message ?? "Unable to submit roast reservation.");
        return;
      }
      router.push(`/order-confirmation?orderType=roast&order_id=${encodeURIComponent(String(result.order_id ?? ""))}&order_key=${encodeURIComponent(String(result.order_key ?? ""))}`);
    } catch (submitError) {
      console.error("Roast reservation failed:", submitError);
      setError("Unable to submit reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-svh flex-1 overflow-hidden bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-7 border-b-2 border-[#2d2d2d] pb-6">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">Holiday Orders</p>
              <h2 className="mt-2 font-heading text-[35px] font-bold uppercase leading-tight sm:text-[41px]">Standing Rib Roast Reservations</h2>
              <p className="mt-3 max-w-2xl font-serif text-sm leading-6 text-neutral-700">Choose your cut, select Prime or Choice, and set your quantity. Pick your pickup date and we’ll have it prepared for you.</p>
              {ordering.message && <p role="status" className="mt-4 font-heading text-base font-bold text-[#9d321e]">{ordering.message}</p>}
            </div>
            <Image
              src="/images/hand-drawn/bull-color.png"
              alt="Hand-drawn illustration of a standing rib roast and butcher knife"
              width={520}
              height={300}
              className="mx-auto w-full max-w-sm object-contain md:justify-self-end"
              priority
            />
          </div>
          <ol className="mt-6 grid gap-4 border-t border-[#b8aa97] pt-5 sm:grid-cols-3">
            {[
              ["01", "Choose your roast", "Select size, grade and quantity"],
              ["02", "Select your pickup date", "Let us know when to prepare it"],
              ["03", "Reserve online", "We’ll confirm your reservation"],
            ].map(([number, title, caption]) => (
              <li key={number} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#9d321e] font-heading text-xs font-bold text-white">{number}</span>
                <span>
                  <strong className="block font-heading text-xs font-bold uppercase tracking-[0.12em]">{title}</strong>
                  <span className="mt-1 block font-serif text-xs text-neutral-600">{caption}</span>
                </span>
              </li>
            ))}
          </ol>
        </header>

        {products.length === 0 ? (
          <div className="border border-[#b8aa97] bg-[#faf8f3] p-6 font-serif text-sm">Standing rib roast options are not currently available. Please check back soon.</div>
        ) : (
          <form {...validationProps} onSubmit={submit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
        <CollectionNotice />
            <div className="min-w-0">
            <section className="border border-[#b8aa97] bg-[#faf8f3] p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#b8aa97] pb-3">
                <div>
                  <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Your Roasts</h2>
                  <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-600">{selectedCount} roast{selectedCount === 1 ? "" : "s"}</p>
                </div>
                <button type="button" onClick={openPicker} disabled={!ordering.isOpen || availablePairs.length === 0} className="inline-flex cursor-pointer items-center gap-2 bg-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus aria-hidden="true" className="h-4 w-4" /> Add A Standing Rib Roast
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex min-h-[270px] flex-col items-center justify-center px-5 py-8 text-center">
                  <Image src="/images/hand-drawn/rib-roast_full.png" alt="Standing rib roast on butcher paper" width={360} height={240} className="mb-3 h-36 w-64 object-contain mix-blend-multiply sm:h-40" />
                  <h3 className="font-serif text-xl font-bold uppercase tracking-[0.05em]">Ready To Build Your Roast?</h3>
                  <p className="mt-1 font-serif text-sm text-neutral-600">Choose your size, grade, and quantity to get started.</p>
                  <button type="button" onClick={openPicker} disabled={!ordering.isOpen || availablePairs.length === 0} className="mt-5 inline-flex cursor-pointer items-center gap-2 bg-neutral-950 px-6 py-3 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50">
                    <Plus aria-hidden="true" className="h-4 w-4" /> Add A Standing Rib Roast
                  </button>
                  {availablePairs.length === 0 && <p className="mt-4 max-w-sm font-serif text-xs text-amber-900">Reservation availability is being updated. Please check back soon.</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => {
                    const product = products.find(entry => entry.id === item.productId)!;
                    const variation = product.variations.find(entry => entry.id === item.variationId)!;
                    const max = variation.stockQuantity ?? item.quantity;
                    return (
                      <div key={item.variationId} className="flex flex-wrap items-center justify-between gap-4 border border-[#d8cec0] bg-white p-4 sm:px-5">
                        <div><h3 className="font-heading text-base font-bold uppercase">{product.name}</h3><p className="mt-1 font-serif text-sm text-neutral-600">{[variation.grade, variation.seasoning].filter(Boolean).join(" / ")}</p></div>
                        <div className="flex items-center gap-2">
                          <button type="button" aria-label={`Decrease ${product.name} ${variation.grade} quantity`} disabled={item.quantity <= 1} onClick={() => updateQuantity(variation, item.quantity - 1)} className="grid h-10 w-10 cursor-pointer place-items-center border border-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-35"><Minus aria-hidden="true" className="h-4 w-4" /></button>
                          <input aria-label={`Quantity for ${product.name} ${variation.grade}`} type="number" min={1} max={max} value={item.quantity} onChange={event => updateQuantity(variation, Number(event.target.value))} className="h-10 w-16 border border-[#2d2d2d] bg-white text-center font-heading text-base font-bold" />
                          <button type="button" aria-label={`Increase ${product.name} ${variation.grade} quantity`} disabled={item.quantity >= max} onClick={() => updateQuantity(variation, item.quantity + 1)} className="grid h-10 w-10 cursor-pointer place-items-center border border-[#2d2d2d] disabled:cursor-not-allowed disabled:opacity-35"><Plus aria-hidden="true" className="h-4 w-4" /></button>
                          <button type="button" aria-label={`Remove ${product.name} ${variation.grade}`} onClick={() => updateQuantity(variation, 0)} className="ml-1 grid h-10 w-10 cursor-pointer place-items-center text-neutral-500 hover:text-[#9d321e]"><X aria-hidden="true" className="h-5 w-5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {pickerOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 pb-[env(safe-area-inset-bottom)] sm:items-center sm:p-6" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPickerOpen(false); }}>
                  <section ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="roast-picker-title" className="w-full border-2 border-neutral-950 bg-[#faf8f3] p-6 sm:max-w-lg">
                    <div className="flex items-center justify-between gap-4">
                      <h2 id="roast-picker-title" className="text-lg font-black uppercase tracking-[0.12em]">Add a Standing Rib Roast</h2>
                      <button type="button" onClick={() => setPickerOpen(false)} aria-label="Close roast picker" className="grid h-10 w-10 cursor-pointer place-items-center"><X aria-hidden="true" className="h-5 w-5" /></button>
                    </div>
                    <div className="mt-5 space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-[0.1em]">Cut
                        <select aria-describedby="roast-size-help" value={pickerProductId} onChange={event => changePickerProduct(Number(event.target.value))} className="mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal">
                          {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                        </select>
                        <span id="roast-size-help" className="mt-2 block font-body text-xs font-normal normal-case tracking-normal text-neutral-600">Click above to select other sizes.</span>
                      </label>
                      <label className="block text-xs font-bold uppercase tracking-[0.1em]">Grade
                        <select aria-describedby="roast-grade-help" value={pickerVariation?.grade ?? ""} onChange={event => changePickerGrade(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal">
                          {pickerGrades.map(grade => {
                            const available = pickerVariations.some(variation => variation.grade === grade && variationAvailable(variation));
                            return <option key={grade} value={grade} disabled={!available}>{grade}{!available ? " (Unavailable)" : ""}</option>;
                          })}
                        </select>
                        <span id="roast-grade-help" className="mt-2 block font-body text-xs font-normal normal-case tracking-normal text-neutral-600">Click above to select another grade.</span>
                      </label>
                      {pickerSeasonings.length > 0 && <label className="block text-xs font-bold uppercase tracking-[0.1em]">Seasoning
                        <select value={pickerVariation?.seasoning ?? ""} onChange={event => {
                          const next = seasoningVariations.find(variation => variation.seasoning === event.target.value);
                          setPickerVariationId(next?.id ?? "");
                        }} className="mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal">
                          {pickerSeasonings.map(seasoning => <option key={seasoning} value={seasoning} disabled={!seasoningVariations.some(variation => variation.seasoning === seasoning && variationAvailable(variation))}>{seasoning}</option>)}
                        </select>
                      </label>}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setPickerOpen(false)} className="cursor-pointer border border-neutral-950 px-4 py-3 text-xs font-black uppercase tracking-[0.12em]">Cancel</button>
                      <button type="button" onClick={addRoast} disabled={!ordering.isOpen || !pickerPairAvailable} className="cursor-pointer bg-neutral-950 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-40">Add Roast</button>
                    </div>
                  </section>
                </div>
              )}
            </section>
            <ReservationArticle type="roast" />
            </div>

            <aside className="self-start border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-6">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Pickup & Contact</h2>
              <p className="mt-1 font-serif text-xs text-neutral-600">Where and when should we prepare your order?</p>
              <div className="mt-5 space-y-4">
                <PickupStoreSelector value={storeLocationId} onChange={setStoreLocationId} disabled={isSubmitting} />
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Pickup date
                  <input required type="date" aria-describedby="roast-date-help" min={pickupDateBounds.minDate} max={pickupDateBounds.maxDate} value={pickupDate} onChange={event => setPickupDate(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                  <span id="roast-date-help" className="mt-2 block font-body text-xs font-normal normal-case tracking-normal text-neutral-600">Click to pick date.</span>
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Name
                  <input required autoComplete="name" value={customerName} onChange={event => setCustomerName(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Email
                  <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Phone
                  <input type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Notes for the butcher (optional)
                  <textarea maxLength={500} rows={4} value={notes} onChange={event => setNotes(event.target.value)} className="mt-2 block w-full resize-y border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
              </div>
              {error && <p role="alert" className="mt-5 border border-red-700 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
              <button type="submit" disabled={!ordering.isOpen || isSubmitting || items.length === 0} className="mt-6 w-full bg-[#9d321e] px-5 py-4 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#762415] disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Submitting Reservation..." : "Reserve My Roasts"}</button>
              <p className="mt-4 font-serif text-xs leading-5 text-neutral-600">No payment is collected online. Your reservation will be sent directly to our meat department for preparation.</p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
