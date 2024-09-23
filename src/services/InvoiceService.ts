import axios from "axios";
import { basicHeader, REST_API_BASE_URL, getLoginHeader } from "./ApiUtils";
import { InvoiceData } from '../store/types';

export async function invoice(invoiceBody: any): Promise<any> {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/invoices/create-invoice`,
      invoiceBody,
      {
        headers: basicHeader,
      }
    );
    console.log("invoice created from invoice service ", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllInvoices(): Promise<InvoiceData[]> {
  try {
    const response = await axios.get<InvoiceData[]>(
      `${REST_API_BASE_URL}/invoices/get-all-invoice`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function searchInvoiceById(invoiceId: string): Promise<InvoiceData> {
  try {
    const response = await axios.get<InvoiceData>(
      `${REST_API_BASE_URL}/invoices/${invoiceId}`,
      {
        headers: basicHeader,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getInvoicesByUsername = async (username: string): Promise<InvoiceData[]> => {
  const response = await axios.get<InvoiceData[]>(`${REST_API_BASE_URL}/invoices/username/${username}`);
  return response.data;
};
