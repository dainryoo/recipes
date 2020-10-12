import React, { Component } from 'react';
import { connect } from "react-redux";
import recipesData from '../data/recipes-with-nutrition.json';

class RecipeSidebar extends Component {
  render() {
    return (
      <div className="recipe sidebar">
        <ul className="category-list">
          {recipesData.map((curr_category, category_index) => (
          <li className="category-item" key={category_index}>
            <div>{curr_category.category_name}</div>
            <ul className="sub-list">
              {curr_category.recipes.map((curr_recipe, recipe_index) => (
                <li key={recipe_index}
                  className={"sub-list-item " + (this.props.selectedRecipe?.name === curr_recipe.name ? "selected" : "")}>
                  <div onClick={() => this.props.updateSelectedRecipe(curr_recipe)}>{curr_recipe.label}</div>
                </li>
              ))}
            </ul>
          </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    selectedRecipe: state.selectedRecipe
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedRecipe: (selectedRecipe) => dispatch({ type:'updateSelectedRecipe', payload: selectedRecipe }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeSidebar);
