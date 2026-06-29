export type SpecialImage = {
  id: string;
  src: string;
  alt: string;
  title?: string;
};

export type SpecialsCategory = {
  id: string;
  title: string;
  images: SpecialImage[];
};

export const biWeeklySpecials: SpecialImage[] = [
  {
    id: "special-1",
    src: "/images/specials/biweekly/specials1.jpg",
    alt: "Current restaurant special 1 of 2",
    title: "Zesty & Bold",
  },
  {
    id: "special-2",
    src: "/images/specials/biweekly/specials2.jpg",
    alt: "Current restaurant special 2 of 2",
    title: "Steakhouse Favorite",
  },
];


export const weekendSpecials: SpecialImage[] = [
  {
    id: "special-1",
    src: "/images/specials/weekend/weekend1.jpg",
    alt: "Current restaurant special 1 of 2",
    title: "Zesty & Bold",
  },
  {
    id: "special-2",
    src: "/images/specials/weekend/weekend2.jpg",
    alt: "Current restaurant special 2 of 2",
    title: "Steakhouse Favorite",
  },
];

export const specialsCategories: SpecialsCategory[] = [
  {
    id: "weekly-specials",
    title: "Weekly Specials",
    images: biWeeklySpecials,
  },
  {
    id: "weekend-two-day-only-specials",
    title: "Weekend Two Day Only Specials",
    images: weekendSpecials,
  },
];