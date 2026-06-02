import { getWooCommerceApi } from "@/lib/woocommerce";
import { mapWooProduct }
  from "./mappers/productMapper";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const api = getWooCommerceApi();
    const response =
      await api.get(
        "products?per_page=100&orderby=menu_order&order=asc"
      );

    return response.data.map(
      mapWooProduct
    );
  } catch (error) {
    console.error(
      "Failed to fetch products:",
      error
    );

    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const api = getWooCommerceApi();
    const response = await api.get(`products/${id}`);

    return mapWooProduct(response.data);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}

export async function getProductsByIds(ids: number[]) : Promise<Product[]> {
  try {
    const api = getWooCommerceApi();
    const response = await api.get(`products?include=${ids.join(",")}&orderby=menu_order&order=asc`);

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error(`Failed to fetch products with ids ${ids.join(",")}:`, error);
    return [];
  }
}

export async function
getProductsByCategoryId(
  id: string
): Promise<Product[]> {
   const api = getWooCommerceApi();
   const response = await api.get(
    `products?category=${id}&orderby=menu_order&order=asc`
  );

  console.log(response.data);

  return response.data.map(mapWooProduct);
}


