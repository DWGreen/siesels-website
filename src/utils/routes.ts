import SandwichBuilder from "@/components/sandwich-builder/SandwichBuilder";

export const routes = {
  menu: "/sandwiches/menu",
  cart: "/sandwiches/cart",
  checkout: "/sandwiches/checkout",

  productCustomizer: ({
    productId,
    editCartItemId,
    returnTo,
  }: {
    productId: number | string;
    editCartItemId?: string;
    returnTo?: string;
  }) => {
    const params =
      new URLSearchParams();

    params.set(
      "productId",
      String(productId)
    );

    if (editCartItemId) {
      params.set(
        "editCartItemId",
        editCartItemId
      );
    }

    if (returnTo) {
      params.set(
        "returnTo",
        returnTo
      );
    }

    return `/sandwiches/customize?${params.toString()}`;
  },
  sandwichBuilder: ({
    productId,
    editCartItemId,
    returnTo,
  }: {
    productId: number | string;
    editCartItemId?: string;
    returnTo?: string;
  }) => {
    const params =
      new URLSearchParams();

    params.set(
      "productId",
      String(productId)
    );

    if (editCartItemId) {
      params.set(
        "editCartItemId",
        editCartItemId
      );
    }

    if (returnTo) {
      params.set(
        "returnTo",
        returnTo
      );
    }

    return `/sandwiches/build?${params.toString()}`;
  },
};