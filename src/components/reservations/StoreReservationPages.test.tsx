import { afterEach, expect, it, vi } from "vitest";
import TurkeyPage from "@/app/turkey-reservations/page";
import BreastPage from "@/app/turkey-breast-reservations/page";
import RoastPage from "@/app/roast-reservations/page";
import HamPage from "@/app/ham-reservations/page";
import ReservationStoreDialog from "./ReservationStoreDialog";
const loaders = vi.hoisted(() => ({ turkey: vi.fn(), roast: vi.fn(), ham: vi.fn() }));
vi.mock("@/services/turkeyReservations", () => ({ getTurkeyReservationProducts: loaders.turkey }));
vi.mock("@/services/roastReservations", () => ({ getRoastReservationProducts: loaders.roast }));
vi.mock("@/services/hamReservations", () => ({ getHamReservationProducts: loaders.ham }));
afterEach(() => vi.unstubAllEnvs());
it.each([
  ["turkey", TurkeyPage, loaders.turkey],
  ["turkey-breast", BreastPage, loaders.turkey],
  ["roast", RoastPage, loaders.roast],
  ["ham", HamPage, loaders.ham],
] as const)("gates %s inventory behind a valid store selection", async (type, page, load) => {
  for (const store of [undefined, "invalid-store"]) {
    const result = await page({ searchParams: Promise.resolve({ store }) });
    expect(result.props.children[0].props.products).toEqual([]);
    expect(result.props.children[0].props.awaitingStore).toBe(true);
    expect(result.props.children[1].type).toBe(ReservationStoreDialog);
    expect(load).not.toHaveBeenCalled();
  }
  load.mockResolvedValue([]);
  const result = await page({ searchParams: Promise.resolve({ store: "siesels-meats" }) });
  expect(result.props.initialStoreLocationId).toBe("siesels-meats");
  if (type === "turkey" || type === "turkey-breast") expect(load).toHaveBeenCalledWith(type, "siesels-meats");
  else expect(load).toHaveBeenCalledWith("siesels-meats");
});
