import axios from "axios";
import { basicHeader, REST_API_BASE_URL, api, getLoginHeader } from "./ApiUtils";

export interface InvoiceData {
  totalAmount: string;
  status: string;
  invoiceId: string;
  calls: CallData[];
  invoiceDate: string;
}

interface CallData {
  callId: number;
  user: UserData;
}

interface UserData {
  userId: number;
}

export async function invoice(invoiceBody: any): Promise<any> {
  try {
    const response = await api.post(
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
    const response = await api.get<InvoiceData[]>(
      `${REST_API_BASE_URL}/invoices/get-all-invoice`,
      {
        headers: getLoginHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function searchInvoiceById(invoiceId: string): Promise<InvoiceData> {
  try {
    const response = await api.get<InvoiceData>(
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
