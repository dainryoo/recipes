import React from 'react';

import pantryData from '../data/pantry.json';

const Pantry = () => {
  const ingredientName = "Current ingredient...";
  console.log(pantryData);

  return (
    <div className="pantry-section">
      <div>{ingredientName}</div>
    </div>
  );
}

export default Pantry;
