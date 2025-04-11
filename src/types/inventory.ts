export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., kg, g, l, ml, pieces
  expirationDate: string; // ISO date string
  category: string; // e.g., vegetables, meat, dairy, spices
  minQuantity?: number; // for low stock alerts
  cost: number; // cost per unit
}

export type InventoryCategory = 
  | 'vegetables'
  | 'fruits'
  | 'meat'
  | 'seafood'
  | 'dairy'
  | 'grains'
  | 'pulses'
  | 'spices'
  | 'condiments'
  | 'oils & fats'
  | 'beverages';

export interface InventoryFilter {
  category?: InventoryCategory;
  searchQuery?: string;
  showLowStock?: boolean;
  showExpiringSoon?: boolean;
} 