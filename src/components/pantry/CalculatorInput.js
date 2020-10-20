import React from 'react';

const CalculatorInput = (props) => {

  const { info, updateCalculator, unit } = props;

  const handleChange = (event) => {
    if (+event.target.value === +event.target.value) {
      // only update if input is a number
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
