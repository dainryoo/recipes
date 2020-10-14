import React from 'react';
import Ingredients from "./recipe/Ingredients.js";
import Directions from "./recipe/Directions.js";
import Nutrition from "./recipe/Nutrition.js";


const Recipe = (props) => {

  const {name, label, ingredients, directions, nutrition} = props.recipe;

  let ingredientCategories = props.recipe.ingredient_categories;
  if (ingredientCategories) {
    let categoriesFlattened = []; // need to turn the nested array into a "flat" one
    ingredientCategories.forEach((category) => {
      categoriesFlattened.push(category);
      category.ingredients.forEach((ingredient) => {
        categoriesFlattened.push(ingredient);
      });
    });
    ingredientCategories = categoriesFlattened;
  }

  return (
    <div className="recipe content">
      <div className="heading">{label ? label : name}</div>
      <Ingredients ingredients={ingredients ? ingredients : ingredientCategories}/>
      {directions && <Directions directions={directions}/>}
      {nutrition && <Nutrition nutrition={nutrition}/>}
    </div>
  );
}

export default Recipe;
