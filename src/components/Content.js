import React from 'react';

import Recipes from "./Recipes.js";
import Pantry from "./Pantry.js";

const Content = () => {
  return (
    <div className="content">
      <Recipes/>
      <Pantry/>
    </div>
  );
}

export default Content;
