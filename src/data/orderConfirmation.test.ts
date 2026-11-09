import { expect, it } from "vitest";
import { reservationReceiptItemName } from "./orderConfirmation";
it("identifies weight-only and bone-count reservation items", () => {
  expect(reservationReceiptItemName("12-14 lb - Siesel's", "turkey")).toBe("Turkey — 12-14 lb");
  expect(reservationReceiptItemName("3 Bone - Iowa Meat Farms", "roast")).toBe("Standing Rib Roast — 3 Bone");
  expect(reservationReceiptItemName("3-4 lb", "turkey-breast")).toBe("Turkey Breast — 3-4 lb");
});
it("preserves descriptive names without repeating their meat type", () => {
  expect(reservationReceiptItemName("Bone In Full Ham - Iowa Meat Farm's", "ham")).toBe("Bone In Full Ham");
  expect(reservationReceiptItemName("Boneless Turkey Breast - Siesel's", "turkey-breast")).toBe("Boneless Turkey Breast");
  expect(reservationReceiptItemName("Diestel Turkey 12-14 lb", "turkey")).toBe("Diestel Turkey 12-14 lb");
});
it("leaves non-reservation receipts unchanged", () => {
  expect(reservationReceiptItemName("Club Sandwich", "sandwich")).toBe("Club Sandwich");
  expect(reservationReceiptItemName("Gift Card", "gift-card")).toBe("Gift Card");
});
