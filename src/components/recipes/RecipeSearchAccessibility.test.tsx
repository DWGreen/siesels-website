import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import AdvancedRecipeSearch from "./AdvancedRecipeSearch";
import RecipeBrowseBar from "./RecipeBrowseBar";
import RecipeSearchBar from "./RecipeSearchBar";
import type { RecipeFilters } from "@/lib/recipes/recipeTypes";

const filters: RecipeFilters = { searchTerm: "", matchMode: "every", categoryValue: "", course: "", diet: "", cuisine: "", mainIngredient: "", holiday: "", cookingMethod: "" };
const groups = [{ value: "cuisine", label: "Cuisine", options: ["Italian"] }];
afterEach(cleanup);

it("keeps browse control IDs distinct from the open advanced search labels", () => {
  render(<><RecipeBrowseBar filters={filters} groups={groups} onChange={vi.fn()} />
    <AdvancedRecipeSearch recipes={[]} filters={filters} groups={groups} onApply={vi.fn()} onClose={vi.fn()} /></>);
  const selects = Array.from(document.querySelectorAll("select"));
  expect(selects).toHaveLength(2);
  expect(selects[0].id).not.toBe(selects[1].id);
  for (const select of selects) {
    expect(select.labels).toHaveLength(1);
    expect(select.labels![0].textContent?.trim()).toBe("Cuisine");
  }
});

it("groups advanced match choices for native arrow-key navigation without sharing the main search group", () => {
  render(<><RecipeSearchBar filters={filters} categoryGroups={[]} onChange={vi.fn()} onClear={vi.fn()} />
    <AdvancedRecipeSearch recipes={[]} filters={filters} groups={[]} onApply={vi.fn()} onClose={vi.fn()} /></>);
  const dialog = screen.getByRole("dialog");
  const choices = within(dialog).getAllByRole("radio") as HTMLInputElement[];
  expect(new Set(choices.map(choice => choice.name)).size).toBe(1);
  expect(choices[0].name).toBeTruthy();
  const background = document.querySelector('input[type="radio"]') as HTMLInputElement;
  expect(background.name).not.toBe(choices[0].name);
  fireEvent.click(within(dialog).getByRole("radio", { name: "Any Word" }));
  expect(within(dialog).getByRole("radio", { name: "Any Word" })).toBeChecked();
  expect(within(dialog).getByRole("radio", { name: "Every Word" })).not.toBeChecked();
});
