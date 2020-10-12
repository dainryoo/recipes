import React, { Component } from 'react';

class Ingredients extends Component {
  render() {
    const ingredients = this.props.ingredients;

    return (
      <div className="subcontent">
      <div className="subheading">Ingredients:</div>
        <table>
          <tbody>
            {ingredients && ingredients.map((currItem, index) => (
              <tr key={index}>
              <td className={currItem.ingredients ? "ingredient-category" : "ingredient-name"}>
                { currItem.ingredients ?
                  (currItem.label + ":")  :
                  (currItem.amount
                    + (currItem.unit.length > 0 && " " + currItem.unit)
                    + (" " + currItem.label)
                    + (currItem.note ? (", " + currItem.note) : "")
                  )
                }
              </td>
              <td>{currItem.amount_in_grams && " (" + parseFloat(currItem.amount_in_grams).toFixed(2) + " g)"}</td>
              <td className={"calorie-column"}>{currItem.calories ? (parseFloat(currItem.calories).toFixed(2)) : ""}</td>
              <td>{currItem.calories ? " cal" : ""}</td>
              <td>{currItem.price ? (" $" + parseFloat(currItem.price).toFixed(2)) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Ingredients;
