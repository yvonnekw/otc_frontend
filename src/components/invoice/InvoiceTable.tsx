import React from 'react'
import CallsTable from '../calls/CallsTable';

const InvoiceTable: React.FC = () => {
  const userId = localStorage.getItem("userId") ?? '';
  return (
    <div>
      <CallsTable userId={userId} status="Invoiced" />
    </div>
  );
};

export default InvoiceTable;
