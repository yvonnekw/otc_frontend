import { AxiosResponse } from 'axios';
import { basicHeader, REST_API_BASE_URL, api } from './ApiUtils';

export interface CallReceiver {
  callReceiverId: number;
  telephone: string;
  fullName: string;
  relationship: string;
}

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
    

export async function getTelephoneNumbers(username: string): Promise<string[]> {
  try {
    const response: AxiosResponse = await api.get(
      `/call-receiver/phone-numbers?username=${username}`,
      {
        headers: basicHeader, 
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting telephone numbers:", error);
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
    console.log("Call receiver details " , callReceivers);
    return callReceivers;
  } catch (error) {
    console.error("Error getting details:", error);
    return [];
  }
}
