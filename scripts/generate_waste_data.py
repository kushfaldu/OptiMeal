import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import uuid
import os

# Set random seed for reproducibility
np.random.seed(42)

# Define constants
START_DATE = datetime.now() - timedelta(days=90)
END_DATE = datetime.now()
NUM_RECORDS = 300

# Sample data
INVENTORY_ITEMS = [
    {"id": "INV001", "name": "Tomatoes", "category": "produce", "unit": "kg", "unit_cost": 5.00},
    {"id": "INV002", "name": "Chicken Breast", "category": "meat", "unit": "kg", "unit_cost": 15.00},
    {"id": "INV003", "name": "Milk", "category": "dairy", "unit": "L", "unit_cost": 3.50},
    {"id": "INV004", "name": "Bread", "category": "bakery", "unit": "units", "unit_cost": 2.50},
    {"id": "INV005", "name": "Lettuce", "category": "produce", "unit": "kg", "unit_cost": 4.00},
    {"id": "INV006", "name": "Cheese", "category": "dairy", "unit": "kg", "unit_cost": 12.00},
    {"id": "INV007", "name": "Fish", "category": "seafood", "unit": "kg", "unit_cost": 20.00},
    {"id": "INV008", "name": "Rice", "category": "dry goods", "unit": "kg", "unit_cost": 2.00},
    {"id": "INV009", "name": "Eggs", "category": "dairy", "unit": "dozen", "unit_cost": 4.50},
    {"id": "INV010", "name": "Carrots", "category": "produce", "unit": "kg", "unit_cost": 3.00},
]

REASONS = [
    "expired", "spoiled", "damaged", "overproduction", "quality_issues",
    "storage_error", "preparation_waste", "returned_by_customer"
]

DISPOSAL_METHODS = ["compost", "trash", "recycled", "donated"]

STAFF_MEMBERS = [
    "John Smith", "Jane Doe", "Mike Johnson", "Sarah Williams",
    "David Brown", "Emily Davis", "Chris Wilson", "Lisa Anderson"
]

LOCATIONS = ["kitchen", "storage", "prep area", "receiving", "display"]

def generate_waste_data():
    data = []
    
    # Generate dates with more entries on weekends
    dates = []
    current_date = START_DATE
    while current_date <= END_DATE:
        # Add more entries for weekends
        num_entries = np.random.randint(2, 6) if current_date.weekday() >= 5 else np.random.randint(1, 4)
        dates.extend([current_date] * num_entries)
        current_date += timedelta(days=1)
    
    # Sort dates to ensure chronological order
    dates.sort()
    
    # Take only NUM_RECORDS entries
    dates = dates[:NUM_RECORDS]
    
    for date in dates:
        # Select a random item
        item = random.choice(INVENTORY_ITEMS)
        
        # Generate quantity with some variation based on item category
        base_quantity = np.random.uniform(0.5, 5.0)
        if item["category"] in ["meat", "seafood"]:
            quantity = base_quantity * 0.5  # Less waste for expensive items
        elif item["category"] in ["produce", "bakery"]:
            quantity = base_quantity * 1.5  # More waste for perishables
        else:
            quantity = base_quantity
            
        # Round quantity to 1 decimal place
        quantity = round(quantity, 1)
        
        # Calculate cost
        cost = round(quantity * item["unit_cost"], 2)
        
        # Generate record
        record = {
            "waste_id": f"W{str(uuid.uuid4())[:8]}",
            "date": date.strftime("%Y-%m-%d"),
            "item_id": item["id"],
            "item_name": item["name"],
            "quantity": quantity,
            "unit": item["unit"],
            "reason": random.choice(REASONS),
            "cost": cost,
            "category": item["category"],
            "disposal_method": random.choice(DISPOSAL_METHODS),
            "responsible_staff": random.choice(STAFF_MEMBERS),
            "location": random.choice(LOCATIONS)
        }
        data.append(record)
    
    return pd.DataFrame(data)

def ensure_directory_exists(file_path):
    directory = os.path.dirname(file_path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def main():
    try:
        # Generate the data
        df = generate_waste_data()
        
        # Sort by date
        df = df.sort_values('date')
        
        # Ensure the output directory exists
        output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'files', 'waste_management_data.csv')
        ensure_directory_exists(output_path)
        
        # Save to CSV
        df.to_csv(output_path, index=False)
        print(f"Generated {len(df)} waste management records and saved to {output_path}")
        
        # Print some basic statistics
        print("\nBasic Statistics:")
        print(f"Date Range: {df['date'].min()} to {df['date'].max()}")
        print(f"Total Waste Cost: ${df['cost'].sum():.2f}")
        print("\nWaste by Category:")
        print(df.groupby('category')['cost'].sum().sort_values(ascending=False))
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Please make sure you have the required packages installed (pandas and numpy)")
        print("You can install them using: pip install pandas numpy")

if __name__ == "__main__":
    main() 