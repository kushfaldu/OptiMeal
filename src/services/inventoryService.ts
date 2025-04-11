import { InventoryItem } from '../types/inventory';

const STORAGE_KEY = 'restaurant_inventory';

const initialInventory: Omit<InventoryItem, 'id'>[] = [
  // Vegetables
  {
    name: 'Onion',
    quantity: 100,
    unit: 'kg',
    expirationDate: '2025-04-15',
    category: 'vegetables',
    minQuantity: 30,
    cost: 20
  },
  {
    name: 'Tomato',
    quantity: 80,
    unit: 'kg',
    expirationDate: '2025-04-12',
    category: 'vegetables',
    minQuantity: 25,
    cost: 25
  },
  {
    name: 'Potato',
    quantity: 150,
    unit: 'kg',
    expirationDate: '2025-04-20',
    category: 'vegetables',
    minQuantity: 40,
    cost: 18
  },
  {
    name: 'Ginger',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-05-01',
    category: 'vegetables',
    minQuantity: 5,
    cost: 150
  },
  {
    name: 'Garlic',
    quantity: 15,
    unit: 'kg',
    expirationDate: '2025-05-01',
    category: 'vegetables',
    minQuantity: 5,
    cost: 200
  },
  {
    name: 'Green Chillies',
    quantity: 10,
    unit: 'kg',
    expirationDate: '2025-04-10',
    category: 'vegetables',
    minQuantity: 3,
    cost: 100
  },
  {
    name: 'Capsicum',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-04-14',
    category: 'vegetables',
    minQuantity: 5,
    cost: 120
  },
  {
    name: 'Carrot',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2025-04-16',
    category: 'vegetables',
    minQuantity: 10,
    cost: 60
  },
  {
    name: 'Spinach',
    quantity: 25,
    unit: 'kg',
    expirationDate: '2025-04-08',
    category: 'vegetables',
    minQuantity: 8,
    cost: 40
  },

  // Fruits
  {
    name: 'Mango',
    quantity: 40,
    unit: 'kg',
    expirationDate: '2025-04-18',
    category: 'fruits',
    minQuantity: 15,
    cost: 150
  },
  {
    name: 'Apple',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2025-04-22',
    category: 'fruits',
    minQuantity: 10,
    cost: 200
  },
  {
    name: 'Banana',
    quantity: 50,
    unit: 'dozens',
    expirationDate: '2025-04-04',
    category: 'fruits',
    minQuantity: 15,
    cost: 60
  },
  {
    name: 'Lemon',
    quantity: 10,
    unit: 'kg',
    expirationDate: '2025-04-12',
    category: 'fruits',
    minQuantity: 3,
    cost: 80
  },
  {
    name: 'Orange',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-04-15',
    category: 'fruits',
    minQuantity: 5,
    cost: 120
  },

  // Meat
  {
    name: 'Chicken',
    quantity: 50,
    unit: 'kg',
    expirationDate: '2025-04-05',
    category: 'meat',
    minQuantity: 15,
    cost: 250
  },
  {
    name: 'Mutton',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2025-04-06',
    category: 'meat',
    minQuantity: 10,
    cost: 750
  },
  {
    name: 'Lamb',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-04-07',
    category: 'meat',
    minQuantity: 5,
    cost: 900
  },

  // Seafood
  {
    name: 'Prawns',
    quantity: 25,
    unit: 'kg',
    expirationDate: '2025-04-07',
    category: 'seafood',
    minQuantity: 8,
    cost: 500
  },
  {
    name: 'Fish (Rohu)',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2025-04-06',
    category: 'seafood',
    minQuantity: 10,
    cost: 300
  },

  // Dairy
  {
    name: 'Milk',
    quantity: 200,
    unit: 'liters',
    expirationDate: '2025-04-02',
    category: 'dairy',
    minQuantity: 50,
    cost: 50
  },
  {
    name: 'Paneer',
    quantity: 25,
    unit: 'kg',
    expirationDate: '2025-04-05',
    category: 'dairy',
    minQuantity: 8,
    cost: 400
  },
  {
    name: 'Yogurt',
    quantity: 50,
    unit: 'kg',
    expirationDate: '2025-04-04',
    category: 'dairy',
    minQuantity: 15,
    cost: 150
  },
  {
    name: 'Butter',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-04-15',
    category: 'dairy',
    minQuantity: 5,
    cost: 500
  },
  {
    name: 'Cream',
    quantity: 15,
    unit: 'liters',
    expirationDate: '2025-04-12',
    category: 'dairy',
    minQuantity: 5,
    cost: 450
  },

  // Grains
  {
    name: 'Rice (Basmati)',
    quantity: 300,
    unit: 'kg',
    expirationDate: '2025-12-31',
    category: 'grains',
    minQuantity: 100,
    cost: 100
  },
  {
    name: 'Wheat Flour (Atta)',
    quantity: 250,
    unit: 'kg',
    expirationDate: '2025-12-31',
    category: 'grains',
    minQuantity: 80,
    cost: 45
  },
  {
    name: 'Semolina (Sooji)',
    quantity: 100,
    unit: 'kg',
    expirationDate: '2025-12-31',
    category: 'grains',
    minQuantity: 30,
    cost: 50
  },

  // Pulses
  {
    name: 'Toor Dal',
    quantity: 50,
    unit: 'kg',
    expirationDate: '2025-11-30',
    category: 'pulses',
    minQuantity: 15,
    cost: 150
  },
  {
    name: 'Chana Dal',
    quantity: 40,
    unit: 'kg',
    expirationDate: '2025-11-30',
    category: 'pulses',
    minQuantity: 12,
    cost: 160
  },
  {
    name: 'Moong Dal',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2025-11-30',
    category: 'pulses',
    minQuantity: 10,
    cost: 140
  },
  {
    name: 'Urad Dal',
    quantity: 25,
    unit: 'kg',
    expirationDate: '2025-11-30',
    category: 'pulses',
    minQuantity: 8,
    cost: 180
  },
  {
    name: 'Oil',
    quantity: 35.51,
    unit: 'pieces',
    expirationDate: '2026-01-22',
    category: 'spices',
    minQuantity: 5,
    cost: 43.67
  },
  {
    name: 'Chole',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2025-11-30',
    category: 'pulses',
    minQuantity: 5,
    cost: 190
  },

  // Spices
  {
    name: 'Turmeric Powder',
    quantity: 15,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 5,
    cost: 200
  },
  {
    name: 'Red Chili Powder',
    quantity: 15,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 5,
    cost: 300
  },
  {
    name: 'Coriander Powder',
    quantity: 15,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 5,
    cost: 250
  },
  {
    name: 'Cumin Seeds',
    quantity: 10,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 3,
    cost: 220
  },
  {
    name: 'Mustard Seeds',
    quantity: 8,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 2,
    cost: 180
  },
  {
    name: 'Garam Masala',
    quantity: 5,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 1,
    cost: 350
  },
  {
    name: 'Black Pepper',
    quantity: 5,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 1,
    cost: 400
  },
  {
    name: 'Cardamom',
    quantity: 2,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 0.5,
    cost: 600
  },
  {
    name: 'Cloves',
    quantity: 2,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 0.5,
    cost: 550
  },
  {
    name: 'Cinnamon',
    quantity: 2,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 0.5,
    cost: 500
  },
  {
    name: 'Fenugreek Seeds',
    quantity: 3,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 1,
    cost: 300
  },
  {
    name: 'Asafoetida (Hing)',
    quantity: 1,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 0.2,
    cost: 250
  },
  {
    name: 'Curry Leaves',
    quantity: 1,
    unit: 'kg',
    expirationDate: '2025-04-10',
    category: 'spices',
    minQuantity: 0.2,
    cost: 100
  },
  {
    name: 'Bay Leaves',
    quantity: 1,
    unit: 'kg',
    expirationDate: '2026-06-01',
    category: 'spices',
    minQuantity: 0.2,
    cost: 150
  },

  // Condiments
  {
    name: 'Salt',
    quantity: 100,
    unit: 'kg',
    expirationDate: '2026-12-31',
    category: 'condiments',
    minQuantity: 30,
    cost: 20
  },
  {
    name: 'Sugar',
    quantity: 100,
    unit: 'kg',
    expirationDate: '2026-12-31',
    category: 'condiments',
    minQuantity: 30,
    cost: 40
  },
  {
    name: 'Tamarind',
    quantity: 10,
    unit: 'kg',
    expirationDate: '2025-10-01',
    category: 'condiments',
    minQuantity: 3,
    cost: 300
  },
  {
    name: 'Vinegar',
    quantity: 20,
    unit: 'liters',
    expirationDate: '2026-12-31',
    category: 'condiments',
    minQuantity: 5,
    cost: 100
  },
  {
    name: 'Soy Sauce',
    quantity: 10,
    unit: 'liters',
    expirationDate: '2026-12-31',
    category: 'condiments',
    minQuantity: 3,
    cost: 500
  },
  {
    name: 'Tomato Ketchup',
    quantity: 15,
    unit: 'liters',
    expirationDate: '2026-12-31',
    category: 'condiments',
    minQuantity: 5,
    cost: 400
  },

  // Oils & Fats
  {
    name: 'Vegetable Oil',
    quantity: 200,
    unit: 'liters',
    expirationDate: '2025-10-01',
    category: 'oils & fats',
    minQuantity: 50,
    cost: 180
  },
  {
    name: 'Mustard Oil',
    quantity: 100,
    unit: 'liters',
    expirationDate: '2025-10-01',
    category: 'oils & fats',
    minQuantity: 30,
    cost: 220
  },
  {
    name: 'Ghee',
    quantity: 50,
    unit: 'kg',
    expirationDate: '2025-10-01',
    category: 'oils & fats',
    minQuantity: 15,
    cost: 350
  },

  // Beverages
  {
    name: 'Tea Leaves',
    quantity: 30,
    unit: 'kg',
    expirationDate: '2026-01-01',
       category: 'beverages',
    minQuantity: 10,
    cost: 500
  },
  {
    name: 'Coffee Beans',
    quantity: 20,
    unit: 'kg',
    expirationDate: '2026-01-01',
    category: 'beverages',
    minQuantity: 5,
    cost: 800
  },
  {
    name: 'Soft Drinks',
    quantity: 100,
    unit: 'liters',
    expirationDate: '2025-12-31',
    category: 'beverages',
    minQuantity: 30,
    cost: 100
  },
  {
    name: 'Mineral Water',
    quantity: 200,
    unit: 'liters',
    expirationDate: '2026-12-31',
    category: 'beverages',
    minQuantity: 50,
    cost: 50
  },
  {
    name: 'Fruit Juice',
    quantity: 50,
    unit: 'liters',
    expirationDate: '2025-12-31',
    category: 'beverages',
    minQuantity: 15,
    cost: 150
  }
];

