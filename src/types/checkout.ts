// Types for the WooCommerce Store API cart/checkout responses.
// Only the fields we currently rely on are typed; unknown fields pass through untyped.

export interface StoreApiMoney {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreApiCartItemTotals extends StoreApiMoney {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
}

export interface StoreApiCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description?: string;
  images?: Array<{ src: string; alt?: string }>;
  variation?: Array<{ attribute: string; value: string }>;
  item_data?: Array<{
    key?: string;
    name: string;
    value: string;
    display_key?: string;
    display_value?: string;
  }>;
  prices: StoreApiMoney & {
    price: string;
    regular_price: string;
    sale_price: string;
  };
  totals: StoreApiCartItemTotals;
}

export interface StoreApiCartTotals extends StoreApiMoney {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string | null;
  total_shipping_tax: string | null;
  total_price: string;
  total_tax: string;
  tax_lines: Array<{ name: string; rate: string; price: string }>;
}

export interface StoreApiCart {
  items: StoreApiCartItem[];
  coupons: Array<{ code: string; totals: Record<string, unknown> }>;
  fees: unknown[];
  totals: StoreApiCartTotals;
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping_rates: unknown[];
  items_count: number;
  items_weight: number;
  errors: Array<{ code: string; message: string }>;
}

export interface AddCartItemRequest {
  id: number;
  quantity: number;
  variation?: Array<{ attribute: string; value: string }>;
  siesels_selection_metadata?: string;
  siesels_line_group?: string;
  siesels_parent_name?: string;
}

export interface UpdateCartItemRequest {
  key: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  key: string;
}
