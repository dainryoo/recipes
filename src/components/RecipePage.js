import React, { useState, useEffect } from "react";
import useRecipeHook from "../hooks/recipeHook.js";

// view of app when on recipe page
const RecipePage = ({ currRecipe, pantryInfo, mobileView }) => {
  return (
    <div className={"recipe content " + (mobileView === "content" ? "mobile-show" : "mobile-hide")}>
      {currRecipe ? <Recipe currRecipe={currRecipe} pantryInfo={pantryInfo} /> : <Message />}
    </div>
  );
};

// all the info about the currently selected recipe id
const Recipe = ({ currRecipe, pantryInfo }) => {
  return (
    <>
      <div className="title">{currRecipe.label}:</div>
      <Ingredients list={currRecipe.ingredients} totalValues={currRecipe.totalValues} pantryInfo={pantryInfo} />
      <Directions list={currRecipe.directions} />
      <GroceryList list={currRecipe.groceryList} />
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

    // Highlight the text on the table to show that we've copied it
    const table = document.getElementById("ingredients-table");
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(table);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(table);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className="ingredients subcontent">
      <div className="title">
        Ingredients:{" "}
        <button className="copy-button" onClick={copyToClipboard}>
          copy
        </button>
      </div>
      <textarea readOnly id="clipboard-data" value={clipboard} />
      {list && (
        <table className="table" id="ingredients-table">
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
        <td>{category.category ? category.category + ":" : ""}</td>
      </tr>
      {category.ingredients.map((item, index) => (
        <Ingredient key={index} item={item} />
      ))}
      <tr>
        <td className="empty-cell">...</td>
      </tr>
    </>
  );
};

// a single ingredient
const Ingredient = ({ item }) => {
  const { label, amount, unit, note, grams, calories, protein, price } = item;
  const optionalNote = note ? `, ${note}` : "";
  const shownGramsValue = !["", "g", "ml", "oz", "lb"].includes(unit) ? `(${num(grams)} g)` : "";

  return (
    <tr>
      <td>{`${num(amount)} ${unit} ${shownGramsValue} ${label}${optionalNote}`}</td>
      <td>{num(calories) + " cal"}</td>
      <td>{num(protein) + " g protein"}</td>
      <td>{"$" + numPrice(price)}</td>
    </tr>
  );
};

// display total nutritional and price values for recipe
const TotalValues = ({ values }) => {
  return (
    <tr>
      <td>Total:</td>
      <td>{`${num(values.calories)} cal`}</td>
      <td>{`${num(values.protein)} g protein`}</td>
      <td>{`$${numPrice(values.price)}`}</td>
    </tr>
  );
};

// shows list of directions
const Directions = ({ list }) => {
  return (
    <div className="directions subcontent">
      <p className="title">Directions:</p>
      <ul className="list">
        {list.map((step, index) =>
          step.length > 0 ? (
            <li className="step" key={index}>
              {step}
            </li>
          ) : (
            <br key={index} />
          )
        )}
      </ul>
    </div>
  );
};

const GroceryList = ({ list }) => {
  return list ? (
    <div className="grocery-list subcontent">
      <div className="title">Grocery list:</div>
      <p>{list}</p>
    </div>
  ) : (
    <></>
  );
};

// take in a numerical value and return it with no decimals, or two decimal points if needed
const num = (value) => {
  return value ? +(Math.round(value + "e+2") + "e-2") : value;
};
// take in a numerical value and return it with two decimal points; use for prices
const numPrice = (value) => {
  return value ? value.toFixed(2) : Number(0).toFixed(2);
};

export default RecipePage;
