import axios from "axios";
import { basicHeader, REST_API_BASE_URL, api, getLoginHeader } from './ApiUtils'
import { Payment} from "../store/types";

export const makePayment = async (paymentBody: Payment) => {
  try {
    const response = await api.post(
      `${REST_API_BASE_URL}/payments/payment`,
      paymentBody,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error making payment: ${error.message}`);
  }
};


export const getPayments = async () => {
  try {
    const response = await api.get(`${REST_API_BASE_URL}/payments/get-all-payments`, {
      headers: basicHeader,
    });

    return response.data;

  } catch (error) {
    throw new Error(`Error fetching all payment: ${error.message}`);
  }
}

  export const getPaidCallsByUsername = async (username: string): Promise<Payment[]> => {
    const response = await axios.get<Payment[]>(`${REST_API_BASE_URL}/payments/username/${username}`);
    return response.data;
  };



