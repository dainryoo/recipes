import React from 'react';
import { connect } from "react-redux";
import Recipe from "./Recipe.js";
import Pantry from "./Pantry.js";
import Sidebar from "./Sidebar.js";

const Body = (props) => {

  const { view, selectedRecipe, selectedPantryItem } = props;

  const recipe = () => {
    return selectedRecipe ? <Recipe recipe={selectedRecipe}/> : "";
  }

  const pantryItem = () => {
    return selectedPantryItem ? <Pantry item={selectedPantryItem}/> : "";
  }

  const message = () => {
    if (view === 1 && !selectedRecipe) {
      return <div className="message">pick a recipe</div>
    } else if (view === 0 && !selectedPantryItem) {
      return <div className="message">pick a pantry item</div>
    }
  }

  return (
    <div className="app-body">
      <Sidebar/>
      {message()}
      {recipe()}
      {pantryItem()}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view,
    selectedRecipe: state.selectedRecipe,
    selectedPantryItem: state.selectedPantryItem
  }
}
export default connect(mapStateToProps)(Body);
