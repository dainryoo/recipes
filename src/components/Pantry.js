import React, { Component } from 'react';

class Pantry extends Component {
  render() {

    const item = this.props.item;
    let nutrition = null;
    let nutrition_per_100_gram = null;

    if (item.per_unit) {
      let nutrition_arr = [];
      for (const [unit, value] of Object.entries(item.per_unit)) {
        if (unit === "calories") {
          nutrition_arr.push(parseFloat(value).toFixed(2) + " calories");
        } else if (unit === "protein") {
          nutrition_arr.push(parseFloat(value).toFixed(2) + " g protein");
        } else if (unit === "price") {
          nutrition_arr.push("$" + parseFloat(value).toFixed(2));
        } else if (unit === "avg_grams") {
          nutrition_arr.push("~" + parseFloat(value).toFixed(2) + " g");
        }
      }
      nutrition = nutrition_arr;
    }

    if (item.per_100_gram) {
      let nutrition_100_arr = [];
      for (const [unit, value] of Object.entries(item.per_100_gram)) {
        if (unit === "calories") {
          nutrition_100_arr.push(parseFloat(value).toFixed(2) + " calories");
        } else if (unit === "protein") {
          nutrition_100_arr.push(parseFloat(value).toFixed(2) + " g protein");
        } else if (unit === "price") {
          nutrition_100_arr.push("$" + parseFloat(value).toFixed(2));
        }
      }
      nutrition_per_100_gram = nutrition_100_arr;
    }


    return (
      <div className="pantry content">
        <div className="heading">{item.label}</div>
        {nutrition &&
          <div className="subcontent">
            <div className="subheading">Per unit:</div>
            <ul>
            {nutrition.map((info, index) => (
              <li key={index}>
                {info}
              </li>
            ))}
            </ul>
          </div>
        }
        {nutrition_per_100_gram &&
          <div className="subcontent">
            <div className="subheading">Per 100 grams:</div>
            <ul>
            {nutrition_per_100_gram.map((info, index) => (
              <li key={index}>
                {info}
              </li>
            ))}
            </ul>
          </div>
        }
      </div>
    );
  }
}
export default Pantry;
