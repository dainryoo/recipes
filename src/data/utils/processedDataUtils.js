const recipesData = require("../processedRecipes.json");
const ingredientsData = require("../processedIngredients.json");

const { findNameMatch } = require("./basicUtils");

// Pass in a recipe name and get the data for the matching entry in the processedRecipes data
const getRecipeData = (recipeName) => {
  return findNameMatch(recipeName, recipesData);
}

// Pass in a ingredient name and get the data for the matching entry in the processedIngredients data
const getIngredientData = (ingredientName) => {
  return findNameMatch(ingredientName, ingredientsData);
}

// Pass in an array of potential ingredient name matches and get the data for the first matching entry in the processedIngredients data
const getFirstIngredientMatchData = (ingredientNames) => {
  if (ingredientNames?.length > 0) {
    for (const ingredientName of ingredientNames) {
      // check each name in the list of names for a match
      const match = findNameMatch(ingredientName, ingredientsData);
      if (match) {
        // return the first valid match
        return match;
      }
    }
  }
  return null;
}

// Return a string array of all recipe names
const getAllRecipeNames = () => {
  return Object.values(recipesData).map((recipe) => {
    return recipe?.name ?? recipe.id;
  });
}

// Return a string array of all ingredient names
const getAllIngredientNames = () => {
  return Object.values(ingredientsData).map((ingredient) => {
    return ingredient?.name ?? ingredient.id;
  });
}

module.exports = {
  getRecipeData,
  getIngredientData,
  getFirstIngredientMatchData,
  getAllRecipeNames,
  getAllIngredientNames
}