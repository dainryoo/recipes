const { MealPlan } = require("../data/utils/mealPlanUtils");
const { Calendar } = require("../data/utils/calendarUtils");
const { MEAL_PLAN_ENTRY, DAYS_OF_WEEK } = require("../data/constants/calendar");

test("MealPlan class and its helper functions behave as expected", () => {
    const mealPlan = new MealPlan();

    const meal1Groceries = {
        "ground pork": {
            "lb": 0.5
        },
        "green onion": {
            "item": 1
        },
        "potato": {
            "item": 1
        }
    };

    const meal2Groceries = {
        "ground pork": {
            "oz": 16
        },
        "green onion": {
            "item": 1
        }
    };

    const meal3Groceries = {
        "ground pork": {
            "lb": 0.5
        },
        "sweet potato": {
            "item": 1
        }
    };

    const meal1And2Groceries = {
        "ground pork": {
            "lb": 0.5,
            "oz": 16
        },
        "green onion": {
            "item": 2
        },
        "potato": {
            "item": 1
        }
    };

    const meal1And2And3Groceries = {
        "ground pork": {
            "lb": 1,
            "oz": 16
        },
        "green onion": {
            "item": 2
        },
        "potato": {
            "item": 1
        },
        "sweet potato": {
            "item": 1
        }
    };

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal1Groceries);
    expect(mealPlan.getMeal(1)).toEqual({
        recipeName: "meal1Recipe",
        whenToEat: [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ],
        recipeGroceries: meal1Groceries
    });
    expect(mealPlan.getGroceryList()).toEqual(meal1Groceries);

    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal2Groceries);
    mealPlan.resetMealPlan();
    expect(mealPlan.getAllMeals()).toEqual({});
    expect(mealPlan.getGroceryList()).toEqual({});

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal1Groceries);
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal2Groceries);
    expect(mealPlan.getGroceryList()).toEqual(meal1And2Groceries);

    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 3, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal3Groceries);
    expect(mealPlan.getGroceryList()).toEqual(meal1And2And3Groceries);

    mealPlan.removeMeal(3);
    expect(mealPlan.getMeal(3)).toEqual(undefined);
    expect(mealPlan.getGroceryList()).toEqual(meal1And2Groceries);

    mealPlan.removeMeal(3);
    expect(mealPlan.getMeal(3)).toEqual(undefined);
    expect(mealPlan.getMeal(1)).toEqual({
        recipeName: "meal1Recipe",
        whenToEat: [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ],
        recipeGroceries: meal1Groceries
    });
    expect(mealPlan.getGroceryList()).toEqual(meal1And2Groceries);
});

test("MealPlan's findAllMealsForDay allows searching for all meals for a certain day", () => {
    const mealPlan = new MealPlan();

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});

    expect(mealPlan.findAllMealsForDay(1)).toEqual({
        0: "meal1Recipe",
        1: "meal2Recipe",
    });

    expect(mealPlan.findAllMealsForDay(2)).toEqual({
        0: "meal3Recipe"
    });

    expect(mealPlan.findAllMealsForDay(4)).toEqual(null);
});

test("MealPlan's getMealOfDay allows searching for a specific meal type for a certain day", () => {
    const mealPlan = new MealPlan();

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});

    expect(mealPlan.getMealOfDay(1, 0)).toEqual("meal1Recipe");
    expect(mealPlan.getMealOfDay(1, 1)).toEqual("meal2Recipe");
    expect(mealPlan.getMealOfDay(1, 2)).toEqual(null);

    expect(mealPlan.getMealOfDay(2, 0)).toEqual("meal3Recipe");
    expect(mealPlan.getMealOfDay(2, 1)).toEqual(null);

    expect(mealPlan.getMealOfDay(4, 0)).toEqual(null);
    expect(mealPlan.getMealOfDay(4, 1)).toEqual(null);
});

test("MealPlan's getMealIdOfMealOfDay allows retrieving the mealId of the specific meal type for a certain day", () => {
    const mealPlan = new MealPlan();

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});

    expect(mealPlan.getMealIdOfMealOfDay(1, 0)).toEqual("1");
    expect(mealPlan.getMealIdOfMealOfDay(1, 1)).toEqual("2");
    expect(mealPlan.getMealIdOfMealOfDay(1, 2)).toEqual(null);

    expect(mealPlan.getMealIdOfMealOfDay(2, 0)).toEqual("3");
    expect(mealPlan.getMealIdOfMealOfDay(2, 1)).toEqual(null);

    expect(mealPlan.getMealIdOfMealOfDay(4, 0)).toEqual(null);
    expect(mealPlan.getMealIdOfMealOfDay(4, 1)).toEqual(null);
});

