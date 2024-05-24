import { AxiosResponse } from 'axios';
import { basicHeader, REST_API_BASE_URL, api } from './ApiUtils';

export async function addReceiver(
  telephone: string,
  username: string
): Promise<boolean> {
  try {
    const response: AxiosResponse = await api.post(
      `/call-receiver/add-receiver`,
      {
        telephone: telephone,
        username: username,
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
