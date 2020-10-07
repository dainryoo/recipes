import React, { Component } from 'react';
import { connect } from "react-redux";
import Recipe from "./Recipe.js";
import RecipeSidebar from "./RecipeSidebar.js";
import Pantry from "./Pantry.js";
import PantrySidebar from "./PantrySidebar.js";

class Body extends Component {
  render() {
    return (
      <div className="app-body">
        {this.props.view ? <RecipeSidebar/> : <PantrySidebar/>}
        {this.props.view ? <Recipe/> : <Pantry/>}
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Body);
