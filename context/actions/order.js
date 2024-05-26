import { APIURL } from "../constants/api";
import ApiClient from "../../api-client";
import { CREATE_ORDER, UPDATE_ORDER_PAYMENT_STATUS } from "../constants/order";

export const createOrder = (data, callback) => {
  return (dispatch, getState) => {
    const {
      user: { token },
    } = getState();
    ApiClient.post(`${APIURL}${CREATE_ORDER}`, data, token, dispatch).then(
      (response) => {
        if (response) {
          callback(response);
        }
      }
    );
  };
};

export const updateOrderPaymentStatus = (data, callback) => {
    return (dispatch, getState) => {
      const {
        user: { token },
      } = getState();
      ApiClient.put(`${APIURL}${UPDATE_ORDER_PAYMENT_STATUS}`, data, token, dispatch).then(
        (response) => {
          if (response) {
            callback(response);
          }
        }
      );
    };
  };
  