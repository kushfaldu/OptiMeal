import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import numpy as np
import json
from datetime import datetime
import os

class DishGenerator:
    def __init__(self, model_dir='models', device=None):
        """
        Initialize the custom dish generator
        
        Args:
            model_dir (str): Directory to store models
            device (str): Device to run the model on ('cuda' or 'cpu')
        """
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load pre-trained model
        self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
        self.model = GPT2LMHeadModel.from_pretrained('gpt2').to(self.device)
        
        # Add special tokens
        special_tokens = {
            'additional_special_tokens': [
                '<|recipe_start|>',
                '<|recipe_end|>',
                '<|ingredients|>',
                '<|instructions|>',
                '<|description|>'
            ]
        }
        self.tokenizer.add_special_tokens(special_tokens)
        self.model.resize_token_embeddings(len(self.tokenizer))
        
    def fine_tune(self, training_data, epochs=3, batch_size=4):
        """
        Fine-tune the model on recipe data
        
        Args:
            training_data (list): List of recipe dictionaries
            epochs (int): Number of training epochs
            batch_size (int): Batch size for training
        """
        # Prepare training data
        texts = []
        for recipe in training_data:
            text = self._format_recipe_for_training(recipe)
            texts.append(text)
            
        # Tokenize
        encodings = self.tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=512,
            return_tensors='pt'
        ).to(self.device)
        
        # Training loop
        self.model.train()
        optimizer = torch.optim.AdamW(self.model.parameters(), lr=5e-5)
        
        for epoch in range(epochs):
            for i in range(0, len(texts), batch_size):
                batch = {
                    key: encodings[key][i:i+batch_size]
                    for key in encodings.keys()
                }
                
                outputs = self.model(**batch, labels=batch['input_ids'])
                loss = outputs.loss
                
                loss.backward()
                optimizer.step()
                optimizer.zero_grad()
                
        # Save fine-tuned model
        self.model.save_pretrained(os.path.join(self.model_dir, 'fine_tuned'))
        self.tokenizer.save_pretrained(os.path.join(self.model_dir, 'fine_tuned'))
        
    def _format_recipe_for_training(self, recipe):
        """Format recipe data for model training"""
        text = '<|recipe_start|>\n'
        text += f"Name: {recipe['name']}\n"
        text += f"<|description|>\n{recipe['description']}\n"
        text += '<|ingredients|>\n'
        
        for ingredient, amount in recipe['ingredients'].items():
            text += f"- {amount} {ingredient}\n"
            
        text += '<|instructions|>\n'
        for i, step in enumerate(recipe['instructions'], 1):
            text += f"{i}. {step}\n"
            
        text += '<|recipe_end|>\n'
        return text
        
    def generate_recipe(self, ingredients=None, cuisine_type=None,
                       max_length=512, num_return_sequences=3,
                       temperature=0.7):
        """
        Generate new recipe ideas
        
        Args:
            ingredients (list): List of available ingredients
            cuisine_type (str): Type of cuisine to generate
            max_length (int): Maximum length of generated text
            num_return_sequences (int): Number of recipes to generate
            temperature (float): Sampling temperature
            
        Returns:
            list: Generated recipes
        """
        # Prepare prompt
        prompt = '<|recipe_start|>\n'
        if ingredients:
            prompt += 'Available ingredients:\n'
            for ingredient in ingredients:
                prompt += f"- {ingredient}\n"
                
        if cuisine_type:
            prompt += f"Cuisine: {cuisine_type}\n"
            
        # Generate
        input_ids = self.tokenizer.encode(prompt, return_tensors='pt').to(self.device)
        
        outputs = self.model.generate(
            input_ids,
            max_length=max_length,
            num_return_sequences=num_return_sequences,
            temperature=temperature,
            top_k=50,
            top_p=0.95,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id,
            eos_token_id=self.tokenizer.encode('<|recipe_end|>')[0]
        )
        
        # Process outputs
        recipes = []
        for output in outputs:
            text = self.tokenizer.decode(output, skip_special_tokens=False)
            recipe = self._parse_generated_recipe(text)
            if recipe:
                recipes.append(recipe)
                
        return recipes
        
    def _parse_generated_recipe(self, text):
        """Parse generated text into recipe structure"""
        try:
            # Split sections
            sections = text.split('<|')[1:]  # Skip first empty part
            recipe = {}
            
            for section in sections:
                if section.startswith('recipe_start|>\n'):
                    # Parse name
                    name_line = section.split('\n')[1]
                    if name_line.startswith('Name: '):
                        recipe['name'] = name_line[6:].strip()
                        
                elif section.startswith('description|>\n'):
                    lines = section.split('\n')[1:]
                    recipe['description'] = '\n'.join(line for line in lines if line)
                    
                elif section.startswith('ingredients|>\n'):
                    ingredients = {}
                    lines = section.split('\n')[1:]
                    for line in lines:
                        if line.startswith('- '):
                            parts = line[2:].split(' ', 1)
                            if len(parts) == 2:
                                amount, ingredient = parts
                                ingredients[ingredient.strip()] = amount.strip()
                    recipe['ingredients'] = ingredients
                    
                elif section.startswith('instructions|>\n'):
                    instructions = []
                    lines = section.split('\n')[1:]
                    for line in lines:
                        if line and line[0].isdigit():
                            step = line.split('. ', 1)[1]
                            instructions.append(step)
                    recipe['instructions'] = instructions
                    
            return recipe if 'name' in recipe else None
            
        except Exception:
            return None
            
    def evaluate_recipe(self, recipe, available_ingredients):
        """
        Evaluate generated recipe based on available ingredients
        
        Args:
            recipe (dict): Generated recipe
            available_ingredients (list): Available ingredients
            
        Returns:
            dict: Evaluation metrics
        """
        available_set = set(available_ingredients)
        recipe_ingredients = set(recipe['ingredients'].keys())
        
        matching_ingredients = recipe_ingredients.intersection(available_set)
        missing_ingredients = recipe_ingredients - available_set
        
        return {
            'matching_ingredients': len(matching_ingredients),
            'missing_ingredients': len(missing_ingredients),
            'ingredient_match_ratio': len(matching_ingredients) / len(recipe_ingredients),
            'missing_items': list(missing_ingredients)
        }
        
    def save_recipes(self, recipes, output_path='generated_recipes.json'):
        """
        Save generated recipes to JSON file
        
        Args:
            recipes (list): List of generated recipes
            output_path (str): Path to save the recipes
        """
        output = {
            'generation_date': datetime.now().isoformat(),
            'recipes': recipes
        }
        
        with open(output_path, 'w') as f:
            json.dump(output, f, indent=4)

def main():
    # Initialize generator
    generator = DishGenerator()
    
    try:
        # Example: Generate recipes with specific ingredients
        available_ingredients = [
            'chicken',
            'tomatoes',
            'onions',
            'garlic',
            'rice',
            'bell peppers'
        ]
        
        # Generate recipes
        recipes = generator.generate_recipe(
            ingredients=available_ingredients,
            cuisine_type='Asian fusion',
            num_return_sequences=3
        )
        
        print(f"Generated {len(recipes)} recipes")
        
        # Evaluate recipes
        for recipe in recipes:
            evaluation = generator.evaluate_recipe(recipe, available_ingredients)
            print(f"Recipe: {recipe['name']}")
            print(f"Ingredient match ratio: {evaluation['ingredient_match_ratio']:.2f}")
            
        # Save results
        generator.save_recipes(recipes)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 