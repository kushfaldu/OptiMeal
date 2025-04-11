import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyD9CBq0lNpsM3Bj1mSoElulK6PViD8EZpY');

export interface SalesForecast {
  predictedRevenue: string;
  trend: 'up' | 'down';
  trendPercentage: string;
  dailyPredictions: {
    date: string;
    revenue: number;
    confidence: number;
  }[];
  peakHours: string[];
  recommendations: string[];
}

export const salesForecastService = {
  generateForecast: async (): Promise<SalesForecast> => {
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

      const prompt = `Generate a detailed sales forecast for a restaurant based on this historical data:
      {
        "last_week_sales": {
          "monday": 38000,
          "tuesday": 42000,
          "wednesday": 45000,
          "thursday": 41000,
          "friday": 52000,
          "saturday": 58000,
          "sunday": 49000
        },
        "peak_hours": ["7:00 PM", "8:00 PM", "1:00 PM"],
        "popular_items": ["Butter Chicken", "Biryani", "Paneer Tikka", "Naan"]
      }

      Return ONLY a JSON object with this EXACT structure (no additional text):
      {
        "predictedRevenue": "total weekly revenue in ₹",
        "trend": "up or down",
        "trendPercentage": "percentage with % symbol",
        "dailyPredictions": [
          {
            "date": "day of week",
            "revenue": number,
            "confidence": number between 80 and 95
          }
        ],
        "peakHours": ["time slots"],
        "recommendations": ["actionable recommendations"]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse the response
      const cleanedText = text.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating sales forecast:', error);
      // Return synthetic data as fallback
      return {
        predictedRevenue: "₹325,000",
        trend: "up",
        trendPercentage: "12%",
        dailyPredictions: [
          { date: "Monday", revenue: 42000, confidence: 88 },
          { date: "Tuesday", revenue: 45000, confidence: 87 },
          { date: "Wednesday", revenue: 48000, confidence: 85 },
          { date: "Thursday", revenue: 44000, confidence: 86 },
          { date: "Friday", revenue: 55000, confidence: 89 },
          { date: "Saturday", revenue: 62000, confidence: 90 },
          { date: "Sunday", revenue: 52000, confidence: 85 }
        ],
        peakHours: ["7:00 PM", "8:00 PM", "1:00 PM"],
        recommendations: [
          "Increase staff during predicted peak hours",
          "Stock up on ingredients for popular items",
          "Consider happy hour promotions during off-peak hours",
          "Prepare more Butter Chicken and Biryani for weekends"
        ]
      };
    }
  }
}; 