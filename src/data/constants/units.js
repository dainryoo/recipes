const UNIT = {
  GRAM: "g",
  ML: "ml",
  TSP: "tsp",
  TBSP: "tbsp",
  CUP: "cup",
  OZ: "oz",
  LB: "lb",
  ITEM: "item",
  HUNDRED_GRAMS: "hundredGrams"
};

const GRAMS_PER = {
  [UNIT.GRAM]: 1.0,
  [UNIT.ML]: 1.0,
  [UNIT.TSP]: 5.0,
  [UNIT.TBSP]: 15.0,
  [UNIT.CUP]: 240.0,
  [UNIT.OZ]: 28.349523125,
  [UNIT.LB]: 453.59237
};

module.exports = {
  UNIT,
  GRAMS_PER
}