import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { SEARCH_FOOD, GET_FOOD, FOOD_DATA, FOOD_PAGINATION_DATA, ADD_FOOD_DATA } from "../constants/food";

export const searchFoods = (params, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${SEARCH_FOOD}`, params, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};

export const getFoods = (params, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.get(`${APIURL}${GET_FOOD}`, params, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
          params.page == 1 ? dispatch({type: FOOD_DATA, data: response}) : dispatch({type: ADD_FOOD_DATA, data: response})
          dispatch({type: FOOD_PAGINATION_DATA, data: response})
        }
      }
    );
  };
};
