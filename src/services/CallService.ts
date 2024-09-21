import { basicHeader, REST_API_BASE_URL, api } from "./ApiUtils";
import axios from "axios";
import {Call, EnterCallResponse} from "../store/types";

// Changed Promise<never> to the appropriate return type
export async function getCallsByUsername(username: string): Promise<Call[]> {
  try {
    const response = await api.get(
        REST_API_BASE_URL + `/calls?username=${username}`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username: ${error.message}`);
  }
}

export async function getPaidCallsByUsername(username: string): Promise<Call[]> {
  try {
    const response = await axios.get(
        REST_API_BASE_URL + `/calls/user/${username}/calls?status=Paid`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching paid calls by username: ${error.message}`);
  }
}

// Changed Promise<any> to Promise<Call[]>
export async function getPendingInvoicedCallsByUsername(username: string): Promise<Call[]> {
  try {
    const response = await axios.get(
        REST_API_BASE_URL + `/calls/user/${username}/calls?status=Pending Invoice`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching pending invoiced calls by username: ${error.message}`);
  }
}

export async function getInvoicedCallsByUsername(username: string): Promise<Call[]> {
  try {
    const response = await axios.get(
        `${REST_API_BASE_URL}/calls/user/${username}/calls?status=Invoiced`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching invoiced calls by username: ${error.message}`);
  }
}

export async function getCallsByUsernameAndStatus(username: string, status: string): Promise<Call[]> {
  try {
    const response = await axios.get(
        `${REST_API_BASE_URL}/calls/user/${username}/calls?status=${status}`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username and status: ${error.message}`);
  }
}

// Updated function name and signature to match its purpose
export async function updateCallStatus(username: string, status: string): Promise<any> {
  try {
    const response = await api.put(
        `${REST_API_BASE_URL}/calls/user/${username}/status`,
        { status }, // Assuming status update is done via PUT request with a body
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error updating call status by username: ${error.message}`);
  }
}

export const enterCall = async (call: Call) => {
    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/calls/make-call`,
            call,
            {
                headers: basicHeader,
            }
        );
        console.log("response from entercall ", response)
        return response.data;
    } catch (error) {
        throw new Error(`Error making call: ${error.message}`);
    }
};
/*
// Updated enterCall function to return Call instead of never
export const enterCall = async (call: Call): Promise<Call> => {
  try {
    const response = await axios.post(
        `${REST_API_BASE_URL}/calls/make-call`,
        call,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error making call: ${error.message}`);
  }
};
*/
export const getCallReceiversForUser = async (
    username: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
        `${REST_API_BASE_URL}/call-receiver/phone-numbers?username=${username}`,
        {
          headers: basicHeader,
        }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching phone numbers for username: ${error.message}`);
  }
};

// Updated checkPhoneNumberExists function to return boolean instead of never
export const checkPhoneNumberExists = async (
    username: string,
    phoneNumber: string
): Promise<boolean> => {
  try {
    const response = await axios.get(
        `${REST_API_BASE_URL}/call-receiver/phone-numbers?username=${username}&telephone=${phoneNumber}`,
        {
          headers: basicHeader,
        }
    );
    return response.data; // Assuming the API returns a boolean or an object with a boolean property
  } catch (error) {
    throw new Error(`Error checking phone number: ${error.message}`);
  }
};

// listCalls function is correct as is
export const listCalls = async (): Promise<Call[]> => {
    try {
        const response = await axios.get<Call[]>(`${REST_API_BASE_URL}/calls/get-all-calls`);
        console.log('API Response:', response.data); // Log the response
        return response.data;  // Returns the array of Call objects directly
    } catch (error) {
        throw new Error(`Error fetching all calls: ${error.message}`);
    }
};

//complete the following
export async function updateCall(username: string): Promise<Call[]> {
    try {
        const response = await api.get(
            REST_API_BASE_URL + `/calls?username=${username}`,
            {
                headers: basicHeader,
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching calls by username: ${error.message}`);
    }
}


export async function deleteCall(username: string): Promise<Call[]> {
    try {
        const response = await api.get(
            REST_API_BASE_URL + `/calls?username=${username}`,
            {
                headers: basicHeader,
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching calls by username: ${error.message}`);
    }
}



/*
import { basicHeader, REST_API_BASE_URL, api } from "./ApiUtils";

import axios from "axios";

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

export async function getCallsByUsername(username: string): Promise<never> {
  try {
    const response = await api.get(
      REST_API_BASE_URL + `/calls?username=${username}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username :${error.message}`);
  }
}

export async function getPaidCallsByUsername(username: string): Promise<never> {
  try {
    const response = await axios.get(
      REST_API_BASE_URL + `/calls/user/${username}/calls?status=Paid`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username and status provided :${error.message}`);
  }
}

export async function getPendingInvoicedCallsByUsername(username: string): Promise<any> {
  try {
    const response = await axios.get(
      REST_API_BASE_URL + `/calls/user/${username}/calls?status=Pending AdminInvoiceTable`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username and status provided :${error.message}`);
  }
}

export async function getInvoicedCallsByUsername(username: string): Promise<any> {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/calls/user/${username}/calls?status=Invoiced`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username and status provided :${error.message}`);
  }
}

export async function getCallsByUsernameAndStatus(username: string, status: string): Promise<any> {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/calls/user/${username}/calls?status=${status}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching calls by username and status provided :${error.message}`);
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
    throw new Error(`Error fetching calls by username and status provided :${error.message}`);
  }
}

export const enterCall = async (call: never): Promise<never> => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/calls/make-call`,
      call,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error making call :${error.message}`);
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
    throw new Error(`Error fetchingphone number with the username provided :${error.message}`);
  }
};

export const checkPhoneNumberExists = async (
  username: string,
  phoneNumber: string
): Promise<never> => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/call-receiver/phone-numbers?username=${username}&telephone=${phoneNumber}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data with username and phone number :${error.message}`);
  }
};

export const listCalls = async (): Promise<Call[]> => {
  try {
    const response = await axios.get<Call[]>(`${REST_API_BASE_URL}/calls/get-all-calls`);
    return response.data;  // Returns the array of Call objects directly
  } catch (error) {
    throw new Error(`Error fetching all calls: ${error.message}`);
  }
};


 */