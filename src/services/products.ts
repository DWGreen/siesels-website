import api from "@/lib/woocommerce";
import { mapWooProduct }
  from "./mappers/productMapper";
import { Product } from "@/types/product";

export async function getProducts() {
  try {
    const response = await api.get("products");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductById(id: number) {
  try {
    const response = await api.get(`products/${id}`);

    return mapWooProduct(response.data);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
  }
}

export async function getProductsByIds(ids: number[]) : Promise<Product[]> {
  try {
    const response = await api.get(`products?include=${ids.join(",")}`);

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error(`Failed to fetch products with ids ${ids.join(",")}:`, error);
    return [];
  }
}

export async function
getProductsByCategoryId(
  id: string
) {
   const response = await api.get(
    `products?category=${id}`
  );

  console.log(response.data);

  return response.data.map(mapWooProduct);
}


