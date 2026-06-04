"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
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
const cartSubtotal =
  cart.items.reduce(
    (sum, item) =>
      sum + item.totalPrice,
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
const [
  showFloatingBar,
  setShowFloatingBar,
] = useState(true);
const staticBarId =
  useId();
const animationFrameRef =
  useRef<number | null>(null);

  useEffect(() => {
    const staticBar =
      document.getElementById(staticBarId);

    if (!staticBar) {
      return;
    }

    const observedStaticBar =
      staticBar;

    function updateFloatingBarState() {
      const rect =
        observedStaticBar.getBoundingClientRect();
      const floatingTop =
        window.innerHeight -
        rect.height;
      const shouldShowFloatingBar =
        rect.top >= floatingTop;

      setShowFloatingBar(
        shouldShowFloatingBar
      );
      animationFrameRef.current = null;
    }

    function requestUpdate() {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          updateFloatingBarState
        );
    }

    updateFloatingBarState();

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );
    window.addEventListener(
      "resize",
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate
      );
      window.removeEventListener(
        "resize",
        requestUpdate
      );

      if (
        animationFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [staticBarId]);

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

  function renderCartBar(
    isFloating: boolean
  ) {
    return (
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          flex-col
          gap-4
          bg-neutral-950
          px-5
          py-4
          text-white
          shadow-[0_-6px_18px_rgba(0,0,0,0.28)]
          sm:flex-row
          sm:items-center
        "
      >
        <div
          className="
            text-xl
            font-black
            uppercase
            tracking-[0.22em]
            sm:text-2xl
          "
        >
          Subtotal:
          <span className="ml-3">
            {`$${cartSubtotal.toFixed(2)}`}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setActiveTab("cart")
          }
          className={`
            ml-auto
            self-end
            bg-white
            px-6
            py-3
            text-xs
            font-black
            uppercase
            tracking-[0.25em]
            text-neutral-950
            transition
            hover:bg-neutral-200
            ${
              isFloating
                ? ""
                : "shadow-none"
            }
          `}
        >
          View Cart ({totalCartItems})
        </button>
      </div>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#e6e6e6]
        text-neutral-950
        pb-28
        sm:pb-24
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
                <div className="flex-1" />
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

      <div
        id={staticBarId}
        className="min-h-[110px] px-6 pb-4 sm:min-h-[88px]"
      >
        {showFloatingBar
          ? null
          : renderCartBar(false)}
      </div>

      {showFloatingBar ? (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-40
            px-6
          "
        >
          {renderCartBar(true)}
        </div>
      ) : null}
    </main>
  );
}