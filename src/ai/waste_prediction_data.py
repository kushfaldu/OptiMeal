import numpy as np
import json
from datetime import datetime, timedelta

def generate_waste_data():
    # Base parameters
    categories = ["Vegetables", "Meat", "Dairy", "Grains"]
    base_waste = 2500  # Base total waste in rupees
    
    # Generate waste by category
    waste_by_category = []
    remaining_percentage = 100
    remaining_amount = base_waste
    
    for i, category in enumerate(categories[:-1]):
        # Generate random percentage for each category
        if i == len(categories) - 2:
            percentage = remaining_percentage
        else:
            percentage = np.random.randint(20, min(50, remaining_percentage))
            remaining_percentage -= percentage
        
        amount = round((percentage / 100) * base_waste)
        remaining_amount -= amount
        
        waste_by_category.append({
            "category": category,
            "amount": f"₹{amount:,}",
            "percentage": f"{percentage}%"
        })
    
    # Add last category with remaining amount
    waste_by_category.append({
        "category": categories[-1],
        "amount": f"₹{remaining_amount:,}",
        "percentage": f"{remaining_percentage}%"
    })
    
    # Generate high-risk items
    high_risk_items = [
        {
            "name": "Fresh Vegetables",
            "expiryDays": 2,
            "quantity": "5 kg",
            "potentialLoss": "₹600"
        },
        {
            "name": "Chicken",
            "expiryDays": 1,
            "quantity": "3 kg",
            "potentialLoss": "₹450"
        },
        {
            "name": "Milk",
            "expiryDays": 3,
            "quantity": "4 L",
            "potentialLoss": "₹200"
        }
    ]
    
    # Calculate trend (simulating improvement)
    last_month_waste = 2700
    trend_percentage = ((base_waste - last_month_waste) / last_month_waste) * 100
    
    # Generate synthetic data
    waste_data = {
        "totalWasteCost": f"₹{base_waste:,}",
        "trend": "down",  # Assuming improvement
        "trendPercentage": f"{abs(round(trend_percentage, 1))}%",
        "highRiskItems": high_risk_items,
        "wasteByCategory": waste_by_category,
        "recommendations": [
            "Use FIFO method for vegetable storage",
            "Adjust meat order quantities based on weekday demand",
            "Monitor dairy product temperatures closely",
            "Implement daily stock checks for high-risk items"
        ]
    }
    
    return waste_data

if __name__ == "__main__":
    # Generate data
    data = generate_waste_data()
    
    # Save to JSON file
    with open('waste_prediction.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Generated waste prediction data:")
    print(json.dumps(data, indent=2)) 