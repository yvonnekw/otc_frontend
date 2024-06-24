
import axios from 'axios';
import { basicHeader, REST_API_BASE_URL, getLoginHeader } from './ApiUtils';
import { toast } from 'react-toastify';

export interface Authority {
  authority: string;
}

export interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone?: string | null;
  password: string;
  authorities: Authority[];
}

export interface registerUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone?: string | null;
  password: string;
  authorities: Authority[];
}

export interface Register {
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone?: string | null;
  password: string;
}

export async function registerUser(user: Register): Promise<string> {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/auth/register`, user, {
      headers: basicHeader,
    });

    if (response.status === 200) {
      return 'User registered successfully';
    } else {
      throw new Error('Failed to register user');
    }
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      console.error('User registration error:', error.message);
      return 'Failed to register user';
    }
  }
}

export async function loginUser(user: any): Promise<any> {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/auth/login`, user, {
      headers: basicHeader,
      //withCredentials: true,
    });

    if (response.status >= 200 && response.status < 300) {
      console.log('The token:', response.data.data.token);
      console.log('The username data:', response.data.data.user.username);
      console.log('The user data:', response.data.data.user);
      console.log('Success username authorities:', response.data.data.user.authorities[0].authority);

      toast.success("Login successful");

      return {
        message: "Login successful",
        data: response.data.data.token,
        success: true,
        error: false,
      };
    } else {
      toast.error("Login unsuccessful");

      return {
        message: "Login unsuccessful",
        data: null,
        success: false,
        error: true,
      };
    }
  } catch (error) {
    handleError(error, 'Error logging in');
    return {
      message: "Error logging in",
      data: null,
      success: false,
      error: true,
    };
  }
}

export async function getUserProfile(username: string): Promise<any> {

  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/users/profile/${username}`, {
      headers: { ...basicHeader, Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error fetching user profile');
  }
}

export async function getUser(userId: string): Promise<any> {

  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/user/${userId}`, {
      headers: getLoginHeader() 
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error fetching user');
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${REST_API_BASE_URL}/user/all-users`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error fetching users');
    throw new Error('Failed to fetch users');
  }
}

export const getUsername = async (): Promise<string | null> => {

  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/auth/username`, {
      headers: { ...basicHeader, Authorization: `Bearer ${token}` },
    });
    console.log('The username:', response.data.username);
    return response.data.username;
  } catch (error) {
    handleError(error, 'Error fetching username');
    return null;
  }
}


function handleError(error: any, defaultMessage: string): void {
  if (axios.isAxiosError(error) && error.response) {
    console.error(`${defaultMessage}: ${JSON.stringify(error.response.data)}`);
    toast.error(error.response.data.message || defaultMessage);
  } else {
    console.error(`${defaultMessage}: ${error.message}`);
    toast.error(defaultMessage);
  }
}

export default handleError;