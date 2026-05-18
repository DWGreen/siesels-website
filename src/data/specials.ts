export type SpecialImage = {
  id: string;
  src: string;
  alt: string;
  title?: string;
};

export const specials: SpecialImage[] = [
  {
    id: "special-1",
    src: "/images/specials/specials1.jpg",
    alt: "Current restaurant special 1 of 2",
    title: "Zesty & Bold",
  },
  {
    id: "special-2",
    src: "/images/specials/specials2.jpg",
    alt: "Current restaurant special 2 of 2",
    title: "Steakhouse Favorite",
  },
];