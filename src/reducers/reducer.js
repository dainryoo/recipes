const initState = {
  view: 1, // 0 = ingredients, 1 = recipe
  selectedRecipe: null,
  selectedPantryItem: null
}

const reducer = (state = initState, action) => {
  switch(action.type) {
    case 'resetState':
      return initState
    case 'updateView':
      return {
        ...state,
        view: action.payload
      }
    case 'updateSelectedPantryItem':
      return {
        ...state,
        selectedPantryItem: action.payload
      }
    case 'updateSelectedRecipe':
      return {
        ...state,
        selectedRecipe: action.payload
      }
    default:
      return state
  }
}

export {reducer}
