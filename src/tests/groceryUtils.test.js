const { 
    addRecipeToMainGroceryList, 
    removeRecipeFromMainGroceryList,
    getGroceryShoppingListItemAmountEntryText,
    generateGroceryShoppingList,
    getShoppingListText
 } = require("../data/utils/groceryUtils");

test('addRecipeToMainGroceryList should properly add groceries (set 1)', () => {
    const recipeGroceries = {
        "pork belly": {
            "lb": 0.5
        },
        "green bell pepper": {
            "item": 0.5
        },
        "onion": {
            "item": 0.5
        },
        "canned black beans": {
            "oz": 15
        }
    };
    
    const mainGroceryList = {
        "pork belly": {
            "oz": 16
        },
        "onion": {
            "item": 1
        }
    };

    const doubledRecipeGroceryList = {
        "pork belly": {
            "lb": 1
        },
        "green bell pepper": {
            "item": 1
        },
        "onion": {
            "item": 1
        },
        "canned black beans": {
            "oz": 30
        }
    };

    const combinedGroceryList = {
        "pork belly": {
            "lb": 0.5,
            "oz": 16
        },
        "green bell pepper": {
            "item": 0.5
        },
        "onion": {
            "item": 1.5
        },
        "canned black beans": {
            "oz": 15
        }
    };

    expect(addRecipeToMainGroceryList(recipeGroceries, {})).toEqual(recipeGroceries);
    expect(addRecipeToMainGroceryList({}, mainGroceryList)).toEqual(mainGroceryList);

    expect(addRecipeToMainGroceryList(recipeGroceries, mainGroceryList)).toEqual(combinedGroceryList);
    expect(addRecipeToMainGroceryList(recipeGroceries, recipeGroceries)).toEqual(doubledRecipeGroceryList);
    expect(addRecipeToMainGroceryList({ "garlic": { "item": 1 } }, mainGroceryList)).toEqual( {...mainGroceryList, "garlic": { "item": 1 } });

    expect(addRecipeToMainGroceryList({}, {})).toEqual({});
    expect(addRecipeToMainGroceryList()).toEqual({});
});

test('addRecipeToMainGroceryList should properly add groceries (set 2)', () => {
    const recipeGroceries = {
        "sweet potato": {
            "g": 300
        }
    };
    
    const mainGroceryList = {
        "sweet potato": {
            "item": 1
        },
        "onion": {
            "item": 1
        }
    };

    const combinedGroceryList = {
        "sweet potato": {
            "item": 1,
            "g": 300
        },
        "onion": {
            "item": 1
        }
    };

    const recipeGroceries2 = {
        "sweet potato": {
            "g": 10
        }
    };

    const combinedGroceryList2 = {
        "sweet potato": {
            "item": 1,
            "g": 310
        },
        "onion": {
            "item": 1
        }
    };

    expect(addRecipeToMainGroceryList(recipeGroceries, mainGroceryList)).toEqual(combinedGroceryList);
    expect(addRecipeToMainGroceryList(recipeGroceries2, combinedGroceryList)).toEqual(combinedGroceryList2);
});

test('removeRecipeFromMainGroceryList should properly remove groceries', () => {
    const recipeGroceries = {
        "pork belly": {
            "lb": 0.5
        },
        "green bell pepper": {
            "item": 0.5
        },
        "red bell pepper": {
            "item": 0.5
        },
        "onion": {
            "item": 1
        },
        "garlic": {
            "item": 2
        },
        "canned black beans": {
            "oz": 15
        }
    };
    
    const mainGroceryList = {
        "pork belly": {
            "oz": 16
        },
        "green bell pepper": {
            "item": 1
        }
    };

    const doubledRecipeGroceryList = addRecipeToMainGroceryList(recipeGroceries, recipeGroceries);
    const combinedGroceryList = addRecipeToMainGroceryList(recipeGroceries, mainGroceryList);

    expect(removeRecipeFromMainGroceryList(recipeGroceries, {})).toEqual({});
    expect(removeRecipeFromMainGroceryList({}, mainGroceryList)).toEqual(mainGroceryList);

    expect(removeRecipeFromMainGroceryList(recipeGroceries, combinedGroceryList)).toEqual(mainGroceryList);
    expect(removeRecipeFromMainGroceryList(recipeGroceries, doubledRecipeGroceryList)).toEqual(recipeGroceries);

    expect(removeRecipeFromMainGroceryList({}, {})).toEqual({});
    expect(removeRecipeFromMainGroceryList()).toEqual({});
});

