const { 
	isPosInt,
	convertStringToInt,
	generateId,
	cleanNum,
	isEmpty,
	findNameMatch 
} = require("../data/utils/basicUtils");

test('isPosInt should recognize only positive integers', () => {
	expect(isPosInt(1)).toBe(true);
	expect(isPosInt(9999)).toBe(true);
	
	expect(isPosInt(0)).toBe(false);
	expect(isPosInt("1")).toBe(false);
	expect(isPosInt(-1)).toBe(false);
	expect(isPosInt("-1")).toBe(false);
	expect(isPosInt(null)).toBe(false);
	expect(isPosInt(undefined)).toBe(false);
	expect(isPosInt()).toBe(false);
});

test('convertStringToInt should correctly convert strings of numbers into Integers', () => {
	expect(convertStringToInt(1)).toEqual(null);
	expect(convertStringToInt(0)).toEqual(null);
	expect(convertStringToInt(undefined)).toEqual(null);
	expect(convertStringToInt(null)).toEqual(null);
	expect(convertStringToInt("test")).toEqual(null);
	expect(convertStringToInt("-1")).toEqual(null);

	expect(convertStringToInt("1")).toEqual(1);
	expect(convertStringToInt("100.0")).toEqual(100);
	expect(convertStringToInt("1.5")).toEqual(1.5);
	expect(convertStringToInt("0.333333333333")).toEqual(0.333333333333);
	expect(convertStringToInt("1/2")).toEqual(0.5);
	expect(convertStringToInt("1/8")).toEqual(0.125);
	expect(convertStringToInt("1/3")).toEqual(1.0 / 3);
	expect(convertStringToInt("1/6")).toEqual(1.0 / 6);
});

test('generateId should generate a valid ID', () => {
	expect(generateId("test ID")).toBe("test-id");
	expect(generateId("test ID  with      too many    spaces")).toBe("test-id-with-too-many-spaces");
	expect(generateId("         test ID with trailing spaces  ")).toBe("test-id-with-trailing-spaces");
	expect(generateId("test ID with 4 non-ABC characters? ?")).toBe("test-id-with-4-non-abc-characters?-?");
	expect(generateId("test ID with àcceÑts")).toBe("test-id-with-àcceñts");
});

test('cleanNum should clean up numbers as expected', () => {
	// Zero tests
	expect(cleanNum(0)).toBe(0);
	expect(cleanNum(0.0)).toBe(0);
	expect(cleanNum(0.01)).toBe(0.01);
	expect(cleanNum(0.001)).toBe(0.00);

	// Negatives
	expect(cleanNum(-0)).toBe(-0);
	expect(cleanNum(-1)).toBe(-1);

	// General tests
	expect(cleanNum(123)).toBe(123);
	expect(cleanNum(123.45)).toBe(123.45);
	expect(cleanNum(123.456)).toBe(123.46);
	expect(cleanNum(123.4549)).toBe(123.45);
	});

test('isEmpty should recognize empty Objects', () => {
	expect(isEmpty({ test: null })).toBe(false);
	expect(isEmpty({})).toBe(true);

	// Non-Objects
	expect(isEmpty([])).toBe(false);
	expect(isEmpty([ { test: [] }])).toBe(false);
	expect(isEmpty(null)).toBe(true);
	expect(isEmpty(undefined)).toBe(true);
});

test('findNameMatch should find matches to Object names', () => {
	const goodName = "good";
	const typoName = "good ";
	const capsName = "GOOD";
	const missingName = "bad";

	const arrayOfObjsWithMatch = [
		{ name: "GOOD", id: 1, other: "bad" },
		{ name: "good", id: 2, other: "bad" },
		{ name: "good", id: 3, other: "bad" },
	];
	const multiTypeArrayOfObjsWithMatch = [
		"good",
		{ name: "good" }
	];
	const arrayOfObjsNoMatch = [
		{ name: "bad", id: 1, other: "good" },
		{ name: "good ", id: 2, other: "good" },
		{ name: "GOOD", id: 3, other: "good" },
	];

	expect(findNameMatch(goodName, arrayOfObjsWithMatch)).toBe(arrayOfObjsWithMatch[1]);
	expect(findNameMatch(capsName, arrayOfObjsWithMatch)).toBe(arrayOfObjsWithMatch[0]);
	expect(findNameMatch(goodName, multiTypeArrayOfObjsWithMatch)).toBe(multiTypeArrayOfObjsWithMatch[1]);

	expect(findNameMatch(goodName, arrayOfObjsNoMatch)).toBe(null);
	expect(findNameMatch(typoName, arrayOfObjsWithMatch)).toBe(null);
	expect(findNameMatch(missingName, arrayOfObjsWithMatch)).toBe(null);
	expect(findNameMatch("", arrayOfObjsWithMatch)).toBe(null);

	expect(findNameMatch(goodName, [])).toBe(null);
	expect(findNameMatch(goodName, [ "good" ])).toBe(null);
	expect(findNameMatch(goodName, null)).toBe(null);
});