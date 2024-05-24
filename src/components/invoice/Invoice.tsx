import React, { useState, useEffect, useContext } from 'react';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';
import { AuthContext } from '../auth/AuthProvider';

interface InvoiceProps {
}

const Invoice: React.FC<InvoiceProps> = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const { role } = useContext(AuthContext);

  if (role !== "ADMIN") {
    return <div>You don't have permission to access this page.</div>;
  }

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
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Invoice Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Call IDs for this invoice</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.status}</td>
              <td>
                {invoice.calls && invoice.calls.length > 0
                  ? invoice.calls.map((call) => `Call ID: ${call.callId}, User ID: ${call.user.userId}`).join(', ')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;