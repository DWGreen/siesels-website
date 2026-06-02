import { getMenuStructure } from "@/services/menu";
import MenuClient
  from "./MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
const menuStructure =
    await getMenuStructure();

  return (

    <MenuClient
      menuStructure={menuStructure}
    />
  );
}