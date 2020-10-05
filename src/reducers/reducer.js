const initState = {
  selectedRecipe: ''
}

const reducer = (state = initState, action) => {
  switch(action.type) {
    case 'resetState':
      return initState
    case 'updateSelectedRecipe':
      console.log(state);
      return {
        ...state,
        selectedRecipe: action.payload
      }
    default:
      return state
  }
}

export {reducer}
