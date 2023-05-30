const { UNIT, GRAMS_PER } = require("../constants/units")

const isMassUnit = (unit) => {
  return [UNIT.GRAM, UNIT.ML].includes(unit);
};

const isWeightUnit = (unit) => {
  return [UNIT.OZ, UNIT.LB].includes(unit);
};

const isVolumeUnit = (unit) => {
  return [UNIT.TSP, UNIT.TBSP, UNIT.CUP].includes(unit);
};

// For a measurement, get the grams equivalent
const getGrams = (amount, unit) => {
  const conversionFactor = GRAMS_PER?.[unit] || 1.0;
  return 1.0 * amount * conversionFactor;
}

// Convert from initial (volume) unit to the target (also volume) unit
const convertVolume = (amount, initUnit, targetUnit) => {
  if (targetUnit === initUnit) {
    return amount;
  } else if (targetUnit === UNIT.TSP) {
    return initUnit === UNIT.TBSP ? amount * 3.0 : amount * 48.0;
  } else if (targetUnit === UNIT.TBSP) {
    return initUnit === UNIT.TSP ? amount / 3.0 : amount * 16.0;
  } else if (targetUnit === UNIT.CUP) {
    return initUnit === UNIT.TSP ? amount / 48.0 : amount / 16.0;
  }
  return amount;
};

// Convert from initial (mass) unit to the target (mass) unit
const convertMass = (amount, initUnit, targetUnit) => {
  if (targetUnit === initUnit) {
    return amount;
  } else if (targetUnit === UNIT.OZ) {
    return initUnit === UNIT.LB ? amount * 16.0 : amount / 28.35;
  } else if (targetUnit === UNIT.LB) {
    return initUnit === UNIT.OZ ? amount / 16.0 : amount / 454.0;
  } else if (targetUnit === UNIT.GRAM) {
    return initUnit === UNIT.OZ ? amount * 28.35 : amount * 454.0;
  }
  return amount;
};

// Convert from any unit to any other unit
const convertUnits = (amount, initUnit, targetUnit) => {
  if (targetUnit === initUnit) {
    return amount;
  }
  if (isWeightUnit(initUnit) && isWeightUnit(targetUnit)) {
    return convertMass(amount, initUnit, targetUnit);
  }
  if (isVolumeUnit(initUnit) && isVolumeUnit(targetUnit)) {
    return convertVolume(amount, initUnit, targetUnit);
  }

  return amount;
}

// For some unit name, get the "universal" name for it (that is recognized by the app)
const getUniversalUnit = (unit) => {
  let universalUnit = null;
  switch (unit?.trim()?.replace('.', "") || "") {
    case "":
      universalUnit = "";
      break;
    case "t":
    case "tsp":
    case "tsps":
    case "Tsp":
    case "Tsps":
    case "TSP":
    case "TSPS":
    case "teaspoon":
    case "teaspoons":
    case "Teaspoon":
    case "Teaspoons":
      universalUnit = "tsp";
      break;
    case "T":
    case "tbsp":
    case "tbsps":
    case "Tbsp":
    case "Tbsps":
    case "TBSP":
    case "TBSPS":
    case "tablespoon":
    case "tablespoons":
    case "Tablespoon":
    case "Tablespoons":
      universalUnit = "tbsp";
      break;
    case "c":
    case "C":
    case "cp":
    case "cps":
    case "cup":
    case "Cup":
    case "Cups":
      universalUnit = "cup";
      break;
    case "lb":
    case "lbs":
    case "Lb":
    case "Lbs":
    case "LB":
    case "LBS":
    case "pound":
    case "pounds":
    case "Pound":
    case "Pounds":
      universalUnit = "lb";
      break;
    case "oz":
    case "ozs":
    case "Oz":
    case "Ozs":
    case "OZ":
    case "OZS":
    case "ounce":
    case "ounces":
    case "Ounce":
    case "Ounces":
      universalUnit = "oz";
      break;
    case "g":
    case "G":
    case "gs":
    case "Gs":
    case "GS":
    case "gram":
    case "grams":
    case "Gram":
    case "Grams":
      universalUnit = "g";
      break;
    case "ml":
    case "mls":
    case "Ml":
    case "Mls":
    case "ML":
    case "MLS":
    case "milliliter":
    case "milliliters":
    case "Milliliter":
    case "Milliliters":
      universalUnit = "ml";
      break;
  }

  return universalUnit;
}

module.exports = { 
  convertUnits,
  getGrams,
  isMassUnit,
  isVolumeUnit,
  isWeightUnit,
  getUniversalUnit
};