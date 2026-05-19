"use client";

import { RecipeFilters } from "@/types/recipes";

type CategoryGroup = {
  label: string;
  prefix: string;
  options: string[];
};

type Props = {
  filters: RecipeFilters;
  categoryGroups: CategoryGroup[];
  onChange: (
    key: keyof RecipeFilters,
    value: string
  ) => void;
  onClear: () => void;
  onAdvancedSearch?: () => void;
};

export default function RecipeSearchBar({
  filters,
  categoryGroups,
  onChange,
  onClear,
  onAdvancedSearch,
}: Props) {
  return (
    <div
      className="
        border-b
        border-neutral-300
        bg-white
        px-4
        py-4
      "
    >
      <div
        className="
          grid
          gap-3
          lg:grid-cols-[260px_1fr_auto_auto]
        "
      >
        <select
          value={filters.categoryValue}
          onChange={event =>
            onChange(
              "categoryValue",
              event.target.value
            )
          }
          className="
            border
            border-neutral-900
            px-3
            py-2
            text-sm
            font-bold
          "
        >
          <option value="">
            Browse Recipe Categories
          </option>

          {categoryGroups.map(group => (
            <optgroup
              key={group.label}
              label={group.label}
            >
              {group.options.map(option => (
                <option
                  key={`${group.prefix}|${option}`}
                  value={`${group.prefix}|${option}`}
                >
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div
          className="
            flex
            border
            border-neutral-900
          "
        >
          <input
            value={filters.searchTerm}
            onChange={event =>
              onChange(
                "searchTerm",
                event.target.value
              )
            }
            placeholder="FIND RECIPES"
            className="
              min-w-0
              flex-1
              px-3
              py-2
              text-sm
              font-bold
              uppercase
              outline-none
            "
          />

          <button
            type="button"
            className="
              border-l
              border-neutral-900
              bg-neutral-900
              px-4
              text-sm
              font-black
              uppercase
              tracking-widest
              text-white
            "
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={onAdvancedSearch}
          className="
            border
            border-neutral-900
            px-4
            py-2
            text-sm
            font-black
            uppercase
            tracking-widest
          "
        >
          Advanced
        </button>

        <button
          type="button"
          onClick={onClear}
          className="
            border
            border-neutral-900
            px-4
            py-2
            text-sm
            font-black
            uppercase
            tracking-widest
          "
        >
          Clear
        </button>
      </div>

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-4
          text-sm
        "
      >
        <span className="font-black uppercase tracking-widest">
          Match:
        </span>

        {[
          ["every", "Every Word"],
          ["any", "Any Word"],
          ["exact", "Exact Phrase"],
        ].map(([value, label]) => (
          <label
            key={value}
            className="flex items-center gap-2"
          >
            <input
              type="radio"
              name="matchMode"
              value={value}
              checked={filters.matchMode === value}
              onChange={() =>
                onChange(
                  "matchMode",
                  value
                )
              }
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}