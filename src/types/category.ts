export interface CategoryConfig {
  maxSelections?: number;

  initializeAllSelected?: boolean;

   autoAddAllProducts?: boolean;

  canMakeCombo?: boolean;
  canMakeHalfSandwichSoup?: boolean;

  selectionRequired?: boolean;
  menuOrder?: number;
}

export interface Category {
  id: number;

  name: string;

  slug: string;

  description?: string;

  config: CategoryConfig;
 menuOrder?: number;

}