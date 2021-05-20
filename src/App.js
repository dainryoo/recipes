import React, { useState, useCallback } from "react";
import "./App.scss";

import Sidebar from "./components/Sidebar.js";
import RecipePage from "./components/RecipePage.js";
import PantryPage from "./components/PantryPage.js";
import useRecipeHook from "./hooks/recipeHook.js";
import usePantryHook from "./hooks/pantryHook.js";

const App = () => {
  const [view, setView] = useState("recipe"); // flag to toggle between recipe and pantry view
  const [mobileView, setMobileView] = useState("content"); // flag to toggle between content and sidebar view on mobile
  const [currRecipeId, setCurrRecipeId] = useState("");
  const [currPantryId, setCurrPantryId] = useState("");

  // changes the current view of the app between Recipe and Pantry pages
  const toggleView = useCallback(
    (newView) => {
      if (newView !== view) {
        setView(newView);
      }
    },
    [view]
  );

  // change the current view of app between Recipe/Pantry pages and the sidebar on mobile
  const toggleMobileView = useCallback(() => {
    setMobileView(mobileView === "content" ? "sidebar" : "content");
  }, [mobileView]);

  // set the currently selected recipe or pantry item, depending on what view we're in
  // and also close the sidebar if mobile view
  const toggleCurrent = useCallback(
    (selected) => {
      if (view === "recipe") {
        setCurrRecipeId(selected);
      } else {
        setCurrPantryId(selected);
      }
      setMobileView("content");
    },
    [view]
  );

  return (
    <div className="App">
      <Header view={view} buttonClick={toggleView} mobileButtonClick={toggleMobileView} />
      <Body
        view={view}
        mobileView={mobileView}
        navClick={toggleCurrent}
        currRecipeId={currRecipeId}
        currPantryId={currPantryId}
      />
    </div>
  );
};

// title of app with buttons to toggle between Recipe page or Pantry page
// param is function to change the view
const Header = ({ view, buttonClick, mobileButtonClick }) => {
  return (
    <div className="app-header">
      <div className="title">
        <button onClick={() => buttonClick("recipe")} className={view === "recipe" ? "selected" : ""}>
          Recipes
        </button>
        +
        <button onClick={() => buttonClick("pantry")} className={view === "pantry" ? "selected" : ""}>
          Pantry
        </button>
      </div>
      <button onClick={() => mobileButtonClick()} className="mobile-button">
        <MenuButtonSvg />
      </button>
    </div>
  );
};

const MenuButtonSvg = () => {
  return (
    <svg viewBox="0 0 100 80" width="20" height="20">
      <rect width="100" height="15"></rect>
      <rect y="30" width="100" height="15"></rect>
      <rect y="60" width="100" height="15"></rect>
    </svg>
  );
};

// depending on the view, either show Recipe Page or Pantry Page
const Body = ({ view, mobileView, navClick, currRecipeId, currPantryId }) => {
  const pantryInfo = usePantryHook();
  const { recipeInfo } = useRecipeHook(pantryInfo);

  let currRecipe;
  if (view === "recipe" && currRecipeId) {
    recipeInfo.forEach((category) => {
      category.recipes.forEach((recipe) => {
        if (recipe.name === currRecipeId) {
          currRecipe = recipe;
        }
      });
    });
  }

  let currPantry;
  if (view === "pantry" && currPantryId) {
    pantryInfo.forEach((category) => {
      category.items.forEach((item) => {
        if (item.name === currPantryId) {
          currPantry = item;
        }
      });
    });
  }

  return (
    <div className="app-body">
      <Sidebar
        recipeInfo={recipeInfo}
        pantryInfo={pantryInfo}
        view={view}
        mobileView={mobileView}
        navClick={navClick}
        currRecipe={currRecipe}
        currPantry={currPantry}
      />
      {view === "recipe" ? (
        <RecipePage currRecipe={currRecipe} pantryInfo={pantryInfo} mobileView={mobileView} />
      ) : (
        <PantryPage currPantry={currPantry} mobileView={mobileView} />
      )}
    </div>
  );
};

export default App;
