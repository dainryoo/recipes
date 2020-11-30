import React from 'react';
import { connect } from "react-redux";

const Header = ({ mobileView, updateMobileView , view, updateView}) => {

  return (
    <div className="app-header">
      <div className="header-title">
        <div className={"recipe " + (view === 1 ? "" : "button")} onClick={() => updateView(1)}>Recipes</div>
        <div className="plus-sign">+</div>
        <div className={"pantry " + (view === 0 ? "" : "button")}onClick={() => updateView(0)}>Pantry</div>
      </div>
      <div className={"mobile-toggle" + (mobileView === 0 ? " secondary" : "")} onClick={() => updateMobileView(mobileView ? 0 : 1)}>
        <div className="mobile-toggle-text">{mobileView === 0 ? "×" : "☰"}</div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
	return {
    mobileView: state.mobileView,
    view: state.view
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateMobileView: (mobileView) => dispatch({ type:'updateMobileView', payload: mobileView }),
    updateView: (view) => dispatch({ type:'updateView', payload: view }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
