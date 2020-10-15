import React from 'react';

const Ingredients = (props) => {

  const { ingredients, onMultiplerChange } = props;

  return (
    <div className="subcontent">
      <div className="subheading">Ingredients:</div>
      <div className="recipe-multiplier">
        <input type="number" min="0" step=".01" onChange={onMultiplerChange}/>x original recipe:
      </div>
      <table>
        <tbody>
          {ingredients && ingredients.map((currItem, index) => (
            <tr key={index}>
            <td><input type="number" min="0" step=".01"/></td>
            <td className={currItem.ingredients ? "ingredient-category" : "ingredient-name"}>
              { currItem.ingredients ?
                (currItem.label + ":")  :
                (currItem.amount
                  + (currItem.unit.length > 0 && " " + currItem.unit)
                  + (currItem.amount_in_grams != null ?
                        (" (" + parseFloat(currItem.amount_in_grams).toFixed(2) + " g)") : "")
                  + (" " + currItem.label)
                  + (currItem.note ? (", " + currItem.note) : "")
                )
              }
            </td>
            <td className={"calorie-column"}>{currItem.calories != null ?
                  (parseFloat(currItem.calories).toFixed(2) + " cal") : ""}</td>
            <td>{currItem.price != null ?
                  (" $" + parseFloat(currItem.price).toFixed(2)) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ingredients;
