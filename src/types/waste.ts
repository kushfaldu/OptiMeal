export type WasteCategory = 'Preparation Waste' | 'Expired Items' | 'Overproduction' | 'Spoilage' | 'Other';

export interface WasteEntry {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category: WasteCategory;
  cost: number;
  date: string;
  reason: string;
  chefName: string;
}

export interface WasteAnalytics {
  totalWasteCost: number;
  wasteByCategoryData: {
    category: WasteCategory;
    cost: number;
    quantity: number;
  }[];
  topWastedItems: {
    itemName: string;
    totalQuantity: number;
    totalCost: number;
  }[];
  wasteOverTime: {
    date: string;
    cost: number;
  }[];
} 