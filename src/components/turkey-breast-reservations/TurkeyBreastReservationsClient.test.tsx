import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TurkeyBreastReservationsClient from "./TurkeyBreastReservationsClient";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useReservationOrdering", () => ({ useReservationOrdering: () => ({ isOpen: true, message: null }) }));

const products = [
  { id: 10, name: "Boneless Turkey Breast", weights: ["3-4 lb", "4-6 lb"] },
  { id: 20, name: "Bone-in Turkey Breast", weights: ["6-8 lb", "8-10 lb"] },
].map(parent => ({
  id: parent.id, name: parent.name, description: "", stockManaged: false, stockQuantity: null, inStock: true,
  variations: parent.weights.map((weight, index) => ({
    id: parent.id + index + 1,
    attributes: [{ attribute: "Weight", name: "Weight", value: weight }],
    stockManaged: true, usesParentStock: false, stockQuantity: index === 1 ? 0 : 3, inStock: index !== 1,
  })),
}));

describe("turkey breast weight picker", () => {
  it("filters weights by type, disables sold out weights, and keeps selections separate", () => {
    render(<TurkeyBreastReservationsClient products={products} />);
    fireEvent.click(screen.getByRole("button", { name: "Add A Turkey Breast" }));
    let dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("combobox", { name: "Weight" })).toHaveValue("11");
    expect(dialog.getByRole("option", { name: "4-6 lb (Unavailable)" })).toBeDisabled();
    expect(dialog.queryByRole("option", { name: "6-8 lb" })).not.toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: "Add Turkey Breast" }));
    expect(screen.getByText("Boneless Turkey Breast — 3-4 lb")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Turkey Breast To Reservation" }));
    dialog = within(screen.getByRole("dialog"));
    fireEvent.change(dialog.getByRole("combobox", { name: "Turkey Breast Type" }), { target: { value: "20" } });
    expect(dialog.getByRole("combobox", { name: "Weight" })).toHaveValue("21");
    expect(dialog.queryByRole("option", { name: "3-4 lb" })).not.toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: "Add Turkey Breast" }));
    expect(screen.getByText("Bone-in Turkey Breast — 6-8 lb")).toBeInTheDocument();
    expect(screen.getByText("Boneless Turkey Breast — 3-4 lb")).toBeInTheDocument();
  });
});
