import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import Ingredients from "./recipe/Ingredients.js";
import Directions from "./recipe/Directions.js";
import Nutrition from "./recipe/Nutrition.js";


const Recipe = (props) => {

  const { recipe, view } = props;
  const { name, label, ingredients, directions, nutrition } = recipe;

  let ingredientCategories = props.recipe.ingredient_categories;
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

  const [currRecipeMultipler, setRecipeMultipler] = useState(1);
  const [modifiedRecipes, setModifiedRecipe] = useState(testObj);

  // triggered when item prop changes:
  useEffect(() => {
    setRecipeMultipler(1); // reset currRecipeMultipler
  }, []);

  const handleMultiplierChange = event => {
    const inputNum = event.target.value;
    editRecipeModifier(inputNum);

    setRecipeMultipler(inputNum);
  }

  const editRecipeModifier = (inputNum) => {
    modifiedRecipes[name] = {
      recipeMultipler: inputNum,
      originalIngredients: ingredients,
      newIngredients: {}
    };
    console.log(modifiedRecipes);
  }


  return (
    <div className={"recipe content" + (view === 0 ? " hidden" : "")}>
      <div className="heading">{label ? label : name}</div>
      <Ingredients ingredients={ingredients ? ingredients : ingredientCategories} onMultiplerChange={handleMultiplierChange} recipeMultipler={currRecipeMultipler}/>
      {directions && <Directions directions={directions}/>}
      {nutrition && <Nutrition nutrition={nutrition} recipeMultipler={currRecipeMultipler}/>}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Recipe);
