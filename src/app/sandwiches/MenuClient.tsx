"use client";

import {
  useMemo,
  useState,
} from "react";

import ProductGrid
  from "@/components/menu/ProductGrid";

import { routes }
  from "@/utils/routes";

import {
  Product,
} from "@/types/product";

import {
  MenuStructure,
} from "@/types/menu";

import {
  getWorkflowTriggerForProduct,
} from "@/data/triggerData";

import {
  useRouter,
} from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartSidebar from "@/components/cart/CartSideBar";
type Props = {
  menuStructure: MenuStructure;
};
type ActiveTab =
  | number
  | "cart"
  | null;
export default function MenuClient({
  menuStructure,
}: Props) {
  const router =
    useRouter();

  const sections =
    menuStructure.sections.filter(
      section =>
        section.products.length > 0
    );
    const { cart } =
  useCart();
const totalCartItems =
  cart.items.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );
  const [
    activeCategoryId,
    setActiveCategoryId,
  ] = useState<number | null>(
    sections[0]?.category.id ?? null
  );
const [
  activeTab,
  setActiveTab,
] = useState<ActiveTab>(
  sections[0]?.category.id ?? null
);
  const activeSection =
  useMemo(
    () => {
      if (activeTab === "cart") {
        return null;
      }

      return (
        sections.find(
          section =>
            section.category.id ===
            activeTab
        ) ?? sections[0]
      );
    },
    [
      sections,
      activeTab,
    ]
  );
  function handleProductClick(
    product: Product
  ) {
    const trigger =
      getWorkflowTriggerForProduct(
        product.id
      );

    if (trigger) {
      router.push(
        `${trigger.route}?productId=${product.id}`
      );

      return;
    }

    router.push(
      routes.productCustomizer({
        productId: product.id,
      })
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#e6e6e6]
        text-neutral-950
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          px-6
          py-14
        "
      >
        <header
          className="
            mb-14
            text-center
          "
        >
          <div
            className="
              mb-5
              flex
              items-center
              justify-center
              gap-5
            "
          >
            <span
              className="
                h-px
                w-20
                bg-neutral-700
                sm:w-28
              "
            />

            <span
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.45em]
                sm:text-lg
              "
            >
              Order Online
            </span>

            <span
              className="
                h-px
                w-20
                bg-neutral-700
                sm:w-28
              "
            />
          </div>

          <h1
            className="
              text-5xl
              font-black
              uppercase
              tracking-[0.28em]
              md:text-7xl
            "
          >
            {menuStructure.rootCategory.name}
          </h1>

          <p
            className="
              mt-5
              text-xs
              font-black
              uppercase
              tracking-[0.28em]
              sm:text-sm
            "
          >
            Available 7:00 AM - 6:30 PM Daily
          </p>
        </header>

        {sections.length === 0 ? (
          <p
            className="
              border-t
              border-neutral-950
              py-8
              text-center
              text-sm
              italic
              text-neutral-700
            "
          >
            No menu sections are currently available.
          </p>
        ) : (
          <>
            <nav
              className="
                mb-10
                border-y
                border-neutral-950
                py-4
              "
              aria-label="Menu sections"
            >
              <div
                className="
                  flex
                  gap-3
                  overflow-x-auto
                  pb-1
                "
              >
                {sections.map(section => {
                  const isActive =
  activeTab ===
  section.category.id;

                  return (
                    <button
                      key={section.category.id}
                      type="button"
                      onClick={() =>
  setActiveTab(
    section.category.id
  )
}
                      className={`
                        shrink-0
                        border
                        border-neutral-950
                        px-5
                        py-3
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.22em]
                        transition

                        ${
                          isActive
                            ? "bg-neutral-950 text-white"
                            : "text-neutral-950 hover:bg-neutral-950 hover:text-white"
                        }
                      `}
                    >
                      {section.category.name}
                    </button>
                  );
                })}
                <button
  type="button"
  onClick={() =>
    setActiveTab("cart")
  }
  className={`
    shrink-0
    border
    border-neutral-950
    px-5
    py-3
    text-xs
    font-black
    uppercase
    tracking-[0.22em]
    transition

    ${
      activeTab === "cart"
        ? "bg-neutral-950 text-white"
        : "text-neutral-950 hover:bg-neutral-950 hover:text-white"
    }
  `}
>
  Cart ({totalCartItems})
</button>
              </div>
            </nav>

           {activeTab === "cart" ? (
  <section>
    <div
      className="
        mb-8
      "
    >
      <h2
        className="
          text-xl
          font-black
          uppercase
          tracking-[0.25em]
        "
      >
        Cart
      </h2>
    </div>

    <div
      className="
        border
        border-neutral-950
        bg-[#e6e6e6]
      "
    >
      <CartSidebar />
    </div>
  </section>
) : (
  activeSection && (
    <section>
      <div
        className="
          mb-8
        "
      >
        <h2
          className="
            text-xl
            font-black
            uppercase
            tracking-[0.25em]
          "
        >
          {activeSection.category.name}
        </h2>
      </div>

      <ProductGrid
        products={
          activeSection.products
        }
        onProductClick={
          handleProductClick
        }
      />
    </section>
  )
)}
          </>
        )}
      </div>
    </main>
  );
}