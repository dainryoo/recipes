import React, { Component } from 'react';
import { connect } from "react-redux";
import pantryData from '../data/pantry.json';

class PantrySidebar extends Component {
  render() {
    return (
      <div className="pantry sidebar">
        <ul className="category-list">
          {pantryData.map((curr_category, category_index) => (
          <li className="category-item" key={category_index}>
            <div>{curr_category.category_name}</div>
            <ul className="sub-list">
              {curr_category.items.map((item, item_index) => (
                <li key={item_index}
                    className={"sub-list-item " + (this.props.selectedPantryItem?.name === item.name ? "selected" : "")}>
                  <div onClick={() => this.props.updateSelectedPantryItem(item)}>{item.label}</div>
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
    selectedPantryItem: state.selectedPantryItem
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectedPantryItem: (selectedPantryItem) => dispatch({ type:'updateSelectedPantryItem', payload: selectedPantryItem }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PantrySidebar);
