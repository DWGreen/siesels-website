// src/components/recipes/IngredientList.tsx

type Props = {
  ingredients: string[];
  servings?: string;
};

export default function IngredientList({ ingredients, servings }: Props) {
  return (
    <aside className="border-2 border-neutral-900 bg-white p-5">
      <h2 className="text-2xl font-black">Ingredients</h2>

      {servings ? (
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.15em] text-neutral-500">
          Serves {servings}
        </p>
      ) : null}

      <ul className="mt-5 divide-y-2 divide-neutral-200">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="py-3 text-sm font-medium leading-6">
            {ingredient}
          </li>
        ))}
      </ul>
    </aside>
  );
}