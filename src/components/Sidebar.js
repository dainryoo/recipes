import React, { useState, useEffect } from "react";

// view is either recipes or pantry
// onclick is function trigger when clicking on sidebar item
const Sidebar = ({ recipeInfo, pantryInfo, view, mobileView, navClick, currRecipe, currPantry }) => {
  const items = view === "recipe" ? recipeInfo : pantryInfo;
  const subitems = view === "recipe" ? "recipes" : "items";
  const currItem = view === "recipe" ? currRecipe?.name : currPantry?.name;
  const [openCategories, setOpenCategories] = useState([]); // the sidebar category accordions that are "opened"

  // if we flip between recipe/pantry view, scroll the sidebar back to its top and clear the opened categories
  useEffect(() => {
    document.getElementsByClassName("sidebar")[0].scrollTo(0, 0);
    setOpenCategories([]);
  }, [view, setOpenCategories]);

  const toggleCategory = (categoryName) => {
    // if it doesn't exist, add the categoryName; else, remove it from the array
    const indexOf = openCategories.indexOf(categoryName);
    setOpenCategories(
      indexOf === -1
        ? [...openCategories, categoryName]
        : [...openCategories.slice(0, indexOf), ...openCategories.slice(indexOf + 1)]
    );
  };

  // check if category is open (i.e. is in the array of open categories)
  const isOpen = (category) => {
    return openCategories.indexOf(category.categoryName) > -1;
  };

  return (
    <div className={"sidebar " + (mobileView === "sidebar" ? "mobile-show" : "mobile-hide")}>
      <ul>
        {items.map((category) => (
          <li className={`category${isOpen(category) ? " open" : ""}`} key={category.categoryName}>
            <div className="category-label" onClick={() => toggleCategory(category.categoryName)}>
              <div className="icon">{isOpen(category) ? "-" : "+"}</div>
              <div>{category.categoryName}</div>
            </div>
            {isOpen(category) && (
              <ul>
                {category[subitems].map((subitem) => (
                  <li
                    className={"item" + (subitem.name === currItem ? " selected" : "")}
                    key={subitem.name}
                    onClick={() => navClick(subitem.name)}>
                    {subitem.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
