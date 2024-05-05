import { RECENT_SEARCHED } from "../constants/food";

const initialState = {
    recentSearched : []
};

export const food = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_SEARCHED:
      return { ...state, recentSearched: action.data };
    default:
      return state;
  }
};