export const inventoryService = {
  getAllItems: (): InventoryItem[] => {
    const items = localStorage.getItem(STORAGE_KEY);
    console.log('Getting all items:', items ? JSON.parse(items).length : 0, 'items found');
    return items ? JSON.parse(items) : [];
  },

  initializeInventory: () => {
    // Force reinitialization for testing
    localStorage.removeItem(STORAGE_KEY);
    console.log('Initializing inventory...');
    const items = initialInventory.map(item => ({
      ...item,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    console.log('Inventory initialized with', items.length, 'items');
  },

  addItem: (item: Omit<InventoryItem, 'id'>): InventoryItem => {
    const items = inventoryService.getAllItems();
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, newItem]));
    return newItem;
  },

  updateItem: (item: InventoryItem): InventoryItem => {
    const items = inventoryService.getAllItems();
    const updatedItems = items.map(i => i.id === item.id ? item : i);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    return item;
  },

  deleteItem: (id: string): void => {
    const items = inventoryService.getAllItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  },

  getLowStockItems: (): InventoryItem[] => {
    return inventoryService.getAllItems().filter(
      item => item.minQuantity && item.quantity <= item.minQuantity
    );
  },

  getExpiringSoonItems: (daysThreshold: number): InventoryItem[] => {
    const items = inventoryService.getAllItems();
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(currentDate.getDate() + daysThreshold);

    return items.filter(item => {
      const expirationDate = new Date(item.expirationDate);
      return expirationDate <= thresholdDate;
    });
  }
}; 