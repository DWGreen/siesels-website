


import { ProductWorkflowTrigger } from "@/types/cart";

export const buildYourOwnTrigger: ProductWorkflowTrigger = {
  productId: 89,

  workflow:
    "build-your-own-sandwich",

  route:
    "/sandwiches/build"
}

export function getWorkflowTriggerForProduct(productId: number): ProductWorkflowTrigger | null {

  if (productId === buildYourOwnTrigger.productId) {
    return buildYourOwnTrigger;
  }

  return null;
}