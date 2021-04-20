import { useState, useEffect } from "react";
import allPantryItems from "../data/pantry.json";

const usePantryHook = () => {
  const [pantryInfo, setPantryInfo] = useState([]); // pantryInfo is the processed recipe json

  useEffect(() => {
    const processedPantry = [];

    // go through each pantry category
    allPantryItems.forEach((category) => {
      let currItems = [];

      // go through each item in the category
      category.items.forEach((item) => {
        // unprocessed item data straight from pantry
        const nutritionData = item.serving_nutrition;
        const priceData = item.price_per_unit;

        // grams equivalent to each measurement unit, including an average weight per one item if valid
        const conversionToGrams = {
          ...(nutritionData.unit === "" && { average: nutritionData.grams / nutritionData.amount }),
          oz: 28.34952312,
          lb: 453.59236992
        };

        if (nutritionData.unit !== "") {
          if (nutritionData.unit === "oz" || nutritionData.unit === "lb") {
            // if nutrition data is saved in ounces or pounds
            conversionToGrams.oz =
              nutritionData.unit === "oz"
                ? nutritionData.grams / nutritionData.amount
                : nutritionData.grams / nutritionData.amount / 16.0;
            conversionToGrams.lb =
              nutritionData.unit === "lb"
                ? nutritionData.grams / nutritionData.amount
                : (nutritionData.grams / nutritionData.amount) * 16.0;
          } else {
            // if nutrition data is saved in other measurements
            conversionToGrams[nutritionData.unit] = nutritionData.grams / nutritionData.amount;

            switch (nutritionData.unit) {
              case "tsp":
                conversionToGrams.tbsp = (nutritionData.grams / nutritionData.amount) * 3.0;
                conversionToGrams.cup = (nutritionData.grams / nutritionData.amount) * 48.0;
                break;
              case "tbsp":
                conversionToGrams.tsp = nutritionData.grams / nutritionData.amount / 3.0;
                conversionToGrams.cup = (nutritionData.grams / nutritionData.amount) * 16.0;
                break;
              case "cup":
                conversionToGrams.tsp = nutritionData.grams / nutritionData.amount / 48.0;
                conversionToGrams.tbsp = nutritionData.grams / nutritionData.amount / 16.0;
                break;
              default:
                break;
            }
          }
        }

        // calculate pantry item info per unit (avg grams, calories, protein, price)
        const perUnit =
          nutritionData.unit === ""
            ? {
                avgGrams: nutritionData.grams / nutritionData.amount,
                calories: nutritionData.calories,
                protein: nutritionData.protein,
                price: conversionToGrams[priceData.unit]
                  ? (nutritionData.grams / conversionToGrams[priceData.unit]) * priceData.price
                  : priceData.price
              }
            : undefined;

        // calculate pantry item info per 100 grams (calories, protein, price)
        const per100g = {
          calories: (nutritionData.calories / nutritionData.grams) * 100.0,
          protein: (nutritionData.protein / nutritionData.grams) * 100.0,
          price: conversionToGrams[priceData.unit]
            ? (100.0 / conversionToGrams[priceData.unit]) * priceData.price
            : (100.0 / nutritionData.grams) * priceData.price
        };

        // build pantry item with all the processed data
        const newItem = {
          name: item.name,
          label: item.label || item.name,
          conversionToGrams: conversionToGrams,
          per100g: per100g,
          ...(item.note && { note: item.note }),
          ...(perUnit && { perUnit: perUnit })
        };

        // add to list of processed items
        currItems.push(newItem);
      });
      processedPantry.push({ categoryName: category.category_name, items: currItems });
    });

    setPantryInfo(processedPantry);
  }, []);

  return pantryInfo;
};

export default usePantryHook;
