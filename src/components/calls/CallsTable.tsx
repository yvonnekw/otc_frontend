import React, { useEffect, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation, useParams } from 'react-router-dom';

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: number;
  costPerMinute: number;
  discountForCalls: number;
  vat: number;
  netCost: number;
  grossCost: number;
  callDate: string;
  status: string;
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const location = useLocation();
  const message = location.state && location.state.message;
  console.log("get calls by user id ", userId)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getCallsByUsernameAndStatus(userId, status!);
        setCalls(response);
        console.log("get calls by user id ", response)
      } catch (error) {
        console.error(error);
      }
    };
    fetchCalls();
  }, [userId, status]);


  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
      <br /> <br />
        <h2 className='text-center'>Call History</h2>
        {calls && calls.length === 0 ? (
          <p>No calls to display.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Call Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Cost Per Minute</th>
                <th>Discount</th>
                <th>Call Gross cost</th>
                <th>VAT</th>
                <th>Net Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {calls && calls.map((call) => (
                <tr key={call.id}>
                  <td>{call.callId}</td>
                  <td>{call.callDate}</td>
                  <td>{call.startTime}</td>
                  <td>{call.endTime}</td>
                  <td>{call.duration}</td>
                  <td>{call.costPerMinute}</td>
                  <td>{call.discountForCalls}</td>
                  <td>{call.grossCost}</td>
                  <td>{call.vat}</td>
                  <td>{call.netCost}</td>
                  <td>{call.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  );
};

export default CallsTable;
