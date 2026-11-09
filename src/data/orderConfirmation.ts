import type { ReservationType } from "@/data/storeLocations";

export type OrderType = ReservationType | "sandwich" | "gift-card";
type ConfirmationConfig = {
  heroTitle: string;
  heroImage: string;
  heading: string;
  message: string;
  returnHref: string;
  returnLabel: string;
  isReservation: boolean;
};

function reservation(label: string, slug: ReservationType, heroImage: string): ConfirmationConfig {
  return {
    heroTitle: `${label}`, heroImage,
    heading: `${label} Reservation Received`,
    message: `Thank you. Your ${label.toLowerCase()} reservation has been sent to the shop. Payment is handled at pickup. No payment was collected online.`,
    returnHref: `/${slug}-reservations`, returnLabel: `Back to ${label} Reservations`, isReservation: true,
  };
}

export const orderConfirmationConfig: Record<OrderType, ConfirmationConfig> = {
  turkey: reservation("Turkey", "turkey", "/images/hero/turkey-reservation.optimized-6e41354c9a.webp"),
  "turkey-breast": reservation("Turkey Breast", "turkey-breast", "/images/hero/turkey-breast-hero.optimized-d930f98ca1.webp"),
  roast: reservation("Standing Rib Roast", "roast", "/images/hero/rib-roasts-hero.optimized-289ab689ea.webp"),
  ham: reservation("Ham", "ham", "/images/hero/ham-hero.optimized-2ed15c19aa.webp"),
  sandwich: {
    heroTitle: "Sandwiches", heroImage: "/images/hero/sandwiches.optimized-74b1266113.webp", heading: "Order Received",
    message: "Thank you. Your order has been received.", returnHref: "/sandwiches", returnLabel: "Back to Sandwiches", isReservation: false,
  },
  "gift-card": {
    heroTitle: "Gift Cards", heroImage: "/images/hero/gift-cards.optimized-5925970f94.webp", heading: "Gift Card Order Received",
    message: "Thank you. Your gift card order has been received.", returnHref: "/gift-cards", returnLabel: "Back to Gift Cards", isReservation: false,
  },
};

export function getOrderType(value?: string): OrderType {
  return value && Object.hasOwn(orderConfirmationConfig, value) ? value as OrderType : "sandwich";
}

export function reservationReceiptItemName(name: string, type: OrderType): string {
  if (!orderConfirmationConfig[type].isReservation) return name;
  const displayName = name.replace(/\s+-\s+(?:Siesel['’]s|Iowa Meat Farm['’]?s)\s*$/i, "").trim();
  const labels = {
    turkey: { label: "Turkey", present: /\bturkey\b/i },
    "turkey-breast": { label: "Turkey Breast", present: /\bturkey[ -]+breast\b/i },
    roast: { label: "Standing Rib Roast", present: /\b(?:rib[ -]+)?roast\b/i },
    ham: { label: "Ham", present: /\bham\b/i },
  };
  const entry = labels[type as ReservationType];
  return entry.present.test(displayName) ? displayName : `${entry.label} — ${displayName}`;
}
