import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageComponent from "Common/PageComponent";
import CopyButton from "Common/CopyButton";
import ingredients from "Data/processedIngredients.json"
import { cleanNum, findIdMatch } from "Data/utils/basicUtils";
import { UNIT } from "Data/constants/units.js";

const IngredientPage = () => {
  const { id } = useParams();
  const ingredient = findIdMatch(id, ingredients);
  const averageGrams = ingredient?.nutrition?.[UNIT.ITEM]?.grams;

  const IngredientCalculator = ({ unit, initValue }) => {
    const initialGrams = unit === UNIT.GRAM ? 100 : null;
    const [value, setValue] = useState(initValue || initialGrams || 1);
    const unitConversion = ingredient?.nutrition?.[unit];
  
    if (!unitConversion) {
      return null;
    }
  
    const handleChange = (event) => {
      const input = event.target.value;
      setValue(input);
    };
  
    const gramsEquivalent = unit !== UNIT.GRAM ? cleanNum(value * unitConversion.grams) : null;
    const gramsEquivalentText = gramsEquivalent ? ` = ${gramsEquivalent} g` : "";
    const caloriesEquivalent = cleanNum(value * unitConversion.calories);
    const caloriesEquivalentText = caloriesEquivalent ? ` = ${caloriesEquivalent} cal` : "";
    const clipboardText = `=${gramsEquivalent || value}/100*${ingredient?.nutrition?.hundredGrams.calories}\t${ingredient.name}`;
  
    return (
      <div>
        <input value={value} onChange={handleChange} />
        {`${unit}`}
        { gramsEquivalentText }
        { caloriesEquivalentText }
        {
          caloriesEquivalentText !== "" ?
            <CopyButton clipboardText={clipboardText} />
            :
            null
        }
      </div>
    );
  }  

  return (
    <PageComponent header={ingredient?.name ?? "choose an ingredient"} sidenavLinks={ingredients}>
      { ingredient ? 
        <div>
          <div>
            <h2>Calculator</h2>
            <IngredientCalculator unit={UNIT.GRAM} initValue={averageGrams} />
            <IngredientCalculator unit={UNIT.TSP} />
            <IngredientCalculator unit={UNIT.TBSP} />
            <IngredientCalculator unit={UNIT.CUP} />
            <IngredientCalculator unit={UNIT.OZ} />
            <IngredientCalculator unit={UNIT.LB} />
          </div>
          {
            ingredient?.note ?
              <div>
                <h2>Note</h2>
                <p>{ingredient.note}</p>
              </div>
              :
              null
          }
        </div>
        :
        null
      }
    </PageComponent>
  );
};
export default IngredientPage;
