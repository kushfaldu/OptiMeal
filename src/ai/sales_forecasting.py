import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import json
from datetime import datetime, timedelta
import joblib
import os

class SalesForecaster:
    def __init__(self, model_dir='models'):
        """
        Initialize the sales forecasting system
        
        Args:
            model_dir (str): Directory to store trained models
        """
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.models = {}
        
    def prepare_data(self, sales_data):
        """
        Prepare sales data for Prophet model
        
        Args:
            sales_data (pd.DataFrame): DataFrame with 'date' and 'sales' columns
            
        Returns:
            pd.DataFrame: Prepared data for Prophet
        """
        df = sales_data.copy()
        df.columns = ['ds', 'y']  # Prophet requires these column names
        return df
        
    def train_model(self, item_name, sales_data, 
                   seasonality_mode='multiplicative',
                   save_model=True):
        """
        Train a Prophet model for an item
        
        Args:
            item_name (str): Name of the item
            sales_data (pd.DataFrame): Historical sales data
            seasonality_mode (str): Seasonality mode for Prophet
            save_model (bool): Whether to save the trained model
            
        Returns:
            dict: Training metrics
        """
        # Prepare data
        df = self.prepare_data(sales_data)
        
        # Create and train model
        model = Prophet(
            seasonality_mode=seasonality_mode,
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True
        )
        
        model.add_country_holidays(country_name='IN')
        model.fit(df)
        
        # Save model
        if save_model:
            model_path = os.path.join(self.model_dir, f"{item_name}_model.pkl")
            with open(model_path, 'wb') as f:
                joblib.dump(model, f)
        
        self.models[item_name] = model
        
        # Calculate metrics
        forecast = model.predict(df)
        metrics = {
            'mae': mean_absolute_error(df['y'], forecast['yhat']),
            'rmse': np.sqrt(mean_squared_error(df['y'], forecast['yhat'])),
            'training_date': datetime.now().isoformat()
        }
        
        return metrics
        
    def load_model(self, item_name):
        """
        Load a trained model for an item
        
        Args:
            item_name (str): Name of the item
            
        Returns:
            Prophet: Loaded model
        """
        model_path = os.path.join(self.model_dir, f"{item_name}_model.pkl")
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model = joblib.load(f)
            self.models[item_name] = model
            return model
        else:
            raise FileNotFoundError(f"No trained model found for {item_name}")
            
    def forecast_sales(self, item_name, days=30, return_components=False):
        """
        Generate sales forecast for an item
        
        Args:
            item_name (str): Name of the item
            days (int): Number of days to forecast
            return_components (bool): Whether to return seasonal components
            
        Returns:
            dict: Forecast results
        """
        if item_name not in self.models:
            self.load_model(item_name)
            
        model = self.models[item_name]
        
        # Create future dates
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # Prepare results
        results = {
            'forecast_date': datetime.now().isoformat(),
            'item_name': item_name,
            'forecast_days': days,
            'predictions': []
        }
        
        # Add predictions
        for i in range(-days, days):  # Include some historical data
            date = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
            row = forecast[forecast['ds'].dt.strftime('%Y-%m-%d') == date].iloc[0]
            
            prediction = {
                'date': date,
                'sales': float(row['yhat']),
                'lower_bound': float(row['yhat_lower']),
                'upper_bound': float(row['yhat_upper'])
            }
            
            if return_components:
                prediction.update({
                    'trend': float(row['trend']),
                    'yearly': float(row['yearly']) if 'yearly' in row else 0,
                    'weekly': float(row['weekly']) if 'weekly' in row else 0,
                    'daily': float(row['daily']) if 'daily' in row else 0
                })
                
            results['predictions'].append(prediction)
            
        return results
        
    def analyze_seasonality(self, item_name):
        """
        Analyze seasonal patterns in sales
        
        Args:
            item_name (str): Name of the item
            
        Returns:
            dict: Seasonality analysis results
        """
        if item_name not in self.models:
            self.load_model(item_name)
            
        model = self.models[item_name]
        
        # Generate seasonal components
        seasonal_components = {
            'yearly': model.yearly_seasonality,
            'weekly': model.weekly_seasonality,
            'daily': model.daily_seasonality
        }
        
        return {
            'item_name': item_name,
            'analysis_date': datetime.now().isoformat(),
            'seasonal_components': seasonal_components
        }
        
    def export_forecasts(self, forecasts, output_path='forecasts.json'):
        """
        Export forecasts to JSON file
        
        Args:
            forecasts (dict): Dictionary of forecasts by item
            output_path (str): Path to save the forecasts
        """
        with open(output_path, 'w') as f:
            json.dump(forecasts, f, indent=4)

def main():
    # Example usage
    forecaster = SalesForecaster()
    
    try:
        # Example: Generate sample data
        dates = pd.date_range(start='2023-01-01', end='2024-03-20', freq='D')
        sales = np.random.normal(100, 20, size=len(dates))
        sales_data = pd.DataFrame({'date': dates, 'sales': sales})
        
        # Train model
        item_name = 'sample_item'
        metrics = forecaster.train_model(item_name, sales_data)
        print(f"Training metrics: {metrics}")
        
        # Generate forecast
        forecast = forecaster.forecast_sales(item_name, days=30, return_components=True)
        print(f"Generated forecast for next {forecast['forecast_days']} days")
        
        # Analyze seasonality
        seasonality = forecaster.analyze_seasonality(item_name)
        print(f"Seasonality analysis: {seasonality}")
        
        # Export results
        forecaster.export_forecasts({item_name: forecast}, 'sample_forecast.json')
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 