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
  turkey: reservation("Turkey", "turkey", "/images/hero/turkey-reservation.jpg"),
  "turkey-breast": reservation("Turkey Breast", "turkey-breast", "/images/hero/turkey-breast-hero.jpg"),
  roast: reservation("Standing Rib Roast", "roast", "/images/hero/rib-roasts-hero.webp"),
  ham: reservation("Ham", "ham", "/images/hero/ham-hero.webp"),
  sandwich: {
    heroTitle: "Sandwiches", heroImage: "/images/hero/sandwiches.webp", heading: "Order Received",
    message: "Thank you. Your order has been received.", returnHref: "/sandwiches", returnLabel: "Back to Sandwiches", isReservation: false,
  },
  "gift-card": {
    heroTitle: "Gift Cards", heroImage: "/images/hero/gift-cards.jpg", heading: "Gift Card Order Received",
    message: "Thank you. Your gift card order has been received.", returnHref: "/gift-cards", returnLabel: "Back to Gift Cards", isReservation: false,
  },
};

export function getOrderType(value?: string): OrderType {
  return value && Object.hasOwn(orderConfirmationConfig, value) ? value as OrderType : "sandwich";
}
