import React, { useState } from 'react';
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



  const [recipeMultipler, setRecipeMultipler] = useState(1);

  // todo: save "metadata": if i have multiplied a recipe,
  // save it in the state with the recipe name attached.
  // on useEffect, check if we have the recipe name saved, if it does, load that info

  // triggered when item prop changes:
  // useEffect(() => {
  //   setCalculatedCal(0); // reset calculatedCal
  //   setInputtedGrams(0); // reset number in input box
  // }, [item]);

  const handleChange = event => {
    const inputNum = event.target.value;
    setRecipeMultipler(inputNum);
  }
  //
  // {
  //   recipeName: { ... }
  //   { recipe }
  //   { recipe }
  //   ...
  // }
  //
  // key = recipeName
  // value = {
  //   recipeMultipler: 0,
  //   ingredientsMultiplers: {
  //     ingredientName: 1,
  //     anotherName: 0.25,
  //     ...
  //   }
  // }
  //
  // key = recipeName
  // value = {
  //   recipeMultipler: 0,
  //   originalIngredientsMultiplers: [ 0, 1, ,1,1,1,1],
  //   newIngredients: {
  //     ingredientName: 1,
  //     anotherName: 0.25
  //   }
  // }


  return (
    <div className={"recipe content" + (view === 0 ? " hidden" : "")}>
      <div className="heading">{label ? label : name}</div>
      <Ingredients ingredients={ingredients ? ingredients : ingredientCategories} onMultiplerChange={handleChange}/>
      {directions && <Directions directions={directions}/>}
      {nutrition && <Nutrition nutrition={nutrition} recipeMultipler={recipeMultipler}/>}
    </div>
  );
}

const mapStateToProps = state => {
	return {
    view: state.view
  }
}
export default connect(mapStateToProps)(Recipe);
