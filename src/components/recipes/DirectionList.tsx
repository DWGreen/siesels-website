// src/components/recipes/DirectionList.tsx

type Props = {
  directions: string[];
};

export default function DirectionList({ directions }: Props) {
  return (
    <section>
      <h2 className="text-2xl font-black">Directions</h2>

      <ol className="mt-5 space-y-5">
        {directions.map((direction, index) => (
          <li key={index} className="flex gap-4">
            <span
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                border-2 border-neutral-900 bg-white text-sm font-black
              "
            >
              {index + 1}
            </span>

            <p className="pt-1 leading-7 text-neutral-800">{direction}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}