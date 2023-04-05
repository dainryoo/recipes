import React from "react";
import { isEmpty } from "Data/utils/basicUtils";
import CopyButton from "Common/CopyButton";

const GroceryListComponent = ({ mealPlan }) => {
  
  return (
    <div>
        <h2>
          {
            !isEmpty(mealPlan.getGroceryList()) ? 
              <>
                Groceries:
                <CopyButton clipboardText={mealPlan.getShoppingListClipboardString()} />
              </>
              :
              null
          }
        </h2>
        <p>{mealPlan.getShoppingListUiString()}</p>
    </div>
  );
};
export default GroceryListComponent;
