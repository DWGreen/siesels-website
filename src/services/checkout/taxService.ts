export interface CalculateTaxInput {
  subtotalCents: number;
}

export interface TaxCalculationResult {
  taxRate: number;
  taxCents: number;
}

const DEFAULT_TAX_RATE = 0.081;

export function calculateTax({
  subtotalCents,
}: CalculateTaxInput): TaxCalculationResult {
  const taxRate = DEFAULT_TAX_RATE;

  const taxCents = Math.round(
    subtotalCents * taxRate
  );

  return {
    taxRate,
    taxCents,
  };
}