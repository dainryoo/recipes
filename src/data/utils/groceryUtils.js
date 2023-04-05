const { UNIT } = require("../constants/units");
const { STORES, storeOrders } = require("../constants/groceryStores");
const ingredientsData = require("../processedIngredients.json");

const { cleanNum, isEmpty, findNameMatch } = require("./basicUtils");

// Add a recipe's groceries to the existing main grocery list
const addRecipeToMainGroceryList = (recipeGroceries, mainGroceryList) => {
  // If main grocery list has nothing in it, just return the recipe's groceries since we are just adding everything.
  if (isEmpty(mainGroceryList)) {
    return { ...recipeGroceries };
  }

  // If the recipe groceries is empty, just return the main grocery list since there's nothing to add.
  if (isEmpty(recipeGroceries)) {
    return { ...mainGroceryList };
  }

  // Prepare the new, combined grocery list to return
  const combinedList = { ...mainGroceryList  };

  // Go through each ingredient in the recipe's grocery list
  for (const [currIngredient, amountEntries] of Object.entries(recipeGroceries)) {
    // Go through each amount entry for each ingredient
    for (const [ unit, recipeAmount ] of Object.entries(amountEntries)) {
      const currIngredientEntryInMainGroceryList = combinedList?.[currIngredient];
      if (!currIngredientEntryInMainGroceryList) {
        // If this ingredient doesn't yet exist in the main grocery list, add the ingredient
        combinedList[currIngredient] = {
          [unit]: recipeAmount
        }
      } else {
        if (!currIngredientEntryInMainGroceryList?.[unit]) {
          // If this ingredient doesn't yet have this unit in the main grocery list, add the unit to the ingredient in the main grocery list
          combinedList[currIngredient] = {
            ...currIngredientEntryInMainGroceryList,
            [unit]: recipeAmount
          }
        } else {
          // If this ingredient's unit exists in the main grocery list, increment the unit value in the main grocery list
          const incrementedAmount = parseFloat((currIngredientEntryInMainGroceryList[unit] + recipeAmount).toFixed(5));
          combinedList[currIngredient] = {
            ...currIngredientEntryInMainGroceryList,
            [unit]: incrementedAmount
          }
        }
      }
    }
  }

  return combinedList;
}

// Remove a recipe's groceries from the existing main grocery list
const removeRecipeFromMainGroceryList = (recipeGroceries, mainGroceryList) => {
  // If the main grocery list has nothing in it, return the empty grocery list since there's nothing to remove from.
  if (isEmpty(mainGroceryList)) {
    return { ...mainGroceryList };
  }

  // If the recipe groceries is empty, just return the main grocery list since there's nothing to remove.
  if (isEmpty(recipeGroceries)) {
    return { ...mainGroceryList };
  }

  // Prepare the new, removed grocery list to return
  const removedList = { ...mainGroceryList  };

  // Go through each ingredient in the recipe's grocery list
  for (const [currIngredient, amountEntries] of Object.entries(recipeGroceries)) {
    // Go through each amount entry for each ingredient
    for (const [ unit, recipeAmount ] of Object.entries(amountEntries)) {
      const currIngredientEntryInMainGroceryList = removedList?.[currIngredient];

      // Only do something if this ingredient and an entry for this unit actually exists in the main grocery list
      if (currIngredientEntryInMainGroceryList && currIngredientEntryInMainGroceryList?.[unit]) {
        // Decrement the unit value in the main grocery list
        const decrementedAmount = parseFloat((currIngredientEntryInMainGroceryList[unit] - recipeAmount).toFixed(5));

        if (decrementedAmount > 0) {
          // If the amount the recipe grocery list entry was decreased to is non zero, keep the entry
          removedList[currIngredient] = {
            ...currIngredientEntryInMainGroceryList,
            [unit]: decrementedAmount
          }
        } else {
          // If the amount for this unit was decreased to zero, we have to check whether the unit was the only entry for the ingredient or not
          const currentIngredientUnitEntries = Object.entries(removedList[currIngredient]);
          if (currentIngredientUnitEntries.length === 1 && currentIngredientUnitEntries[0][0] === unit) {
            // If the amount was decreased to zero and there are no other unit entries for the ingredient left, remove the entire ingredient from the grocery list
            delete removedList[currIngredient];
          } else {
            // If the amount was decreased to zero, but there are still other unit entries for the ingredient left, keep the ingredient but remove its unit entry
            delete currIngredientEntryInMainGroceryList[unit];    
            removedList[currIngredient] = {
              ...currIngredientEntryInMainGroceryList
            }
          }
        }
      }
    }
  }

  return removedList;
}

