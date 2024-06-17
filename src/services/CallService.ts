import axios, { AxiosResponse } from "axios";
import { basicHeader, REST_API_BASE_URL, api } from "./ApiUtils";

interface Call {
  id: number;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalTime: number;
  costPerMinute: number;
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
}

export async function getCallsByUsername(username: string): Promise<any> {
  try {
    const response = await api.get(
      REST_API_BASE_URL + `/calls?username=${username}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPaidCallsByUsername(username: string): Promise<any> {
  try {
    const response = await api.get(
      REST_API_BASE_URL + `/calls/user/${username}/calls?status=Paid`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPendingInvoicedCallsByUsername(username: string): Promise<any> {
  try {
    const response = await api.get(
      REST_API_BASE_URL + `/calls/user/${username}/calls?status=Pending Invoice`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInvoicedCallsByUsername(username: string): Promise<any> {
  try {
    const response = await api.get(
      REST_API_BASE_URL + `/calls/user/${username}/calls?status=Invoiced`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCallsByUsernameAndStatus(username: string, status: string): Promise<any> {
  try {
    const response = await api.get(
      `${REST_API_BASE_URL}/calls/user/${username}/calls?status=${status}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

//update this 
export async function updateCallStatus(username: string, status: string): Promise<any> {
  try {
    const response = await api.get(
      `${REST_API_BASE_URL}/calls/user/${username}/calls?status=${status}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const enterCall = async (call: any): Promise<any> => {
  try {
    const response = await axios.post(
      REST_API_BASE_URL + "/calls/make-call",
      call,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCallReceiversForUser = async (
  username: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/call-receiver/phone-numbers?username=${username}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkPhoneNumberExists = async (
  username: string,
  phoneNumber: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/call-receiver/phone-numbers?username=${username}&telephone=${phoneNumber}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listCalls = async (): Promise<any> => {
  try {
    const response = await axios.get<Call[]>(`${REST_API_BASE_URL}/calls/get-all-calls`, {
    headers: basicHeader,
    });
    
    return response
  } catch (error) {
    throw error;
  }
};
