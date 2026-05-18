// src/components/recipes/RecipeSearchBar.tsx

"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RecipeSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("query", query.trim());
    } else {
      params.delete("query");
    }

    params.set("page", "1");

    router.push(`/cooking?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col gap-3 border-none border-neutral-900 bg-white p-3
        sm:flex-row
      "
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search recipes..."
        className="
          min-h-12 flex-1 border border-neutral-900 px-4
          text-base font-bold outline-none
          placeholder:text-neutral-400
        "
      />

      <button
        type="submit"
        className="
          min-h-12 border-2 border-neutral-900 bg-neutral-950 px-6
          text-sm font-black uppercase tracking-[0.2em] text-white
          transition hover:bg-white hover:text-neutral-950
        "
      >
        Search
      </button>
    </form>
  );
}