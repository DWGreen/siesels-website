import { Ingredient } from "@/types/ingredients";

type Props = {
  ingredients: Ingredient[];
};

export default function QuickIngredientsList({
  ingredients,
}: Props) {
  return (
    <div
      className="
       flex
    flex-col
    gap-2
      "
    >
      {ingredients.map((ingredient) => (
        <span
          key={ingredient.name}
          className="
            text-xs
            bg-gray-100
            rounded-full
            px-2
            py-1
          "
        >
         {ingredient.included ? "✓" : "✗"} {ingredient.extra ? "Extra" : ""} {ingredient.name} {ingredient.price ? "+ $" + ingredient.price.toFixed(2) : ""}
        </span>
        
    
      ))}
    </div>
  );
}