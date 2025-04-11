import { WasteEntry, WasteAnalytics, WasteCategory } from '../types/waste';

type WasteUpdateListener = () => void;

class WasteService {
  private wasteEntries: WasteEntry[] = [
    {
      id: '1',
      itemName: 'Tomatoes',
      quantity: 2.5,
      unit: 'kg',
      category: 'Spoilage',
      cost: 250,
      date: '2024-03-20',
      reason: 'Found moldy in storage',
      chefName: 'Raj Kumar'
    },
    {
      id: '2',
      itemName: 'Rice',
      quantity: 3,
      unit: 'kg',
      category: 'Overproduction',
      cost: 180,
      date: '2024-03-19',
      reason: 'Excess preparation for event',
      chefName: 'Priya Singh'
    },
    {
      id: '3',
      itemName: 'Chicken',
      quantity: 4.2,
      unit: 'kg',
      category: 'Expired Items',
      cost: 840,
      date: '2024-03-18',
      reason: 'Past expiration date',
      chefName: 'Amit Patel'
    },
    {
      id: '4',
      itemName: 'Onions',
      quantity: 1.8,
      unit: 'kg',
      category: 'Preparation Waste',
      cost: 90,
      date: '2024-03-20',
      reason: 'Trimmings and peels',
      chefName: 'Priya Singh'
    },
    {
      id: '5',
      itemName: 'Paneer',
      quantity: 2.0,
      unit: 'kg',
      category: 'Overproduction',
      cost: 600,
      date: '2024-03-19',
      reason: 'Low customer turnout',
      chefName: 'Raj Kumar'
    },
    {
      id: '6',
      itemName: 'Mixed Vegetables',
      quantity: 3.5,
      unit: 'kg',
      category: 'Preparation Waste',
      cost: 280,
      date: '2024-03-18',
      reason: 'Vegetable trimmings',
      chefName: 'Neha Sharma'
    },
    {
      id: '7',
      itemName: 'Fish',
      quantity: 1.5,
      unit: 'kg',
      category: 'Spoilage',
      cost: 450,
      date: '2024-03-17',
      reason: 'Improper storage temperature',
      chefName: 'Amit Patel'
    },
    {
      id: '8',
      itemName: 'Milk',
      quantity: 5,
      unit: 'l',
      category: 'Expired Items',
      cost: 300,
      date: '2024-03-17',
      reason: 'Past expiration date',
      chefName: 'Neha Sharma'
    },
    {
      id: '9',
      itemName: 'Rice',
      quantity: 4,
      unit: 'kg',
      category: 'Overproduction',
      cost: 240,
      date: '2024-03-16',
      reason: 'Overestimated lunch crowd',
      chefName: 'Raj Kumar'
    },
    {
      id: '10',
      itemName: 'Tomatoes',
      quantity: 3,
      unit: 'kg',
      category: 'Other',
      cost: 300,
      date: '2024-03-16',
      reason: 'Supplier quality issues',
      chefName: 'Priya Singh'
    }
  ];

  private listeners: WasteUpdateListener[] = [];

  // Subscribe to waste data updates
  subscribe(listener: WasteUpdateListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of updates
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Get all waste entries
  async getAllEntries(): Promise<WasteEntry[]> {
    return this.wasteEntries;
  }

  // Add a new waste entry
  async addEntry(entry: Omit<WasteEntry, 'id'>): Promise<WasteEntry> {
    const newEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.wasteEntries = [...this.wasteEntries, newEntry];
    this.notifyListeners();
    return newEntry;
  }

  // Get waste analytics
  async getAnalytics(): Promise<WasteAnalytics> {
    const totalWasteCost = this.wasteEntries.reduce((sum, entry) => sum + entry.cost, 0);

    // Calculate waste by category
    const categoryMap = new Map<WasteCategory, { cost: number; quantity: number }>();
    this.wasteEntries.forEach(entry => {
      const current = categoryMap.get(entry.category) || { cost: 0, quantity: 0 };
      categoryMap.set(entry.category, {
        cost: current.cost + entry.cost,
        quantity: current.quantity + entry.quantity
      });
    });

    const wasteByCategoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data
    }));

    // Calculate top wasted items
    const itemMap = new Map<string, { totalQuantity: number; totalCost: number }>();
    this.wasteEntries.forEach(entry => {
      const current = itemMap.get(entry.itemName) || { totalQuantity: 0, totalCost: 0 };
      itemMap.set(entry.itemName, {
        totalQuantity: current.totalQuantity + entry.quantity,
        totalCost: current.totalCost + entry.cost
      });
    });

    const topWastedItems = Array.from(itemMap.entries())
      .map(([itemName, data]) => ({ itemName, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);

    // Calculate waste over time
    const wasteOverTime = this.wasteEntries
      .reduce((acc, entry) => {
        const existing = acc.find(item => item.date === entry.date);
        if (existing) {
          existing.cost += entry.cost;
        } else {
          acc.push({ date: entry.date, cost: entry.cost });
        }
        return acc;
      }, [] as { date: string; cost: number }[])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalWasteCost,
      wasteByCategoryData,
      topWastedItems,
      wasteOverTime
    };
  }
}

export const wasteService = new WasteService(); 