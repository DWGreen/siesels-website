function productStoreId(name: string) {
  const suffix = name.trim().replace(/[’‘]/g, "'").match(/\s+-\s+(Siesel's|Iowa Meat Farm'?s)$/i)?.[1].toLowerCase();
  if (suffix === "siesel's") return "siesels-meats";
  if (suffix === "iowa meat farms" || suffix === "iowa meat farm's") return "iowa-meat-farms";
  return null;
}

export function reservationProductMatchesStore(product: { id: number; name: string }, storeId?: string) {
  return productStoreId(product.name) !== null && productStoreId(product.name) === storeId;
}

export function reservationDisplayName(name: string) {
  return name.replace(/\s+-\s+(?:Siesel['’]s|Iowa Meat Farm['’]?s)\s*$/i, "").trim();
}
