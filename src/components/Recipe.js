import React, { Component } from 'react';
import { connect } from "react-redux";

class Recipe extends Component {
  render() {
    const noRecipeSelectedMsg = "Select a recipe to get started";

    const recipe = this.props.selectedRecipe;
    let ingredients = null;
    let ingredient_categories = null;
    let directions = null;

    if (recipe) {
      ingredients = recipe.ingredients;
      ingredient_categories = recipe.ingredient_categories;
      directions = recipe.directions;
    }

    return (
      <div className="recipe content">
        <div className="heading">{recipe ? recipe.name : noRecipeSelectedMsg}</div>
        {recipe &&
          <div>
            <div className="subheading">Ingredients:</div>
            <ul>
              {ingredients && ingredients.map((curr_ingredient, index) => (
                <li key={index}>
                  {curr_ingredient.name}
                </li>
              ))}
              {ingredient_categories && ingredient_categories.map((category, category_index) => (
                <li key={category_index}>
                  {category.name}
                  <ul>
                    {category.ingredients.map((curr_ingredient, index) => (
                      <li key={index}>
                        {curr_ingredient.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="subheading">Directions:</div>
            <ul>
              {directions && directions.map((step, index) => (
                <li key={index}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    selectedRecipe: state.selectedRecipe
  }
}

export default connect(mapStateToProps)(Recipe);
