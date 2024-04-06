const { RecipeCreator } = require("../data/utils/recipeCreatorUtils");
const { getIngredientData } = require("../data/utils/processedDataUtils");
const { cleanNum } = require("../data/utils/basicUtils");


// Remove the nutrition key from each ingredient item in a recipe's ingredients array
const removeNutrition = (recipeIngredientsArray) => {
  return recipeIngredientsArray?.map((ingredient) => {
    return {
      amount: ingredient.amount,
      unit: ingredient.unit,
      name: ingredient.name,
    }
  })
}

test('RecipeCreator setUserInput should set the correct raw user input', () => {
  const recipeCreator = new RecipeCreator();

  let userInputValue = "1 tablespoon sugar, 1 tsp salt";
  recipeCreator.setUserInput(userInputValue);
  expect(recipeCreator.getUserInput()).toEqual(userInputValue);

  userInputValue = "1 T sugar, 1 tsp salt";
  recipeCreator.setUserInput(userInputValue);
  expect(recipeCreator.getUserInput()).toEqual(userInputValue);
});

test('RecipeCreator setUserInput should set the correct cleaned/formatted user input', () => {
  const recipeCreator = new RecipeCreator();

  let userInputValue = "\n\n\n\n\n\n\n1T sugar";
  let expectedValue = "1 tbsp sugar";
  recipeCreator.setUserInput(userInputValue);
  expect(recipeCreator.getCleanUserInput()).toEqual(expectedValue);

  userInputValue = "1 T sugar,\n\t1 t salt\n1";
  expectedValue = "1 tbsp sugar, 1 tsp salt";
  recipeCreator.setUserInput(userInputValue);
  expect(recipeCreator.getCleanUserInput()).toEqual(expectedValue);

  userInputValue = "1 C water, 100ml milk, 90g water, 100 grams milk,";
  expectedValue = "1 cup water, 100 ml milk, 90 g water, 100 g milk";
  recipeCreator.setUserInput(userInputValue);
  expect(recipeCreator.getCleanUserInput()).toEqual(expectedValue);
});

test('RecipeCreator setUserInput should set the correct ingredients array in the recipe object', () => {
  const recipeCreator = new RecipeCreator();
  const milkCalFor100g = getIngredientData("milk")?.nutrition?.hundredGrams?.calories;
  expect(milkCalFor100g).toBeTruthy();

  let userInputValue = "1T sugar.1,";
  let expectedArrValue = [
    { amount: 1, unit: "tbsp", name: "sugar" }
  ];
  let expectedStringValue = "1 tbsp sugar";
  let expectedNutritionValue = "45 cal";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
  expect(recipeCreator.getRecipeNutritionCaloriesString()).toEqual(expectedNutritionValue);

  userInputValue = "1/2 C water, 100.0ml milk, 90g water,100 grams milk,0";
  expectedArrValue  = [
    { amount: 0.5, unit: "cup", name: "water" },
    { amount: 100, unit: "ml", name: "milk" },
    { amount: 90, unit: "g", name: "water" },
    { amount: 100, unit: "g", name: "milk" }
  ];
  expectedStringValue = "0.5 cup water, 100 ml milk, 90 g water, 100 g milk";
  expectedNutritionValue = `${cleanNum(milkCalFor100g * 2)} cal`;
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
  expect(recipeCreator.getRecipeNutritionCaloriesString()).toEqual(expectedNutritionValue);

  userInputValue = "1/2 C water, 1 Apple, 1 onion";
  expectedArrValue  = [
    { amount: 0.5, unit: "cup", name: "water" },
    { amount: 1, unit: "", name: "apple" },
    { amount: 1, unit: "", name: "onion" }
  ];
  expectedStringValue = "0.5 cup water, 1 apple, 1 onion";
  expectedNutritionValue = "216 cal";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
  expect(recipeCreator.getRecipeNutritionCaloriesString()).toEqual(expectedNutritionValue);
});

test('RecipeCreator setUserInput should properly handle ingredient names with spaces', () => {
  const recipeCreator = new RecipeCreator();

  let userInputValue = "1 lb ground lamb, 1lb ground pork, 1 acorn squash, 2 lb acorn squash, 3lb acorn squash";
  let expectedArrValue  = [
    { amount: 1, unit: "lb", name: "ground lamb" },
    { amount: 1, unit: "lb", name: "ground pork" },
    { amount: 1, unit: "", name: "acorn squash" },
    { amount: 2, unit: "lb", name: "acorn squash" },
    { amount: 3, unit: "lb", name: "acorn squash" }
  ];
  let expectedStringValue = "1 lb ground lamb, 1 lb ground pork, 1 acorn squash, 2 lb acorn squash, 3 lb acorn squash";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
});

test('Handle invalid or not recognized input passed into the RecipeCreator', () => {
  const recipeCreator = new RecipeCreator();

  let userInputValue = "1T sugarr";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual([]);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual("");
  expect(recipeCreator.getRecipeNutritionCaloriesString()).toEqual("");

  userInputValue = "1T sugarr, 1T sugar";
  let expectedArrValue = [
    { amount: 1, unit: "tbsp", name: "sugar" }
  ];
  let expectedStringValue = "1 tbsp sugar";
  let expectedNutritionValue = "45 cal";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
  expect(recipeCreator.getRecipeNutritionCaloriesString()).toEqual(expectedNutritionValue);
});

test('Handle plural names of ingredients inputted in the RecipeCreator', () => {
  const recipeCreator = new RecipeCreator();

  let userInputValue = "1T sugar, 1 apples, 2 onion";
  let expectedArrValue  = [
    { amount: 1, unit: "tbsp", name: "sugar" },
    { amount: 1, unit: "", name: "apple" },
    { amount: 2, unit: "", name: "onion" }
  ];
  let expectedStringValue = "1 tbsp sugar, 1 apple, 2 onion";
  recipeCreator.setUserInput(userInputValue);
  expect(removeNutrition(recipeCreator.getRecipeIngredientsArray())).toEqual(expectedArrValue);
  expect(recipeCreator.getRecipeIngredientsString()).toEqual(expectedStringValue);
});