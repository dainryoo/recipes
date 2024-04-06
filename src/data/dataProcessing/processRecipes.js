const { tagsToAddToGrocery } = require("../constants/groceryStores");
const { UNIT } = require("../constants/units");

const { cleanNum, findNameMatch, generateId, isEmpty } = require("../utils/basicUtils");
const { convertUnits, isVolumeUnit, isWeightUnit } = require("../utils/unitsUtils");

// Return nutrition info about each ingredient in a recipe, as well as the entire recipe's nutrition
const getRecipeWithNutrition = (ingredients, processedIngredients) => {
  // If no valid ingredients info was passed in, exit
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  // Keep running total counts for entire recipe nutrition
  let caloriesSum = 0;
  let proteinSum = 0;
  // Keep running total of this recipe's groceries
  const groceries = {};

  // Go through every ingredient category
  const allIngredientsWithNutrition = ingredients.map((currCategory) => {
    // For each ingredient category, go through every individual ingredient
    const processedItems = currCategory?.items?.map((currItem) => {
      // Get the current item's information from the processed ingredients file
      const ingredientData = findNameMatch(currItem.name, processedIngredients);
      const nutritionData = ingredientData?.nutrition;

      const currItemAmount = currItem?.amount;
      const currItemUnit = currItem?.unit || UNIT.ITEM;
      const currItemNutrition = {};

      // If the current item has a valid unit and the unit is in the processed ingredients file
      if (currItemUnit && nutritionData?.[currItemUnit]) {
        const currAmountToGrams = nutritionData[currItemUnit].grams * currItemAmount;
        const currItemCal = currAmountToGrams * nutritionData[UNIT.GRAM].calories;
        const currItemProtein = currAmountToGrams * nutritionData[UNIT.GRAM].protein;

        // Use processed ingredient file entry to calculate recipe ingredient values
        currItemNutrition.grams = currAmountToGrams;
        currItemNutrition.calories = currItemCal;
        currItemNutrition.protein = currItemProtein;

        // Write out the calculation for this ingredient's calories as a string
        const roundedCurrAmountToGrams = cleanNum(currAmountToGrams);
        if (currItemUnit === UNIT.ITEM) {
          // If it's valid for this ingredient to be counted as a single item, use that instead of 100g in the calculation string
          if (currItem.name === "garlic" || currItem.name.includes("egg")) {
            // special case string for garlic or egg products
            currItemNutrition.calorieCalculation = `=${cleanNum(nutritionData?.[UNIT.ITEM].calories)}*${currItemAmount}`;
          } else {
            currItemNutrition.calorieCalculation = `=${roundedCurrAmountToGrams}/${cleanNum(nutritionData?.[UNIT.ITEM].grams)}*${cleanNum(nutritionData[UNIT.ITEM].calories)}`;
          }
        } else {
          // else, use 100g in the calculation string
          currItemNutrition.calorieCalculation = `=${roundedCurrAmountToGrams}/100*${cleanNum(nutritionData[UNIT.HUNDRED_GRAMS].calories)}`;
          // Append an additional oz/lb value at the end of the calculation string, if it makes sense for this ingredient
          if (isWeightUnit(currItemUnit)) {
            const currItemAmountOz = cleanNum(convertUnits(currItemAmount, currItemUnit, UNIT.OZ));
            const currItemAmountLb = cleanNum(convertUnits(currItemAmount, currItemUnit, UNIT.LB));
            currItemNutrition.calorieCalculation += ` * ${currItemAmountOz}/${currItemAmountOz} * ${currItemAmountLb}/${currItemAmountLb}`;
          }
        }

        // Add to running total counts for entire recipe nutrition
        caloriesSum += currItemCal;
        proteinSum += currItemProtein;
        
        // Add this ingredient to the recipe's groceries, if it has a grocery tag
        if (ingredientData?.tags?.some((tag) => tagsToAddToGrocery.includes(tag))) {
          // Get the amount we have for this item already saved in the groceries, if any
          const initialGroceryItemAmount = groceries?.[currItem.name]?.[currItemUnit] ?? 0;
          // Save the new amount to the grocery entry
          groceries[currItem.name] = { [currItemUnit]: initialGroceryItemAmount + currItemAmount };
        }
      } else {
        // If we were missing some necessary data, log a warning
        console.log(`Warning: ${currItemUnit} value for ${currItem.name} was not found in processed ingredients data`)
      }

      // Return the original item info, plus the processed nutrition info
      return {
        ...currItem,
        ...(!isEmpty(currItemNutrition) && { nutrition: currItemNutrition }),
      }
    });

    // Return back the category with its processed ingredients
    return {
      category: currCategory.category,
      items: processedItems || []
    }
  });

  // Also return detailed nutrition info and groceries for the entire recipe
  return {
    recipeNutrition: {
      totalCalories: caloriesSum,
      totalProtein: proteinSum
    },
    groceries: groceries,
    ingredientsNutrition: allIngredientsWithNutrition
  }
}

