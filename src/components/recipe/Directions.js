import React from 'react';

const Directions = (props) => {

  const directions = props.directions;

  return (
    <div className="subcontent">
      <div className="subheading">Directions:</div>
      <ul>
        {directions && directions.map((step, index) => (
          <li key={index}>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Directions;
