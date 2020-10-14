import React from 'react';

const InfoList = (props) => {
  return (
    <div className="subcontent">
      <div className="subheading">{props.title}</div>
      <ul>
      {props.list.map((info, index) => (
        <li key={index}>
          {info}
        </li>
      ))}
      </ul>
    </div>
  );
}

export default InfoList;
