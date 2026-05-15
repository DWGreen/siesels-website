export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const leftNavItems: NavItem[] = [
  { label: "Specials", href: "/specials" },
  {
    label: "Order Online",
    href: "/sandwiches",
    children: [
      { label: "Sandwich Ordering", href: "/sandwiches" },
      { label: "Instacart", href: "/order/instacart" },
    ],
  },
  { label: "Cooking", href: "/cooking" },
];

export const rightNavItems: NavItem[] = [
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
];

export const footerNavItems: NavItem[] = [
  { label: "Specials", href: "/specials" },
  { label: "Order Sandwiches Online", href: "/sandwiches" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Cooking", href: "/cooking" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/bestmeatssandiego",
    icon: "instagram" as const,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/BestMeatsSanDiego",
    icon: "facebook" as const,
  },
];
