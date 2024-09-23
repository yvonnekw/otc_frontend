import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Payment } from '../../store/types';
import { getPaidCallsByUsername } from '../../services/PaymentService';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Props {
    username: string;
    refresh: boolean;  // Add refresh prop to trigger data refresh
}

const UserPaidTable: React.FC<Props> = ({ username, refresh }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Define columns for the DataGrid
    const columns: GridColDef[] = [
        { field: 'paymentId', headerName: 'Payment ID', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 150 },
        { field: 'paymentDate', headerName: 'Payment Date', width: 180 },
        { field: 'fullNameOnPaymentCard', headerName: 'Card Holder', width: 200 },
        { field: 'cardNumber', headerName: 'Card Number', width: 200 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'invoiceId', headerName: 'Invoice ID', width: 150 },
        { field: 'username', headerName: 'Username', width: 150 },
    ];

    // Fetch payments data when the component mounts or when username or refresh prop changes
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const data = await getPaidCallsByUsername(username);
                setPayments(data);
                setFilteredPayments(data); // Initialize filtered payments with fetched data
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, [username, refresh]);  // Include refresh prop in the dependency array

    // Filter payments by search term
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredPayments(
            payments.filter(payment =>
                Object.values(payment).some(value =>
                    value?.toString().toLowerCase().includes(lowercasedSearchTerm)
                )
            )
        );
    }, [searchTerm, payments]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h1" gutterBottom align="center">
                Paid Calls
            </Typography>

            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {filteredPayments.length === 0 ? (
                <Typography>No payments to display.</Typography>
            ) : (
                <div style={{ height: 600, width: '100%' }} data-testid="payment-data-grid">
                    <DataGrid
                        rows={filteredPayments.map(payment => ({ ...payment, id: payment.paymentId }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </Container>
    );
};

export default UserPaidTable;
