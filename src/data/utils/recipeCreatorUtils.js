const ingredientsData = require("../processedIngredients.json");

const { UNIT } = require("../constants/units");
const { getUniversalUnit, isWeightUnit } = require("./unitsUtils");
const { convertStringToInt, cleanNum } = require("./basicUtils");
const { getFirstIngredientMatchData } = require("./processedDataUtils");
const { processSingleRecipe } = require("../dataProcessing/processRecipes");

class RecipeCreator {
    constructor() {
      this.userInput = ''; // the unprocessed text currently in the input box
      this.cleanUserInput = ''; // the processed text, formatted to a more managable string
      this.recipeObj = {
        name: '',
        ingredients: [
          {
            category: "",
            items: []
          }
        ],
        directions: []
      };
    }

    getUserInput = () => {
      return `${this.userInput}`;
    }

    getCleanUserInput = () => {
      return `${this.cleanUserInput}`;
    }

    setUserInput = (newUserInput) => {
      // save the raw user input first
      this.userInput = `${newUserInput}`;

      // clean up the raw input
      const flattenedUserInput = this.userInput.trim().replace(/([,.]+\s+)|\n+|\r+|(\s){2,}/g, ","); // turn the input into a list of items joined by ','
      const matchedIngredients = flattenedUserInput.matchAll(/\s?(?<amount>(\d+[.]\d+)|(\d+\/\d+)|(\d+))\s?(?<unitAndName>[\w\s]+)*,?/gm);

      const ingredientsList = []; // array of objects, each object representing an ingredient
      const processedIngredientsStrings = []; // array of strings, each string displaying the ingredient's amount, unit, and name
      for (let match of matchedIngredients) {
        const { amount, unitAndName } = match.groups; // retrieve the different parts of each detected match

        if (amount !== null && unitAndName) {
          // Take the amount string and get the integer version of it
          const amountNumber = convertStringToInt(amount);

          // Extract the final unit name and the ingredient name from the unitAndName group
          const splitUnitAndName = unitAndName.split(" ");
          let ingredientNameParts = splitUnitAndName; // for now, save all of the matched words as part of the ingredient name
          let finalUnitName = ""; // for now, assume the entire array is the ingredient name and the unit name is blank
          if (splitUnitAndName.length > 1) {
            const potentialUnit = getUniversalUnit(splitUnitAndName[0].trim()); // test the first word in the array to see if it is actually a unit name
            // if the potential unit actually finds a unit match, use the first element of the array as the unit name
            if (potentialUnit) {
              ingredientNameParts.shift(); // remove the first element of the array from the name parts
              finalUnitName = potentialUnit;
            }
            // else, assume the entire array is the ingredient name and the unit is a blank string
          }

          // Build out the full ingredient name
          const ingredientName = ingredientNameParts.join(" ");

          // check that the input's ingredient name is one we have in the ingredients data
          const potentialNameMatches = [ ingredientName, `${ingredientName}s`, `${ingredientName}es` ]; // (check both singular and potential plural names)
          if (ingredientName.length > 1 && ingredientName.slice(-1) === "s") {
            potentialNameMatches.push(ingredientName.substring(0, ingredientName.length - 1));
            if (ingredientName.length > 2 && ingredientName.slice(-2) === "es") {
              potentialNameMatches.push(ingredientName.substring(0, ingredientName.length - 2));
            }
          }
          
          const ingredientMatch = getFirstIngredientMatchData(potentialNameMatches);
          if (ingredientMatch) {
            ingredientsList.push({ amount: amountNumber, unit: finalUnitName, name: ingredientMatch.name }); // save each detected match as an ingredient object
            processedIngredientsStrings.push(`${amount} ${finalUnitName} ${ingredientMatch.name}`); // save each detected match as an ingredient string
          }
        }
      }

      this.cleanUserInput = processedIngredientsStrings.join(", ");

      // use the newly saved user input to recalculate the ingredients as objects in the recipe's ingredients array
      // parse the current value for userInput and save into ingredients as items
      this.recipeObj.ingredients[0].items = [ ...ingredientsList ];
      this.recipeObj = processSingleRecipe(this.recipeObj, ingredientsData);
    }

    getRecipeObj = () => {
      return this.recipeObj;
    }

    getRecipeObjAsPrettyText = () => {
      return this.getRecipeIngredientsArray().map((item) => {
        const itemAmountText = `${item.amount}${item.unit ? ` ${item.unit}` : ""}${item.unit !== UNIT.GRAM && !(isWeightUnit(item.unit)) ? ` (${item.nutrition.grams}g)` : ""}`;
        const itemNutritionText = `${cleanNum(item.nutrition.calories)} cal, ${cleanNum(item.nutrition.protein)}g protein`;
        return `${itemAmountText} ${item.name}: ${itemNutritionText}`;
      }).join("\n");
    }

    getRecipeIngredientsArray = () => {
      return this.recipeObj.ingredients[0].items || [];
    }

    getRecipeIngredientsString = () => {
      return this.getRecipeIngredientsArray().map((item) => {
        return `${item.amount}${item.unit ? ` ${item.unit}` : ""} ${item.name}`;
      }).join(", ");
    }

    getRecipeNutritionString = () => {
      return this.recipeObj.nutrition.totalCalories ? `${cleanNum(this.recipeObj.nutrition.totalCalories)} cal, ${cleanNum(this.recipeObj.nutrition.totalProtein)} g protein` : "";
    }

    getRecipeNutritionCaloriesString = () => {
      return this.recipeObj.nutrition.totalCalories ? `${cleanNum(this.recipeObj.nutrition.totalCalories)} cal` : "";
    }

    getRecipeGroceryText = () => {
      return this.recipeObj.groceryList;
    }
  
  };
  
  module.exports = {
    RecipeCreator
  }