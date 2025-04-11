import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyD9CBq0lNpsM3Bj1mSoElulK6PViD8EZpY');

export interface WastePrediction {
  totalWasteCost: string;
  trend: 'up' | 'down';
  trendPercentage: string;
  highRiskItems: {
    name: string;
    expiryDays: number;
    quantity: string;
    potentialLoss: string;
  }[];
  wasteByCategory: {
    category: string;
    amount: string;
    percentage: string;
  }[];
  recommendations: string[];
}

export const wastePredictionService = {
  generatePrediction: async (): Promise<WastePrediction> => {
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

      const prompt = `Generate waste predictions for a restaurant based on this data:
      {
        "current_inventory": {
          "vegetables": { "value": "₹15000", "shelf_life": "5-7 days" },
          "meat": { "value": "₹25000", "shelf_life": "3-5 days" },
          "dairy": { "value": "₹10000", "shelf_life": "7-10 days" },
          "grains": { "value": "₹8000", "shelf_life": "30-60 days" }
        },
        "last_month_waste": {
          "total": "₹2700",
          "by_category": {
            "vegetables": "₹1200",
            "meat": "₹800",
            "dairy": "₹500",
            "grains": "₹200"
          }
        }
      }

      Return ONLY a JSON object with this EXACT structure (no additional text):
      {
        "totalWasteCost": "amount in ₹",
        "trend": "up or down",
        "trendPercentage": "percentage with % symbol",
        "highRiskItems": [
          {
            "name": "item name",
            "expiryDays": number,
            "quantity": "amount with unit",
            "potentialLoss": "amount in ₹"
          }
        ],
        "wasteByCategory": [
          {
            "category": "category name",
            "amount": "amount in ₹",
            "percentage": "percentage of total waste"
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
      console.error('Error generating waste prediction:', error);
      // Return synthetic data as fallback
      return {
        totalWasteCost: "₹2,500",
        trend: "down",
        trendPercentage: "8%",
        highRiskItems: [
          {
            name: "Fresh Vegetables",
            expiryDays: 2,
            quantity: "5 kg",
            potentialLoss: "₹600"
          },
          {
            name: "Chicken",
            expiryDays: 1,
            quantity: "3 kg",
            potentialLoss: "₹450"
          },
          {
            name: "Milk",
            expiryDays: 3,
            quantity: "4 L",
            potentialLoss: "₹200"
          }
        ],
        wasteByCategory: [
          {
            category: "Vegetables",
            amount: "₹1,000",
            percentage: "40%"
          },
          {
            category: "Meat",
            amount: "₹750",
            percentage: "30%"
          },
          {
            category: "Dairy",
            amount: "₹500",
            percentage: "20%"
          },
          {
            category: "Grains",
            amount: "₹250",
            percentage: "10%"
          }
        ],
        recommendations: [
          "Use FIFO method for vegetable storage",
          "Adjust meat order quantities based on weekday demand",
          "Monitor dairy product temperatures closely",
          "Implement daily stock checks for high-risk items"
        ]
      };
    }
  }
}; 