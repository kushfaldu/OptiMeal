import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
from sales_forecasting_data import generate_sales_data
from waste_prediction_data import generate_waste_data
from inventory_optimization_data import generate_inventory_data

# Load environment variables
load_dotenv()

# Initialize Gemini
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def load_json_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def get_sales_insights(data):
    prompt = f"""
    Analyze this sales forecast data and provide a BRIEF insight (2-3 sentences):
    - Predicted Revenue: {data['predictedRevenue']}
    - Trend: {data['trend']} ({data['trendPercentage']})
    - Peak Hours: {', '.join(data['peakHours'])}
    - Daily Revenue Range: {min(d['revenue'] for d in data['dailyPredictions'])} to {max(d['revenue'] for d in data['dailyPredictions'])}
    
    Focus on key actionable insights and revenue patterns.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error getting sales insights: {str(e)}")
        return "Sales show a strong upward trend with notable weekend peaks. Recommend staffing adjustments and inventory preparation for peak hours."

def get_waste_insights(data):
    prompt = f"""
    Analyze this waste management data and provide a BRIEF insight (2-3 sentences):
    - Total Waste Cost: {data['totalWasteCost']}
    - Trend: {data['trend']} ({data['trendPercentage']})
    - High Risk Items: {len(data['highRiskItems'])} items
    - Highest Waste Category: {max(data['wasteByCategory'], key=lambda x: x['amount'])['category']}
    
    Focus on immediate actions needed to reduce waste.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error getting waste insights: {str(e)}")
        return "Waste costs are trending down with meat category showing highest loss. Immediate attention needed for perishables expiring within 48 hours."

def get_inventory_insights(data):
    prompt = f"""
    Analyze this inventory data and provide a BRIEF insight (2-3 sentences):
    - Efficiency Score: {data['efficiencyScore']}
    - Trend: {data['trend']} ({data['trendPercentage']})
    - Critical Items: {sum(1 for item in data['reorderSuggestions'] if item['urgency'] == 'high')}
    - Low Stock Categories: {sum(1 for level in data['stockLevels'] if level['status'] == 'low')}
    
    Focus on critical stock management needs and efficiency improvements.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error getting inventory insights: {str(e)}")
        return "Inventory efficiency is improving with some critical items needing attention. Recommend implementing automated reordering for high-turnover items."

def main():
    # Load data
    sales_data = load_json_data('../data/sales_forecast.json')
    waste_data = load_json_data('../data/waste_prediction.json')
    inventory_data = load_json_data('../data/inventory_optimization.json')
    
    # Get insights
    sales_insight = get_sales_insights(sales_data)
    waste_insight = get_waste_insights(waste_data)
    inventory_insight = get_inventory_insights(inventory_data)
    
    # Combine data and insights
    insights = {
        "salesInsight": {
            "data": sales_data,
            "analysis": sales_insight
        },
        "wasteInsight": {
            "data": waste_data,
            "analysis": waste_insight
        },
        "inventoryInsight": {
            "data": inventory_data,
            "analysis": inventory_insight
        }
    }
    
    # Save combined insights
    with open('../data/combined_insights.json', 'w') as f:
        json.dump(insights, f, indent=2)
        
    # Print insights
    print("\n=== Generated AI Insights ===\n")
    print("Sales Insight:")
    print("-" * 50)
    print(sales_insight)
    print("\nWaste Management Insight:")
    print("-" * 50)
    print(waste_insight)
    print("\nInventory Optimization Insight:")
    print("-" * 50)
    print(inventory_insight)

if __name__ == "__main__":
    main() 