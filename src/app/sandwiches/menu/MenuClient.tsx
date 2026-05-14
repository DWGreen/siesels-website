"use client";

import ProductGrid
  from "@/components/menu/ProductGrid";

import {
  useCart
} from "@/context/CartContext";

import {routes} from "@/utils/routes";

import {
  Product
} from "@/types/product";
import ProductCard from "@/components/menu/ProductCard";
import { getWorkflowTriggerForProduct } from "@/data/triggerData";
import {
  useRouter
} from "next/navigation";

type Props = {
  allSandwiches:
    Product[];
};



export default function MenuClient({
  allSandwiches,
}: Props) {

  
  const router = useRouter();

console.log("all sandwiches:", allSandwiches);
    const specialty =
  allSandwiches.filter(product =>

    product.categories.some(
      category =>
        category.slug ===
        "specialty-sandwiches"
    )
  );
  const buildYourOwn =
  allSandwiches.find(product =>

    product.categories.some(
      category =>
        category.slug ===
        "build-your-own"
    )
  );
  return (

    <main className="p-8 space-y-12">

      <section>

        <h1
          className="
            text-4xl
            font-bold
            mb-6
          "
        >
          Specialty Sandwiches
        </h1>

        <ProductGrid
          products={
            specialty }

          onProductClick={(
            product
          ) =>
{


    
router.push(
      routes.productCustomizer({productId: product.id})
    );
   
}
          }
        />

      </section>
      <section>

        <h1
          className="
            text-4xl
            font-bold
            mb-6
          "
        >
          Build Your Own Sandwich
        </h1>
        {buildYourOwn && (  
        <ProductCard
          product={
            buildYourOwn }

          onClick={(
            
          ) =>

            {
            

  const trigger =
    getWorkflowTriggerForProduct(
      buildYourOwn.id
    );

  if (trigger) {

    router.push(
      `${trigger.route}?productId=${buildYourOwn.id}`
    );
  }
}
          }
          
        />
        )}

        {!buildYourOwn && (
          <p>
            Build Your Own Sandwich is currently unavailable. Please check back later!
          </p>
        )}

      </section>

    </main>
  );
}