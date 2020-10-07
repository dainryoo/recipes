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
        Object.entries(pantryItem.nutrition).map(([unit, value]) => {
          nutrition_arr.push({unit, value});
        });
        nutrition = nutrition_arr;
        console.log(nutrition_arr);
      }
      if (pantryItem.nutrition_per_100_gram) {
        let nutrition_100_arr = [];
        Object.entries(pantryItem.nutrition_per_100_gram).map(([unit, value]) => {
          nutrition_100_arr.push({unit, value});
        });
        nutrition_per_100_gram = nutrition_100_arr;
        console.log(nutrition_100_arr);
      }
    }

    return (
      <div className="pantry content">
        <div className="heading">{pantryItem ? pantryItem.name : noPantrySelectedMsg}</div>
        {nutrition &&
          <div>
            <div className="subheading">Nutrition per unit:</div>
          </div>
        }
        {nutrition_per_100_gram &&
          <div>
            <div className="subheading">Nutrition per 100 grams:</div>
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
