import MenuClient
  from "./MenuClient";

import {
  getProductsByCategoryId
} from "@/services/products";

export default async function MenuPage() {

  const allSandwiches =
    await getProductsByCategoryId(
      "34"
    );

  return (

    <MenuClient
      allSandwiches={
        allSandwiches
      }
    />
  );
}