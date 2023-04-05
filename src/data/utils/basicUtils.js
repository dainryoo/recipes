const ingredientsData = require("../processedIngredients.json");
const recipesData = require("../processedRecipes.json");

// Return whether the passed in value is a positive integer
const isPosInt = (value) => {
  return typeof value === 'number' && Math.sign(value) === 1;
}

// Return a rounded version of the passed in number
const round = (num) => {
  return typeof num === 'number' ? Math.round(num) : num;
}

// Return a user friendly cleaned up number; take in a numerical value and return it with no decimals, or two decimal points if needed
const cleanNum = (value) => {
  const cleanedNumber = value ? +(Math.round(value + "e+2") + "e-2") : value;
  return !isNaN(cleanedNumber) ? cleanedNumber : null;
};

// Create a kebab-case ID for each recipe/ingredient based on simplified version of its name
const generateId = (nameStr) => {
  return !!nameStr ? nameStr.trim(" ").replace(/\s+/g, "-").toLowerCase() : "";
}

// Check whether an object is empty
const isEmpty = (obj) => {
  return !obj || (Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype);
}

// In some array of objects, find and return the object that has a match to the passed objName, if any
const findNameMatch = (objName, arrayOfObjs) => {
  return arrayOfObjs?.find(obj => obj?.name === objName) || null;
}

// In some array of objects, find and return the object that has a match to the passed objId, if any
const findIdMatch = (objId, arrayOfObjs) => {
  return arrayOfObjs?.find(obj => obj?.id === objId) || null;
}

// Custom filter function that checks against some input value for matches to the name of a list item
const filterListBy = (list, rawInputValue) => {
  // If no list was provided or if no input value to check against was provided, exit
  if (list?.length === 0 || !rawInputValue) {
    return list;
  }

  // the search input, turned all lowercase
  const inputValue = rawInputValue.toLowerCase();
  // the search input, with spaces stripped out
  const strippedInputValue = inputValue.replace(/[^a-z0-9]/gi,'');

  // Array of strings, keeping track of the already added matches items so we don't have repeats
  const filteredListIds = [];

  // Filter the list based on pure matches to the inputValue
  const filteredList = list.filter((currListItem) => {
    // turn the current list item, we are checking against the search input into all lowercase
    const curr = currListItem.name.toLowerCase().replace(/[^a-z0-9]/gi,'');
    // check for a match against the stripped input value
    const matchesFilter = curr.includes(strippedInputValue);
    if (matchesFilter) {
      filteredListIds.push(currListItem.id);
    }
    // return whether a match was found or not
    return matchesFilter;
  });

  // Also add to the end of the list some additional "loose" matches to the inputValue (i.e. tag/ingredient matches)
  const looseMatchesList = list.filter((currListItem) => {
    // if this item is already in the filteredList, we don't have to check whether it's a loose match
    if (filteredListIds.includes(currListItem.id)) {
      return false;
    }

    const isRecipe = !!currListItem?.directions; // determine whether we are looking at an ingredient or a recipe
    const currListItemData = findIdMatch(currListItem.id, isRecipe ? recipesData : ingredientsData);
    // check if input matches any ingredients (if this is a recipe we are checking against)
    const hasIngredientMatches = isRecipe && inputValue.length > 2 ? currListItemData?.ingredientList?.includes(inputValue) : false;
    // check if input matches any tags
    const hasTagMatches = currListItemData?.tags?.some(tag => tag === strippedInputValue);
    return hasTagMatches || hasIngredientMatches;
  });

  // Add a divider element in between the two lists, if appropriate
  if (looseMatchesList.length > 0 && filteredList.length > 0) {
    looseMatchesList.unshift("divider");
  }

  return filteredList.concat(looseMatchesList);
}

module.exports = {
  isPosInt,
  round,
  cleanNum, 
  filterListBy,
  findNameMatch,
  findIdMatch,
  generateId, 
  isEmpty
};