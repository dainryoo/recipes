import React, { Component } from 'react';
import { connect } from "react-redux";

class Header extends Component {
  render() {
    const appName = "Recipes";
    const appDescription = "A collection of recipes + their nutritional info.";

    return (
      <div className="app-header">
      <button onClick={() => this.props.updateView(this.props.view ? 0 : 1)}>change view</button>
        <div className="title">{appName}</div>
        <div className="description">{appDescription}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateView: (view) => dispatch({ type:'updateView', payload: view }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
