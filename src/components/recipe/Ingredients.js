import React, { useState } from 'react';
import IngredientInputBox from "./IngredientInputBox.js";

const Ingredients = (props) => {

  const { ingredients, onMultiplerChange, recipeMultipler } = props;

  const [inputView, toggleInputView] = useState(true);

  const handleToggleChange = () => {
    toggleInputView(!inputView);
  }

  return (
    <div className="subcontent">
      <div className="subheading">Ingredients:</div>
      <div className="recipe-multiplier">
        <input type="number" min="0" step=".01" onChange={onMultiplerChange} defaultValue={recipeMultipler}/>x original recipe:
      </div>
      <table>
        <tbody>
          {ingredients && ingredients.map((currItem, index) => (
            <tr key={index}>
              { currItem.ingredients && <td className="ingredient-category">{currItem.label + ":"}</td> }

              { currItem.amount &&
                <td className="ingredient-name">
                  <button onClick={handleToggleChange}>
                    {(currItem.amount + (currItem.unit.length > 0 && " " + currItem.unit)
                      + (currItem.amount_in_grams != null ? (" (" + parseFloat(currItem.amount_in_grams).toFixed(2) + " g)") : ""))}
                  </button>
                  {(" " + currItem.label) + (currItem.note ? (", " + currItem.note) : "")}
                </td>}

              <td className="calorie-column">
                { currItem.calories != null ? (parseFloat(currItem.calories).toFixed(2) + " cal") : "" }
              </td>
              <td className="price-column">
                { currItem.price != null ? (" $" + parseFloat(currItem.price).toFixed(2)) : "" }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ingredients;
