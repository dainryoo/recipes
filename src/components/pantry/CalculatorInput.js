import React from 'react';

const CalculatorInput = ({ info, updateCalculator, unit }) => {

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
      updateCalculator(input, unit);
    }
  }

  return (
      <div key={unit} className="calculator">
        <input value={info[unit].input} onChange={handleChange}/>
        {unit + " = "
          + (info[unit].toGrams != null ? (parseFloat(info[unit].toGrams).toFixed(2).replace(/\.?0+$/, "") + " g = ") : "")
          + parseFloat(info[unit].calories).toFixed(2) + " calories"}
      </div>
  );
}

export default CalculatorInput;