// Take an obj that represents groceries, with each key-value pair as a single item, and turn it into a string
const getGroceryListString = (groceries) => {
  // Go through each entry in the groceries obj and turn each entry into a string representing the grocery item and how much of the item
  const groceryList = Object.keys(groceries)?.map((currItem) => {
    const currAmountEntry = groceries[currItem]; // gets data in the form of { "unit": "value" }
    const currAmountValue = Object.values(currAmountEntry)[0]; // get the amount number value
    const rawCurrAmountUnit = Object.keys(currAmountEntry)[0]; // get the amount's raw unit data first
    const currAmountUnit = rawCurrAmountUnit === UNIT.ITEM ? "" : rawCurrAmountUnit; // then, massage raw unit into prettier string
    
    const currAmountString = `${cleanNum(currAmountValue)}${isVolumeUnit(currAmountUnit) ? " " : ""}${currAmountUnit}`;
    return `${currAmountString} ${currItem}`
  });
  return groceryList.length > 0 ? `(${groceryList.join(", ")})` : "";
}

// Take an obj that represents a recipe's ingredients, and turn it into a simple string
const getIngredientListSimple = (ingredients) => {
  let finalString = "";
  ingredients.forEach((category) => {
    category.items.forEach((item) => {
      const amountText = item.amount + (item.unit != null && item.unit !== "" ? " " + item.unit : "");
      finalString += `${amountText} ${item.name}\n`;
    });
    finalString += "\n";
  });
  return finalString;
}

// Take an obj that represents a recipe's ingredients, and turn it into a string specifically formatted for spreadsheets
const getIngredientListStringFormattedForSpreadsheet = (ingredients) => {
  let finalString = "";
  ingredients.forEach((category) => {
    category.items.forEach((item) => {
      const calorieCalculationText = item.nutrition.calorieCalculation;
      const amountText = item.amount + (item.unit != null && item.unit !== "" ? " " + item.unit : "");
      finalString += `${calorieCalculationText}\t${amountText} ${item.name}\n`;
    });
    finalString += "\n";
  });
  return finalString;
}

// For the passed in recipe, add a kebab-case ID, nutrition info about every ingredient, and entire recipe nutrition info
const processSingleRecipe = (recipe, processedIngredients) => {
  const recipeWithNutrition = getRecipeWithNutrition(recipe.ingredients, processedIngredients);
  return {
    id: generateId(recipe.name),
    ...recipe,
    nutrition: recipeWithNutrition.recipeNutrition,
    groceries: recipeWithNutrition.groceries,
    groceryList: getGroceryListString(recipeWithNutrition.groceries),
    ingredients: recipeWithNutrition.ingredientsNutrition,
    ingredientListSimple: getIngredientListSimple(recipeWithNutrition.ingredientsNutrition),
    ingredientListFormattedForSpreadsheet: getIngredientListStringFormattedForSpreadsheet(recipeWithNutrition.ingredientsNutrition)
  };
}

// Process raw recipes data
const processRecipes = (data, processedIngredients) => {
  // Exit if we are missing necessary data
  if (!data || data.length === 0 || !processedIngredients) {
    return {};
  }

  const allProcessedRecipes = data.map((recipe) => {
    // For each recipe, add a kebab-case ID, nutrition info about every ingredient, and entire recipe nutrition info
    return processSingleRecipe(recipe, processedIngredients);
  });
  return allProcessedRecipes;
}

module.exports = { 
  processSingleRecipe,
  processRecipes
};

// const processRecipesData = (data, ingredientsData) => {

//   // checkMissingData(finalRecipesData, ingredientsData);
//   fs.writeFileSync(path.join(__dirname, "../data/processedRecipes.json"), JSON.stringify(finalRecipesData), "utf8"); // save the data into a new file
// };

// // Check for recipes with unknown ingredients and for ingredients that aren't used in any recipes
// const checkMissingData = (recipesData, ingredientsData) => {

//   // check every single ingredient for each recipe to see if the ingredient exists in the pantry
//   // if not, print out a warning

//   // check every single ingredient info to see if it's actually used in any recipes
// };
