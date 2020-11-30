import React from 'react';
import { connect } from "react-redux";
import recipesData from '../data/recipes-with-nutrition.json';
import pantryData from '../data/generated-pantry.json';

const Sidebar = (props) => {

  const { selectedRecipe, updateSelectedRecipe, selectedPantryItem, updateSelectedPantryItem, mobileView, view } = props;

  return (
    <div className={"sidebar" + (mobileView === 0 ? "" : " mobile-hidden")}>
      <ul className="category-list">
        {
          view === 1 ? (
          recipesData.map((curr_category, category_index) => (
          <li className="category-item" key={category_index}>
            <div>{curr_category.category_name}</div>
            <ul className="sub-list">
              {curr_category.recipes.map((curr_recipe, recipe_index) => (
                <li key={recipe_index}
                  className={"sub-list-item " + (selectedRecipe?.name === curr_recipe.name ? "selected" : "")}>
                  <div onClick={() => updateSelectedRecipe(curr_recipe)}>{curr_recipe.label}</div>
                </li>
              ))}
            </ul>
          </li>
          ))
        ) : (
          pantryData.map((curr_category, category_index) => (
          <li className="category-item" key={category_index}>
            <div>{curr_category.category_name}</div>
            <ul className="sub-list">
              {curr_category.items.map((item, item_index) => (
                <li key={item_index}
                    className={"sub-list-item " + (selectedPantryItem?.name === item.name ? "selected" : "")}>
                  <div onClick={() => updateSelectedPantryItem(item)}>{item.label}</div>
                </li>
              ))}
            </ul>
          </li>
          ))
        )
        }
      </ul>
    </div>
  );
}

const mapStateToProps = state => {
	return {
    selectedRecipe: state.selectedRecipe,
    selectedPantryItem: state.selectedPantryItem,
    mobileView : state.mobileView,
    view : state.view
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedRecipe: (selectedRecipe) => dispatch({ type:'updateSelectedRecipe', payload: selectedRecipe }),
    updateSelectedPantryItem: (selectedPantryItem) => dispatch({ type:'updateSelectedPantryItem', payload: selectedPantryItem }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
