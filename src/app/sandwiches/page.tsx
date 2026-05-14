import InteriorHero
  from "@/components/sections/InteriorHero";

import { getProducts }
  from "@/services/products";

import MenuGrid
  from "@/components/menu/MenuGrid";

export default async function SandwichesPage() {
  const products = await getProducts();

  return (
    <>
      <InteriorHero
        title="Sandwiches"
        backgroundImage="/images/hero/butcher.jpg"
        backgroundAlt="Butcher at work at Siesel's Meats"
      />

      <section
        className="
          flex
          flex-1
          items-center
          justify-center
          bg-brand-gray
          px-4
          py-20
          lg:py-32
        "
      >
        <MenuGrid products={products} />
      </section>
    </>
  );
}