import React, { useState } from "react";
import { MEAL_PLAN_ENTRY } from "Data/constants/calendar";
import RecipeListDropdown from "./RecipeListDropdown";
import styles from "./index.module.scss";

const MealChooserComponent = ({ mealPlan, chosenDayAndMealTypes, updateMeals, chooseDayAndMealTypes }) => {
  const [ chosenRecipe, setChosenRecipe ] = useState(null);

  // Check whether there are chosen days and chosen meal types with meal entries to reset
  const hasSelectedResettableEntry = Object.values(mealPlan.getAllMeals()).find((mealPlanEntry) => {
    // Filter out all meal plan entries, returning only those that have matches to the list of chosen days and chosen meal types
    return mealPlanEntry?.whenToEat?.find((whenToEatEntry) => {
      // Go through each entry in the meal plan and check its day and meal type against the list of chosen days and meal types for any matches
      return chosenDayAndMealTypes.some((chosenDayAndMealType) => {
        return chosenDayAndMealType?.[MEAL_PLAN_ENTRY.DAY] === whenToEatEntry?.[MEAL_PLAN_ENTRY.DAY]
          && chosenDayAndMealType?.[MEAL_PLAN_ENTRY.MEAL_TYPE] === whenToEatEntry?.[MEAL_PLAN_ENTRY.MEAL_TYPE];
      });
    })
  });

  // Function for handling when the Save button is pressed
  const onMealSave = () => {
    // Add the entry to the meal plan
    mealPlan.addMeal(
      chosenRecipe,
      [ ...chosenDayAndMealTypes ]
    );
    // Reset the currently chosen recipe
    setChosenRecipe(null);
    // Call the updateMeals function to make sure the meals state is handled properly in the parent
    updateMeals();
  };

  // Function for handling when the Cancel button is pressed
  const onCancel = () => {
    // Reset the day and meal type that had been chosen
    chooseDayAndMealTypes([]);
    // Reset the currently chosen recipe
    setChosenRecipe(null);
  }

  // Function for handling when the Reset button is pressed
  const onMealReset = () => {
    // Meals to remove exist in the list of chosen days and meal types
    if (hasSelectedResettableEntry) {
      // Remove all of the entries from the meal plan
      chosenDayAndMealTypes.forEach((dayAndMealType) => {
        const mealIdToRemove = mealPlan.getMealIdOfMealOfDay(dayAndMealType?.[MEAL_PLAN_ENTRY.DAY], dayAndMealType?.[MEAL_PLAN_ENTRY.MEAL_TYPE]);
        mealPlan.removeMeal(mealIdToRemove);
      });
      // Reset the currently chosen recipe
      setChosenRecipe(null);
      // Call the updateMeals function to make sure the meals state is handled properly in the parent
      updateMeals();
    }
  }

  // Update the state for the chosen recipe 
  const chooseRecipe = (recipeName) => {
    setChosenRecipe(recipeName);
  }

  // Whether a day and mealType were chosen to edit or not
  const currentlyEditing = chosenDayAndMealTypes?.length > 0;

  return (currentlyEditing ?
    <div className={styles.mealChooserContainer}>
      <h2>
        Choose a recipe
      </h2>
      <div className={styles.cancelAndResetButtonsContainer}>
        <button className={styles.actionButton} onClick={onCancel}>Cancel</button>
        {
          hasSelectedResettableEntry ?
            <button className={styles.actionButton} onClick={onMealReset}>Reset Selected Meals</button>
            :
            null
        }
      </div>
      <RecipeListDropdown chosenRecipe={chosenRecipe} chooseRecipe={chooseRecipe}/>
      {
        chosenRecipe ?
          <button 
            className={`${styles.saveButton} ${styles.actionButton}`}
            onClick={onMealSave}
          >
            Save
          </button>
          :
          null
      }
    </div>
  :
    null
  );
};
export default MealChooserComponent;
