import React, { useState, useMemo } from "react";
import { MealPlan } from "Data/utils/mealPlanUtils";
import { Calendar } from "Data/utils/calendarUtils";
import PageComponent from "Common/PageComponent";
import GroceryListComponent from "./GroceryListComponent";
import CalendarComponent from "./CalendarComponent";
import MealChooserComponent from "./MealChooserComponent";
import styles from "./index.module.scss";

// Values to use for sessionStorage keys
const STORED_MEAL_PLAN_GROCERY_LIST = "stored-meal-plan-grocery-list";
const STORED_MEAL_PLAN_SHOPPING_LIST_TEXT = "stored-meal-plan-shopping-list-text";
const STORED_MEAL_PLAN_ALL_MEALS = "stored-meal-plan-all-meals";
const STORED_CALENDAR_DAYS = "stored-calendar-days";

const MealPrepPage = () => {
  const [meals, setMeals] = useState(null);
  // The chosen day and mealType to edit in the MealChooserComponent
  const [ chosenDayAndMealTypes, setChosenDayAndMealTypes ] = useState([]);

  // Update the state for the chosenDay and chosenMealType that we are editing in the MealChooserComponent
  const chooseDayAndMealTypes = (dayIdAndMealTypeIds) => {
    setChosenDayAndMealTypes([ ...dayIdAndMealTypeIds ]);
  }

  const mealPlan = useMemo(() => new MealPlan(), []);
  const calendar = useMemo(() => new Calendar(), []);

  // If an existing meal plan was found in localStorage, update the newly created MealPlan object
  if (window.localStorage.getItem(STORED_MEAL_PLAN_ALL_MEALS)) {
    mealPlan.setMealPlan(
      JSON.parse(window.localStorage.getItem(STORED_MEAL_PLAN_GROCERY_LIST)),
      JSON.parse(window.localStorage.getItem(STORED_MEAL_PLAN_SHOPPING_LIST_TEXT)),
      JSON.parse(window.localStorage.getItem(STORED_MEAL_PLAN_ALL_MEALS))
    );
  }

  // If an existing calendar was found in localStorage, update the newly created Calendar object
  if (window.localStorage.getItem(STORED_CALENDAR_DAYS)) {
    calendar.setCalendar(JSON.parse(window.localStorage.getItem(STORED_CALENDAR_DAYS)));
  } else {
    // Else, save the new Calendar as the localStorage data
    window.localStorage.setItem(STORED_CALENDAR_DAYS, JSON.stringify(calendar.getDays()));
  }
  
  // Update the state for all set meals
  // This needs to be passed to and used by all children components that update the mealPlan object
  const updateMeals = () => {
    setMeals(mealPlan.getAllMeals());
    setChosenDayAndMealTypes([]);

    // Update localStorage items
    window.localStorage.setItem(STORED_MEAL_PLAN_GROCERY_LIST, JSON.stringify(mealPlan.getGroceryList()));
    window.localStorage.setItem(STORED_MEAL_PLAN_SHOPPING_LIST_TEXT, JSON.stringify(mealPlan.getShoppingListText()));
    window.localStorage.setItem(STORED_MEAL_PLAN_ALL_MEALS, JSON.stringify(mealPlan.getAllMeals()));
    window.localStorage.setItem(STORED_CALENDAR_DAYS, JSON.stringify(calendar.getDays()));
  }
  
  return (
    <PageComponent header="Meal Prep">
      <div className={styles.calendarAndMealChooserContainer}>
        <CalendarComponent 
          calendar={calendar}
          mealPlan={mealPlan}
          chosenDayAndMealTypes={chosenDayAndMealTypes}
          updateMeals={updateMeals}
          chooseDayAndMealTypes={chooseDayAndMealTypes}
        />
        <MealChooserComponent 
          mealPlan={mealPlan}
          chosenDayAndMealTypes={chosenDayAndMealTypes}
          updateMeals={updateMeals}
          chooseDayAndMealTypes={chooseDayAndMealTypes}
        />
      </div>
      <GroceryListComponent 
        mealPlan={mealPlan}
      />
    </PageComponent>
  );
};
export default MealPrepPage;
