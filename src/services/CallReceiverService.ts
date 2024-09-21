import {AxiosResponse} from 'axios';
import {basicHeader, REST_API_BASE_URL, api} from './ApiUtils';
import {Receiver} from "../store/types";

export interface CallReceiver {
    callReceiverId: number;
    telephone: string;
    fullName: string;
    relationship: string;
}

export const addReceiver = async (telephone: string, username: string, fullName: string, relationship: string) => {
    try {
        const payload = {
            telephone,
            username,
            fullName,
            relationship,
        };
        console.log('Request payload:', payload);

        const response = await api.post(`${REST_API_BASE_URL}/call-receiver/add-receiver`, payload);
        return response.data;
    } catch (error) {
        console.error('Error adding new receiver:', error.response ? error.response.data : error.message);
        throw new Error('Error adding new receiver');
    }
};

/*
export async function addReceiver(
  telephone: string,
  username: string,
  fullName: string,
  relationship: string
): Promise<boolean> {
  try {
    const response: AxiosResponse = await api.post(
      `/call-receiver/add-receiver`,
      {
        telephone: telephone,
        username: username,
        fullName: fullName,
        relationship: relationship
      },
      { headers: basicHeader }
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error adding new receiver:", error);
    throw new Error("Error adding new receiver");
  }
}
    
*/
export async function getUserCallReceiverList(): Promise<Receiver[]> {
    const token = localStorage.getItem('token');
    try {
        const response: AxiosResponse = await api.get(
            `/call-receiver/get-all-receivers`,
            {
                headers: { ...basicHeader, Authorization: `Bearer ${token}` },
            }
        );

        console.log(" user Call receivers list ", response.data)
        return response.data;
    } catch (error) {
        console.error("Error getting callReceivers:", error);
        return [];
    }
}


export async function getCallReceiverDetails(username: string): Promise<string[]> {
    try {
        const response: AxiosResponse = await api.get(
            `/call-receiver/call-receivers?username=${username}`,
            {
                headers: basicHeader,
            }
        );
        const callReceivers = response.data.map((receiver: CallReceiver) => ({
            fullName: receiver.fullName,
            telephone: receiver.telephone,
        }));
        console.log("Call receiver details ", callReceivers);
        return callReceivers;
    } catch (error) {
        console.error("Error getting details:", error);
        return [];
    }
}
