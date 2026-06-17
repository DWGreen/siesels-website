import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CookingPage from "./page";

const recipeModulePageMock = vi.fn(() => null);

vi.mock("@/components/recipes/RecipeModulePage", () => ({
  default: (props: unknown) => recipeModulePageMock(props),
}));

describe("CookingPage", () => {
  beforeEach(() => {
    recipeModulePageMock.mockClear();
  });

  it("passes normalized search params to RecipeModulePage", async () => {
    const ui = await CookingPage({
      searchParams: Promise.resolve({
        q: "steak",
        match: "any",
        filter: "diet",
        value: "keto",
        category: "dinner",
        view: "all",
      }),
    });

    render(ui);

    expect(recipeModulePageMock).toHaveBeenCalledTimes(1);
    expect(recipeModulePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSearchTerm: "steak",
        initialMatchMode: "any",
        initialFilterKey: "diet",
        initialFilterValue: "keto",
        initialCategoryValue: "dinner",
        forceShowResults: true,
      })
    );
  });

  it("falls back when match/filter params are invalid", async () => {
    const ui = await CookingPage({
      searchParams: Promise.resolve({
        q: "pasta",
        match: "wrong-value",
        filter: "not-a-filter",
      }),
    });

    render(ui);

    expect(recipeModulePageMock).toHaveBeenCalledTimes(1);
    expect(recipeModulePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSearchTerm: "pasta",
        initialMatchMode: "every",
        initialFilterKey: undefined,
        initialFilterValue: "",
        initialCategoryValue: "",
        forceShowResults: false,
      })
    );
  });

  it("handles missing searchParams", async () => {
    const ui = await CookingPage({});

    render(ui);

    expect(recipeModulePageMock).toHaveBeenCalledTimes(1);
    expect(recipeModulePageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSearchTerm: "",
        initialMatchMode: "every",
        initialFilterKey: undefined,
        initialFilterValue: "",
        initialCategoryValue: "",
        forceShowResults: false,
      })
    );
  });
});
