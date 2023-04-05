const { UNIT } = require("../data/constants/units");

const { 
    convertUnits, 
    getGrams, 
    isMassUnit,
    isVolumeUnit, 
    isWeightUnit 
} = require("../data/utils/unitsUtils");

test('isMassUnit should correctly verify mass units', () => {
    expect(isMassUnit(UNIT.GRAM)).toBe(true);
    expect(isMassUnit(UNIT.ML)).toBe(true);

    expect(isMassUnit(UNIT.TSP)).toBe(false);
    expect(isMassUnit(UNIT.ITEM)).toBe(false);
    expect(isMassUnit(UNIT.HUNDRED_GRAMS)).toBe(false);
});

test('isVolumeUnit should correctly verify volume units', () => {
    expect(isVolumeUnit(UNIT.TSP)).toBe(true);
    expect(isVolumeUnit(UNIT.TBSP)).toBe(true);
    expect(isVolumeUnit(UNIT.CUP)).toBe(true);

    expect(isVolumeUnit(UNIT.GRAM)).toBe(false);
    expect(isVolumeUnit(UNIT.LB)).toBe(false);
    expect(isVolumeUnit(UNIT.ITEM)).toBe(false);
});

test('isWeightUnit should correctly verify weight units', () => {
    expect(isWeightUnit(UNIT.OZ)).toBe(true);
    expect(isWeightUnit(UNIT.LB)).toBe(true);

    expect(isWeightUnit(UNIT.TSP)).toBe(false);
    expect(isWeightUnit(UNIT.ITEM)).toBe(false);
    expect(isWeightUnit(UNIT.HUNDRED_GRAMS)).toBe(false);
});

test('getGrams should correctly convert any value to grams', () => {
    expect(getGrams(2, UNIT.OZ)).toEqual(56.69904625);
    expect(getGrams(0.03, UNIT.LB)).toEqual(13.6077711);

    expect(getGrams(0.00006, UNIT.CUP)).toEqual(0.0144);
    expect(getGrams(1.11, UNIT.TSP)).toEqual(5.550000000000001);

    expect(getGrams(3, UNIT.ML)).toEqual(3);
});

test('convertUnits should correctly calculate unit conversions', () => {
    expect(convertUnits(1, UNIT.OZ, UNIT.LB)).toEqual(0.0625);
    expect(convertUnits(1, UNIT.LB, UNIT.OZ)).toEqual(16);

    expect(convertUnits(1, UNIT.CUP, UNIT.TBSP)).toEqual(16);
    expect(convertUnits(1, UNIT.TBSP, UNIT.TSP)).toEqual(3);
    expect(convertUnits(1, UNIT.CUP, UNIT.TSP)).toEqual(48);
    expect(convertUnits(1, UNIT.TBSP, UNIT.CUP)).toEqual(0.0625);
    expect(convertUnits(1, UNIT.TSP, UNIT.CUP)).toEqual(0.020833333333333332);

    Object.values(UNIT).forEach((currUnit) => {
        expect(convertUnits(1, currUnit, currUnit)).toEqual(1);
    })
});