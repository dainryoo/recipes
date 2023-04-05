const { INGREDIENT_TAGS } = require("../constants/tags");
const { UNIT } = require("../constants/units");

const { generateId, isEmpty } = require("../utils/basicUtils");
const { convertUnits, getGrams, isVolumeUnit, isWeightUnit } = require("../utils/unitsUtils");

// Take an ingredient's serving info and return its filtered tags and detailed nutrition info
const getProcessedIngredientData = (ingredient) => {
  const servingInfo = ingredient?.serving;
  const servingAmount = servingInfo?.amount ? 1.0 * servingInfo.amount : null;
  const servingUnit = servingInfo?.unit;
  const servingGrams = servingInfo?.grams ? 1.0 * servingInfo.grams : null;
  const servingCalories = (!!servingInfo?.calories || servingInfo?.calories === 0) ? 1.0 * servingInfo.calories : null;
  const servingProtein = (!!servingInfo?.protein || servingInfo?.protein == 0) ? 1.0 * servingInfo.protein : null;

  // In case of any missing servingInfo data, return an empty object
  if (!servingInfo || isEmpty(servingInfo) || !servingGrams || !servingAmount || servingCalories == null || servingProtein == null) {
    console.log(`Warning: ${ingredient.name} is missing serving info!`);
    return {};
  }

  // From the originally inputted list of tags for the ingredient, filter out any unexpected tags
  const originalIngredientTags = ingredient?.tags;
  const cleanedIngredientTags = originalIngredientTags?.filter((currTag) => {
    const isValidTag = Object.values(INGREDIENT_TAGS)?.includes(currTag);
    // In case of any unexpected tags for this ingredient, log a warning
    if (!isValidTag) {
      console.log(`Warning: ${ingredient.name} has unexpected tag of ${currTag}`);
    }
    return isValidTag;
  });

  // Calculate nutrition for 1 gram of this ingredient
  const gramNutrition = { 
    grams: 1.0,
    calories: servingCalories / servingGrams, 
    protein: servingProtein / servingGrams
  };
  // Calculate nutrition for 100 grams of this ingredient
  const hundredGramsNutrition = { 
    grams: 100.0,
    calories: gramNutrition.calories * 100.0, 
    protein: gramNutrition.protein * 100.0
  };

  // Calculate nutrition for 1 oz and 1 lb of this ingredient
  // First get the (general) grams measurement of 1 oz and 1 lb
  const weightUnitsToGrams = {
    oz: getGrams(1, UNIT.OZ),
    lb: getGrams(1, UNIT.LB)
  }
  // If this ingredient had oz/lb info already, use that instead for the gram measurements
  if (isWeightUnit(servingUnit)) {
    const servingToOz = convertUnits(servingAmount, servingUnit, UNIT.OZ);
    const servingToLb = convertUnits(servingAmount, servingUnit, UNIT.LB);
    weightUnitsToGrams.oz =  servingGrams / servingToOz;
    weightUnitsToGrams.lb = servingGrams / servingToLb;
  }
  // Use the gram measurements of 1 oz and 1 lb to calculate the nutrition
  const weightData = {
    [UNIT.OZ]: {
      grams: weightUnitsToGrams.oz,
      calories: servingCalories / servingGrams * weightUnitsToGrams.oz,
      protein: servingProtein / servingGrams * weightUnitsToGrams.oz
    },
    [UNIT.LB]: {
      grams: weightUnitsToGrams.lb,
      calories: servingCalories / servingGrams * weightUnitsToGrams.lb,
      protein: servingProtein / servingGrams * weightUnitsToGrams.lb
    }
  };

  // Calculate nutrition for 1 of this ingredient, if valid (i.e. it makes sense for the ingredient)
  const itemNutrition = {};
  if (servingUnit === "") {
    itemNutrition.grams = servingGrams / servingAmount;
    itemNutrition.calories = servingCalories / servingAmount;
    itemNutrition.protein = servingProtein / servingAmount;
  }

  // Calculate nutrition for 1 tsp, 1 tbsp, and 1 cup of this ingredient, if valid (i.e. it makes sense for the ingredient)
  const volumeData = {};
  if (isVolumeUnit(servingUnit)) {
    const servingToTsp = convertUnits(servingAmount, servingUnit, UNIT.TSP);
    const servingToTbsp = convertUnits(servingAmount, servingUnit, UNIT.TBSP);
    const servingToCup = convertUnits(servingAmount, servingUnit, UNIT.CUP);

    const tspToGrams = servingGrams / servingToTsp;
    const tbspToGrams = servingGrams / servingToTbsp;
    const cupToGrams = servingGrams / servingToCup;

    volumeData[UNIT.TSP] = {
      grams: tspToGrams,
      calories: servingCalories / servingGrams * tspToGrams,
      protein: servingProtein / servingGrams * tspToGrams
    };
    volumeData[UNIT.TBSP] = {
      grams: tbspToGrams,
      calories: servingCalories / servingGrams * tbspToGrams,
      protein: servingProtein / servingGrams * tbspToGrams
    };
    volumeData[UNIT.CUP] = {
      grams: cupToGrams,
      calories: servingCalories / servingGrams * cupToGrams,
      protein: servingProtein / servingGrams * cupToGrams
    };
  }

  // Save the filteredTags and all of the different nutrition infos
  return {
    filteredTags: cleanedIngredientTags,
    nutrition: {
      [UNIT.GRAM]: gramNutrition,
      [UNIT.ML]: gramNutrition,
      [UNIT.HUNDRED_GRAMS]: hundredGramsNutrition,
      ...weightData,
      ...(!isEmpty(itemNutrition) && { [UNIT.ITEM]: itemNutrition }),
      ...(!isEmpty(volumeData) && { ...volumeData })
    }
  };
}

// Process raw ingredient data
const processIngredients = (data) => {
  const allProcessedIngredients = data.map((ingredient) => {
    // For each ingredient, add a kebab-case ID, the filtered tags, and the new detailed nutrition info
    const processedData = getProcessedIngredientData(ingredient);
    const processedIngredient = {
      id: generateId(ingredient.name),
      ...ingredient,
      tags: [ ...processedData?.filteredTags ],
      nutrition: { ...processedData.nutrition }
    };
    return processedIngredient;
  });
  return allProcessedIngredients;
}

module.exports = { processIngredients };