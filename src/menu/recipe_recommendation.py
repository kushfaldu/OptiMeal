import numpy as np
import pandas as pd
from transformers import BertTokenizer, BertModel
import torch
import torch.nn as nn
from sklearn.metrics.pairwise import cosine_similarity
import json
from datetime import datetime, timedelta
import os

class RecipeEmbedding(nn.Module):
    def __init__(self, bert_model='bert-base-uncased'):
        """
        Initialize the recipe embedding model
        
        Args:
            bert_model (str): Name of the BERT model to use
        """
        super(RecipeEmbedding, self).__init__()
        self.bert = BertModel.from_pretrained(bert_model)
        self.tokenizer = BertTokenizer.from_pretrained(bert_model)
        
    def forward(self, text):
        """Generate embeddings for recipe text"""
        tokens = self.tokenizer(
            text,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors='pt'
        )
        
        outputs = self.bert(**tokens)
        return outputs.last_hidden_state[:, 0, :]  # Use [CLS] token

class RecipeRecommender:
    def __init__(self, model_dir='models', device=None):
        """
        Initialize the recipe recommendation system
        
        Args:
            model_dir (str): Directory to store models and data
            device (str): Device to run the model on ('cuda' or 'cpu')
        """
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Initialize embedding model
        self.embedding_model = RecipeEmbedding().to(self.device)
        self.embedding_model.eval()
        
        # Recipe database
        self.recipes = []
        self.recipe_embeddings = None
        
    def load_recipes(self, recipe_file):
        """
        Load recipes from JSON file
        
        Args:
            recipe_file (str): Path to recipe JSON file
        """
        with open(recipe_file, 'r') as f:
            self.recipes = json.load(f)
            
        # Generate embeddings for all recipes
        self._generate_recipe_embeddings()
        
    def _generate_recipe_embeddings(self):
        """Generate embeddings for all recipes in the database"""
        embeddings = []
        
        with torch.no_grad():
            for recipe in self.recipes:
                # Combine recipe information into text
                text = f"{recipe['name']} {recipe['description']} "
                text += " ".join(recipe['ingredients'])
                
                # Generate embedding
                embedding = self.embedding_model(text)
                embeddings.append(embedding.cpu().numpy())
                
        self.recipe_embeddings = np.vstack(embeddings)
        
    def find_similar_recipes(self, ingredients, top_k=5):
        """
        Find recipes similar to given ingredients
        
        Args:
            ingredients (list): List of available ingredients
            top_k (int): Number of recommendations to return
            
        Returns:
            list: Recommended recipes
        """
        # Generate query embedding
        query_text = " ".join(ingredients)
        with torch.no_grad():
            query_embedding = self.embedding_model(query_text)
            query_embedding = query_embedding.cpu().numpy()
            
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, self.recipe_embeddings)
        top_indices = similarities[0].argsort()[-top_k:][::-1]
        
        # Get recommendations
        recommendations = []
        for idx in top_indices:
            recipe = self.recipes[idx]
            recipe['similarity_score'] = float(similarities[0][idx])
            recommendations.append(recipe)
            
        return recommendations
        
    def recommend_recipes(self, inventory_data, expiring_soon=True, top_k=5):
        """
        Recommend recipes based on current inventory
        
        Args:
            inventory_data (dict): Current inventory data
            expiring_soon (bool): Whether to prioritize soon-to-expire ingredients
            top_k (int): Number of recommendations to return
            
        Returns:
            dict: Recipe recommendations
        """
        # Extract available ingredients
        available_ingredients = []
        expiring_ingredients = []
        
        for item, data in inventory_data.items():
            if data['quantity'] > 0:
                available_ingredients.append(item)
                
                # Check expiration
                expiry_date = datetime.fromisoformat(data['expiration_date'])
                if (expiry_date - datetime.now()).days <= 3:
                    expiring_ingredients.append(item)
                    
        # Generate recommendations
        if expiring_soon and expiring_ingredients:
            recommendations = self.find_similar_recipes(expiring_ingredients, top_k)
        else:
            recommendations = self.find_similar_recipes(available_ingredients, top_k)
            
        return {
            'timestamp': datetime.now().isoformat(),
            'available_ingredients': len(available_ingredients),
            'expiring_ingredients': len(expiring_ingredients),
            'recommendations': recommendations
        }
        
    def generate_weekly_menu(self, inventory_data, days=7):
        """
        Generate a weekly menu plan
        
        Args:
            inventory_data (dict): Current inventory data
            days (int): Number of days to plan for
            
        Returns:
            dict: Weekly menu plan
        """
        menu_plan = {
            'generated_date': datetime.now().isoformat(),
            'days': []
        }
        
        current_inventory = inventory_data.copy()
        
        for day in range(days):
            date = datetime.now() + timedelta(days=day)
            
            # Get recommendations for the day
            recommendations = self.recommend_recipes(current_inventory)
            
            # Select top recipe
            if recommendations['recommendations']:
                selected_recipe = recommendations['recommendations'][0]
                
                # Update inventory (simulate usage)
                for ingredient in selected_recipe['ingredients']:
                    if ingredient in current_inventory:
                        current_inventory[ingredient]['quantity'] -= 1
                        
                menu_plan['days'].append({
                    'date': date.strftime('%Y-%m-%d'),
                    'recipe': selected_recipe
                })
                
        return menu_plan
        
    def save_recommendations(self, recommendations, output_path='recommendations.json'):
        """
        Save recommendations to JSON file
        
        Args:
            recommendations (dict): Recipe recommendations
            output_path (str): Path to save the recommendations
        """
        with open(output_path, 'w') as f:
            json.dump(recommendations, f, indent=4)

def main():
    # Initialize recommender
    recommender = RecipeRecommender()
    
    try:
        # Load sample recipes
        recommender.load_recipes('recipes.json')
        
        # Sample inventory data
        inventory_data = {
            'tomatoes': {
                'quantity': 5,
                'expiration_date': (datetime.now() + timedelta(days=2)).isoformat()
            },
            'onions': {
                'quantity': 3,
                'expiration_date': (datetime.now() + timedelta(days=5)).isoformat()
            },
            'chicken': {
                'quantity': 2,
                'expiration_date': (datetime.now() + timedelta(days=1)).isoformat()
            }
        }
        
        # Get recommendations
        recommendations = recommender.recommend_recipes(inventory_data)
        print(f"Found {len(recommendations['recommendations'])} recommendations")
        
        # Generate weekly menu
        menu_plan = recommender.generate_weekly_menu(inventory_data)
        print(f"Generated menu plan for {len(menu_plan['days'])} days")
        
        # Save results
        recommender.save_recommendations(recommendations)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 