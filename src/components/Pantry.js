import React, { Component } from 'react';
import { connect } from "react-redux";

class Recipe extends Component {
  render() {
    const noPantrySelectedMsg = "Select a pantry item to view info";

    const pantryItem = this.props.selectedPantryItem;
    let nutrition = null;
    let nutrition_per_100_gram = null;

    if (pantryItem) {
      if (pantryItem.nutrition) {
        let nutrition_arr = [];
        for (const [unit, value] of Object.entries(pantryItem.nutrition)) {
          nutrition_arr.push({unit, value});
        }
        nutrition = nutrition_arr;
      }
      if (pantryItem.nutrition_per_100_gram) {
        let nutrition_100_arr = [];
        for (const [unit, value] of Object.entries(pantryItem.nutrition_per_100_gram)) {
          if (unit === "calories" || unit === "protein") {
              nutrition_100_arr.push({unit, value});
          }
        }
        nutrition_per_100_gram = nutrition_100_arr;
      }
    }

    return (
      <div className="pantry content">
        <div className="heading">{pantryItem ? pantryItem.name : noPantrySelectedMsg}</div>
        {nutrition &&
          <div>
            <div className="subheading">Nutrition per unit:</div>
            <ul>
            {nutrition.map((info, index) => (
              <li key={index}>
                {info.unit}: {info.value}
              </li>
            ))}
            </ul>
          </div>
        }
        {nutrition_per_100_gram &&
          <div>
            <div className="subheading">Nutrition per 100 grams:</div>
            <ul>
            {nutrition_per_100_gram.map((info, index) => (
              <li key={index}>
                {info.unit}: {info.value}
              </li>
            ))}
            </ul>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
	return {
    selectedPantryItem: state.selectedPantryItem
  }
}

export default connect(mapStateToProps)(Recipe);
