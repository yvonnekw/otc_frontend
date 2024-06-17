import axios, { AxiosInstance, AxiosError } from "axios";

import dotenv from 'dotenv';


//export const REST_API_BASE_URL: string = process.env.REST_API_BASE_URL || '' + process.env.REST_API_PORT;

const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL || ''}${import.meta.env.VITE_REST_API_PORT || ''}`;

export const basicHeader = {
  "Content-Type": "application/json",
};

const api: AxiosInstance = axios.create({
  baseURL: REST_API_BASE_URL,
  headers: basicHeader,
});
/*
export const api: AxiosInstance = axios.create({
  baseURL: REST_API_BASE_URL,
});*/

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

export { api, REST_API_BASE_URL };


