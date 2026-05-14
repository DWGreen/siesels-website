export interface CategoryConfig {
  maxSelections?: number;

  initializeAllSelected?: boolean;

   autoAddAllProducts?: boolean;

  canMakeCombo?: boolean;
  canMakeHalfSandwichSoup?: boolean;

  selectionRequired?: boolean;
}

export interface Category {
  id: number;

  name: string;

  slug: string;

  description?: string;

  config: CategoryConfig;


}