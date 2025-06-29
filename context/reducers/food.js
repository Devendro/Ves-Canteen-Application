import { RECENT_SEARCHED, FLOATING_BUTTON, UPDATE_LIKE, FOOD_DATA, FOOD_PAGINATION_DATA, ADD_FOOD_DATA } from "../constants/food";

const initialState = {
  recentSearched: [],
  foodPaginationData: {
    "totalDocs": 0,
    "limit": 10,
    "page": 1,
    "totalPages": 0,
    "pagingCounter": 0,
    "hasPrevPage": false,
    "hasNextPage": false,
    "offset": 0,
    "prevPage": null,
    "nextPage": null,
  },
  foodData: [],
  floatingButton: true
};

export const food = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_SEARCHED:
      return { ...state, recentSearched: action.data };
    case FLOATING_BUTTON:
      return { ...state, floatingButton: action.data };
    case FOOD_DATA:
      return { ...state, foodData: action.data.docs }
    case ADD_FOOD_DATA:
      return { ...state, foodData: [...state.foodData, ...action.data.docs] }
    case FOOD_PAGINATION_DATA:
      return { ...state, foodPaginationData: { totalDocs: action.data.totalDocs, limit: action.data.limit, page: action.data.page, totalPages: action.data.totalPages, pagingCounter: action.data.pagingCounter, hasPrevPage: action.data.hasPrevPage, hasNextPage: action.data.hasNextPage, prevPage: action.data.prevPage, nextPage: action.data.nextPage } }
    case UPDATE_LIKE:
      return { ...state, }
    default:
      return state;
  }
};
