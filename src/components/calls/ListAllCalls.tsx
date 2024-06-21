
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    callDate: string;
    status: string;
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setCalls(response.data);
                } else {
                    throw new Error('Invalid data received from server');
                }
            } catch (error) {
                console.error('Error fetching calls:', error);
                // Optionally handle error state or show error message
                // setCalls([]); // Uncomment to reset calls to empty array on error
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {userId && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;


/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    callDate: string;
    status: string;
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setCalls(response.data);
                } else {
                    throw new Error('Invalid data received from server');
                }
            } catch (error) {
                console.error('Error fetching calls:', error);
                // Optionally handle error state or show error message
                // setCalls([]); // Uncomment to reset calls to empty array on error
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {userId && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;
*/

/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    callDate: string;
    status: string;
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response.data);
            } catch (error) {
                console.error('Error fetching calls:', error);
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {userId && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;
*/


/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';


interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    callDate: string;
    status: string;
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response.data);
            } catch (error) {
                console.error('Error fetching calls:', error);
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <div>You don't have permission to access this page.</div>;
    }

    return (
        <div className="container">
            {message && <p className="text-warning px-5">{message}</p>}
            {userId && <h6 className="text-success text-center">You are logged in as: {userId}</h6>}
            <br /><br />
            <h2 className="text-center">Call List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Call Id</th>
                        <th>Call Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Cost Per Second</th>
                        <th>Discount For Call</th>
                        <th>VAT</th>
                        <th>Gross Cost</th>
                        <th>Net Cost</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Call Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {calls.map((call) => (
                        <tr key={call.callId}>
                            <td>{call.callId}</td>
                            <td>{new Date(call.callDate).toLocaleDateString()}</td>
                            <td>{call.startTime}</td>
                            <td>{call.endTime}</td>
                            <td>{call.duration}</td>
                            <td>{call.costPerSecond}</td>
                            <td>{call.discountForCalls}</td>
                            <td>{call.vat}</td>
                            <td>{call.grossCost}</td>
                            <td>{call.netCost}</td>
                            <td>{call.status}</td>
                            <td>{`${call.user.firstName} ${call.user.lastName}`}</td>
                            <td>{call.receiver.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAllCalls;
*/

/*
interface Call {
    id: number;
    callId: string;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    userId: number;
    callReceiver: number;
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
                        <th>Cost Per Second</th>
                        <th>Discount For Call</th>
                        <th>VAT</th>
                        <th>Gross Cost</th>
                        <th>Net Cost</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Call Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {calls.map((call) => (
                        <tr key={call.callId}>
                            <td>{call.callId}</td>
                            <td>{call.startTime}</td>
                            <td>{call.endTime}</td>
                            <td>{call.duration}</td>
                            <td>{call.costPerSecond}</td>
                            <td>{call.discountForCalls}</td>
                            <td>{call.vat}</td>
                            <td>{call.grossCost}</td>
                            <td>{call.netCost}</td>
                            <td>{call.status}</td>
                            <td>{call.userId}</td>
                            <td>{call.callReceiver}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default ListAllCalls;
*/