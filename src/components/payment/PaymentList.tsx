import React, { useState, useEffect, useContext } from 'react';
import { getPayments } from '../../services/PaymentService';
import { AuthContext } from '../auth/AuthProvider';
import {
    Container,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    CircularProgress,
    Alert,
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

interface Invoice {
    invoiceId: number;
    invoiceDate: string;
    status: string;
    totalAmount: number;
    calls: Call[];
}

interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    fullNameOnPaymentCard: string;
    cardNumber: string;
    expiringDate: string;
    issueNumber: string;
    securityNumber: string;
    status: string;
    invoice: Invoice;
}

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Payment List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Invoiced ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Card Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.paymentId}>
                                <TableCell>{payment.paymentId}</TableCell>
                                <TableCell>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.paymentDate}</TableCell>
                                <TableCell>{payment.cardNumber.slice(-4)}</TableCell>
                                <TableCell>{payment.status}</TableCell>
                                <TableCell>{`${payment.invoice.calls[0].user.firstName} ${payment.invoice.calls[0].user.lastName}`}</TableCell>
                                <TableCell>{payment.invoice.calls[0].receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PaymentList;

/*
import React, { useState, useEffect, useContext } from 'react';
import { getPayments } from '../../services/PaymentService'; 
import { AuthContext } from '../auth/AuthProvider';


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

interface Invoice {
    invoiceId: number;
    invoiceDate: string;
    status: string;
    totalAmount: number;
    calls: Call[];
}

interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    fullNameOnPaymentCard: string;
    cardNumber: string;
    expiringDate: string;
    issueNumber: string;
    securityNumber: string;
    status: string;
    invoice: Invoice;
}

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Payment List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Invoiced ID</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>Card Number</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                            <td>{payment.paymentId}</td>
                            <td>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.paymentDate}</td>
                            <td>{payment.cardNumber.slice(-4)}</td>
                            <td>{payment.status}</td>
                            <td>{`${payment.invoice.calls[0].user.firstName} ${payment.invoice.calls[0].user.lastName}`}</td>
                            <td>{payment.invoice.calls[0].receiver.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;
*/

/*
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

interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    cardNumber: string;
    invoice: {
        invoiceId: string;
    };
    user: User;
    receiver: Receiver;
    status: string
}

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    // Render the page only if the user has the admin role
    if (role !== "ADMIN") {
        return <div>You don't have permission to access this page.</div>;
    }

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments(); 
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.'); 
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div>
            <h2>Payment List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Paymemt ID</th>
                        <th>Invoiced ID</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>status</th>
                        <th>Payment Details</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                            <td>{payment.paymentId}</td>
                            <td>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.paymentDate}</td>
                            <td>{payment.status}</td>
                            <td>{payment.cardNumber.slice(-4)}</td>
                            <td>{`${payment.user.firstName} ${payment.user.lastName}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;

*/