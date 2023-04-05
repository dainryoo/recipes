const { getRecipeData } = require("./processedDataUtils");

const { 
  addRecipeToMainGroceryList,
  removeRecipeFromMainGroceryList,
  getShoppingListText 
} = require("./groceryUtils");

const { isEmpty } = require("./basicUtils");
const { MEAL_PLAN_ENTRY } = require("../constants/calendar");

class MealPlan {
  constructor() {
    this.groceryList = {};
    this.shoppingListText = {};
    this.allMeals = {};
  }

  // Reset the entire meal plan
  resetMealPlan() {
    this.groceryList = {};
    this.shoppingListText = {};
    this.allMeals = {};
  }

  // Set entire meal plan with passed in values
  setMealPlan(newGroceryList, newShoppingListText, newAllMeals) {
    if (!isEmpty(newGroceryList) && !isEmpty(newShoppingListText) && !isEmpty(newAllMeals)) {
      this.groceryList = { ...newGroceryList };
      this.shoppingListText = { ...newShoppingListText };
      this.allMeals = { ...newAllMeals };
    }
  }

  // Add a new meal to the MealPlan
  addMeal(recipeName, daysAndMealsToEatThisRecipe) {
    // Get the recipe data
    const recipeData = getRecipeData(recipeName);

    // If recipe data was found, proceed with adding the meal
    if (recipeData) {
      // Generate a random new ID for this meal
      const newMealId = Date.now().toString(36) + Math.random().toString(16).slice(2);

      // Get the grocery information for this recipe
      const recipeGroceries = recipeData?.groceries;

      // A random, unique Unicode symbol to append to the recipe
      const unicodeRangeMin = 8704;
      const unicodeRangeMax = 9215;
      const randomUnicodeUnit = Math.floor(Math.random() * (unicodeRangeMax - unicodeRangeMin + 1)) + unicodeRangeMin;
      const newEntrySymbol = String.fromCharCode(randomUnicodeUnit);

      // Use the helper function to add the meal to the list of all meals and update the main grocery list
      this.addMealToAllMeals(newMealId, recipeName, daysAndMealsToEatThisRecipe, recipeGroceries, newEntrySymbol);
    }
  }

  // Add meal to list of all meals and update main grocery list (addMeal helper function)
  addMealToAllMeals(newMealId, recipeName, daysAndMealsToEatThisRecipe, recipeGroceries, newEntrySymbol) {
    // For every day and meal type intended to set this new meal, make sure to clear out any existing entries
    daysAndMealsToEatThisRecipe.forEach((dayAndMealType) => {
      this.removeMeal(this.getMealIdOfMealOfDay(dayAndMealType[MEAL_PLAN_ENTRY.DAY], dayAndMealType[MEAL_PLAN_ENTRY.MEAL_TYPE]));
    });

    // Add the new meal entry (the recipe name, the groceries, and the meals it is for) to the list of all meals
    this.allMeals[newMealId] = {
      recipeName: recipeName,
      whenToEat: [ ...daysAndMealsToEatThisRecipe ],
      recipeGroceries: recipeGroceries,
      symbol: newEntrySymbol
    };

    // Add this meal's groceries needed to the main grocery list
    this.addToGroceryList(recipeGroceries);
  }

  // Remove a meal from the MealPlan
  removeMeal(mealId) {
    // Make sure the mealId can be found in the list of all meals
    if (this.allMeals?.[mealId]) {
      // Remove this meal's groceries from the main grocery list
      this.removeFromGroceryList(this.allMeals[mealId].recipeGroceries);

      // Remove the meal entry from the list of all meals
      delete this.allMeals[mealId];
    }
  }

  // Add a grocery list to the main grocery list
  addToGroceryList(groceriesToAdd) {
    // Update the grocery list
    this.groceryList = {
      ...addRecipeToMainGroceryList(groceriesToAdd, this.groceryList)
    };
    // Update the shopping list text
    this.shoppingListText = getShoppingListText(this.groceryList);
  }

