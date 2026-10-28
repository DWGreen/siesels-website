import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import SpecialsImageViewer from "./SpecialsImageViewer";
import { biWeeklySpecials } from "@/data/specials";

vi.mock("next/image", () => ({ default: () => null }));
afterEach(cleanup);

it("opens guided, navigates each item, and preserves the view choice across pages", () => {
  const onClose = vi.fn();
  const onNext = vi.fn();
  const { rerender } = render(<SpecialsImageViewer image={biWeeklySpecials[0]} onClose={onClose} onNext={onNext} />);
  expect(screen.getByRole("button", { name: "Guided view: On" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("img")).toHaveAccessibleName("Flanken Style Short Ribs, enlarged ad region");
  expect(screen.getByRole("button", { name: "Previous item" })).toBeDisabled();
  for (const region of biWeeklySpecials[0].guidedRegions!.slice(1)) {
    fireEvent.click(screen.getByRole("button", { name: "Next item" }));
    expect(screen.getByRole("img")).toHaveAccessibleName(`${region.label}, enlarged ad region`);
  }
  expect(screen.getByRole("button", { name: "Next item" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: "Next ad page" })).not.toBeInTheDocument();
  rerender(<SpecialsImageViewer image={biWeeklySpecials[1]} onClose={onClose} onNext={onNext} />);
  expect(screen.getByRole("img")).toHaveAccessibleName("Club House Sandwich, enlarged ad region");
  fireEvent.click(screen.getByRole("button", { name: "Guided view: On" }));
  expect(screen.getByRole("button", { name: "Zoom in on image" })).toBeInTheDocument();
  rerender(<SpecialsImageViewer image={biWeeklySpecials[0]} onClose={onClose} />);
  expect(screen.getByRole("button", { name: "Guided view: Off" })).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(screen.getByRole("button", { name: "Zoom in on image" }));
  expect(screen.getByRole("button", { name: "Fit image to screen" })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(onClose).toHaveBeenCalledOnce();
});

it("supports ads without regions", () => {
  render(<SpecialsImageViewer image={{ ...biWeeklySpecials[0], guidedRegions: undefined }} onClose={() => {}} />);
  expect(screen.queryByRole("button", { name: /Guided view/ })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Zoom in on image" })).toBeInTheDocument();
});

it("defines complete, bounded item regions for both current ads", () => {
  for (const ad of biWeeklySpecials) {
    expect(ad.guidedRegions).toHaveLength(ad.textAlternative.offers.length);
    for (const region of ad.guidedRegions!) {
      expect(region.x).toBeGreaterThanOrEqual(0);
      expect(region.y).toBeGreaterThanOrEqual(0);
      expect(region.width).toBeGreaterThan(0);
      expect(region.height).toBeGreaterThan(0);
      expect(region.x + region.width).toBeLessThanOrEqual(100);
      expect(region.y + region.height).toBeLessThanOrEqual(100);
    }
  }
});

it("navigates continuously across pages in both directions with a combined item count", () => {
  function Fixture() {
    const [page, setPage] = useState(0);
    return <SpecialsImageViewer image={biWeeklySpecials[page]} images={biWeeklySpecials}
      onSelectImage={setPage} onClose={() => {}}
      onPrevious={() => setPage(0)} onNext={() => setPage(1)} />;
  }
  render(<Fixture />);
  const labels = biWeeklySpecials.flatMap(page => page.guidedRegions!.map(region => region.label));
  expect(screen.getByText("Item 1 of 15")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous item" })).toBeDisabled();
  for (let index = 1; index < labels.length; index++) {
    fireEvent.click(screen.getByRole("button", { name: "Next item" }));
    expect(screen.getByRole("img")).toHaveAccessibleName(`${labels[index]}, enlarged ad region`);
    expect(screen.getByText(`Item ${index + 1} of 15`)).toBeInTheDocument();
  }
  expect(screen.getByRole("button", { name: "Next item" })).toBeDisabled();
  for (let index = labels.length - 2; index >= 0; index--) {
    fireEvent.click(screen.getByRole("button", { name: "Previous item" }));
    expect(screen.getByRole("img")).toHaveAccessibleName(`${labels[index]}, enlarged ad region`);
  }
  fireEvent.click(screen.getByRole("button", { name: "Guided view: On" }));
  expect(screen.queryByRole("button", { name: "Next item" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next ad page" }));
  expect(screen.getByRole("heading")).toHaveTextContent("Sandwich, Deli & Grocery Specials");
});
