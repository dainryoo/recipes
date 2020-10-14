import json

# fill in recipes array with nutrition info
def process_recipe_file():
    recipes_file_name = "recipes.json"
    recipes_with_nutrition_file_name = "recipes-with-nutrition.json"
    pantry_file_name = "pantry.json"

    print("Opening recipes file");
    recipes_file = open(recipes_file_name, "r")
    recipes = json.load(recipes_file)
    recipes_file.close()

    print("Opening pantry file");
    pantry_file = open(pantry_file_name, "r")
    pantry = json.load(pantry_file)
    pantry_file.close()

    calculate_nutrition(recipes, pantry);

    print("Writing into recipes file");
    recipes_with_nutrition_file = open(recipes_with_nutrition_file_name, "w")
    json.dump(recipes, recipes_with_nutrition_file, sort_keys=True, indent=2)
    recipes_with_nutrition_file.close()

# calculates nutrition info of all the recipes
def calculate_nutrition(all_recipes, pantry):
    print("Calculating nutrition of all recipes")
    # for each recipe category in the list of recipe categories:
    for i in range(len(all_recipes)):
        curr_recipe_category = all_recipes[i]["recipes"]
        # for each recipe in this recipe category:
        for j in range(len(curr_recipe_category)):
            # calculate and append nutrition info
            curr_recipe = curr_recipe_category[j]
            # if the recipe has multiple ingredient categories
            if (curr_recipe.has_key("ingredient_categories")):
                for i in range(len(curr_recipe["ingredient_categories"])):
                    curr_category = curr_recipe["ingredient_categories"][i]
                    calculate_nutrition_with_categories(curr_recipe, curr_category, pantry)
            else:
                calculate_recipe_nutrition(curr_recipe, pantry)


# calculate the nutrition of a recipe
def calculate_recipe_nutrition(recipe, pantry):
    ingredients = recipe["ingredients"]
    total_calories = 0.0
    total_protein = 0.0
    total_price = 0.0

    for i in range(len(ingredients)):
        # get nutrition info for each ingredient in the recipe
        curr_ingredient = ingredients[i]
        calculate_ingredient_nutrition(curr_ingredient, pantry)
        total_calories += curr_ingredient["calories"]
        total_protein += curr_ingredient["protein"]
        total_price += curr_ingredient["price"]

    recipe["nutrition"] = {
        "calories": total_calories,
        "protein": total_protein,
        "price": total_price
    }

# calculate the nutrition of a recipe with ingredient subcategories
def calculate_nutrition_with_categories(recipe, ingredient_category, pantry):
    ingredients = ingredient_category["ingredients"]

    # if the recipe already has existing nutrition info
    if (recipe.has_key("per_unit")):
        total_calories = recipe["per_unit"]["calories"]
        total_protein = recipe["per_unit"]["protein"]
        total_price = recipe["per_unit"]["price"]
    else:
        total_calories = 0.0
        total_protein = 0.0
        total_price = 0.0

    for i in range(len(ingredients)):
        # get nutrition info for each ingredient in the recipe
        curr_ingredient = ingredients[i]
        calculate_ingredient_nutrition(curr_ingredient, pantry)
        total_calories += curr_ingredient["calories"]
        total_protein += curr_ingredient["protein"]
        total_price += curr_ingredient["price"]

    recipe["nutrition"] = {
        "calories": total_calories,
        "protein": total_protein,
        "price": total_price
    }


# calculate the nutrition of a single ingredient from a recipe
def calculate_ingredient_nutrition(ingredient, pantry):
    ingredient_info = find_pantry_item(ingredient, pantry)

    # if we didn't find the ingredient in the pantry, set nutrition info as 0
    if (ingredient_info == None):
        ingredient["calories"] = 0.0
        ingredient["protein"] = 0.0
        ingredient["price"] = 0.0
        ingredient["label"] = ingredient["name"]
        print("ERROR: " + ingredient['name'] + " was not found in pantry information.\n")
        return

    # if we found the ingredient, proceed with nutrition calculation
    ingredient["label"] = ingredient_info["label"] if ingredient_info["label"] != None else ingredient_info["name"]

    if ("unit" not in ingredient or ingredient["unit"] == ""):
        # if no unit is defined/used in the amount for this ingredient
        calories_per_unit = ingredient_info["per_unit"]["calories"]
        protein_per_unit = ingredient_info["per_unit"]["protein"]
        price_per_unit = ingredient_info["per_unit"]["price"]
        number_of_units = ingredient["amount"]

        ingredient["calories"] = calories_per_unit * number_of_units
        ingredient["protein"] = protein_per_unit * number_of_units
        ingredient["price"] = price_per_unit * number_of_units
    else:
        # figure out which unit is used
        unit = ingredient["unit"]
        if unit in ["g", "gram", "grams", "ml", "mL", "milliliter", "milliliters"]:
            # if unit is grams or ml, we can just use the raw value for value in grams
            amount = ingredient["amount"]
        elif unit in ["lb", "lbs", "pound", "pounds"]:
            # if unit is pounds, convert weight to grams
            amount = ingredient["amount"] * 453.592
        elif unit in ["oz", "ounce", "ounces"]:
            # if unit is ounces, convert weight to grams
            amount = ingredient["amount"] * 28.3495
        else:
            # if unit is anything else, handle special case abbreviations
            if unit in ["t", "tsp", "teaspoon", "teaspoons"]:
                unit_name = "tsp"
            elif unit in ["T", "tbsp", "Tbsp", "tablespoon", "tablespoons"]:
                unit_name = "tbsp"
            elif unit in ["c", "cup", "cups"]:
                unit_name = "cup"
            # calculate the value in grams
            if ("conversion_to_grams" in ingredient_info):
                amount = ingredient["amount"] * ingredient_info["conversion_to_grams"][unit_name]
            else:
                amount = ingredient["amount"] * 100.0 / ingredient_info["per_100_gram"][unit_name]
            # save amount in grams into recipe for reference
            ingredient["amount_in_grams"] = amount

        ingredient["calories"] = amount / 100.0 * ingredient_info["per_100_gram"]["calories"]
        ingredient["protein"] = amount / 100.0 * ingredient_info["per_100_gram"]["protein"]
        ingredient["price"] = amount / 100.0 * ingredient_info["per_100_gram"]["price"]



# returns the ingredient info from the pantry; if not found, return None
def find_pantry_item(ingredient, pantry):
    for i in range(len(pantry)):
        curr_pantry_category = pantry[i]["items"]
        for j in range(len(curr_pantry_category)):
            if curr_pantry_category[j]["name"] == ingredient["name"]:
                return curr_pantry_category[j]
    return


if __name__ == '__main__':
    process_recipe_file()
