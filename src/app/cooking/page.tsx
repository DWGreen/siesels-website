import RecipeModulePage from "@/components/recipes/RecipeModulePage";
import {
  isRecipeUrlFilterKey,
  RecipeUrlFilterKey,
} from "@/lib/recipes/recipeUrls";

type SearchParams = {
  q?: string;
  match?: string;
  filter?: string;
  value?: string;
  category?: string;
  view?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};
export default async function CookingPage({ searchParams }: Props) {
  const params = await searchParams;
   const initialFilterKey: RecipeUrlFilterKey | undefined =
    isRecipeUrlFilterKey(params?.filter)
      ? params?.filter
      : undefined;
return (
    <RecipeModulePage
      initialSearchTerm={params?.q ?? ""}
      initialMatchMode={
        params?.match === "any" ||
        params?.match === "exact" ||
        params?.match === "every"
          ? params.match
          : "every"
      }
      initialFilterKey={initialFilterKey}
      initialFilterValue={params?.value ?? ""}
      initialCategoryValue={params?.category ?? ""}
      forceShowResults={params?.view === "all"}
    />
  );
}