import React, { Component } from 'react';
import { connect } from "react-redux";
import pantryData from '../data/pantry.json';

class PantrySidebar extends Component {
  render() {
    return (
      <div className="pantry sidebar">
        Pantry Nav:
        <ul>
          {pantryData.map((curr_category, category_index) => (
          <li key={category_index}>
            {curr_category.category_name}
            <ul>
              {curr_category.items.map((item, item_index) => (
                <li key={item_index}>
                  <button onClick={() => this.props.updateSelectedPantryItem(item)}>{item.name}</button>
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
