import React, { useEffect, useState } from 'react';
import { Call } from "../../store/types";
import { listCalls } from "../../services/CallService";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { fetchCalls } from "../../store/callsSlice";
import { useAppSelector } from "../../store/hooks/useAppSelector";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, TableFooter, TableSortLabel,
    Container
} from '@mui/material';

// Helper function to sort data
const sortData = (data: Call[], orderBy: string, order: 'asc' | 'desc') => {
    return data.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('callId');

    const status = useAppSelector(state => state.calls.status);

    useEffect(() => {
        const fetchCallsData = async () => {
            try {
                const response = await listCalls();
                setCalls(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching calls. Please try again.');
                setLoading(false);
            }
        };

        fetchCallsData();
    }, []);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedCalls = sortData(calls, orderBy, order);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h6" color="error">Error: {error}</Typography>
            </div>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                All Call List
            </Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sortDirection={orderBy === 'callId' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'callId'}
                                direction={orderBy === 'callId' ? order : 'asc'}
                                onClick={() => handleRequestSort('callId')}
                            >
                                Call ID
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'startTime' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'startTime'}
                                direction={orderBy === 'startTime' ? order : 'asc'}
                                onClick={() => handleRequestSort('startTime')}
                            >
                                Start Time
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'endTime' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'endTime'}
                                direction={orderBy === 'endTime' ? order : 'asc'}
                                onClick={() => handleRequestSort('endTime')}
                            >
                                End Time
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'duration' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'duration'}
                                direction={orderBy === 'duration' ? order : 'asc'}
                                onClick={() => handleRequestSort('duration')}
                            >
                                Duration
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'user' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'user'}
                                direction={orderBy === 'user' ? order : 'asc'}
                                onClick={() => handleRequestSort('user')}
                            >
                                User
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'receiver' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'receiver'}
                                direction={orderBy === 'receiver' ? order : 'asc'}
                                onClick={() => handleRequestSort('receiver')}
                            >
                                Receiver
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedCalls.map((call) => (
                        <TableRow key={call.callId}>
                            <TableCell>{call.callId}</TableCell>
                            <TableCell>{call.startTime}</TableCell>
                            <TableCell>{call.endTime}</TableCell>
                            <TableCell>{call.duration}</TableCell>
                            <TableCell>{call.user.firstName} {call.user.lastName}</TableCell>
                            <TableCell>{call.receiver.fullName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>
                            <Typography variant="body2">Total Calls: {calls.length}</Typography>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>

        </Container>
    );
};

export default ListAllCalls;



/*
import React, {useEffect, useState} from 'react';
import {Call} from "../../store/types";
import {listCalls} from "../../services/CallService";
import {useAppSelector} from "../../store/hooks/useAppSelector";
import {fetchCalls} from "../../store/callsSlice";
import {useAppDispatch} from "../../store/hooks/useAppDispatch";

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
   //const [call, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    //const calls = useAppSelector(state => state.calls.calls);
    //const [error, setError] = useState<string | null>(null);
    //const status = useAppSelector(state => state.calls.status);
    //const error = useAppSelector(state => state.calls.error);
    //const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching calls. Please try again.');
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/
/*
import React, { useEffect } from 'react';
import { fetchCalls } from '../../store/callsSlice';
import { useAppDispatch } from '../../store/hooks/useAppDispatch';  // Import typed hooks
import { useAppSelector } from '../../store/hooks/useAppSelector';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const calls = useAppSelector(state => state.calls.calls);
    const status = useAppSelector(state => state.calls.status);
    const error = useAppSelector(state => state.calls.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/
/*
import React, { useEffect } from 'react';
import { fetchCalls } from '../../store/callsSlice';
import { useAppDispatch } from '../../store/hooks/useAppDispatch';  // Import typed hooks
import { useAppSelector } from '../../store/hooks/useAppSelector';


const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const calls = useAppSelector(state => state.calls.calls);
    const status = useAppSelector(state => state.calls.status);
    const error = useAppSelector(state => state.calls.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/


/*

import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalls } from '../../store/callsSlice';
import { RootState } from '../../store/store';

const ListAllCalls: React.FC = () => {
    const dispatch = useDispatch<any>();
    const calls = useSelector((state: RootState) => state.calls.calls);
    const callsStatus = useSelector((state: RootState) => state.calls.status);
    const callsError = useSelector((state: RootState) => state.calls.error);
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;
    const role = storedUser ? JSON.parse(storedUser).role : null;

    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        if (callsStatus === 'idle') {
            dispatch(fetchCalls());
        }
    }, [callsStatus, dispatch]);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            {callsStatus === 'loading' && <Typography>Loading...</Typography>}
            {callsStatus === 'failed' && <Alert severity="error">{callsError}</Alert>}
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
                                <TableCell>{call.receiver[0]?.telephone}</TableCell>
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
import { useDispatch } from 'react-redux';

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
  //  const location = useLocation();
   // const message = location.state?.message;
    const { role } = useContext(AuthContext);
    //onst userId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;

    const dispatch = useDispatch<any>();
    const location = useLocation();
    const message = location.state && location.state.message;

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
            {username && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
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