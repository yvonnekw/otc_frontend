import React, { useState, useEffect, useContext } from 'react';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';
import { AuthContext } from '../auth/AuthProvider';
import CallsTable from '../calls/CallsTable';

interface InvoiceProps {
}

const Invoice: React.FC<InvoiceProps> = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const userId = localStorage.getItem("userId") ?? '';

  const { role } = useContext(AuthContext);

  //if (role !== "ADMIN") {
   // return <div>You don't have permission to access this page.</div>;
  //}

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData: InvoiceData[] = await getAllInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Invoice List</h2>
    
      <div>
        <CallsTable userId={userId} status="Invoiced" />
      </div>
    </div>
   
  );
};

export default Invoice;