import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModifierSection from "./ModifierSection";
import { ModifierDefinition, ModifierDraft } from "@/types/cart";

vi.mock("./ModifierOptionGroup", () => ({
  default: ({ onToggleOption }: { onToggleOption: (id: number) => void }) => (
    <button type="button" onClick={() => onToggleOption(42)}>Chips</button>
  ),
}));

const definition: ModifierDefinition = {
  id: "combo-1",
  productId: 95,
  configTrigger: "canMakeCombo",
  optionCategoryId: 29,
  optionGroups: [{ id: "chips", name: "Select Chips", options: [] }],
};
const draft: ModifierDraft = {
  definitionId: "combo-1",
  enabled: false,
  selectionsByGroup: { chips: [42] },
};

describe("ModifierSection combo options", () => {
  it("shows disabled combo options before the checkbox is checked", () => {
    render(<ModifierSection definition={definition} draft={draft} onDraftChange={vi.fn()} onToggleOption={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Chips" })).toBeDisabled();
    expect(screen.getByRole("group")).toHaveClass("opacity-40");
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("enables existing options without losing selections", () => {
    const onDraftChange = vi.fn();
    const onToggleOption = vi.fn();
    const { rerender } = render(<ModifierSection definition={definition} draft={draft} onDraftChange={onDraftChange} onToggleOption={onToggleOption} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onDraftChange).toHaveBeenCalledWith({ ...draft, enabled: true });
    rerender(<ModifierSection definition={definition} draft={{ ...draft, enabled: true }} onDraftChange={onDraftChange} onToggleOption={onToggleOption} />);
    expect(screen.getByRole("button", { name: "Chips" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Chips" }));
    expect(onToggleOption).toHaveBeenCalledWith("chips", 42);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onDraftChange).toHaveBeenLastCalledWith(draft);
  });

  it("preserves hiding behavior for disabled half-sandwich/soup options", () => {
    render(<ModifierSection definition={{ ...definition, configTrigger: "canMakeHalfSandwichSoup" }} draft={draft} onDraftChange={vi.fn()} onToggleOption={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Chips" })).not.toBeInTheDocument();
  });
});