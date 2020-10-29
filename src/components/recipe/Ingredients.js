import React from 'react';
import IngredientInputBox from "./IngredientInputBox.js";

const Ingredients = (props) => {

  const { ingredients, setAmountInput, saveIngredientEdit, cancelIngredientEdit, editingIngredientIndex, startEditingIngredient } = props;

  return (
    <div className="subcontent">
      <div className="subheading">Ingredients:</div>
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
