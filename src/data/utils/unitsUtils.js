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

module.exports = { 
  convertUnits,
  getGrams,
  isMassUnit,
  isVolumeUnit,
  isWeightUnit
};