import React from 'react'
import CallsTable from '../calls/CallsTable';

const PaymentTable: React.FC = () => {
  const storedUser = localStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).username : null;
  return (
    <div>
      <CallsTable userId={username} status="Paid" />
    </div>
  );
};

export default PaymentTable;
