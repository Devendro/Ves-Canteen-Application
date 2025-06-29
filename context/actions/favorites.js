import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { UPDATE_FAVORITE } from "../constants/favorites";

export const updateFavorite = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(`${APIURL}${UPDATE_FAVORITE}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};