import React from "react";

// view of app when on recipe page
const RecipePage = ({ currRecipe }) => {
  return <div className="recipe content">{currRecipe ? <Recipe currRecipe={currRecipe} /> : <Message />}</div>;
};

// all the info about the currently selected recipe id
const Recipe = ({ currRecipe }) => {
  return (
    <>
      <p className="title">{currRecipe.label}:</p>
      <Ingredients list={currRecipe.ingredients} totalValues={currRecipe.totalValues} />
      <Directions list={currRecipe.directions} />
    </>
  );
};

// shown when no recipes are selected
const Message = () => {
  return "Choose a recipe to begin";
};

// shows ingredients list
const Ingredients = ({ list, totalValues }) => {
  return (
    <div className="ingredients subcontent">
      <p className="title">Ingredients:</p>
      {list && (
        <table className="table">
          <tbody>
            {list.map((currentCategory, index) => (
              <IngredientCategory key={index} category={currentCategory} />
            ))}
            <TotalValues values={totalValues} />
          </tbody>
        </table>
      )}
    </div>
  );
};

// each ingredient category
const IngredientCategory = ({ category }) => {
  return (
    <>
      <tr>
        <td>{category.category}</td>
      </tr>
      {category.ingredients.map((item, index) => (
        <Ingredient key={index} item={item} />
      ))}
      <tr>
        <td> ...</td>
      </tr>
    </>
  );
};

// a single ingredient
const Ingredient = ({ item }) => {
  const { label, amount, unit, grams, calories, protein, price } = item;

  return (
    <tr>
      <td>
        {`${amount} ` + (unit ? unit : "") + (unit && grams ? ` (${grams} g)` : "")} {label}{" "}
      </td>
      <td>{parseFloat(calories).toFixed(2) + " cal"}</td>
      <td>{parseFloat(protein).toFixed(2) + " g protein"}</td>
      <td>{"$" + parseFloat(price).toFixed(2)}</td>
    </tr>
  );
};

// display total nutritional and price values for recipe
const TotalValues = ({ values }) => {
  return (
    <tr>
      <td></td>
      <td>{`${parseFloat(values.calories).toFixed(2)} total cal`}</td>
      <td>{`${parseFloat(values.protein).toFixed(2)} total g protein`}</td>
      <td>{`$${parseFloat(values.price).toFixed(2)} total`}</td>
    </tr>
  );
};

// shows list of directions
const Directions = ({ list }) => {
  return (
    <div className="directions subcontent">
      <p className="title">Directions:</p>
      {list ? (
        <ul className="list">
          {list.map((step, index) =>
            step.length > 0 ? (
              <li className="step" key={index}>
                {step}
              </li>
            ) : (
              <p key={index}></p>
            )
          )}
        </ul>
      ) : (
        <div className="error">Error with directions list for this recipe</div>
      )}
    </div>
  );
};

export default RecipePage;
