const recipesData = require("../data/processedRecipes.json");
const ingredientsData = require("../data/processedIngredients.json");

const { 
    getRecipeData,
    getIngredientData,
    getFirstIngredientMatchData,
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

test('getFirstIngredientMatchData should return the first successfully matched ingredient', () => {
    const testIngredient1 = Object.values(ingredientsData)[0];
    const testIngredient2 = Object.values(ingredientsData)[1];
    const incorrectIngredientName1 = "sdfsdafb";
    const incorrectIngredientName2 = `${testIngredient1.name}s`;

    // Make sure the ingredientsData entries are valid first
    expect(testIngredient1.name).toBeTruthy();
    expect(testIngredient2.name).toBeTruthy();

    // If an array with one valid recipe is passed in, we should get that one recipe as the result
    expect(getFirstIngredientMatchData([ testIngredient1.name ]).name).toEqual(testIngredient1.name);
    
    // If an array with one valid recipe and any number of invalid recipe names is passed in, we should get that one recipe as the result
    expect(getFirstIngredientMatchData([ testIngredient1.name, incorrectIngredientName1 ]).name).toEqual(testIngredient1.name);
    expect(getFirstIngredientMatchData([ incorrectIngredientName1, testIngredient1.name ]).name).toEqual(testIngredient1.name);
    expect(getFirstIngredientMatchData([ incorrectIngredientName1, incorrectIngredientName2, incorrectIngredientName1, testIngredient1.name ]).name).toEqual(testIngredient1.name);

    // If an array with multiple valid recipes and any number of invalid recipe names is passed in, we should get the first valid recipe as the result
    expect(getFirstIngredientMatchData([ testIngredient1.name, testIngredient2.name ]).name).toEqual(testIngredient1.name);
    expect(getFirstIngredientMatchData([ testIngredient1.name, testIngredient2.name, incorrectIngredientName1 ]).name).toEqual(testIngredient1.name);
    expect(getFirstIngredientMatchData([ testIngredient2.name, testIngredient1.name, incorrectIngredientName1 ]).name).toEqual(testIngredient2.name);
    expect(getFirstIngredientMatchData([ incorrectIngredientName1, testIngredient1.name, testIngredient2.name ]).name).toEqual(testIngredient1.name);
    expect(getFirstIngredientMatchData([ incorrectIngredientName1, testIngredient2.name, testIngredient1.name ]).name).toEqual(testIngredient2.name);

    // If an array with no valid recipe names is passed in, we should get no results
    expect(getFirstIngredientMatchData([ incorrectIngredientName1 ])).toBe(null);
    expect(getFirstIngredientMatchData([ incorrectIngredientName2 ])).toBe(null);
    expect(getFirstIngredientMatchData([ incorrectIngredientName1, incorrectIngredientName2 ])).toBe(null);
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