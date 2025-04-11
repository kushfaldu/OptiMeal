export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: string;
  servings: number;
}

export interface RecipeRequest {
  selectedIngredients: string[];
  useExpiringItems?: boolean;
} 