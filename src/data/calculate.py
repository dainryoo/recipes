import json

gram_names = ["g", "gram", "grams"]
ml_names = ["ml", "mL", "milliliter", "milliliters"]
oz_names = ["oz", "ounce", "ounces"]
lb_names = ["lb", "lbs", "pound", "pounds"]
tsp_names = ["t", "tsp", "teaspoon", "teaspoons"]
tbsp_names = ["T", "tbsp", "Tbsp", "tablespoon", "tablespoons"]
cup_names = ["c", "cup", "cups"]

# fill in recipes array with nutrition info
def process_recipe_file():
    recipes_file_name = "recipes.json"
    recipes_with_nutrition_file_name = "recipes-with-nutrition.json"
    pantry_file_name = "pantry.json"
    generated_pantry_file_name = "generated-pantry.json"

    print("Opening pantry file")
    pantry_file = open(pantry_file_name, "r")
    pantry = json.load(pantry_file)
    pantry_file.close()

    fill_out_pantry(pantry)

    print("Writing into new pantry file")
    generated_pantry_file = open(generated_pantry_file_name, "w")
    json.dump(pantry, generated_pantry_file, sort_keys=True, indent=2)
    generated_pantry_file.close()

    print("Opening recipes file")
    recipes_file = open(recipes_file_name, "r")
    recipes = json.load(recipes_file)
    recipes_file.close()

    calculate_nutrition(recipes, pantry)

    print("Writing into recipes file")
    recipes_with_nutrition_file = open(recipes_with_nutrition_file_name, "w")
    json.dump(recipes, recipes_with_nutrition_file, sort_keys=True, indent=2)
    recipes_with_nutrition_file.close()

# goes through pantry and calculates data based on inputted data
def fill_out_pantry(pantry):
    print("Calculating data for extra pantry information")
    # for each pantry item category in the list of pantry categories:
    for i in range(len(pantry)):
        curr_pantry_category = pantry[i]["items"]
        # for each item in this pantry category:
        for j in range(len(curr_pantry_category)):
            # fill out extra pantry item nutrition info
            curr_item = curr_pantry_category[j]
            fill_out_pantry_item_info(curr_item)

# calculate extra data for a pantry item based on inputted data
def fill_out_pantry_item_info(item):
    if "serving_nutrition" in item:
        serving = item["serving_nutrition"]
        unit = serving["unit"]
        grams = serving["grams"]*1.0
        amount = serving["amount"]*1.0

        item["per_100_gram"] = {
            "calories": 100.0/grams*serving["calories"],
            "protein": 100.0/grams*serving["protein"],
        }
        item["conversion_to_grams"] = {
            "oz": 28.34952,
            "lb": 453.59237
        }

        if unit == "":
            item["per_unit"] = {
                "calories": serving["calories"]/amount,
                "protein": serving["protein"]/amount,
                "avg_grams": grams/amount
            }
        else:
            if unit in oz_names or unit in lb_names:
                oz_to_g = grams/amount if unit in oz_names else grams/amount/16.0
                lb_to_g = grams/amount*16.0 if unit in oz_names else grams/amount

                item["conversion_to_grams"]["oz"] = oz_to_g
                item["conversion_to_grams"]["lb"] = lb_to_g
            else:
                tsp_to_g =  grams/amount if unit in tsp_names else grams/amount/3.0 if unit in tbsp_names else grams/amount/48.0
                tbsp_to_g =  grams/amount*3.0 if unit in tsp_names else grams/amount if unit in tbsp_names else grams/amount/16.0
                cup_to_g =  grams/amount*48.0 if unit in tsp_names else grams/amount*16.0 if unit in tbsp_names else grams/amount

                item["conversion_to_grams"]["tsp"] = tsp_to_g
                item["conversion_to_grams"]["tbsp"] = tbsp_to_g
                item["conversion_to_grams"]["cup"] = cup_to_g


        price = item["price_per_unit"]["price"]
        price_unit = item["price_per_unit"]["unit"]

        if price_unit == "":
            item["per_unit"]["price"] = price*1.0/amount
            item["per_100_gram"]["price"] = 100.0/grams*price
        else:
            if price_unit in item["conversion_to_grams"]:
                item["per_100_gram"]["price"] = 100.0/item["conversion_to_grams"][price_unit] * price
                if "per_unit" in item:
                    item["per_unit"]["price"] = grams/item["conversion_to_grams"][price_unit]/amount * price
            elif price_unit in gram_names:
                item["per_100_gram"]["price"] = 100.0*price


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
    total_recipe_calories = 0.0
    total_recipe_protein = 0.0
    total_recipe_price = 0.0

    for i in range(len(ingredients)):
        # get nutrition info for each ingredient in the recipe
        curr_ingredient = ingredients[i]
        calculate_ingredient_nutrition(curr_ingredient, pantry)
        total_recipe_calories += curr_ingredient["calories"]
        total_recipe_protein += curr_ingredient["protein"]
        total_recipe_price += curr_ingredient["price"]

    recipe["nutrition"] = {
        "calories": total_recipe_calories,
        "protein": total_recipe_protein,
        "price": total_recipe_price
    }

# calculate the nutrition of a recipe with ingredient subcategories
def calculate_nutrition_with_categories(recipe, ingredient_category, pantry):
    ingredients = ingredient_category["ingredients"]

    # get info if the recipe already has existing nutrition info (else start from 0.0 for everything)
    total_recipe_calories = recipe["nutrition"]["calories"] if recipe.has_key("nutrition") else 0.0
    total_recipe_protein = recipe["nutrition"]["protein"] if recipe.has_key("nutrition") else 0.0
    total_recipe_price = recipe["nutrition"]["price"] if recipe.has_key("nutrition") else 0.0

    for i in range(len(ingredients)):
        # get nutrition info for each ingredient in the recipe
        curr_ingredient = ingredients[i]
        calculate_ingredient_nutrition(curr_ingredient, pantry)
        total_recipe_calories += curr_ingredient["calories"]
        total_recipe_protein += curr_ingredient["protein"]
        total_recipe_price += curr_ingredient["price"]

    recipe["nutrition"] = {
        "calories": total_recipe_calories,
        "protein": total_recipe_protein,
        "price": total_recipe_price
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
        if unit in gram_names or unit in ml_names:
            # if unit is grams or ml, we can just use the raw value for value in grams
            amount = ingredient["amount"]
        elif unit in oz_names or unit in lb_names:
            # if unit is pounds, convert weight to ounces; else, keep the ounce amount
            amount = ingredient["amount"] * 16.0 if unit in lb_names else ingredient["amount"]

            # once unit is ounces, convert weight to grams
            if ("conversion_to_grams" in ingredient_info and "oz" in ingredient_info["conversion_to_grams"]):
                amount = amount * ingredient_info["conversion_to_grams"]["oz"]
            else:
                amount = ingredient["amount"] * 28.34952

        else:
            # if unit is anything else, handle special case abbreviations
            unit_name = "tsp" if unit in tsp_names else "tbsp" if unit in tbsp_names else "cup"

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
