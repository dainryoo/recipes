import React from 'react';

import recipesData from '../data/recipes.json';

const Recipes = () => {
  const recipeName = "Current recipe...";
  console.log(recipesData);

  return (
    <div className="recipe-section">
      <div>{recipeName}</div>
    </div>
  );
}

export default Recipes;
