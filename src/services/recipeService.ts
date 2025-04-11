import { Recipe, RecipeRequest } from '../types/menu';
import { inventoryService } from './inventoryService';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyD9CBq0lNpsM3Bj1mSoElulK6PViD8EZpY');

export const recipeService = {
  generateRecipe: async (request: RecipeRequest): Promise<Recipe> => {
    try {
      let ingredients: string[];
      
      if (request.useExpiringItems) {
        const expiringItems = inventoryService.getExpiringSoonItems(7);
        ingredients = expiringItems.map(item => item.name);
      } else {
        ingredients = request.selectedIngredients;
      }

      // Get the model - using the correct model name
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      });

      const prompt = `Create a detailed Indian recipe using these ingredients: ${ingredients.join(', ')}. 
      The recipe should be creative and authentic Indian cuisine.
      Return ONLY a JSON object with this EXACT structure (no additional text or markdown):
      {
        "name": "Recipe Name",
        "description": "A brief description of the dish",
        "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
        "instructions": ["step 1", "step 2", "step 3"],
        "preparationTime": "time in minutes",
        "servings": number
      }`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw Gemini Response:', text);

      try {
        // Clean the response text
        let cleanedText = text.trim();
        
        // If the response is wrapped in code blocks, remove them
        cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '');
        
        // Find the JSON object in the text
        const startIndex = cleanedText.indexOf('{');
        const endIndex = cleanedText.lastIndexOf('}') + 1;
        
        if (startIndex === -1 || endIndex === -1) {
          throw new Error('No valid JSON found in response');
        }
        
        cleanedText = cleanedText.substring(startIndex, endIndex);
        
        // Parse the JSON
        const parsedRecipe = JSON.parse(cleanedText);

        // Validate and return the recipe with default values if needed
        return {
          name: parsedRecipe.name || 'Untitled Recipe',
          description: parsedRecipe.description || 'No description available',
          ingredients: Array.isArray(parsedRecipe.ingredients) ? parsedRecipe.ingredients : [],
          instructions: Array.isArray(parsedRecipe.instructions) ? parsedRecipe.instructions : [],
          preparationTime: parsedRecipe.preparationTime || '0 minutes',
          servings: typeof parsedRecipe.servings === 'number' ? parsedRecipe.servings : 4
        };
      } catch (parseError) {
        console.error('Error parsing recipe JSON:', parseError);
        console.error('Raw text that failed to parse:', text);
        throw new Error('Failed to parse recipe from AI response');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate recipe');
    }
  }
};

localStorage.clear()
