import React from 'react';

const PantrySubcontent = (props) => {
  return (
    <div className="subcontent">
      <div className="subheading">{props.title}</div>
      {props.info && props.info}
      {props.list &&
        <ul>
        {props.list.map((info, index) => (
          <li key={index}>
            {info}
          </li>
        ))}
        </ul>
      }
    </div>
  );
}

export default PantrySubcontent;
