"use client";
//this is the bar that displays drop downs that allow you to filter recipes when browsing, it originally used a RecipeFilters type, which is part of the reason things were a little screwed up, because types diverged
//
import { OptionGroup, RecipeFilters } from "@/lib/recipes/recipeTypes";



type Props = {
  filters: RecipeFilters;
  groups: OptionGroup[];
  onChange: (
    key: keyof RecipeFilters,
    value: string
  ) => void;
};

export default function RecipeBrowseBar({
  filters,
  groups,
  onChange,
}: Props) {
  console.log("RecipeBrowseBar filters:", filters);
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
        border-y
        border-neutral-300
        bg-neutral-100
        px-4
        py-3
      "
    >
      <div
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.25em]
          text-neutral-700
        "
      >
        Browse:
      </div>

      {groups.map(group => (
        <label
          key={group.value}
          className="sr-only"
          htmlFor={`browse-${group.value}`}
        >
          {group.label}
        </label>
      ))}

      {groups.map(group => (
        <select
          key={group.value}
          id={`browse-${group.value}`}
          value={filters[group.value]}
          onChange={event =>
            onChange(
              group.value,
              event.target.value
            )
          }
          className="
            min-w-40
            border
            border-neutral-900
            bg-white
            px-3
            py-2
            text-sm
            font-bold
            uppercase
            tracking-wide
          "
        >
          <option value="">{group.label}</option>

          {group.options.map(option => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}