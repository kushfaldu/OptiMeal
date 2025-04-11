import numpy as np
import json
from datetime import datetime, timedelta

def generate_inventory_data():
    # Base parameters
    categories = ["Raw Materials", "Spices", "Beverages", "Packaging"]
    base_efficiency = 85  # Base efficiency score
    
    # Generate stock levels
    stock_levels = []
    for category in categories:
        # Generate random stock level between 20% and 90%
        level = np.random.randint(20, 90)
        status = "optimal" if 40 <= level <= 80 else ("low" if level < 40 else "high")
        
        stock_levels.append({
            "category": category,
            "currentLevel": f"{level}%",
            "status": status,
            "value": f"₹{np.random.randint(5000, 15000):,}"
        })
    
    # Generate reorder suggestions
    reorder_suggestions = [
        {
            "item": "Basmati Rice",
            "currentStock": "5 kg",
            "suggestedOrder": "25 kg",
            "urgency": "high"
        },
        {
            "item": "Cooking Oil",
            "currentStock": "10 L",
            "suggestedOrder": "20 L",
            "urgency": "medium"
        },
        {
            "item": "Tomatoes",
            "currentStock": "3 kg",
            "suggestedOrder": "10 kg",
            "urgency": "high"
        }
    ]
    
    # Calculate trend (simulating improvement)
    last_month_efficiency = 82
    trend_percentage = ((base_efficiency - last_month_efficiency) / last_month_efficiency) * 100
    
    # Generate synthetic data
    inventory_data = {
        "efficiencyScore": f"{base_efficiency}%",
        "trend": "up",  # Assuming improvement
        "trendPercentage": f"{abs(round(trend_percentage, 1))}%",
        "stockLevels": stock_levels,
        "reorderSuggestions": reorder_suggestions,
        "recommendations": [
            "Implement automatic reordering for high-turnover items",
            "Review storage conditions for perishables",
            "Optimize order quantities based on usage patterns",
            "Consider bulk purchasing for frequently used items"
        ]
    }
    
    return inventory_data

if __name__ == "__main__":
    # Generate data
    data = generate_inventory_data()
    
    # Save to JSON file
    with open('inventory_optimization.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Generated inventory optimization data:")
    print(json.dumps(data, indent=2)) 