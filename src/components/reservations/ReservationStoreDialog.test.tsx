import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ReservationStoreDialog from "./ReservationStoreDialog";
const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }), usePathname: () => "/ham-reservations" }));
it("requires a store choice and navigates to its inventory only after continuing", () => {
  render(<ReservationStoreDialog />);
  expect(screen.getByRole("dialog", { name: "Choose your pickup store" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "View available products" })).toBeDisabled();
  fireEvent.click(screen.getByRole("radio", { name: /Iowa Meat Farms/ }));
  expect(push).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "View available products" }));
  expect(push).toHaveBeenCalledWith("/ham-reservations?store=iowa-meat-farms");
  expect(screen.getByRole("button", { name: "Loading availability…" })).toBeDisabled();
});
