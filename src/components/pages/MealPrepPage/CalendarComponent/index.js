import React from "react";
import { MEAL_PLAN_ENTRY } from "Data/constants/calendar";
import CopyButton from "Common/CopyButton";
import styles from "./index.module.scss";

const CalendarComponent = ({ calendar, mealPlan, chosenDayAndMealTypes, updateMeals, chooseDayAndMealTypes }) => {

  // Function for handling when the Clear All button is pressed
  const onClear = () => {
    // Reset the entire meal plan
    mealPlan.resetMealPlan();
    // Call the updateMeals function to make sure the meals state is handled properly in the parent
    updateMeals();
  }

  // Check whether this day and mealType are already on the list of chosen days and mealTypes
  const alreadyAddedAtIndex = (dayId, mealTypeId) => {
    // Return the index if a match was found
    const index = chosenDayAndMealTypes.findIndex((entry) => { 
      return entry[MEAL_PLAN_ENTRY.DAY] === dayId && entry[MEAL_PLAN_ENTRY.MEAL_TYPE] === mealTypeId; 
    });
    return index;
  }

  // Add this day and mealType to the list of chosen days and meal types, if not added.
  // If already added, remove this day and mealType from the list of chosen days and meal types
  const toggleChoosingDayAndMealType = (dayId, mealTypeId) => {
    const existingIndex = alreadyAddedAtIndex(dayId, mealTypeId);
    if (existingIndex > -1) {
      // A match was found, so we should remove the entry
      chosenDayAndMealTypes.splice(existingIndex, 1); // remove the one entry from the index match that was found
    } else {
      // No match was found, so we should add a new entry
      chosenDayAndMealTypes.push({ 
        [MEAL_PLAN_ENTRY.DAY]: dayId, 
        [MEAL_PLAN_ENTRY.MEAL_TYPE]: mealTypeId
      });
    }
    chooseDayAndMealTypes( [ ...chosenDayAndMealTypes ]);
  }

  return (
    <div className={styles.calendarContainer}>
      <h2>
        Calendar
        <CopyButton clipboardText={mealPlan.getAllMealsString(calendar)} />
      </h2>
      <div className={styles.calendarDayLabelsContainer}>
        {calendar.getDays().map((day, dayIndex) => {
          return ( 
            <div key={`${day}day-${dayIndex}`} className={styles.calendarDay}>
              <h3 className={styles.calendarDayLabel}>{day}</h3>
              <div className={styles.calendarDayMealTypes}>
                <div 
                  className={`${styles.calendarSingleEntryContainer} ${alreadyAddedAtIndex(dayIndex, 0) > -1 ? styles.selected : ""}`}
                  onClick={() => toggleChoosingDayAndMealType(dayIndex, 0)}
                >
                  <input 
                    type="checkbox"
                    checked={alreadyAddedAtIndex(dayIndex, 0) > -1}
                    readOnly
                  />
                  <span className={`${styles.entryRecipeLabel} ${alreadyAddedAtIndex(dayIndex, 0) > -1 ? styles.selected : ""}`}>
                    {mealPlan.getMealOfDayLabel(dayIndex, 0)}
                  </span>
                </div>
                <div 
                  className={`${styles.calendarSingleEntryContainer} ${alreadyAddedAtIndex(dayIndex, 1) > -1 ? styles.selected : ""}`}
                  onClick={() => toggleChoosingDayAndMealType(dayIndex, 1)}
                >
                  <input 
                    type="checkbox"
                    checked={alreadyAddedAtIndex(dayIndex, 1) > -1}
                    readOnly
                  />
                  <span className={`${styles.entryRecipeLabel} ${alreadyAddedAtIndex(dayIndex, 1) > -1 ? styles.selected : ""}`}>
                    {mealPlan.getMealOfDayLabel(dayIndex, 1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        tabIndex="-1"
        className={`${styles.clearButton} ${chosenDayAndMealTypes?.length <= 0 ? "" : styles.hidden}`}
        onClick={onClear}
      >
          <span className={styles.dangerIcon}>⚠</span>
          Clear Calendar
          <span className={styles.dangerIcon}>⚠</span>
      </button>
    </div>
  );
};
export default CalendarComponent;
