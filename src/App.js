import React, { useState, useCallback } from "react";
import "./App.scss";

import Sidebar from "./components/Sidebar.js";
import RecipePage from "./components/RecipePage.js";
import PantryPage from "./components/PantryPage.js";
import useRecipeHook from "./hooks/recipeHook.js";
import usePantryHook from "./hooks/pantryHook.js";

const App = () => {
  const [view, setView] = useState("pantry"); // flag to toggle between recipe and pantry view
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

  // set the currently selected recipe or pantry item, depending on what view we're in
  const toggleCurrent = useCallback(
    (selected) => {
      if (view === "recipe") {
        setCurrRecipeId(selected);
      } else {
        setCurrPantryId(selected);
      }
    },
    [view]
  );

  return (
    <div className="App">
      <Header buttonClick={toggleView} />
      <Body view={view} navClick={toggleCurrent} currRecipeId={currRecipeId} currPantryId={currPantryId} />
    </div>
  );
};

// title of app with buttons to toggle between Recipe page or Pantry page
// param is function to change the view
const Header = ({ buttonClick }) => {
  return (
    <div className="app-header">
      <div className="title">
        <button onClick={() => buttonClick("recipe")}>Recipes</button>+
        <button onClick={() => buttonClick("pantry")}>Pantry</button>
      </div>
      <div className="mobile-btn">=</div>
    </div>
  );
};

// depending on the view, either show Recipe Page or Pantry Page
const Body = ({ view, navClick, currRecipeId, currPantryId }) => {
  const pantryInfo = usePantryHook();
  const recipeInfo = useRecipeHook(pantryInfo);

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
      <Sidebar recipeInfo={recipeInfo} pantryInfo={pantryInfo} view={view} navClick={navClick} />
      {view === "recipe" ? <RecipePage currRecipe={currRecipe} /> : <PantryPage currPantry={currPantry} />}
    </div>
  );
};

export default App;
