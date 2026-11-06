import type { ReservationType } from "@/data/storeLocations";

// Live parent product IDs. Keep new store-specific products outside this list
// until the store-aware reservation flow is ready to launch.
export const reservationProductIds: Record<ReservationType, readonly number[]> = {
  turkey: [173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183],
  roast: [191, 194, 197, 207, 210],
  "turkey-breast": [260, 261],
  ham: [213, 216, 257],
};

export function isAllowedReservationProduct(type: ReservationType, productId: number) {
  return reservationProductIds[type].includes(productId);
}
