import React, { Component } from 'react';

class Nutrition extends Component {
  render() {
    const {calories, protein, price} = this.props.nutrition;

    return (
      <div className="subcontent">
        <div className="subheading">Total values:</div>
        <ul>
          <li>{parseFloat(calories).toFixed(2)} calories</li>
          <li>{parseFloat(protein).toFixed(2)} grams protein</li>
          <li>${parseFloat(price).toFixed(2)} total</li>
        </ul>
      </div>
    );
  }
}

export default Nutrition;
