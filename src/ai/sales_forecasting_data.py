import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json

def generate_sales_data():
    # Base parameters
    base_sales = 45000  # Base daily sales
    daily_variation = 0.2  # 20% variation
    weekly_pattern = [0.8, 0.9, 1.0, 0.95, 1.2, 1.3, 1.1]  # Weekly pattern multipliers
    
    # Generate daily sales for a week
    daily_predictions = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for i, day in enumerate(days):
        # Calculate sales with weekly pattern and random variation
        base = base_sales * weekly_pattern[i]
        variation = np.random.uniform(-daily_variation, daily_variation)
        sales = base * (1 + variation)
        
        # Add confidence level (higher for closer days)
        confidence = 90 - (i * 0.7) + np.random.uniform(-2, 2)
        
        daily_predictions.append({
            "date": day,
            "revenue": round(sales),
            "confidence": round(confidence, 1)
        })

    # Calculate trend
    last_week_total = 320000  # Simulated last week's total
    this_week_total = sum(pred["revenue"] for pred in daily_predictions)
    trend_percentage = ((this_week_total - last_week_total) / last_week_total) * 100

    # Generate synthetic data
    forecast_data = {
        "predictedRevenue": f"₹{round(this_week_total):,}",
        "trend": "up" if trend_percentage > 0 else "down",
        "trendPercentage": f"{abs(round(trend_percentage, 1))}%",
        "dailyPredictions": daily_predictions,
        "peakHours": ["7:00 PM", "8:00 PM", "1:00 PM"],
        "recommendations": [
            "Increase staff during predicted peak hours (7-8 PM)",
            "Stock up on popular items before weekend rush",
            "Consider lunch hour promotions to boost afternoon sales",
            "Optimize kitchen prep time for weekend service"
        ]
    }
    
    return forecast_data

if __name__ == "__main__":
    # Generate data
    data = generate_sales_data()
    
    # Save to JSON file
    with open('sales_forecast.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Generated sales forecast data:")
    print(json.dumps(data, indent=2)) 