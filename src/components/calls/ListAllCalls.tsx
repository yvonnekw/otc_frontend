import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';

interface Call {
    id: number;
    callId: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalTime: number;
    costPerMinute: number;
    discountForCalls: number;
    signUpDiscount: number;
    vat: number;
    netCost: number;
    grossCost: number;

    status: string;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    console.log("list calls user role ", userRole);

    if (role !== "ADMIN") {
        return <div>You don't have permission to access this page.</div>;
    }

    useEffect(() => {
        listCalls()
            .then((response) => {
                setCalls(response.data);
            })
            .catch((error) => {
                console.error('Error fetching calls:', error);
            });
    }, []);

    return (
        <div className='container'>
            {message && <p className='text-warning px-5'>{message}</p>}
            {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
            <br /><br />
            <h2 className='text-center'>Call list</h2>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Call Id</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Total Time</th>
                        <th>Cost Per Minute</th>
                        <th>Discount For Call</th>
                        <th>VAT</th>
                        <th>Gross Cost</th>
                        <th>Net Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {calls.map((call) => (
                        <tr key={call.callId}>
                            <td>{call.callId}</td>
                            <td>{call.startTime}</td>
                            <td>{call.endTime}</td>
                            <td>{call.duration}</td>
                            <td>{call.totalTime}</td>
                            <td>{call.costPerMinute}</td>
                            <td>{call.discountForCalls}</td>
                            <td>{call.vat}</td>
                            <td>{call.grossCost}</td>
                            <td>{call.netCost}</td>
                            <td>{call.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default ListAllCalls;
