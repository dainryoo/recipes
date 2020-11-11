import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PantrySubcontent from "./pantry/PantrySubcontent.js";
import Calculators from "./pantry/Calculators.js";


const Pantry = ({ item, view }) => {

  let nutrition = null;
  let nutritionPer100Gram = null;
  let measurements = null;


  const [calculatorInfo, setCalculatorInfo] = useState({ grams: { input: 0, calories: 0}});

  useEffect(() => {
    const newState = { grams: { input: 0, calories: 0}};
    if (item.conversion_to_grams) {
      for (const unit of Object.keys(item.conversion_to_grams)) {
        newState[unit] = { input: 0, toGrams: 0, calories: 0 };
      }
    }
    setCalculatorInfo(newState);
  }, [item]);

  const handleCalculatorChange = (input, unitName) => {
    const toGrams = (unitName === "grams" ? input : input * item.conversion_to_grams[unitName]);
    const calories = item.per_100_gram.calories / 100.0 * toGrams;

    const prevState = calculatorInfo;
    if (unitName === "grams") {
      setCalculatorInfo(prevState => ({
        ...prevState,
        [unitName]: {
          input: input,
          calories: calories
        }
      }));
    } else {
      setCalculatorInfo(prevState => ({
        ...prevState,
        [unitName]: {
          input: input,
          toGrams: toGrams,
          calories: calories
        }
      }));
    }
  }



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
      {item.note && <PantrySubcontent title="Notes:" info={item.note}/>}
      <Calculators info={calculatorInfo} updateCalculator={handleCalculatorChange}/>
      {measurements && <PantrySubcontent title="Grams conversions:" list={measurements}/>}
      {nutrition && <PantrySubcontent title="Per unit:" list={nutrition}/>}
      {nutritionPer100Gram && <PantrySubcontent title="Per 100 grams:" list={nutritionPer100Gram}/>}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Pantry);
