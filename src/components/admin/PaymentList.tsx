import React, { useState, useEffect, useMemo } from 'react';
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
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { getPayments } from '../../services/PaymentService';
import { Payment } from '../../store/types';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

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

    const columns = useMemo<Column<Payment>[]>(() => [
        { Header: 'Payment ID', accessor: 'paymentId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Date', accessor: 'paymentDate' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: { row: any }) => (
                <>
                    <Button
                        color="primary"
                        onClick={() => handleUpdateClick(row.original)}
                    >
                        <FaEdit />
                        Update
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => handleDeleteClick(row.original)}
                    >
                        <FaTrashAlt />
                        Delete
                    </Button>
                </>
            ),
        },
    ], []);

    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { globalFilter },
        setGlobalFilter,  // this is correctly obtained from useTable
    } = useTable<Payment>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    // Update button click handler
    const handleUpdateClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
    };

    // Close update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPayment(null);
    };

    // Update logic
    const handleUpdate = () => {
        console.log('Updating payment with ID:', selectedPayment?.paymentId);
        handleCloseDialog();
    };

    // Delete button click handler
    const handleDeleteClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedPayment(null);
    };

    // Delete logic
    const handleDelete = () => {
        console.log('Deleting payment with ID:', selectedPayment?.paymentId);
        handleCloseDeleteDialog();
    };

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

            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            />

            <TableContainer component={Paper}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for payment ID: {selectedPayment?.paymentId}
                    </DialogContentText>
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.amount || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
                                ...prev!,
                                amount: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.status || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
                                ...prev!,
                                status: e.target.value,
                            }));
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Delete Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete payment ID: {selectedPayment?.paymentId}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PaymentList;
