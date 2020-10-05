import React from 'react';

const Header = () => {
  const appName = "Recipes";
  const appDescription = "A collection of recipes + their nutritional info.";

  return (
    <div className="app-header">
      <div className="app-title">{appName}</div>
      <div className="app-description">{appDescription}</div>
    </div>
  );
}

export default Header;