  // Remove a grocery list from the main grocery list
  removeFromGroceryList(groceriesToRemove) {
    // Update the grocery list
    this.groceryList = {
      ...removeRecipeFromMainGroceryList(groceriesToRemove, this.groceryList)
    }
    // Update the shopping list text
    this.shoppingListText = getShoppingListText(this.groceryList);
  }

  // For a given day, find all the meals for it
  findAllMealsForDay(dayId) {
    const foundMeals = {};

    // Go through every meal on the list of all meals
    Object.values(this.allMeals).forEach((currMeal) => {
      // For each meal, add the day/mealType combination to the results if the day in the entry matches the dayId
      currMeal.whenToEat.forEach((dayAndMealType) => {
        if (dayAndMealType[MEAL_PLAN_ENTRY.DAY] === dayId) {
          foundMeals[dayAndMealType[MEAL_PLAN_ENTRY.MEAL_TYPE]] = currMeal.recipeName;
        }
      })
    });

    // Return the results only if meals were found
    return isEmpty(foundMeals) ? null : foundMeals;
  }

  // For a given day, get that day's specific meal type entry
  getMealOfDay(dayId, mealTypeId) {
    return this.findAllMealsForDay(dayId)?.[mealTypeId] ?? null;
  }

  // For a given day, get a label for that day's specific meal type entry 
  getMealOfDayLabel(dayId, mealTypeId) {
    const mealEntry = this.getMealOfDay(dayId, mealTypeId);
    // If no meal was found, return a "---" string
    if (!mealEntry) {
      return "---";
    }

    const mealEntrySymbol = this.allMeals?.[this.getMealIdOfMealOfDay(dayId, mealTypeId)]?.symbol
    return mealEntry + (mealEntrySymbol ? ` ${mealEntrySymbol}` : "");
  }

  // For a given day, get that day's specific meal type entry, then get the Id of that meal type entry
  getMealIdOfMealOfDay(dayId, mealTypeId) {
    const foundMeal = Object.entries(this.allMeals)?.find(([currMealId, mealEntry]) => {
      return mealEntry.whenToEat.find(dayMealType => {
        return dayMealType[MEAL_PLAN_ENTRY.DAY] === dayId && dayMealType[MEAL_PLAN_ENTRY.MEAL_TYPE] === mealTypeId
      });
    });

    return foundMeal?.[0] ?? null;
  }

  // Return the meal matching the mealId
  getMeal(mealId) {
    const foundMeal = this.allMeals?.[mealId];
    return isEmpty(foundMeal) ? undefined : { ...foundMeal };
  }

  getAllMeals() {
    return { ...this.allMeals };
  }

  // Return all the meals in order matching the passed in calendar, as a single string
  getAllMealsString(calendar) {
    if (calendar) {
      const calendarDaysString = calendar.getDaysString();
      const allMealsArray = [];

      // Get all the meals in order of the calendar passed in, iterating first by meal type, then day
      for (let mealTypeIndex = 0; mealTypeIndex < 2; mealTypeIndex++) {
        const currMealTypeMealsArray = [];
        for (let dayIndex = 0; dayIndex < calendar.getNumDays(); dayIndex++) {
          currMealTypeMealsArray.push(this.getMealOfDay(dayIndex, mealTypeIndex) ?? "...");
        }
        allMealsArray.push(currMealTypeMealsArray.join("\t"));
      }

      return `${calendarDaysString}\n${allMealsArray.join("\n")}`;
    }
    return null;
  }

  getGroceryList() {
    return { ...this.groceryList };
  }

  getShoppingListText() {
    return { ...this.shoppingListText };
  }

  getShoppingListUiString() {
    return this.shoppingListText.uiString;
  }

  getShoppingListClipboardString() {
    return this.shoppingListText.clipboardString;
  }

};

module.exports = {
  MealPlan
}