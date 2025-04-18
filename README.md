# Smart Restaurant Management System

An AI-powered restaurant management system that combines computer vision, natural language processing, and machine learning to optimize restaurant operations.

## Features

### 1. Inventory Management
- Real-time inventory tracking using computer vision
- Smart stock level monitoring and alerts
- Automated inventory counts using YOLO object detection
- Spoilage detection and waste prevention

### 2. AI-Powered Recipe Management
- Custom dish generation based on available ingredients
- Recipe recommendations using NLP
- Ingredient substitution suggestions
- Weekly menu planning optimization

### 3. Sales and Demand Forecasting
- Time series analysis for sales prediction
- Seasonal trend analysis
- Demand-based inventory optimization
- Dynamic pricing recommendations

### 4. Waste Management and Cost Optimization
- Predictive waste analysis
- Cost optimization for menu pricing
- Ingredient usage optimization
- Profit margin analysis and suggestions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-restaurant-management.git
cd smart-restaurant-management
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Optional: For GPU support, uncomment and install CUDA packages in requirements.txt

## Project Structure

```
smart-restaurant-management/
├── src/
│   ├── ai/
│   │   ├── sales_forecasting.py
│   │   ├── waste_prediction.py
│   │   └── inventory_replenishment.py
│   ├── menu/
│   │   ├── recipe_recommendation.py
│   │   ├── custom_dish_generator.py
│   │   └── cost_optimization.py
│   └── vision/
│       ├── inventory_tracking.py
│       └── spoilage_detection.py
├── models/
│   └── fine_tuned/
├── data/
│   ├── recipes/
│   └── inventory/
├── requirements.txt
└── README.md
```

## Usage

### Custom Dish Generator
```python
from src.menu.custom_dish_generator import DishGenerator

# Initialize generator
generator = DishGenerator()

# Generate recipes with available ingredients
recipes = generator.generate_recipe(
    ingredients=['chicken', 'tomatoes', 'onions', 'garlic', 'rice'],
    cuisine_type='Asian fusion',
    num_return_sequences=3
)

# Save generated recipes
generator.save_recipes(recipes)
```

### Sales Forecasting
```python
from src.ai.sales_forecasting import SalesForecaster

forecaster = SalesForecaster()
predictions = forecaster.forecast_sales(days=30)
```

### Waste Prediction
```python
from src.ai.waste_prediction import WastePredictor

predictor = WastePredictor()
waste_forecast = predictor.predict_waste(inventory_data)
```

## Model Training

### Fine-tuning Recipe Generator
```python
# Prepare training data
training_data = [
    {
        "name": "Spicy Chicken Stir-Fry",
        "description": "A flavorful Asian-inspired dish",
        "ingredients": {
            "chicken breast": "500g",
            "bell peppers": "2",
            "onion": "1 large"
        },
        "instructions": [
            "Cut chicken into strips",
            "Stir-fry vegetables",
            "Combine and season"
        ]
    }
    # ... more recipes
]

# Fine-tune model
generator = DishGenerator()
generator.fine_tune(training_data, epochs=3)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PyTorch team for the deep learning framework
- Hugging Face for transformer models
- Ultralytics for YOLO implementation

## Contact

For questions and support, please open an issue in the GitHub repository. #   O p t i M e a l 
 
 #   O p t i M e a l 
 
 