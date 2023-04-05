const { INGREDIENT_TAGS } = require("./tags")

const STORES = {
  WF: "whole-foods",
  CM: "central-market",
  HM: "h-mart"
};

// Types (tags) of ingredients that we want to add to our groceries
const tagsToAddToGrocery = [
  INGREDIENT_TAGS.PRODUCE,
  INGREDIENT_TAGS.NUT,
  INGREDIENT_TAGS.CANNED,
  INGREDIENT_TAGS.PROTEIN,
  INGREDIENT_TAGS.CHEESE,
  INGREDIENT_TAGS.YOGURT,
  INGREDIENT_TAGS.MISC,
];

// The order that each store lays out their items
const storeOrders = {
  [STORES.WF]: [
    "apple",
    INGREDIENT_TAGS.FRUIT,
    "avocado",
    INGREDIENT_TAGS.HERB,
    "green onion",
    "cabbage",
    "green bell pepper",
    "red bell pepper",
    "yellow bell pepper",
    "tomatillo",
    "jalapeno",
    "zucchini",
    "cucumber",
    "ginger",
    INGREDIENT_TAGS.VEGETABLE,
    INGREDIENT_TAGS.PRODUCE,
    "cherry tomato",
    "grape tomato",
    "roma tomato",
    "potato",
    "sweet potato",
    "onion",
    "garlic",
    "shallot",
    INGREDIENT_TAGS.NUT,
    INGREDIENT_TAGS.CANNED,
    INGREDIENT_TAGS.PROTEIN,
    INGREDIENT_TAGS.CHEESE,
    INGREDIENT_TAGS.YOGURT,
    INGREDIENT_TAGS.DAIRY,
    INGREDIENT_TAGS.MISC
  ],
  [STORES.CM]: [
    "zucchini",
    "green bell pepper",
    "red bell pepper",
    "yellow bell pepper",
    "tomatillo",
    "jalapeno",
    "cherry tomato",
    "grape tomato",
    "roma tomato",
    "avocado",
    "potato",
    "sweet potato",
    "onion",
    "garlic",
    "shallot",
    INGREDIENT_TAGS.VEGETABLE,
    "apple",
    INGREDIENT_TAGS.FRUIT,
    INGREDIENT_TAGS.PRODUCE,
    INGREDIENT_TAGS.NUT,
    INGREDIENT_TAGS.CANNED,
    INGREDIENT_TAGS.PROTEIN,
    INGREDIENT_TAGS.MISC
  ],
  [STORES.HM]: [
    INGREDIENT_TAGS.PRODUCE,
    INGREDIENT_TAGS.NOODLE,
    INGREDIENT_TAGS.PROTEIN,
    INGREDIENT_TAGS.CANNED,
    INGREDIENT_TAGS.NUT,
    INGREDIENT_TAGS.MISC
  ],
};

module.exports = {
  STORES,
  tagsToAddToGrocery,
  storeOrders
}