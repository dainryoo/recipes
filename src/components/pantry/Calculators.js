import React from 'react';
import CalculatorInput from "./CalculatorInput.js";

const Calculators = ({ info, updateCalculator }) => {

  return (
    <div className="subcontent">
      <div className="subheading">Calculator: </div>
      {Object.keys(info).map((unit) => {
        return (<CalculatorInput key={unit} info={info} unit={unit} updateCalculator={updateCalculator}/>)
      })
      }
    </div>
  );
}

export default Calculators;
