import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import TurkeyReservationsClient from "@/components/turkey-reservations/TurkeyReservationsClient";
import TurkeyBreastReservationsClient from "@/components/turkey-breast-reservations/TurkeyBreastReservationsClient";
import HamReservationsClient from "@/components/ham-reservations/HamReservationsClient";
import RoastReservationsClient from "@/components/roast-reservations/RoastReservationsClient";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useReservationOrdering", () => ({ useReservationOrdering: () => ({ isOpen: true, message: null }) }));
afterEach(cleanup);

it.each([
  ["turkey", TurkeyReservationsClient], ["turkey breast", TurkeyBreastReservationsClient],
  ["ham", HamReservationsClient], ["roast", RoastReservationsClient],
] as const)("requires separate first and last names on the %s form", (_type, Form) => {
  render(<Form products={[{ id: 1, name: "Reservation product", description: "", stockManaged: true, stockQuantity: 5, inStock: true,
    variations: [{ id: 2, grade: "USDA Prime", seasoning: null, attributeName: "Grade", attributes: [{ attribute: "Weight", name: "Weight", value: "3-4 lb" }], usesParentStock: false, stockManaged: true, stockQuantity: 5, inStock: true }],
  }]} />);
  const first = screen.getByRole("textbox", { name: "First name" }) as HTMLInputElement;
  const last = screen.getByRole("textbox", { name: "Last name" }) as HTMLInputElement;
  expect(first).toBeRequired();
  expect(last).toBeRequired();
  expect(screen.getByRole("textbox", { name: "Email (optional)" })).not.toBeRequired();
  expect(screen.getByRole("textbox", { name: "Phone" })).toBeRequired();
  expect(first).toHaveAttribute("autocomplete", "given-name");
  expect(last).toHaveAttribute("autocomplete", "family-name");
  expect(first.checkValidity()).toBe(false);
  expect(last.checkValidity()).toBe(false);
  fireEvent.change(first, { target: { value: "Mary Jane" } });
  expect(first.checkValidity()).toBe(true);
  expect(last.checkValidity()).toBe(false);
  fireEvent.change(last, { target: { value: "de la Cruz" } });
  expect(first).toHaveValue("Mary Jane");
  expect(last).toHaveValue("de la Cruz");
  expect(last.checkValidity()).toBe(true);
  expect(screen.queryByRole("textbox", { name: /^name$/i })).not.toBeInTheDocument();
});
