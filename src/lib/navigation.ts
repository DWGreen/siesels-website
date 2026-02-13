export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const leftNavItems: NavItem[] = [
  { label: "Specials", href: "/specials" },
  {
    label: "Order Online",
    href: "/order",
    children: [
      { label: "Siesel's Meats", href: "/order/siesels" },
      { label: "Iowa Meat Farms", href: "/order/iowa-meat-farms" },
    ],
  },
  { label: "Cooking", href: "/cooking" },
];

export const rightNavItems: NavItem[] = [
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram" as const,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook" as const,
  },
];
