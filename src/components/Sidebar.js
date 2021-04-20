import React from "react";

// view is either recipes or pantry
// onclick is function trigger when clicking on sidebar item
const Sidebar = ({ recipeInfo, pantryInfo, view, navClick }) => {
  const items = view === "recipe" ? recipeInfo : pantryInfo;
  const subitems = view === "recipe" ? "recipes" : "items";

  return (
    <div className="sidebar">
      <ul>
        {items.map((category) => (
          <li className="category" key={category.categoryName}>
            {category.categoryName}
            <ul>
              {category[subitems].map((subitem) => (
                <li className="item" key={subitem.name} onClick={() => navClick(subitem.name)}>
                  {subitem.label}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
