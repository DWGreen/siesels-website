import { CategoryConfig } from "@/types/category";

export function parseCategoryConfig(
  description?: string
): CategoryConfig {
  try {
    return JSON.parse(description || "{}");
  } catch {
    return {};
  }
}