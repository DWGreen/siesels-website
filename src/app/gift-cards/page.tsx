import GiftCardOrderClient from "@/components/gift-cards/GiftCardOrderClient";
import { getProductsByCategoryId } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function GiftCardsPage() {
  const products = await getProductsByCategoryId("37");

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">A Gift From Siesel's</p>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase leading-tight sm:text-4xl">Send A Little Something Special</h1>
          <p className="mt-3 max-w-2xl font-serif text-sm leading-6 text-neutral-700">Choose a gift card amount and add the recipient details. We’ll include them with the order for the shop to fulfill.</p>
        </header>

        {products.length > 0 ? (
          <GiftCardOrderClient products={products} />
        ) : (
          <div className="border border-[#b8aa97] bg-[#faf8f3] p-6 font-serif text-sm">Gift cards are not currently available to order online. Please contact the shop for assistance.</div>
        )}
      </div>
    </main>
  );
}