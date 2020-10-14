import React, { Component } from 'react';

class Pantry extends Component {
  render() {

    const item = this.props.item;
    let nutrition = null;
    let nutritionPer100Gram = null;
    let measurements = null;

    if (item.conversion_to_grams) {
      let measurementsArr = [];
      for (const [unit, value] of Object.entries(item.conversion_to_grams)) {
        measurementsArr.push("1 " + unit + " = " + parseFloat(value).toFixed(2) + " g");
      }
      measurements = measurementsArr;
    }

    if (item.per_unit) {
      let nutritionArr = [];
      for (const [unit, value] of Object.entries(item.per_unit)) {
        if (unit === "calories") {
          nutritionArr.push(parseFloat(value).toFixed(2) + " calories");
        } else if (unit === "protein") {
          nutritionArr.push(parseFloat(value).toFixed(2) + " g protein");
        } else if (unit === "price") {
          nutritionArr.push("$" + parseFloat(value).toFixed(2));
        } else if (unit === "avg_grams") {
          nutritionArr.push("~" + parseFloat(value).toFixed(2) + " g");
        }
      }
      nutrition = nutritionArr;
    }

    if (item.per_100_gram) {
      let nutrition100Arr = [];
      for (const [unit, value] of Object.entries(item.per_100_gram)) {
        if (unit === "calories") {
          nutrition100Arr.push(parseFloat(value).toFixed(2) + " calories");
        } else if (unit === "protein") {
          nutrition100Arr.push(parseFloat(value).toFixed(2) + " g protein");
        } else if (unit === "price") {
          nutrition100Arr.push("$" + parseFloat(value).toFixed(2));
        }
      }
      nutritionPer100Gram = nutrition100Arr;
    }


    return (
      <div className="pantry content">
        <div className="heading">{item.label}</div>
        {measurements &&
          <div className="subcontent">
            <div className="subheading">Grams conversions:</div>
            <ul>
            {measurements.map((info, index) => (
              <li key={index}>
                {info}
              </li>
            ))}
            </ul>
          </div>
        }
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
        {nutritionPer100Gram &&
          <div className="subcontent">
            <div className="subheading">Per 100 grams:</div>
            <ul>
            {nutritionPer100Gram.map((info, index) => (
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
