import React, { useState, useEffect } from 'react';

const Calculator = (props) => {

  const { item } = props;
  const [calculatedCal, setCalculatedCal] = useState(0);
  const [inputtedGrams, setInputtedGrams] = useState(0);

  // triggered when item prop changes:
  useEffect(() => {
    setCalculatedCal(0); // reset calculatedCal
    setInputtedGrams(0); // reset number in input box
  }, [item]);

  const handleChange = event => {
    const inputNum = event.target.value;
    setInputtedGrams(inputNum);
    if (item.per_100_gram && item.per_100_gram.calories) {
      setCalculatedCal(inputNum / 100.0 * item.per_100_gram.calories);
    }
  }


  return (
    <div className="calculator">
      <input type="number" min="0" step=".01" value={inputtedGrams} onChange={handleChange}/> grams = {parseFloat(calculatedCal).toFixed(2)} calories
    </div>
  );
}


export default Calculator;
