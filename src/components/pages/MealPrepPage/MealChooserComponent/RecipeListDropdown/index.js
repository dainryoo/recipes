import React, { useState } from "react";
import allRecipes from "Data/processedRecipes.json";
import { filterListBy } from "Data/utils/basicUtils";
import styles from "./index.module.scss";

const RecipeListDropdown = ({ chosenRecipe, chooseRecipe }) => {
  // Keep track of the values inside of the search bar to filter the dropdown list of all recipes
  const [ inputValue, setInputValue ] = useState("");

  return (
    <div className={styles.recipeListContainer}>
      <div className={styles.dropdownSearchBarContainer}>
        <input 
          placeholder="Type to find recipes..."
          className={styles.dropdownSearchBar}
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
        />
      </div>
      <div className={styles.recipeListDropdown}>
        {
          filterListBy(allRecipes, inputValue).map((recipe, recipeIndex) => {
            const isDivider = recipe === "divider";
            const isChosenRecipe = recipe.name === chosenRecipe;
            return (
              isDivider ?
                <div className={styles.divider} key="divider"></div>
                :
                <button 
                  key={`recipe-list-dropdown-${recipeIndex}`} 
                  className={`${styles.recipeListDropdownOption} ${isChosenRecipe ? styles.selected : ""}`}
                  onClick={() => chooseRecipe(recipe.name)}
                >
                  <span className={styles.selectedIcon}>✓ </span>
                  <span>{recipe.name}</span>
                </button>
            );
          })
        }
      </div>
    </div>
  );
};

export default RecipeListDropdown;
