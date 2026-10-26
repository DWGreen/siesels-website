import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { useAccessibleModal } from "./useAccessibleModal";

function Fixture({ autofocus = false, nonTabbable = false }: { autofocus?: boolean; nonTabbable?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useAccessibleModal<HTMLDivElement>(open, () => setOpen(false));
  return <div>
    <button onClick={() => setOpen(true)}>Open</button>
    <div data-testid="background"><button>Background</button></div>
    {open && <div ref={ref} role="dialog" aria-label="Test modal" aria-modal="true">
      <button tabIndex={nonTabbable ? -1 : undefined} onClick={() => setOpen(false)}>Close</button>
      <input aria-label="Choice" autoFocus={autofocus} />
      <button>Last</button>
    </div>}
  </div>;
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([{ width: 100, height: 30 }] as unknown as DOMRectList);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); document.body.style.overflow = ""; });

describe("accessible modal behavior", () => {
  it("focuses the dialog, traps Tab, isolates the background, and restores focus/scroll on Escape", () => {
    document.body.style.overflow = "auto";
    render(<Fixture />);
    const opener = screen.getByRole("button", { name: "Open" });
    opener.focus(); fireEvent.click(opener);
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    expect(screen.getByTestId("background")).toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("hidden");
    screen.getByRole("button", { name: "Last" }).focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(screen.getByTestId("background")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores the actual opener even when React autofocus has already moved focus inside", () => {
    render(<Fixture autofocus />);
    const opener = screen.getByRole("button", { name: "Open" });
    opener.focus(); fireEvent.click(opener);
    expect(screen.getByRole("textbox")).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(opener).toHaveFocus();
  });

  it("prevents programmatic background focus while open", () => {
    render(<Fixture />);
    const background = screen.getByRole("button", { name: "Background" });
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    background.focus();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });
});

it("skips controls removed from the tab order and preserves already inert background content", () => {
  render(<Fixture nonTabbable />);
  const background = screen.getByTestId("background");
  background.setAttribute("inert", "");
  const opener = screen.getByRole("button", { name: "Open" });
  opener.focus(); fireEvent.click(opener);
  expect(screen.getByRole("textbox")).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(background).toHaveAttribute("inert");
  expect(opener).toHaveFocus();
});
