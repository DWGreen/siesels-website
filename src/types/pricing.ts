type SandwichPricing = {
basePrice: number;
ingredientPrices: {
  [ingredientId: number]: number;
};
  additionalPrice: number;
  totalPrice: number;
};


