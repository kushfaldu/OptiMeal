import numpy as np
import pandas as pd
from pulp import *
import json
from datetime import datetime
import os

class MenuOptimizer:
    def __init__(self):
        """Initialize the menu optimization system"""
        self.recipes = {}
        self.costs = {}
        self.constraints = {}
        
    def load_data(self, recipe_file, cost_file):
        """
        Load recipe and cost data
        
        Args:
            recipe_file (str): Path to recipe JSON file
            cost_file (str): Path to cost JSON file
        """
        # Load recipes
        with open(recipe_file, 'r') as f:
            self.recipes = json.load(f)
            
        # Load costs
        with open(cost_file, 'r') as f:
            self.costs = json.load(f)
            
    def calculate_recipe_cost(self, recipe):
        """
        Calculate the cost of a recipe
        
        Args:
            recipe (dict): Recipe data
            
        Returns:
            float: Total cost of the recipe
        """
        total_cost = 0
        
        for ingredient, amount in recipe['ingredients'].items():
            if ingredient in self.costs:
                unit_cost = self.costs[ingredient]['cost_per_unit']
                total_cost += amount * unit_cost
                
        # Add overhead costs
        total_cost *= (1 + recipe.get('overhead_percentage', 0.2))
        
        return total_cost
        
    def optimize_prices(self, min_profit_margin=0.3, max_price_change=0.2):
        """
        Optimize menu prices using linear programming
        
        Args:
            min_profit_margin (float): Minimum required profit margin
            max_price_change (float): Maximum allowed price change
            
        Returns:
            dict: Optimized prices and metrics
        """
        # Create optimization problem
        prob = LpProblem("Menu_Price_Optimization", LpMaximize)
        
        # Decision variables (new prices)
        prices = LpVariable.dicts(
            "price",
            self.recipes.keys(),
            lowBound=0
        )
        
        # Objective: Maximize total profit
        total_profit = lpSum([
            prices[recipe_id] * recipe['expected_sales'] -
            self.calculate_recipe_cost(recipe) * recipe['expected_sales']
            for recipe_id, recipe in self.recipes.items()
        ])
        prob += total_profit
        
        # Constraints
        for recipe_id, recipe in self.recipes.items():
            cost = self.calculate_recipe_cost(recipe)
            current_price = recipe['current_price']
            
            # Minimum profit margin
            prob += prices[recipe_id] >= cost * (1 + min_profit_margin)
            
            # Maximum price change
            prob += prices[recipe_id] <= current_price * (1 + max_price_change)
            prob += prices[recipe_id] >= current_price * (1 - max_price_change)
            
        # Solve problem
        prob.solve()
        
        # Prepare results
        results = {
            'optimization_date': datetime.now().isoformat(),
            'status': LpStatus[prob.status],
            'total_profit': value(total_profit),
            'prices': {}
        }
        
        for recipe_id in self.recipes.keys():
            results['prices'][recipe_id] = {
                'old_price': self.recipes[recipe_id]['current_price'],
                'new_price': value(prices[recipe_id]),
                'cost': self.calculate_recipe_cost(self.recipes[recipe_id]),
                'profit_margin': (value(prices[recipe_id]) - 
                                self.calculate_recipe_cost(self.recipes[recipe_id])) /
                               self.calculate_recipe_cost(self.recipes[recipe_id])
            }
            
        return results
        
    def analyze_costs(self):
        """
        Analyze cost structure of menu items
        
        Returns:
            dict: Cost analysis results
        """
        analysis = {
            'analysis_date': datetime.now().isoformat(),
            'recipes': {}
        }
        
        for recipe_id, recipe in self.recipes.items():
            # Calculate costs
            ingredient_costs = {}
            total_ingredient_cost = 0
            
            for ingredient, amount in recipe['ingredients'].items():
                if ingredient in self.costs:
                    cost = amount * self.costs[ingredient]['cost_per_unit']
                    ingredient_costs[ingredient] = cost
                    total_ingredient_cost += cost
                    
            # Calculate metrics
            overhead_cost = total_ingredient_cost * recipe.get('overhead_percentage', 0.2)
            total_cost = total_ingredient_cost + overhead_cost
            current_price = recipe['current_price']
            profit_margin = (current_price - total_cost) / total_cost
            
            analysis['recipes'][recipe_id] = {
                'name': recipe['name'],
                'total_cost': total_cost,
                'ingredient_costs': ingredient_costs,
                'overhead_cost': overhead_cost,
                'current_price': current_price,
                'profit_margin': profit_margin,
                'cost_breakdown_percentage': {
                    ingredient: (cost / total_cost) * 100
                    for ingredient, cost in ingredient_costs.items()
                }
            }
            
        return analysis
        
    def suggest_cost_reductions(self, target_margin=0.3):
        """
        Suggest ways to reduce costs
        
        Args:
            target_margin (float): Target profit margin
            
        Returns:
            dict: Cost reduction suggestions
        """
        suggestions = {
            'analysis_date': datetime.now().isoformat(),
            'recipes': {}
        }
        
        for recipe_id, recipe in self.recipes.items():
            current_cost = self.calculate_recipe_cost(recipe)
            current_price = recipe['current_price']
            current_margin = (current_price - current_cost) / current_cost
            
            if current_margin < target_margin:
                # Analyze ingredient costs
                ingredient_costs = []
                for ingredient, amount in recipe['ingredients'].items():
                    if ingredient in self.costs:
                        cost = amount * self.costs[ingredient]['cost_per_unit']
                        ingredient_costs.append({
                            'ingredient': ingredient,
                            'cost': cost,
                            'amount': amount,
                            'unit_cost': self.costs[ingredient]['cost_per_unit']
                        })
                
                # Sort by cost
                ingredient_costs.sort(key=lambda x: x['cost'], reverse=True)
                
                suggestions['recipes'][recipe_id] = {
                    'name': recipe['name'],
                    'current_margin': current_margin,
                    'target_margin': target_margin,
                    'cost_reduction_needed': current_cost * (target_margin - current_margin),
                    'high_cost_ingredients': ingredient_costs[:3],
                    'suggestions': [
                        f"Consider reducing {ing['ingredient']} amount by 10-15%"
                        for ing in ingredient_costs[:3]
                    ]
                }
                
        return suggestions
        
    def export_analysis(self, analysis, output_path='cost_analysis.json'):
        """
        Export cost analysis to JSON file
        
        Args:
            analysis (dict): Analysis results
            output_path (str): Path to save the analysis
        """
        with open(output_path, 'w') as f:
            json.dump(analysis, f, indent=4)

def main():
    # Initialize optimizer
    optimizer = MenuOptimizer()
    
    try:
        # Load data
        optimizer.load_data('recipes.json', 'costs.json')
        
        # Optimize prices
        results = optimizer.optimize_prices()
        print(f"Optimization status: {results['status']}")
        print(f"Total profit: {results['total_profit']:.2f}")
        
        # Analyze costs
        analysis = optimizer.analyze_costs()
        print(f"Analyzed costs for {len(analysis['recipes'])} recipes")
        
        # Get cost reduction suggestions
        suggestions = optimizer.suggest_cost_reductions()
        print(f"Generated suggestions for {len(suggestions['recipes'])} recipes")
        
        # Export results
        optimizer.export_analysis({
            'optimization': results,
            'analysis': analysis,
            'suggestions': suggestions
        })
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 