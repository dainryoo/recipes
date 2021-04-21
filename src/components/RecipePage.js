import React, { useState, useEffect } from "react";
import useRecipeHook from "../hooks/recipeHook.js";

// view of app when on recipe page
const RecipePage = ({ currRecipe, pantryInfo }) => {
  return (
    <div className="recipe content">
      {currRecipe ? <Recipe currRecipe={currRecipe} pantryInfo={pantryInfo} /> : <Message />}
    </div>
  );
};

// all the info about the currently selected recipe id
const Recipe = ({ currRecipe, pantryInfo }) => {
  return (
    <>
      <p className="title">{currRecipe.label}:</p>
      <Ingredients list={currRecipe.ingredients} totalValues={currRecipe.totalValues} pantryInfo={pantryInfo} />
      <Directions list={currRecipe.directions} />
    </>
  );
};

// shown when no recipes are selected
const Message = () => {
  return "Choose a recipe to begin";
};

// shows ingredients list
const Ingredients = ({ list, totalValues, pantryInfo }) => {
  // clipboard obj holds all ingredient info to copy when user presses Copy to Clipboard button
  const [clipboard, setClipboard] = useState("");

  const { getPantryItemJson } = useRecipeHook(pantryInfo);

  // reset the clipboard data if the recipe (i.e. list of ingredients) changes
  useEffect(() => {
    let clipboardText = "";
    list.forEach((category) => {
      category.ingredients.forEach((item) => {
        const calorieCalculation = `=${num(item.grams) || 0}/100*${
          getPantryItemJson(item.name) ? num(getPantryItemJson(item.name).per100g.calories) : 0
        }`;
        const amount = item.amount + (item.unit != null && item.unit !== "" ? " " + item.unit : "") + " ";

        clipboardText += calorieCalculation + "\t" + amount + (item.label || item.name) + "\n";
      });
      clipboardText += "\n";
    });
    setClipboard(clipboardText);
  }, [list, getPantryItemJson]);

  const copyToClipboard = (event) => {
    const clipboardData = document.getElementById("clipboard-data");
    clipboardData.select();
    document.execCommand("copy");
  };

  return (
    <div className="ingredients subcontent">
      <p className="title">Ingredients:</p>
      <button onClick={copyToClipboard}>copy</button>
      <textarea readOnly id="clipboard-data" value={clipboard} />
      {list && (
        <table className="table">
          <tbody>
            {list.map((currentCategory, index) => (
              <IngredientCategory key={index} category={currentCategory} />
            ))}
            <TotalValues values={totalValues} />
          </tbody>
        </table>
      )}
    </div>
  );
};

// each ingredient category
const IngredientCategory = ({ category }) => {
  return (
    <>
      <tr>
        <td>{category.category}</td>
      </tr>
      {category.ingredients.map((item, index) => (
        <Ingredient key={index} item={item} />
      ))}
      <tr>
        <td> ...</td>
      </tr>
    </>
  );
};

// a single ingredient
const Ingredient = ({ item }) => {
  const { label, amount, unit, grams, calories, protein, price } = item;
  const shownGramsValue = !["", "g", "ml", "oz", "lb"].includes(unit) ? `(${num(grams)} g)` : "";

  return (
    <tr>
      <td>{`${amount} ${unit} ${shownGramsValue} ${label}`}</td>
      <td>{num(calories) + " cal"}</td>
      <td>{num(protein) + " g protein"}</td>
      <td>{"$" + num(price)}</td>
    </tr>
  );
};

// display total nutritional and price values for recipe
const TotalValues = ({ values }) => {
  return (
    <tr>
      <td></td>
      <td>{`${num(values.calories)} total cal`}</td>
      <td>{`${num(values.protein)} total g protein`}</td>
      <td>{`$${num(values.price)} total`}</td>
    </tr>
  );
};

// shows list of directions
const Directions = ({ list }) => {
  return (
    <div className="directions subcontent">
      <p className="title">Directions:</p>
      {list ? (
        <ul className="list">
          {list.map((step, index) =>
            step.length > 0 ? (
              <li className="step" key={index}>
                {step}
              </li>
            ) : (
              <p key={index}></p>
            )
          )}
        </ul>
      ) : (
        <div className="error">Error with directions list for this recipe</div>
      )}
    </div>
  );
};

// take in a numerical value and return it with no decimals, or two decimal points if needed
const num = (value) => {
  return value ? +(Math.round(value + "e+2") + "e-2") : value;
};

export default RecipePage;
