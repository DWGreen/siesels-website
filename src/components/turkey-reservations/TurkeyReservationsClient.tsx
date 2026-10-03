"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { TurkeyReservationProduct } from "@/services/turkeyReservations";
import { reservationStoreLocations } from "@/data/storeLocations";

type Props = {
  products: TurkeyReservationProduct[];
};

function getTodayDate(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export default function TurkeyReservationsClient({ products }: Props) {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState("");
  const [storeLocationId, setStoreLocationId] = useState(reservationStoreLocations[0]?.id ?? "");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerProductId, setPickerProductId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(quantities).reduce((total, quantity) => total + quantity, 0),
    [quantities]
  );
  const selectedProducts = products.filter(product => (quantities[product.id] ?? 0) > 0);
  const availableProducts = products.filter(
    product =>
      product.stockManaged &&
      product.inStock &&
      (product.stockQuantity ?? 0) > (quantities[product.id] ?? 0)
  );

  function addSelectedSize() {
    if (pickerProductId === "") return;
    const product = products.find(item => item.id === pickerProductId);
    if (!product) return;

    setQuantities(current => ({
      ...current,
      [product.id]: Math.min(
        product.stockQuantity ?? 0,
        (current[product.id] ?? 0) + 1
      ),
    }));
    setIsPickerOpen(false);
    setPickerProductId("");
  }

  function updateQuantity(product: TurkeyReservationProduct, next: number) {
    const max = product.stockManaged ? Math.max(0, product.stockQuantity ?? 0) : 0;
    const quantity = Math.min(max, Math.max(0, Math.floor(next)));
    setQuantities(current => ({ ...current, [product.id]: quantity }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const items = products
      .map(product => ({
        productId: product.id,
        quantity: quantities[product.id] ?? 0,
      }))
      .filter(item => item.quantity > 0);

    if (items.length === 0) {
      setError("Choose a quantity for at least one turkey size.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/turkey-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate,
          storeLocationId,
          customer: { name: customerName, email, phone },
          items,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message ?? "Unable to submit reservation.");
        return;
      }

      router.push(
        `/sandwiches/checkout/success?reservation=turkey&order_id=${encodeURIComponent(
          String(result.order_id ?? "")
        )}&order_key=${encodeURIComponent(String(result.order_key ?? ""))}`
      );
    } catch (submitError) {
      console.error("Turkey reservation failed:", submitError);
      setError("Unable to submit reservation. Please try again.");
    } finally {
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
              <h2 className="mt-2 font-heading text-3xl font-bold uppercase leading-tight sm:text-4xl">Turkey Reservations</h2>
              <p className="mt-3 max-w-2xl font-serif text-sm leading-6 text-neutral-700">Build your reservation by adding the turkey weight ranges you need, then choose a pickup date. Payment is handled at pickup.</p>
            </div>
            <Image src="/images/hand-drawn/turkey-color.png" alt="Hand-drawn butcher illustration" width={520} height={300} className="mx-auto w-full max-w-sm object-contain md:justify-self-end" priority />
          </div>
          <ol className="mt-6 grid gap-4 border-t border-[#b8aa97] pt-5 sm:grid-cols-3">
            {[
              ["01", "Choose your turkey", "Select weight range and quantity"],
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

        {products.length === 0 ? (
          <div className="border border-[#b8aa97] bg-[#faf8f3] p-6 font-serif text-sm">
            Turkey reservation sizes are not currently available. Please check back soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
            <section className="border border-[#b8aa97] bg-[#faf8f3] p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#b8aa97] pb-3">
                <div>
                  <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Your Turkeys</h2>
                  <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">{selectedCount} turkey{selectedCount === 1 ? "" : "s"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPickerProductId(availableProducts[0]?.id ?? "");
                    setIsPickerOpen(true);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 bg-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add Turkey To Reservation
                </button>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="flex min-h-[270px] flex-col items-center justify-center px-5 py-8 text-center">
                  <Image src="/images/hand-drawn/turkey_color.png" alt="Prepared turkey for a holiday meal" width={360} height={240} className="mb-3 h-36 w-64 object-cover mix-blend-multiply sm:h-40" />
                  <h3 className="font-serif text-xl font-bold uppercase tracking-[0.05em]">Ready To Reserve Your Turkey?</h3>
                  <p className="mt-1 font-serif text-sm text-neutral-600">Choose a weight range and quantity to get started.</p>
                  <button
                    type="button"
                    disabled={availableProducts.length === 0}
                    onClick={() => {
                      setPickerProductId(availableProducts[0]?.id ?? "");
                      setIsPickerOpen(true);
                    }}
                    className="mt-5 cursor-pointer bg-neutral-950 px-6 py-3 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus aria-hidden="true" className="mr-2 inline h-4 w-4" /> Add A Turkey
                  </button>
                  {products.some(product => !product.stockManaged) && (
                    <p className="mt-4 max-w-sm font-serif text-xs text-amber-900">Some sizes are not available until the shop configures their reservation limits.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map(product => {
                    const quantity = quantities[product.id] ?? 0;
                    const max = product.stockQuantity ?? quantity;

                    return (
                      <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 border border-[#d8cec0] bg-white p-4 sm:px-5">
                        <div className="min-w-0">
                          <h3 className="font-heading text-base font-bold uppercase">{product.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease ${product.name} quantity`}
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(product, quantity - 1)}
                            className="grid h-10 w-10 cursor-pointer place-items-center border border-neutral-950 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Minus aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <input
                            aria-label={`Quantity for ${product.name}`}
                            type="number"
                            min={1}
                            max={max}
                            step={1}
                            value={quantity}
                            onChange={event => updateQuantity(product, Number(event.target.value))}
                            className="h-10 w-16 border border-neutral-950 bg-[#f4f4f4] text-center text-base font-bold"
                          />
                          <button
                            type="button"
                            aria-label={`Increase ${product.name} quantity`}
                            disabled={quantity >= max}
                            onClick={() => updateQuantity(product, quantity + 1)}
                            className="grid h-10 w-10 cursor-pointer place-items-center border border-neutral-950 disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => updateQuantity(product, 0)}
                            className="ml-1 grid h-10 w-10 cursor-pointer place-items-center text-neutral-500 hover:text-[#9d321e]"
                          >
                            <X aria-hidden="true" className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isPickerOpen && (
                <div
                  className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 pb-[env(safe-area-inset-bottom)] sm:items-center sm:p-6"
                  role="presentation"
                  onMouseDown={event => {
                    if (event.target === event.currentTarget) setIsPickerOpen(false);
                  }}
                >
                  <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="turkey-picker-title"
                    className="w-full border-2 border-neutral-950 bg-[#faf8f3] p-6 sm:max-w-lg"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h2 id="turkey-picker-title" className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Add a Turkey</h2>
                      <button type="button" onClick={() => setIsPickerOpen(false)} aria-label="Close turkey picker" className="grid h-10 w-10 cursor-pointer place-items-center">
                        <X aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </div>
                    <label className="mt-5 block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                      Weight range
                      <select
                        autoFocus
                        value={pickerProductId}
                        onChange={event => setPickerProductId(Number(event.target.value))}
                        className="mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal"
                      >
                        {products.map(product => {
                          const available = product.stockManaged && product.inStock && (product.stockQuantity ?? 0) > (quantities[product.id] ?? 0);
                          return (
                            <option key={product.id} value={product.id} disabled={!available}>
                              {product.name}{!product.stockManaged ? " (Unavailable)" : !available ? " (Out Of Stock)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setIsPickerOpen(false)} className="cursor-pointer border border-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em]">
                        Cancel
                      </button>
                      <button type="button" onClick={addSelectedSize} disabled={pickerProductId === "" || !availableProducts.some(product => product.id === pickerProductId)} className="cursor-pointer bg-neutral-950 px-4 py-3 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-40">
                        Add Turkey
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </section>

            <aside className="self-start border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-6">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Pickup & Contact</h2>
              <p className="mt-1 font-serif text-xs text-neutral-600">Where and when should we prepare your order?</p>
              <div className="mt-5 space-y-4">
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                  Pickup location
                  <select required value={storeLocationId} onChange={event => setStoreLocationId(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-white px-3 py-3 text-sm font-normal normal-case tracking-normal">
                    <option value="" disabled>Select a store</option>
                    {reservationStoreLocations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)}
                  </select>
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                  Pickup date
                  <input
                    required
                    type="date"
                    min={getTodayDate()}
                    value={pickupDate}
                    onChange={event => setPickupDate(event.target.value)}
                    className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal"
                  />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                  Name
                  <input required autoComplete="name" value={customerName} onChange={event => setCustomerName(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                  Email
                  <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
                <label className="block font-heading text-[10px] font-bold uppercase tracking-[0.15em]">
                  Phone
                  <input type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} className="mt-2 block w-full border border-neutral-950 bg-[#f4f4f4] px-3 py-3 text-sm font-normal normal-case tracking-normal" />
                </label>
              </div>

              {error && <p role="alert" className="mt-5 border border-red-700 bg-red-50 p-3 text-sm text-red-900">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || products.length === 0}
                className="mt-6 w-full bg-[#9d321e] px-5 py-4 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#762415] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Reservation..." : "Reserve Turkeys"}
              </button>
              <p className="mt-4 font-serif text-xs leading-5 text-neutral-600">
                No payment is collected online. Your reservation will be sent to the shop for preparation.
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}