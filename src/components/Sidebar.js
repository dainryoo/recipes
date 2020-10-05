import React, { Component } from 'react';
import recipesData from '../data/recipes.json';

import { connect } from "react-redux";

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <ul>
          {recipesData.map((curr_category, category_index) => (
          <li key={category_index}>
            {curr_category.category_name}
            <ul>
              {curr_category.recipes.map((curr_recipe, recipe_index) => (
                <li key={recipe_index}>
                  <button onClick={this.props.setRecipe}>{curr_recipe.name}</button>
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
    setRecipe: () => dispatch({ type:'updateSelectedRecipe', payload: "sdlfksldkjf" }),
    updateSelectedRecipe: (selectedRecipe) => dispatch({ type:'updateSelectedRecipe', payload: selectedRecipe }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
