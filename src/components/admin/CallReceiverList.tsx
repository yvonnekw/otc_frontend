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
import { Receiver } from '../../store/types';
import {CallReceiver, getUserCallReceiverList} from "../../services/CallReceiverService";



const CallReceiverList: React.FC = () => {
    const[callReceivers, setCallReceivers] = useState<Receiver[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReceiver, setSelectedReceiver] = useState<Receiver | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchCallReceivers = async () => {
            try {
                const response = await getUserCallReceiverList();
                setCallReceivers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching call receivers. Please try again.');
                setLoading(false);
            }
        };

        fetchCallReceivers();
    }, []);

    const columns = useMemo<Column<Receiver>[]>(() => [
        { Header: 'Call Receiver ID', accessor: 'callReceiverId' },
        { Header: 'Full Name', accessor: 'fullName' },
        { Header: 'Telephone number', accessor: 'telephone' },
        { Header: 'Relationship To User', accessor: 'relationship' },
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

    const data = useMemo(() => callReceivers, [callReceivers]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { globalFilter },
        setGlobalFilter,  // this is correctly obtained from useTable
    } = useTable<Receiver>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    // Update button click handler
    const handleUpdateClick = (receiver: Receiver) => {
        setSelectedReceiver(receiver);
        setDialogOpen(true);
    };

    // Close update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedReceiver(null);
    };

    // Update logic
    const handleUpdate = () => {
        console.log('Updating payment with ID:', selectedReceiver?.callReceiverId);
        handleCloseDialog();
    };

    // Delete button click handler
    const handleDeleteClick = (receiver: Receiver) => {
        setSelectedReceiver(receiver);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedReceiver(null);
    };

    // Delete logic
    const handleDelete = () => {
        console.log('Deleting payment with ID:', selectedReceiver?.callReceiverId);
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
                Call Receiver List
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
                        Please update the details for payment ID: {selectedReceiver?.callReceiverId}
                    </DialogContentText>
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedReceiver?.callReceiverId || ''}
                        onChange={(e) => {
                            setSelectedReceiver((prev) => ({
                                ...prev!,
                                amount: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="relationship"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedReceiver?.relationship || ''}
                        onChange={(e) => {
                            setSelectedReceiver((prev) => ({
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
                        Are you sure you want to delete payment ID: {selectedReceiver?.callReceiverId}?
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

export default CallReceiverList;
