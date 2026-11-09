import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RoastReservationsClient from "./RoastReservationsClient";
import type { RoastReservationProduct } from "@/services/roastReservations";

vi.mock("next/navigation", () => ({ usePathname: () => "/turkey-reservations", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useReservationOrdering", () => ({ useReservationOrdering: () => ({ isOpen: true, message: null }) }));

const products: RoastReservationProduct[] = [{
  id: 10,
  name: "Rib Roast",
  variations: [
    { id: 11, grade: "USDA Choice", seasoning: "Plain" },
    { id: 12, grade: "USDA Prime", seasoning: "Seasoned" },
    { id: 13, grade: "USDA Prime", seasoning: "Plain" },
  ].map(variation => ({ ...variation, attributeName: "Grade", stockManaged: true, stockQuantity: 10, inStock: true })) as RoastReservationProduct["variations"],
}];

describe("roast picker", () => {
  it("defaults to Prime, has distinct grades, and preserves separate seasoning choices", () => {
    render(<RoastReservationsClient products={products} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Add A Standing Rib Roast" })[0]);
    const dialog = within(screen.getByRole("dialog"));
    const grade = dialog.getByRole("combobox", { name: /Grade/ });
    expect(within(grade).getAllByRole("option").map(option => option.textContent)).toEqual(["USDA Prime", "USDA Choice"]);
    expect(grade).toHaveValue("USDA Prime");
    expect(dialog.getByRole("combobox", { name: "Seasoning" })).toHaveValue("Plain");
    fireEvent.change(dialog.getByRole("combobox", { name: "Seasoning" }), { target: { value: "Seasoned" } });
    fireEvent.click(dialog.getByRole("button", { name: "Add Roast" }));
    expect(screen.getByText("USDA Prime / Seasoned")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add A Standing Rib Roast" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Add Roast" }));
    expect(screen.getByText("USDA Prime / Plain")).toBeInTheDocument();
    expect(screen.getByText("USDA Prime / Seasoned")).toBeInTheDocument();
  });
});
it("sorts bone counts descending, defaults to the largest, and keeps Easy Carve separate", () => {
  const sizes = [2, 7, 4].map(bones => ({ ...products[0], id: bones, name: `${bones} Bone Standing Rib Roast`, variations: products[0].variations.map(v => ({ ...v, id: bones * 100 + v.id })) }));
  render(<RoastReservationsClient products={sizes} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Add A Standing Rib Roast" })[0]);
  let dialog = within(screen.getByRole("dialog"));
  const cut = dialog.getByRole("combobox", { name: /^Cut/ });
  expect(within(cut).getAllByRole("option").map(option => option.textContent)).toEqual(["7 Bone Standing Rib Roast", "4 Bone Standing Rib Roast", "2 Bone Standing Rib Roast"]);
  expect(cut).toHaveValue("7");
  expect(dialog.getByRole("checkbox", { name: "Easy Carve" })).not.toBeChecked();
  fireEvent.click(dialog.getByRole("checkbox", { name: "Easy Carve" }));
  fireEvent.click(dialog.getByRole("button", { name: "Add Roast" }));
  expect(screen.getByText("USDA Prime / Plain / Easy Carve")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Add A Standing Rib Roast" }));
  dialog = within(screen.getByRole("dialog"));
  expect(dialog.getByRole("checkbox", { name: "Easy Carve" })).not.toBeChecked();
  fireEvent.click(dialog.getByRole("button", { name: "Add Roast" }));
  expect(screen.getByText("USDA Prime / Plain")).toBeInTheDocument();
  expect(screen.getByText("USDA Prime / Plain / Easy Carve")).toBeInTheDocument();
});
