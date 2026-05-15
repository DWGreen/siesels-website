import { getMenuStructure } from "@/services/menu";
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
const menuStructure =
    await getMenuStructure();

  return (

    <MenuClient
      menuStructure={menuStructure}
    />
  );
}