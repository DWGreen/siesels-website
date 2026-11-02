/** Bone-count products are named e.g. "Standing Rib Roast - 7 Bone". */
export function roastBoneCount(name: string): number {
  return Number(name.match(/(\d+)\s*[-–]?\s*bone/i)?.[1] ?? 0);
}

export function sortRoastsByBoneCount<T extends { name: string }>(products: T[]): T[] {
  return [...products].sort((a, b) => roastBoneCount(b.name) - roastBoneCount(a.name));
}
