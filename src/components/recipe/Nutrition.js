import React from 'react';

const Nutrition = (props) => {

  const { recipeMultipler } = props;
  const {calories, protein, price} = props.nutrition;

  return (
    <div className="subcontent">
      <div className="subheading">Total values for {recipeMultipler}x the recipe:</div>
      <ul>
        <li>{parseFloat(calories).toFixed(2)} calories</li>
        <li>{parseFloat(protein).toFixed(2)} grams protein</li>
        <li>${parseFloat(price).toFixed(2)} total</li>
      </ul>
    </div>
  );
}

export default Nutrition;
