import React, { Component } from 'react';

class Nutrition extends Component {
  render() {
    const nutrition = this.props.nutrition;

    return (
      <div className="subcontent">
        <div className="subheading">Total values:</div>
        <ul>
          <li>{parseFloat(nutrition.calories).toFixed(2)} calories</li>
          <li>{parseFloat(nutrition.protein).toFixed(2)} grams protein</li>
          <li>${parseFloat(nutrition.price).toFixed(2)} total</li>
        </ul>
      </div>
    );
  }
}

export default Nutrition;
