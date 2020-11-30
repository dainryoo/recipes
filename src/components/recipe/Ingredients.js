import React, { useState, useEffect } from 'react';
import IngredientInputBox from "./IngredientInputBox.js";

const Ingredients = (props) => {

  const { ingredients, setAmountInput, saveIngredientEdit, cancelIngredientEdit, editingIngredientIndex, startEditingIngredient } = props;

  // clipboard obj holds all ingredient info to copy when user presses Copy to Clipboard button
  const [clipboard, setClipboard] = useState("");

  // reset the clipboard data if the recipe (i.e. list of ingredients) changes
  useEffect(() => {
    let clipboardText = "";
    ingredients.forEach((item) => {
      const calories = item.calories != null ? (parseFloat(item.calories).toFixed(2)) : "";
      const label = (item.ingredients != null && clipboardText !== "") ? ("\n\t" + item.label) : ("\t" + item.label);
      const amount = item.amount != null
                    ? (" (" + item.amount
                      + ((item.unit != null && item.unit !== "") ? (" " + item.unit) : "")
                      + (item.amount_in_grams != null ? (", " + parseFloat(item.amount_in_grams).toFixed(2) + " g") : "")
                    + ")")
                    : "";
      clipboardText += calories + label + amount + "\n";
    });
    setClipboard(clipboardText);
  }, [ingredients]);

  const copyToClipboard = (event) => {
    const clipboardData = document.getElementById("clipboard-data-ingredients");
    clipboardData.select();
    document.execCommand("copy");
  }


  return (
    <div className="subcontent">
      <div className="subheading">Ingredients:
        <button onClick={copyToClipboard}>Copy</button>
        <textarea readOnly id="clipboard-data-ingredients" value={clipboard}/>
      </div>
      <table>
        <tbody>
          {ingredients && ingredients.map((currItem, index) => (
            <tr key={index}>
              { currItem.ingredients && <td className="ingredient-category">{currItem.label + ":"}</td> }
              { currItem.amount &&
                <td className="ingredient-name">
                  <IngredientInputBox itemIndex={index}
                                      currItem={currItem}
                                      setAmountInput={setAmountInput}
                                      saveIngredientEdit={saveIngredientEdit}
                                      cancelIngredientEdit={cancelIngredientEdit}
                                      editingIngredientIndex={editingIngredientIndex}
                                      startEditingIngredient={startEditingIngredient}/>
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
