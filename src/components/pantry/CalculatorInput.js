import React from 'react';

const CalculatorInput = (props) => {

  const { info, updateCalculator, unit } = props;

  const handleChange = (event) => {
    // only update the calculator if the input matches the decimal regex
    if (event.target.value.match(/^\d*\.?\d*$/)) {
      updateCalculator(event, unit);
    }
  }

  return (
      <div key={unit} className="calculator">
        <input value={info[unit].input} onChange={handleChange}/>
        {unit + " = "
          + (info[unit].toGrams != null ? (parseFloat(info[unit].toGrams).toFixed(2) + " g = ") : "")
          + parseFloat(info[unit].calories).toFixed(2) + " calories"}
      </div>
  );
}

export default CalculatorInput;
