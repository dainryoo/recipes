import React from 'react';
import { connect } from "react-redux";
import InfoList from "./pantry/InfoList.js";
import Calculator from "./pantry/Calculator.js";


const Pantry = (props) => {

  const { item, view } = props;
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
    <div className={"pantry content" + (view === 1 ? " hidden" : "")}>
      <div className="heading">{item.label}</div>
      <Calculator item={item}/>
      {measurements && <InfoList title="Grams conversions:" list={measurements}/>}
      {nutrition && <InfoList title="Per unit:" list={nutrition}/>}
      {nutritionPer100Gram && <InfoList title="Per 100 grams:" list={nutritionPer100Gram}/>}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Pantry);
