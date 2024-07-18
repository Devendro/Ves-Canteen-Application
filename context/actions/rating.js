import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { CREATE_ORDER, UPDATE_ORDER_PAYMENT_STATUS } from "../constants/order";
import { GET_ALL_ORDERS } from "../constants/payment";
import { CREATE_RATING } from "../constants/rating";

export const createRating = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(`${APIURL}${CREATE_RATING}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};

