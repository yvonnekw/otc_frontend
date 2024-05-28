import axios, { AxiosInstance } from "axios";
import jwt_decode from "jwt-decode";

export const REST_API_BASE_URL: string = "http://localhost:8000";
export const basicHeader = {
  "Content-Type": "application/json",
};


export const api: AxiosInstance = axios.create({
  baseURL: REST_API_BASE_URL,
});

interface JwtPayload {
  exp: number;
}

export const getLoginHeader = (): Record<string, string> => {
  const token: string | null = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};



