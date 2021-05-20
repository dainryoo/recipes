import React, { useEffect, useState } from "react";

// view of app when on pantry page
const PantryPage = ({ currPantry, mobileView }) => {
  return (
    <div className={"pantry content " + (mobileView === "content" ? "mobile-show" : "mobile-hide")}>
      {currPantry ? <Pantry currPantry={currPantry} /> : <Message />}
    </div>
  );
};

const Pantry = ({ currPantry }) => {
  return (
    <>
      <div className="title">{currPantry.label}</div>
      <Note text={currPantry.note} />
      <Calculators currPantry={currPantry} />
    </>
  );
};

// shown when no pantry item is selected
const Message = () => {
  return "Choose a pantry item to begin";
};

const Note = ({ text }) => {
  return text ? (
    <div className="note subcontent">
      <div className="title">Note:</div>
      <p>{text}</p>
    </div>
  ) : (
    <></>
  );
};

const Calculators = ({ currPantry }) => {
  return (
    <div className="calculators subcontent">
      <div className="title">Nutrition facts:</div>
      <table>
        <tbody>
          <CalculatorInput key={currPantry.name + "grams"} unit={"g"} item={currPantry} />
          {Object.keys(currPantry.conversionToGrams).map((unit) => {
            return <CalculatorInput key={currPantry.name + unit} unit={unit} item={currPantry} />;
          })}
        </tbody>
      </table>
    </div>
  );
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

  const gramsConversion = unit !== "g" ? `${num(conversions.grams)} g` : "";
  const caloriesConversion = `${num(conversions.calories)} cal`;
  const proteinConversion = `${num(conversions.protein)} g protein`;
  const priceConversion = `$${numPrice(conversions.price)}`;

  return (
    <tr className="calculator">
      <td>
        <input value={inputValue} onChange={handleChange} /> {unit}
      </td>
      <td>{gramsConversion}</td>
      <td>{caloriesConversion}</td>
      <td>{proteinConversion}</td>
      <td>{priceConversion}</td>
    </tr>
  );
};

// take in a numerical value and return it with no decimals, or two decimal points if needed
const num = (value) => {
  return value ? +(Math.round(value + "e+2") + "e-2") : value;
};
// take in a numerical value and return it with two decimal points; use for prices
const numPrice = (value) => {
  return value ? value.toFixed(2) : Number(0).toFixed(2);
};

export default PantryPage;
