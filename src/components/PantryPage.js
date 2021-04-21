import React, { useEffect, useState } from "react";

// view of app when on pantry page
const PantryPage = ({ currPantry }) => {
  return <div className="pantry content">{currPantry ? <Pantry currPantry={currPantry} /> : <Message />}</div>;
};

const Pantry = ({ currPantry }) => {
  return (
    <div>
      <p>{currPantry.label}</p>
      <p>{currPantry.note && `Note: ${currPantry.note}`}</p>
      <p>Nutrition facts:</p>
      <CalculatorInput key={currPantry.name + "grams"} unit={"g"} item={currPantry} />
      {Object.keys(currPantry.conversionToGrams).map((unit) => {
        return <CalculatorInput key={currPantry.name + unit} unit={unit} item={currPantry} />;
      })}
    </div>
  );
};

// shown when no pantry item is selected
const Message = () => {
  return "Choose a pantry item to begin";
};

const CalculatorInput = ({ item, unit }) => {
  // input box starts off as 0, unless this input box is representing one "average" item
  const [inputValue, setInputValue] = useState(unit === "average" ? "1" : "0");
  // conversions is the calories, protein, and price values calculated for this input
  const [conversions, setConversions] = useState({});

  // every time the input value changes, recalculate everything
  useEffect(() => {
    const grams = unit === "g" ? inputValue : inputValue * item.conversionToGrams[unit];
    setConversions({
      grams: grams,
      calories: (grams / 100.0) * item.per100g.calories,
      protein: (grams / 100.0) * item.per100g.protein,
      price: (grams / 100.0) * item.per100g.price
    });
  }, [item, unit, inputValue]);

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
        input = "0";
      }
      setInputValue(input);
    }
  };

  const gramsConversion = unit !== "g" ? ` = ${num(conversions.grams)} g` : "";
  const caloriesConversion = ` = ${num(conversions.calories)} cal`;
  const proteinConversion = ` = ${num(conversions.protein)} g protein`;
  const priceConversion = ` = $${num(conversions.price)}`;

  return (
    <div className="calculator">
      <input value={inputValue} onChange={handleChange} />
      {unit + gramsConversion + caloriesConversion + proteinConversion + priceConversion}
    </div>
  );
};

// take in a numerical value and return it with no decimals, or two decimal points if needed
const num = (value) => {
  return value ? +(Math.round(value + "e+2") + "e-2") : value;
};

export default PantryPage;
