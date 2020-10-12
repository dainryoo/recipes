import React, { Component } from 'react';
import { connect } from "react-redux";
import Recipe from "./Recipe.js";
import RecipeSidebar from "./RecipeSidebar.js";
import Pantry from "./Pantry.js";
import PantrySidebar from "./PantrySidebar.js";

class Body extends Component {
  render() {
    const sidebar = this.props.view ? <RecipeSidebar/> : <PantrySidebar/>
    let content = "";
    if (this.props.view === 1) {
      content = this.props.selectedRecipe ? <Recipe recipe={this.props.selectedRecipe}/> : <div className="message">pick a recipe</div>;
    } else {
      content = this.props.selectedPantryItem ? <Pantry item={this.props.selectedPantryItem}/> : <div className="message">pick a pantry item</div>;
    }

    return (
      <div className="app-body">
        {sidebar}
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    view: state.view,
    selectedRecipe: state.selectedRecipe,
    selectedPantryItem: state.selectedPantryItem
  }
}
export default connect(mapStateToProps)(Body);