test("MealPlan's getShoppingListUiString should generate the correct expected single string", () => {
    const mealPlan = new MealPlan();

    const meal1Groceries = {
        "ground pork": {
            "lb": 0.5
        },
        "green onion": {
            "item": 1
        },
        "potato": {
            "item": 1
        }
    };

    const meal1GroceryList = "1 green onion, 1 potato, 0.5 lb ground pork";

    const meal2Groceries = {
        "ground pork": {
            "oz": 16
        },
        "green onion": {
            "item": 1
        }
    };

    const meal3Groceries = {
        "ground pork": {
            "lb": 0.5
        },
        "sweet potato": {
            "item": 1
        }
    };

    const meal1And2Groceries = {
        "ground pork": {
            "lb": 0.5,
            "oz": 16
        },
        "green onion": {
            "item": 2
        },
        "potato": {
            "item": 1
        }
    };

    const meal1And2GroceryList = "2 green onion, 1 potato, 0.5 lb + 16 oz ground pork";

    const meal1And2And3Groceries = {
        "ground pork": {
            "lb": 1,
            "oz": 16
        },
        "green onion": {
            "item": 2
        },
        "potato": {
            "item": 1
        },
        "sweet potato": {
            "item": 1
        }
    };

    const meal1And2And3GroceryList = "2 green onion, 1 potato, 1 sweet potato, 1 lb + 16 oz ground pork";

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal1Groceries);
    expect(mealPlan.getGroceryList()).toEqual(meal1Groceries);
    expect(mealPlan.getShoppingListUiString()).toEqual(meal1GroceryList);
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal2Groceries);
    expect(mealPlan.getGroceryList()).toEqual(meal1And2Groceries);
    expect(mealPlan.getShoppingListUiString()).toEqual(meal1And2GroceryList);
    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 3, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], meal3Groceries);
    expect(mealPlan.getGroceryList()).toEqual(meal1And2And3Groceries);
    expect(mealPlan.getShoppingListUiString()).toEqual(meal1And2And3GroceryList);

    mealPlan.removeMeal("3");
    expect(mealPlan.getGroceryList()).toEqual(meal1And2Groceries);
    mealPlan.removeMeal("2");
    expect(mealPlan.getShoppingListUiString()).toEqual(meal1GroceryList);
    mealPlan.removeMeal("1");
    expect(mealPlan.getShoppingListUiString()).toEqual("");
});

test("MealPlan's getAllMealsString should return a single string of all the meals in order", () => {
    const mealPlan = new MealPlan();
    const calendar = new Calendar(4);

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 2, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});

    const expectedString = `${DAYS_OF_WEEK.SUN}\t${DAYS_OF_WEEK.MON}\t${DAYS_OF_WEEK.TUE}\t${DAYS_OF_WEEK.WED}\nmeal1Recipe\tmeal1Recipe\tmeal3Recipe\t...\nmeal2Recipe\tmeal2Recipe\t...\t...`;
    expect(mealPlan.getAllMealsString()).toEqual(null);
    expect(mealPlan.getAllMealsString(calendar)).toEqual(expectedString);
});

test("When adding meals to a MealPlan, any entries overlapping with the whenToEat of the new meal should be removed", () => {
    const mealPlan = new MealPlan();

    mealPlan.addMealToAllMeals("1", "meal1Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    mealPlan.addMealToAllMeals("2", "meal2Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 }, { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    expect(mealPlan.getMealOfDay(1, 0)).toEqual("meal1Recipe");
    expect(mealPlan.getMealIdOfMealOfDay(1, 0)).toEqual("1");

    mealPlan.addMealToAllMeals("3", "meal3Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 } ], {});
    expect(mealPlan.getMealOfDay(1, 0)).toEqual("meal3Recipe");
    expect(mealPlan.getMealIdOfMealOfDay(1, 0)).toEqual("3");
    expect(mealPlan.getMealOfDay(0, 0)).toEqual(null);
    expect(mealPlan.getMealIdOfMealOfDay(0, 0)).toEqual(null);

    mealPlan.addMealToAllMeals("4", "meal4Recipe", [ { [MEAL_PLAN_ENTRY.DAY]: 1, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 0 }, { [MEAL_PLAN_ENTRY.DAY]: 0, [MEAL_PLAN_ENTRY.MEAL_TYPE]: 1 } ], {});
    expect(mealPlan.getMealOfDay(1, 0)).toEqual("meal4Recipe");
    expect(mealPlan.getMealIdOfMealOfDay(1, 0)).toEqual("4");
    expect(mealPlan.getMealOfDay(0, 0)).toEqual(null);
    expect(mealPlan.getMealIdOfMealOfDay(0, 0)).toEqual(null);
    expect(mealPlan.getMealOfDay(1, 1)).toEqual(null);
    expect(mealPlan.getMealIdOfMealOfDay(1, 1)).toEqual(null);
});