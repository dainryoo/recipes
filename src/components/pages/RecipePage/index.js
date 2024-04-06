import React from "react";
import { useParams } from "react-router-dom";
import PageComponent from "Common/PageComponent";
import CopyButton from "Common/CopyButton";
import recipes from "Data/processedRecipes.json";
import { cleanNum, findIdMatch } from "Data/utils/basicUtils";
import { isVolumeUnit } from "Data/utils/unitsUtils";

const RecipePage = () => {
  const { id } = useParams();
  const recipe = findIdMatch(id, recipes);

  return (
    <PageComponent header={recipe?.name  ?? "choose a recipe"} sidenavLinks={recipes}>
      { recipe ? 
        <div>
          { recipe?.groceryList ? 
            <div>
              <h2>
                Grocery List
                <CopyButton clipboardText={recipe.groceryList} />
              </h2>
              <p>{recipe.groceryList}</p>
            </div>
            :
            null
          }
          <div>
            <h2>
              Ingredients
              <CopyButton clipboardText={recipe.ingredientListSimple} />
              <CopyButton clipboardText={recipe.ingredientListFormattedForSpreadsheet} copyButtonText='Copy for Spreadsheet' />
            </h2>
            {recipe?.ingredients?.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3>{category.category}</h3>
                {category.items.map((item, itemIndex) => (
                  <Ingredient key={itemIndex} item={item} />
                ))}
              </div>
            ))}
          </div>
          <div>
            <h2>Directions</h2>
            {recipe?.directions?.map((step, stepIndex) => {
              return <p key={`${recipe?.id}-step-${stepIndex}`}>{step || <br/> }</p>
            })}
          </div>
          <div>
            <h2>
              Nutrition
              <CopyButton clipboardText={cleanNum(recipe?.nutrition?.totalCalories)}/>
            </h2>
            <p>{cleanNum(recipe?.nutrition?.totalCalories)} calories</p>
            <p>{cleanNum(recipe?.nutrition?.totalProtein)} g protein</p>
          </div>
        </div>
        :
        null
      }
    </PageComponent>
  );
};

// A single ingredient
const Ingredient = ({ item }) => {
  const { name, amount, unit, note, nutrition } = item;
  const showGrams = nutrition?.grams && isVolumeUnit(unit);
  return (
    <p>
      {cleanNum(amount)} {unit} {showGrams ? `(${cleanNum(nutrition.grams)}g)` : ""} {name}
      {note && `, ${note}`}
      {`, ${cleanNum(nutrition.calories)} cal`}
      {`, ${cleanNum(nutrition.protein)}g protein`}
    </p>
  );
};

export default RecipePage;
