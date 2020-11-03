import React from 'react';

const IngredientInputBox = (props) => {

  const { itemIndex, currItem, setAmountInput, saveIngredientEdit, cancelIngredientEdit, editingIngredientIndex, startEditingIngredient } = props;

  let initialAmount = currItem.amount_in_grams != null ? currItem.amount_in_grams : currItem.amount;

  const handleChange = (event) => {
    if (event.target.value.match(/^\d*\.?\d*$/)) {
      // only update the calculator if the input matches the decimal regex
      let input = event.target.value;
      if (input.startsWith("0") && !input.startsWith("0.")) {
        // remove leading zeros on non decimal numbers, if any
        input = input.substring(1);
      }
      if (input.length === 0) {
        // change empty inputs to a zero
        input = 0;
      }
      setAmountInput(input, itemIndex);
    }
  }

  return (
    <div>
      {
        editingIngredientIndex !== itemIndex && <button onClick={() => startEditingIngredient(itemIndex)}>
        {(parseFloat(currItem.amount).toFixed(2) + (currItem.unit.length > 0 ? " " + currItem.unit : "")
          + (currItem.amount_in_grams != null ? (" (" + parseFloat(currItem.amount_in_grams).toFixed(2) + " g)") : ""))}
        </button>
      }
      {
        editingIngredientIndex === itemIndex &&
        <span>
          <input value={initialAmount} onChange={handleChange}/>
          <button onClick={() => saveIngredientEdit(itemIndex)}>Save</button>
          <button onClick={() => cancelIngredientEdit(itemIndex)}>Cancel</button>
        </span>
      }
      {(" " + currItem.label) + (currItem.note ? (", " + currItem.note) : "")}
    </div>
  );
}

export default IngredientInputBox;
