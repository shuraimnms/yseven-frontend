import { useEffect } from 'react';

interface RecipeSchemaProps {
  recipe: {
    name: string;
    description: string;
    image: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    recipeYield: string;
    recipeIngredient: string[];
    recipeInstructions: string[];
    recipeCategory: string;
    recipeCuisine: string;
  };
}

export const RecipeSchema = ({ recipe }: RecipeSchemaProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'recipe-schema';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": recipe.name,
      "image": recipe.image,
      "description": recipe.description,
      "prepTime": recipe.prepTime,
      "cookTime": recipe.cookTime,
      "totalTime": recipe.totalTime,
      "recipeYield": recipe.recipeYield,
      "recipeIngredient": recipe.recipeIngredient,
      "recipeInstructions": recipe.recipeInstructions.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "text": step
      })),
      "recipeCategory": recipe.recipeCategory,
      "recipeCuisine": recipe.recipeCuisine,
      "author": {
        "@type": "Organization",
        "name": "Y7 Premium Sauces"
      }
    });
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('recipe-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [recipe]);
  
  return null;
};
