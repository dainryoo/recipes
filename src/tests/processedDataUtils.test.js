const recipesData = require("../data/processedRecipes.json");
const ingredientsData = require("../data/processedIngredients.json");

const { 
    getRecipeData,
    getIngredientData,
    getAllRecipeNames,
    getAllIngredientNames
} = require("../data/utils/processedDataUtils");

test('Bonus test to make sure all recipesData and ingredientsData is valid', () => {
    Object.values(recipesData).forEach((recipe) => {
        expect(recipe.id).toBeTruthy();
        expect(recipe.name).toBeTruthy();
        expect(recipe.ingredients).toBeTruthy();
        expect(recipe.directions).toBeTruthy();
        expect(recipe.nutrition).toBeTruthy();
        expect(recipe.groceries).toBeTruthy();
    });
});

test('getRecipeData should return the correct recipe', () => {
    const testRecipe = Object.values(recipesData)[0];

    // Make sure the recipesData entry is valid and has all the expected values
    expect(testRecipe.id).toBeTruthy();
    expect(testRecipe.name).toBeTruthy();
    expect(testRecipe.ingredients).toBeTruthy();
    expect(testRecipe.directions).toBeTruthy();
    expect(testRecipe.nutrition).toBeTruthy();
    expect(testRecipe.groceries).toBeTruthy();

    expect(getRecipeData(testRecipe.name)).toBeTruthy();
    expect(getRecipeData(testRecipe.name).name).toEqual(testRecipe.name);
    expect(getRecipeData(testRecipe.name).ingredients).toEqual(testRecipe.ingredients);

    // If an invalid recipe name is passed in, we should get no results
    expect(getRecipeData("asdfkjlasjdfasdfkljasdf")).toBe(null);
});

test('getIngredientData should return the correct ingredient', () => {
    const testIngredient = Object.values(ingredientsData)[0];

    // Make sure the ingredientsData entry is valid and has all the expected values
    expect(testIngredient.id).toBeTruthy();
    expect(testIngredient.name).toBeTruthy();
    expect(testIngredient.tags).toBeTruthy();
    expect(testIngredient.serving).toBeTruthy();
    expect(testIngredient.nutrition).toBeTruthy();

    expect(getIngredientData(testIngredient.name)).toBeTruthy();
    expect(getIngredientData(testIngredient.name).name).toEqual(testIngredient.name);
    expect(getIngredientData(testIngredient.name).tags).toEqual(testIngredient.tags);
    expect(getIngredientData(testIngredient.name).serving).toEqual(testIngredient.serving);

    // If an invalid recipe name is passed in, we should get no results
    expect(getIngredientData("asdfkjlasjdfasdfkljasdf")).toBe(null);
});

test('getAllRecipeNames should return an array of valid strings of all the recipes\' names', () => {
    const retrievedNames = getAllRecipeNames();
    expect(retrievedNames.length).not.toEqual(0);

    const noTrailingSpacesRegex = /^[a-zA-Z0-9 ]+$/; // make sure recipe names are strings without trailing spaces
    retrievedNames.forEach((name) => {
        expect(name).toMatch(noTrailingSpacesRegex);
    });

    expect(retrievedNames[0]).toEqual(Object.values(recipesData)[0].name);
});

test('getAllIngredientNames should return an array of valid strings of all the ingredients\' names', () => {
    const retrievedNames = getAllIngredientNames();
    expect(retrievedNames.length).not.toEqual(0);

    const noTrailingSpacesRegex = /^[a-zA-Z0-9 ]+$/; // make sure ingredient names are strings without trailing spaces
    retrievedNames.forEach((name) => {
        expect(name).toMatch(noTrailingSpacesRegex);
    });

    expect(retrievedNames[0]).toEqual(Object.values(ingredientsData)[0].name);
});