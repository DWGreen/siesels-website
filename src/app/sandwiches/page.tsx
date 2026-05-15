import InteriorHero
  from "@/components/sections/InteriorHero";

import { getProducts }
  from "@/services/products";

import MenuGrid
  from "@/components/menu/MenuGrid";

  import { getMenuStructure } from "@/services/menu";
import MenuClient
  from "./MenuClient";

import {
  getProductsByCategoryId
} from "@/services/products";

export default async function SandwichesPage() {

const menuStructure =
    await getMenuStructure();
  return (
    <>
     

      
          <MenuClient
              menuStructure={menuStructure}
            />
      
    </>
  );
}