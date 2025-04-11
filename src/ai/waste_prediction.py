import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
from datetime import datetime, timedelta
import os

class WastePredictor:
    def __init__(self, model_dir='models'):
        """
        Initialize the waste prediction system
        
        Args:
            model_dir (str): Directory to store trained models
        """
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.models = {}
        self.scalers = {}
        
    def prepare_features(self, data):
        """
        Prepare features for waste prediction
        
        Args:
            data (pd.DataFrame): Raw data with waste information
            
        Returns:
            tuple: X (features) and y (target)
        """
        # Extract temporal features
        df = data.copy()
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['day_of_month'] = pd.to_datetime(df['date']).dt.day
        
        # Define feature columns
        feature_cols = [
            'day_of_week', 'month', 'day_of_month',
            'inventory_level', 'sales_forecast', 'shelf_life_days'
        ]
        
        X = df[feature_cols]
        y = df['waste_amount']
        
        return X, y
        
    def train_model(self, item_name, training_data, save_model=True):
        """
        Train a waste prediction model for an item
        
        Args:
            item_name (str): Name of the item
            training_data (pd.DataFrame): Historical waste data
            save_model (bool): Whether to save the trained model
            
        Returns:
            dict: Training metrics
        """
        # Prepare features
        X, y = self.prepare_features(training_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42
        )
        
        model.fit(X_train_scaled, y_train)
        
        # Save model and scaler
        if save_model:
            model_path = os.path.join(self.model_dir, f"{item_name}_waste_model.pkl")
            scaler_path = os.path.join(self.model_dir, f"{item_name}_scaler.pkl")
            
            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)
        
        self.models[item_name] = model
        self.scalers[item_name] = scaler
        
        # Calculate metrics
        y_pred = model.predict(X_test_scaled)
        metrics = {
            'mae': mean_absolute_error(y_test, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
            'r2': r2_score(y_test, y_pred),
            'training_date': datetime.now().isoformat()
        }
        
        return metrics
        
    def load_model(self, item_name):
        """
        Load a trained model and scaler for an item
        
        Args:
            item_name (str): Name of the item
        """
        model_path = os.path.join(self.model_dir, f"{item_name}_waste_model.pkl")
        scaler_path = os.path.join(self.model_dir, f"{item_name}_scaler.pkl")
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            self.models[item_name] = joblib.load(model_path)
            self.scalers[item_name] = joblib.load(scaler_path)
        else:
            raise FileNotFoundError(f"No trained model found for {item_name}")
            
    def predict_waste(self, item_name, input_data):
        """
        Generate waste predictions for an item
        
        Args:
            item_name (str): Name of the item
            input_data (pd.DataFrame): Input data for prediction
            
        Returns:
            dict: Prediction results
        """
        if item_name not in self.models:
            self.load_model(item_name)
            
        # Prepare features
        X, _ = self.prepare_features(input_data)
        X_scaled = self.scalers[item_name].transform(X)
        
        # Make predictions
        predictions = self.models[item_name].predict(X_scaled)
        
        # Prepare results
        results = {
            'prediction_date': datetime.now().isoformat(),
            'item_name': item_name,
            'predictions': []
        }
        
        for i, pred in enumerate(predictions):
            results['predictions'].append({
                'date': input_data.iloc[i]['date'],
                'predicted_waste': float(pred),
                'inventory_level': float(input_data.iloc[i]['inventory_level']),
                'sales_forecast': float(input_data.iloc[i]['sales_forecast'])
            })
            
        return results
        
    def analyze_feature_importance(self, item_name):
        """
        Analyze feature importance for waste prediction
        
        Args:
            item_name (str): Name of the item
            
        Returns:
            dict: Feature importance analysis
        """
        if item_name not in self.models:
            self.load_model(item_name)
            
        model = self.models[item_name]
        
        # Get feature names
        feature_names = [
            'day_of_week', 'month', 'day_of_month',
            'inventory_level', 'sales_forecast', 'shelf_life_days'
        ]
        
        # Calculate importance
        importance = model.feature_importances_
        
        return {
            'item_name': item_name,
            'analysis_date': datetime.now().isoformat(),
            'feature_importance': {
                name: float(imp)
                for name, imp in zip(feature_names, importance)
            }
        }
        
    def export_predictions(self, predictions, output_path='waste_predictions.json'):
        """
        Export predictions to JSON file
        
        Args:
            predictions (dict): Dictionary of predictions by item
            output_path (str): Path to save the predictions
        """
        with open(output_path, 'w') as f:
            json.dump(predictions, f, indent=4)

def main():
    # Example usage
    predictor = WastePredictor()
    
    try:
        # Generate sample data
        dates = pd.date_range(start='2023-01-01', end='2024-03-20', freq='D')
        n_samples = len(dates)
        
        sample_data = pd.DataFrame({
            'date': dates,
            'inventory_level': np.random.uniform(50, 200, n_samples),
            'sales_forecast': np.random.uniform(20, 100, n_samples),
            'shelf_life_days': np.random.uniform(3, 14, n_samples),
            'waste_amount': np.random.uniform(0, 30, n_samples)
        })
        
        # Train model
        item_name = 'sample_item'
        metrics = predictor.train_model(item_name, sample_data)
        print(f"Training metrics: {metrics}")
        
        # Generate predictions
        future_dates = pd.date_range(
            start=datetime.now(),
            periods=30,
            freq='D'
        )
        
        future_data = pd.DataFrame({
            'date': future_dates,
            'inventory_level': np.random.uniform(50, 200, 30),
            'sales_forecast': np.random.uniform(20, 100, 30),
            'shelf_life_days': np.random.uniform(3, 14, 30),
            'waste_amount': np.zeros(30)  # Placeholder for prediction
        })
        
        predictions = predictor.predict_waste(item_name, future_data)
        print(f"Generated predictions for {len(predictions['predictions'])} days")
        
        # Analyze feature importance
        importance = predictor.analyze_feature_importance(item_name)
        print(f"Feature importance: {importance}")
        
        # Export results
        predictor.export_predictions({item_name: predictions})
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 