// Take a shopping list item and turn it into a string describing the amount of this unit of the item needed to purchase
const getGroceryShoppingListItemAmountEntryText = (unitAmount, unit, itemPerUnitGrams) => {
  // If the item entry is in grams and the item can be counted in units (e.g. 200g of potato, and potatoes can be counted in units)
  if (unit === UNIT.GRAM && itemPerUnitGrams) {
    // Convert the grams entry into a rough estimate of how many units, based on the average grams of a single unit
    const estimatedAmount = unitAmount * 1.0 / itemPerUnitGrams;
    // Return the item's amount entry with the rough estimate
    return `~${cleanNum(estimatedAmount)}`;
  } else {
    // Otherwise, just return the item's amount entry normally
    return `${cleanNum(unitAmount)}${unit === UNIT.ITEM ? "" : ` ${unit}`}`;
  }
}

// Turn any grocery list (Object with key/value pairs for each ingredient/unitEntry) into an ordered grocery shopping list (sorted Array of Objects)
const generateGroceryShoppingList = (groceryList) => {
  const shoppingListArray = [];

  // Go through each grocery item in the grocery list
  for (const [currentItem, amountEntries] of Object.entries(groceryList)) {
    const currItemData = findNameMatch(currentItem, ingredientsData);
    const itemPerUnitData = currItemData?.nutrition?.item;

    const currItemsAmountsArray = []; // keep track of all the current item's amount entries in an array
    // Go through each amount entry for each item
    for (const [ unit, unitAmount ] of Object.entries(amountEntries)) {
      currItemsAmountsArray.push(getGroceryShoppingListItemAmountEntryText(unitAmount, unit, itemPerUnitData?.grams));
    }

    // Find the best match (i.e. earliest match) to the list of store, using the item name, then the item's tags
    const positionMatchingOptions = [ currentItem, ...currItemData?.tags ];
    const lowestTagPosition = storeOrders[STORES.WF].findIndex(itemPosition => positionMatchingOptions.includes(itemPosition));

    // For each item, return the best (lowest) position found for the item, its UI-friendly string text, and its clipboard-friendly string text
    shoppingListArray.push({
      item: currentItem,
      lowestPosition: lowestTagPosition === -1 ? 999999 : lowestTagPosition, // if no index was found (i.e. -1), set as a very high number instead
      uiStringText: `${currItemsAmountsArray.join(" + ")} ${currentItem}`,
      clipboardStringText: `${currentItem} (${currItemsAmountsArray.join(" + ")})`
    });
  }

  // Return the shopping list array in order, from lowest to highest position
  return shoppingListArray.sort((a,b) => a.lowestPosition - b.lowestPosition);
}

// Turn any grocery list (Object with key/value pairs for each ingredient/unitEntry) into a UI-friendly single string text for the page display and a Copy/Paste friendly string for the user clipboard
const getShoppingListText = (groceryList) => {
  // Return the two needed text strings in an object with two values, one for each text string
  const shoppingListText = {
    uiString: "",
    clipboardString: ""
  };

  // First, generate the ordered grocery shopping list array
  const shoppingListArray = generateGroceryShoppingList(groceryList);

  // Save a value in the return object for the UI-friendly single string
  shoppingListText.uiString = shoppingListArray?.map((shoppingListItem) => {
    return shoppingListItem.uiStringText;
  }).join(", ");

  // Save a value in the return object for the clipboard-friendly string
  shoppingListText.clipboardString = shoppingListArray?.map((shoppingListItem) => {
    return shoppingListItem.clipboardStringText;
  }).join("\n");

  return shoppingListText;
}

module.exports = {
  addRecipeToMainGroceryList,
  removeRecipeFromMainGroceryList,
  getGroceryShoppingListItemAmountEntryText,
  generateGroceryShoppingList,
  getShoppingListText
}