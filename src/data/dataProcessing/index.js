const fs = require("fs");
const path = require("path");
const { processIngredients } = require("./processIngredients");
const { processRecipes } = require("./processRecipes");

const ingredientsFile = fs.readFileSync(path.join(__dirname, "../constants/ingredients.json"));
const rawIngredients = JSON.parse(ingredientsFile);
const recipesFile = fs.readFileSync(path.join(__dirname, "../constants/recipes.json"));
const rawRecipes = JSON.parse(recipesFile);

// Process ingredients
const processedIngredients = processIngredients(rawIngredients);
// Save the processed ingredients data into a new file
fs.writeFileSync(
  path.join(__dirname, "../processedIngredients.json"),
  JSON.stringify(processedIngredients),
  "utf8"
);

// Process recipes using the processed ingredients data
const processedRecipes = processRecipes(rawRecipes, processedIngredients);
// Save the processed recipes data into a new file
fs.writeFileSync(
  path.join(__dirname, "../processedRecipes.json"),
  JSON.stringify(processedRecipes),
  "utf8"
);