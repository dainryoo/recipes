import { useState, useCallback, useEffect } from "react";
import allRecipes from "../data/recipes.json";

const useRecipeHook = (pantryInfo) => {
  const [recipeInfo, setRecipeInfo] = useState([]); // recipeInfo is the processed recipe json

  // take in ingredient name and return the raw ingredient data from the pantry
  const getPantryItemJson = useCallback(
    (name) => {
      let foundItem;
      pantryInfo.forEach((category) => {
        category.items.forEach((item) => {
          if (item.name === name) {
            foundItem = item;
          }
        });
      });
      return foundItem;
    },
    [pantryInfo]
  );

  // take in ingredient from recipe and its data from pantry
  // return its weight in grams
  const getIngredientGrams = useCallback((ingredient, itemData) => {
    if (ingredient.unit === "g" || ingredient.unit === "ml") {
      return ingredient.amount;
    } else if (ingredient.unit === "") {
      return ingredient.amount * itemData.perUnit.avgGrams;
    } else if (ingredient.unit in itemData.conversionToGrams) {
      return ingredient.amount * itemData.conversionToGrams[ingredient.unit];
    } else {
      return 0;
    }
  }, []);

  // take in ingredient from recipe and its data from pantry
  // return its calories
  const getIngredientCalories = useCallback((ingredient, itemData, grams) => {
    if (ingredient.unit === "") {
      return ingredient.amount * itemData.perUnit.calories;
    } else if (grams) {
      return (grams / 100.0) * itemData.per100g.calories;
    } else {
      return 0;
    }
  }, []);

  // take in ingredient from recipe and its data from pantry
  // return its protein
  const getIngredientProtein = useCallback((ingredient, itemData, grams) => {
    if (ingredient.unit === "") {
      return ingredient.amount * itemData.perUnit.protein;
    } else if (grams) {
      return (grams / 100.0) * itemData.per100g.protein;
    } else {
      return 0;
    }
  }, []);

  // take in ingredient from recipe and its data from pantry
  // return its price
  const getIngredientPrice = useCallback((ingredient, itemData, grams) => {
    if (ingredient.unit === "") {
      return ingredient.amount * itemData.perUnit.price;
    } else if (grams) {
      return (grams / 100.0) * itemData.per100g.price;
    } else {
      return 0;
    }
  }, []);

  const getCalculatedIngredientData = useCallback(
    (ingredient, itemData) => {
      const grams = getIngredientGrams(ingredient, itemData);
      const calories = getIngredientCalories(ingredient, itemData, grams);
      const protein = getIngredientProtein(ingredient, itemData, grams);
      const price = getIngredientPrice(ingredient, itemData, grams);
      return { grams: grams, calories: calories, protein: protein, price: price };
    },
    [getIngredientGrams, getIngredientCalories, getIngredientProtein, getIngredientPrice]
  );

  // take in an ingredient from a recipe, use its name to find its value in the pantry
  // return item's { name, label, amount, unit, grams, calories, protein, price }
  const calculateIngredientValues = useCallback(
    (ingredient) => {
      const itemData = getPantryItemJson(ingredient.name);
      if (itemData) {
        const calculatedItemData = getCalculatedIngredientData(ingredient, itemData);

        return {
          name: itemData.name,
          label: itemData.label,
          amount: ingredient.amount,
          unit: ingredient.unit,
          ...(ingredient.note && { note: ingredient.note }),
          grams: calculatedItemData.grams,
          calories: calculatedItemData.calories,
          protein: calculatedItemData.protein,
          price: calculatedItemData.price
        };
      } else {
        return {
          name: ingredient.name,
          label: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          calories: 0,
          protein: 0,
          price: 0,
          ...(ingredient.unit === "g" && { grams: ingredient.amount })
        };
      }
    },
    [getPantryItemJson, getCalculatedIngredientData]
  );

  // take in the raw recipe data and return a recipe with all the calculated individiual ingredient and total recipe values
  const calculateRecipeValues = useCallback(
    (recipe) => {
      let totalRecipeValues = { calories: 0, protein: 0, price: 0 };

      let allIngredientCategories = [];
      // go through each ingredient category of the recipe
      recipe.ingredients.forEach((ingredientCategory) => {
        let currCategoryIngredients = [];
        // go through each ingredient in the category
        ingredientCategory.items.forEach((ingredient) => {
          // calculate each ingredient value
          let currIngredient = calculateIngredientValues(ingredient);
          // add each ingredient to list of items for the current ingredient category
          currCategoryIngredients.push(currIngredient);
          // add each ingredient value to recipe value
          totalRecipeValues.calories += currIngredient.calories;
          totalRecipeValues.protein += currIngredient.protein;
          totalRecipeValues.price += currIngredient.price;
        });
        allIngredientCategories.push({ category: ingredientCategory.category, ingredients: currCategoryIngredients });
      });

      // build recipe with all the processed data
      const processedRecipe = {
        name: recipe.name,
        label: recipe.label || recipe.name,
        ...(recipe.groceryList && { groceryList: recipe.groceryList }),
        ingredients: allIngredientCategories,
        directions: recipe.directions,
        totalValues: totalRecipeValues
      };

      return processedRecipe;
    },
    [calculateIngredientValues]
  );

  useEffect(() => {
    const processedRecipes = [];

    // go through each recipe catetgory
    allRecipes.forEach((recipeCategory) => {
      let currRecipes = [];

      // go through each recipe in the category
      recipeCategory.recipes.forEach((recipe) => {
        const calculatedRecipe = calculateRecipeValues(recipe);
        // add to list of processed recipes
        currRecipes.push(calculatedRecipe);
      });

      processedRecipes.push({ categoryName: recipeCategory.category_name, recipes: currRecipes });
    });

    setRecipeInfo(processedRecipes);
  }, [calculateRecipeValues]);

  return { recipeInfo, getPantryItemJson };
};

export default useRecipeHook;
