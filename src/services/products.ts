import api from "@/lib/woocommerce";
import { mapWooProduct }
  from "./mappers/productMapper";

export async function getProducts() {
  try {
    const response = await api.get("products");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const response = await api.get(`products/${id}`);

    return mapWooProduct(response.data);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    return null;
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