test('removeRecipeFromMainGroceryList should properly remove groceries (set 2)', () => {
    const recipeGroceries = {
        "onion": {
            "g": 30
        }
    };
    
    const mainGroceryList = {
        "onion": {
            "g": 90
        },
        "green onion": {
            "item": 3
        }
    };

    const reducedGroceryList = {
        "onion": {
            "g": 60
        },
        "green onion": {
            "item": 3
        }
    };

    const reducedGroceryList2 = {
        "onion": {
            "g": 30
        },
        "green onion": {
            "item": 3
        }
    };

    const reducedGroceryList3 = {
        "green onion": {
            "item": 3
        }
    };

    expect(removeRecipeFromMainGroceryList(recipeGroceries, mainGroceryList)).toEqual(reducedGroceryList);
    expect(removeRecipeFromMainGroceryList(recipeGroceries, reducedGroceryList)).toEqual(reducedGroceryList2);
    expect(removeRecipeFromMainGroceryList(recipeGroceries, reducedGroceryList2)).toEqual(reducedGroceryList3);
});

test('removeRecipeFromMainGroceryList should properly remove groceries (set 3)', () => {
    const recipeGroceries = {
        "onion": {
            "lb": 0.3
        }
    };
    
    const mainGroceryList = {
        "onion": {
            "lb": 0.3
        },
        "green onion": {
            "item": 3
        }
    };

    const reducedGroceryList = {
        "green onion": {
            "item": 3
        }
    };

    expect(removeRecipeFromMainGroceryList(recipeGroceries, mainGroceryList)).toEqual(reducedGroceryList);
    expect(removeRecipeFromMainGroceryList(recipeGroceries, mainGroceryList)["onion"]).toEqual(undefined);

    expect(removeRecipeFromMainGroceryList(recipeGroceries, recipeGroceries)).toEqual({});
});

test('getGroceryShoppingListItemAmountEntryText should generate the correct shopping list item entry text', () => {
    expect(getGroceryShoppingListItemAmountEntryText(1, "item", null)).toEqual("1");
    expect(getGroceryShoppingListItemAmountEntryText(1, "item", undefined)).toEqual("1");

    expect(getGroceryShoppingListItemAmountEntryText(10, "g", undefined)).toEqual("10 g");
    expect(getGroceryShoppingListItemAmountEntryText(3, "tbsp", undefined)).toEqual("3 tbsp");

    expect(getGroceryShoppingListItemAmountEntryText(10, "g", 2)).toEqual("~5");
    expect(getGroceryShoppingListItemAmountEntryText(3, "tbsp", 2)).toEqual("3 tbsp");
});

test('generateGroceryShoppingList should generate the correct shopping list', () => {

    const groceryList = {
        "chicken thigh": {
            "lb": 2
        },
        "sweet potato": {
            "item": 1,
            "g": 310
        },
        "onion": {
            "item": 1
        },
        "canned chickpeas": {
            "oz": 15
        },
        "green bell pepper": {
            "item": 1
        }
    };

    const correctShoppingList = [
        { item: "green bell pepper" },
        { item: "sweet potato" },
        { item: "onion" },
        { item: "canned chickpeas" },
        { item: "chicken thigh" },
    ];

    const incorrectShoppingList = [
        { item: "chicken thigh" },
        { item: "sweet potato" },
        { item: "onion" },
        { item: "canned chickpeas" },
        { item: "green bell pepper" }
    ];

    const incorrectShoppingList2 = [
        { item: "green bell pepper" },
        { item: "sweet potato" },
        { item: "onion" },
    ];

    const incorrectShoppingList3 = [
        { item: "green bell pepper" },
        { item: "red bell pepper" },
        { item: "sweet potato" },
        { item: "onion" },
        { item: "canned chickpeas" },
        { item: "chicken thigh" },
    ];

    const shoppingList = generateGroceryShoppingList(groceryList);
    expect(shoppingList).toMatchObject(correctShoppingList);

    expect(shoppingList).not.toMatchObject(incorrectShoppingList);
    expect(shoppingList).not.toMatchObject(incorrectShoppingList2);
    expect(shoppingList).not.toMatchObject(incorrectShoppingList3);
});

test('getShoppingListText should generate the correct shopping list UI strings', () => {
    expect(getShoppingListText({}).uiString).toEqual("");

    const groceryList = {
        "chicken thigh": {
            "lb": 2,
            "oz": 16
        },
        "onion": {
            "item": 1
        },
        "apple": {
            "item": 1
        }
    };
    
    const shoppingListText = getShoppingListText(groceryList);
    expect(shoppingListText.uiString).toEqual("1 apple, 1 onion, 2 lb + 16 oz chicken thigh");
});

test('getShoppingListText should generate the correct shopping list UI strings', () => {
    expect(getShoppingListText({}).clipboardString).toEqual("");
    
    const groceryList = {
        "chicken thigh": {
            "lb": 2.225,
            "oz": 16
        },
        "onion": {
            "item": 1
        },
        "apple": {
            "item": 1
        }
    };
    
    const shoppingListText = getShoppingListText(groceryList);
    expect(shoppingListText.clipboardString).toEqual("apple (1)\nonion (1)\nchicken thigh (2.23 lb + 16 oz)");
});