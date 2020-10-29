import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import Ingredients from "./recipe/Ingredients.js";
import Directions from "./recipe/Directions.js";
import Nutrition from "./recipe/Nutrition.js";


const Recipe = ({recipe, view}) => {

  const { name, label, ingredients, directions, nutrition } = recipe;

  let ingredientCategories = recipe.ingredient_categories;
  if (ingredientCategories) {
    let categoriesFlattened = []; // need to turn the nested array into a "flat" one
    ingredientCategories.forEach((category) => {
      categoriesFlattened.push(category);
      category.ingredients.forEach((ingredient) => {
        categoriesFlattened.push(ingredient);
      });
    });
    ingredientCategories = categoriesFlattened;
  }

  let testObj = {test: {multiplier: 1}, another_test: {multiplier:2}};

  const [modifiedRecipes, setModifiedRecipes] = useState(testObj);
  const [editingIngredientIndex, setIndex] = useState(-1);

  const [calculatorInfo, setCalculatorInfo] = useState({ grams: { input: 0, calories: 0}});

  // useEffect(() => {
  //   const newState = { grams: { input: 0, calories: 0}};
  //   if (item.conversion_to_grams) {
  //     for (const unit of Object.keys(item.conversion_to_grams)) {
  //       newState[unit] = { input: 0, toGrams: 0, calories: 0 };
  //     }
  //   }
  //   setCalculatorInfo(newState);
  // }, [recipe]);

  // save and finish the edit to an individual item (represented by its index)
  const saveIngredientEdit = (itemIndex) => {
    setIndex(-1);
    console.log(modifiedRecipes);
  }

  // cancel the edit to an individual item (represented by its index)
  const cancelIngredientEdit = (itemIndex) => {
    setIndex(-1);
    console.log(modifiedRecipes);
  }

  // start editing an individual item (represented by its index)
  const startEditingIngredient = (itemIndex) => {
    setIndex(itemIndex);
  }

  // for the currently editing item, keep hold of the current input
  const setAmountInput = (input, itemIndex) => {
    const prevState = modifiedRecipes;


    if (prevState.hasOwnProperty(name)) {
      // if this current recipe has been modified and has a version saved already
      let prevEditedInfo = prevState[name].editedIngredients;
      prevEditedInfo[itemIndex].amount = parseFloat(input);

      setModifiedRecipes(prevState => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          editedIngredients: prevEditedInfo
        }
      }));
    } else {
      // if the recipe hasn't been saved yet, add it
      setModifiedRecipes(prevState => ({
        ...prevState,
        [name]: {
          originalIngredients: ingredients,
          editedIngredients: ingredients
        }
      }));
    }

    console.log(modifiedRecipes);
  }

  // reset the item being edited if the recipe changes
  useEffect(() => {
    setIndex(-1);
  }, [recipe]);


  return (
    <div className={"recipe content" + (view === 0 ? " hidden" : "")}>
      <div className="heading">{label ? label : name}</div>
      <Ingredients ingredients={ingredients ? ingredients : ingredientCategories}
                    setAmountInput={setAmountInput}
                    saveIngredientEdit={saveIngredientEdit}
                    cancelIngredientEdit={cancelIngredientEdit}
                    editingIngredientIndex={editingIngredientIndex}
                    startEditingIngredient={startEditingIngredient}/>
      {directions && <Directions directions={directions}/>}
      {nutrition && <Nutrition nutrition={nutrition} />}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Recipe);
