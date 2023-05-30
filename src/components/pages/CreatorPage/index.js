import React, { useState } from "react";
import { RecipeCreator } from "Data/utils/recipeCreatorUtils";
import PageComponent from "Common/PageComponent";
import CopyButton from "Common/CopyButton";
import styles from "./index.module.scss";

// Values to use for sessionStorage keys
const STORED_USER_INPUT = "stored-user-input";

const CreatorPage = () => {
  const creation = new RecipeCreator();

  // If an existing userInput was found in localStorage, use that value instead of an empty text box
  const [ userInput, setUserInput ] = useState(window.localStorage.getItem(STORED_USER_INPUT) || "");
  
  const [ recipeOutputText, setRecipeOutputText ] = useState("");
  const [ recipeNutritionText, setRecipeNutritionText ] = useState("");
  const [ recipeGroceryText, setRecipeGroceryText ] = useState("");

  // Function for handling when the Process Recipe button is pressed
  const onProcessRecipeClick = () => {
    // Save the user input from the textbox into the Recipe Creator object
    creation.setUserInput(userInput);
    window.localStorage.setItem(STORED_USER_INPUT, userInput);

    // Update the output text state variable with the creation's newly processed ingredients list
    setRecipeOutputText(creation.getRecipeObjAsPrettyText());
    // Update the calculated nutrition state variable
    setRecipeNutritionText(creation.getRecipeNutritionString());
    // Update the calculated grocery list state variable
    setRecipeGroceryText(creation.getRecipeGroceryText());
  }

  return (
    <PageComponent header="Recipe Creator">
      <h2>Ingredients:</h2>
      <div className={styles.creatorInput}>
        <textarea className={styles.inputBox} value={userInput} onChange={(e) => setUserInput(e.target.value)} />

        <button
          tabIndex="-1"
          className={`${styles.processButton}`}
          onClick={onProcessRecipeClick}
        >
          Process Recipe
        </button>
      </div>
      {
        recipeOutputText ? 
          <>
            <h2>Processed Recipe:</h2>
            <div className={styles.creatorOutput}>
              <h3>nutrition:</h3>
              <p>{recipeNutritionText}</p>
              <h3>recipe:</h3>
              <p className={styles.recipeOutputText}>{recipeOutputText}</p>
              <h3>
                groceries
                { recipeGroceryText ? <CopyButton clipboardText={recipeGroceryText} /> : null }
              </h3>
              <p>{recipeGroceryText}</p>
            </div>
          </>
          :
          null
      }
    </PageComponent>
  );
};
export default CreatorPage;
