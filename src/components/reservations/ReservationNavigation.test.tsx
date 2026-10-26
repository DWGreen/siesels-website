import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ReservationNavigation from "./ReservationNavigation";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("shows a scroll cue when links overflow and starts at the left edge", () => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(900);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(375);
  render(<ReservationNavigation current="turducken" />);
  expect(screen.queryByText("Swipe or scroll to explore")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Scroll holiday reservation links horizontally").scrollLeft).toBe(0);
  expect(screen.getByRole("link", { name: "Turducken" })).toHaveAttribute("aria-current", "page");
  expect(screen.getAllByRole("link")).toHaveLength(5);
  expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
  expect(screen.queryByLabelText("Scroll right")).not.toBeInTheDocument();
  const scroller = screen.getByLabelText("Scroll holiday reservation links horizontally");
  scroller.scrollLeft = 200;
  fireEvent.scroll(scroller);
  expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
  scroller.scrollLeft = 525;
  fireEvent.scroll(scroller);
  expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  expect(screen.queryByLabelText("Scroll left")).not.toBeInTheDocument();
});

it("hides the scroll cue when all links fit", () => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(900);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1200);
  render(<ReservationNavigation current="turkey" />);
  expect(screen.queryByText("Swipe or scroll to explore")).not.toBeInTheDocument();
});

it("reveals the selected page when it is outside the visible menu", () => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(900);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(375);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return { left: this.getAttribute("aria-current") === "page" ? 700 : 0,
      right: this.getAttribute("aria-current") === "page" ? 900 : 375 } as DOMRect;
  });
  render(<ReservationNavigation current="turducken" />);
  expect(screen.getByLabelText("Scroll holiday reservation links horizontally").scrollLeft).toBe(525);
  expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
  expect(screen.queryByLabelText("Scroll left")).not.toBeInTheDocument();
});
