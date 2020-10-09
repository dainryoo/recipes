import React, { Component } from 'react';
import { connect } from "react-redux";

class Recipe extends Component {
  render() {
    const noRecipeSelectedMessage = (<div className="message">Select a recipe to view</div>);

    const recipe = this.props.selectedRecipe;
    let ingredients = null;
    let ingredient_categories = null;
    let directions = null;
    let nutrition = null;

    if (recipe) {
      ingredients = recipe.ingredients;
      ingredient_categories = recipe.ingredient_categories;
      directions = recipe.directions;
      nutrition = recipe.nutrition;
    }

    return (
      <div className="recipe content">
        {recipe ? <div className="heading">{recipe.name}</div> : noRecipeSelectedMessage}
        {recipe &&
          <div>
            <div className="subheading">Ingredients:</div>
            <ul>
              {ingredients && ingredients.map((curr_ingredient, index) => (
                <li key={index}>
                  {curr_ingredient.amount} {curr_ingredient.unit.length > 0 && curr_ingredient.unit} {curr_ingredient.name}
                  {curr_ingredient.amount_in_grams && " (" + parseFloat(curr_ingredient.amount_in_grams).toFixed(2) + " g)"}
                </li>
              ))}
              {ingredient_categories && ingredient_categories.map((category, category_index) => (
                <li key={category_index}>
                  {category.name}
                  <ul>
                    {category.ingredients.map((curr_ingredient, index) => (
                      <li key={index}>
                        {curr_ingredient.amount} {curr_ingredient.unit.length > 0 && curr_ingredient.unit} {curr_ingredient.name}
                        {curr_ingredient.amount_in_grams && " (" + parseFloat(curr_ingredient.amount_in_grams).toFixed(2) + " g)"}
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
            <div className="subheading">Total nutrition:</div>
            <ul>
              <li>{parseFloat(nutrition.calories).toFixed(2)} calories</li>
              <li>{parseFloat(nutrition.protein).toFixed(2)} grams protein</li>
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
