import React from 'react';
import { connect } from "react-redux";


const Header = (props) => {

  const { view, updateView } = props;

  return (
    <div className="app-header">
      <div className={"recipe " + (view === 1 ? "" : "button")} onClick={() => updateView(1)}>Recipes</div>
      <div className="plus-sign">+</div>
      <div className={"pantry " + (view === 0 ? "" : "button")}onClick={() => updateView(0)}>Pantry</div>
    </div>
  );
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
