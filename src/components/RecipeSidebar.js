import React, { Component } from 'react';
import { connect } from "react-redux";
import recipesData from '../data/recipes.json';

class RecipeSidebar extends Component {
  render() {
    return (
      <div className="recipe sidebar">
        Recipe Nav:
        <ul>
          {recipesData.map((curr_category, category_index) => (
          <li key={category_index}>
            {curr_category.category_name}
            <ul>
              {curr_category.recipes.map((curr_recipe, recipe_index) => (
                <li key={recipe_index}>
                  <button onClick={() => this.props.updateSelectedRecipe(curr_recipe)}>{curr_recipe.name}</button>
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
