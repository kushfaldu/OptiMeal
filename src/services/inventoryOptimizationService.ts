import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyD9CBq0lNpsM3Bj1mSoElulK6PViD8EZpY');

export interface InventoryOptimization {
  efficiencyScore: string;
  trend: 'up' | 'down';
  trendPercentage: string;
  stockLevels: {
    item: string;
    currentStock: string;
    optimalStock: string;
    status: 'low' | 'optimal' | 'excess';
    action: string;
  }[];
  reorderSuggestions: {
    item: string;
    quantity: string;
    urgency: 'high' | 'medium' | 'low';
    estimatedCost: string;
  }[];
  recommendations: string[];
}

export const inventoryOptimizationService = {
  generateOptimization: async (): Promise<InventoryOptimization> => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      });

      const prompt = `Generate inventory optimization insights for a restaurant based on this data:
      {
        "current_inventory": {
          "rice": { "stock": "25 kg", "optimal": "30 kg", "cost": "₹2500" },
          "chicken": { "stock": "8 kg", "optimal": "15 kg", "cost": "₹1600" },
          "vegetables": { "stock": "20 kg", "optimal": "18 kg", "cost": "₹1000" },
          "spices": { "stock": "5 kg", "optimal": "4 kg", "cost": "₹2000" }
        },
        "daily_usage": {
          "rice": "5 kg",
          "chicken": "4 kg",
          "vegetables": "6 kg",
          "spices": "0.5 kg"
        },
        "last_week_efficiency": 87
      }

      Return ONLY a JSON object with this EXACT structure (no additional text):
      {
        "efficiencyScore": "percentage",
        "trend": "up or down",
        "trendPercentage": "percentage with % symbol",
        "stockLevels": [
          {
            "item": "item name",
            "currentStock": "amount with unit",
            "optimalStock": "amount with unit",
            "status": "low or optimal or excess",
            "action": "action needed"
          }
        ],
        "reorderSuggestions": [
          {
            "item": "item name",
            "quantity": "amount with unit",
            "urgency": "high or medium or low",
            "estimatedCost": "amount in ₹"
          }
        ],
        "recommendations": ["actionable recommendations"]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse the response
      const cleanedText = text.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating inventory optimization:', error);
      // Return synthetic data as fallback
      return {
        efficiencyScore: "92%",
        trend: "up",
        trendPercentage: "5%",
        stockLevels: [
          {
            item: "Rice",
            currentStock: "25 kg",
            optimalStock: "30 kg",
            status: "low",
            action: "Reorder needed within 2 days"
          },
          {
            item: "Chicken",
            currentStock: "8 kg",
            optimalStock: "15 kg",
            status: "low",
            action: "Immediate reorder required"
          },
          {
            item: "Vegetables",
            currentStock: "20 kg",
            optimalStock: "18 kg",
            status: "excess",
            action: "Use in daily specials"
          },
          {
            item: "Spices",
            currentStock: "5 kg",
            optimalStock: "4 kg",
            status: "optimal",
            action: "Maintain current level"
          }
        ],
        reorderSuggestions: [
          {
            item: "Chicken",
            quantity: "10 kg",
            urgency: "high",
            estimatedCost: "₹2,000"
          },
          {
            item: "Rice",
            quantity: "15 kg",
            urgency: "medium",
            estimatedCost: "₹1,500"
          }
        ],
        recommendations: [
          "Place chicken order immediately",
          "Schedule rice reorder for tomorrow",
          "Use excess vegetables in promotions",
          "Review stock levels daily for high-usage items"
        ]
      };
    }
  }
}; 