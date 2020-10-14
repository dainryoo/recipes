import React from 'react';
import { connect } from "react-redux";
import Recipe from "./Recipe.js";
import Pantry from "./Pantry.js";
import Sidebar from "./Sidebar.js";

const Body = (props) => {

  const { view, selectedRecipe, selectedPantryItem } = props;

  let content = "";
  if (view === 1) {
    content = selectedRecipe ? <Recipe recipe={selectedRecipe}/> : <div className="message">pick a recipe</div>;
  } else {
    content = selectedPantryItem ? <Pantry item={selectedPantryItem}/> : <div className="message">pick a pantry item</div>;
  }

  return (
    <div className="app-body">
      <Sidebar/>
      {content}
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
