import React from 'react'
import CallsTable from '../calls/CallsTable';

const PaymentTable: React.FC = () => {
  const userId = localStorage.getItem("userId") ?? '';
  return (
    <div>
      <CallsTable userId={userId} status="Paid" />
    </div>
  );
};

export default PaymentTable;
