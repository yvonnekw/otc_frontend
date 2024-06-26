import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Divider } from '@mui/material';
import { getAllInvoices, InvoiceData } from '../../services/InvoiceService';
import { AuthContext } from '../auth/AuthProvider';
import CallsTable from '../calls/CallsTable';

interface InvoiceProps { }

const Invoice: React.FC<InvoiceProps> = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  //const userId = localStorage.getItem('userId') ?? '';
  const storedUser = localStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).username : null;
  const role = storedUser ? JSON.parse(storedUser).role : null;

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

  if (role !== 'ADMIN') {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" color="error" align="center">
          You don't have permission to access this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Invoice List
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <CallsTable userId={username} status="Invoiced" />
    </Container>
  );
};

export default Invoice;

/*

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
    
      <div>
        <CallsTable userId={userId} status="Invoiced" />
      </div>
    </div>
   
  );
};

export default Invoice;

*/