const initState = {
  mobileView: 1, // 0 = sidebar, 1 = main content
  view: 1, // 0 = ingredients, 1 = recipe
  selectedRecipe: null,
  selectedPantryItem: null
}

const reducer = (state = initState, action) => {
  switch(action.type) {
    case 'resetState':
      return initState
    case 'updateMobileView':
      return {
        ...state,
        mobileView: action.payload
      }
    case 'updateView':
      return {
        ...state,
        mobileView: 1,
        view: action.payload
      }
    case 'updateSelectedPantryItem':
      return {
        ...state,
        mobileView: 1,
        selectedPantryItem: action.payload
      }
    case 'updateSelectedRecipe':
      return {
        ...state,
        mobileView: 1,
        selectedRecipe: action.payload
      }
    default:
      return state
  }
}

export {reducer}
