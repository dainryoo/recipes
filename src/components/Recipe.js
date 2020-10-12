import React, { Component } from 'react';
import Ingredients from "./recipe/Ingredients.js";
import Directions from "./recipe/Directions.js";
import Nutrition from "./recipe/Nutrition.js";

class Recipe extends Component {
  render() {
    let recipe = this.props.recipe;
    let ingredients = recipe.ingredients;
    let ingredientCategories = recipe.ingredient_categories;
    let directions = recipe.directions;
    let nutrition = recipe.nutrition;

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
        <div className="heading">{recipe.label}</div>
        {ingredients && <Ingredients ingredients={ingredients}/>}
        {ingredientCategories && <Ingredients ingredients={ingredientCategories}/>}
        {directions && <Directions directions={directions}/>}
        {nutrition && <Nutrition nutrition={nutrition}/>}
      </div>
    );
  }
}

export default Recipe;
