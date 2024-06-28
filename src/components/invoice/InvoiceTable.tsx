import React from 'react'
import CallsTable from '../calls/CallsTable';

const InvoiceTable: React.FC = () => {
  //const userId = localStorage.getItem("userId") ?? '';
  const storedUser = localStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).username : null;
  return (
    <div>
      <CallsTable userId={username} status="Invoiced" />
    </div>
  );
};

export default InvoiceTable;
