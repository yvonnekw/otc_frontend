import axios, { AxiosResponse } from "axios";
import { basicHeader, REST_API_BASE_URL, api, getLoginHeader } from "./ApiUtils";

export interface Authority {
  authority: string;
}

export interface User {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone?: string | null;
  password: string;
  authorities: Authority[];
}


export async function registerUser(user: any): Promise<any> {
  try {
    const response = await axios.post(
      REST_API_BASE_URL + "/auth/register",
      user,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}

export async function loginUser2(user: any): Promise<any> {
  try {
    const response = await axios.post(
      REST_API_BASE_URL + "/auth/login",
      user,
      {
        headers: basicHeader,
      }
    );
    if (response.status >= 200 && response.status < 300) {
      const token = response?.data?.token;
      const username = response?.data?.username;
      console.log("The token:", token);
      console.log("The username data :", response?.data);
      console.log(
        "success username authorities " + response?.data?.user
      );
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserProfile(username: string, tokcen: string): Promise<any> {
  try {
    const response = await axios.post(
      REST_API_BASE_URL + `/users/profile/${username}`,
      {
        headers: basicHeader,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUser(userId: string, token: string): Promise<any> {
  try {
    const response = await api.get(REST_API_BASE_URL + `/user/${userId}`, {
      headers: getLoginHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${REST_API_BASE_URL}/user/all-users`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export async function getUsername2(): Promise<void> {
  const token = localStorage.getItem("token"); 
  console.log("The user token " + token);
}

export const loginUser = async (user: any): Promise<any> => {
  try {
    const response = await axios.post(REST_API_BASE_URL + "/auth/login", user, {
      headers: basicHeader,
    });
    console.log("Response data:", response.data); 
    const token = response?.data?.token;
    const username = response?.data?.username;
    console.log("The token:", token);
    console.log("The username :", username);
    return response; 
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUsername = async (): Promise<any> => {
  const token = localStorage.getItem("token"); 

  if (isLoggedIn()) {
    try {
      const response = await axios.get(REST_API_BASE_URL + "/auth/username", {
        headers: {
          ...basicHeader,
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log("the getUsername " + response.data.username);
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      throw error;
    }
  } else {
    console.error("token has expired!");
  }
};

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token; 
};

export async function registerUser2(user: User) {
  try {
    const response = await axios.post(REST_API_BASE_URL + "/auth/register", user, {
      headers: basicHeader,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error: ${error.message}`);
    }
  }
}



