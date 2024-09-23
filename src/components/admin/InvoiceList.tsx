import React, { useEffect, useMemo, useState } from 'react';
import {
    Container,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
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
import { getAllInvoices } from '../../services/InvoiceService';
import { InvoiceData } from '../../store/types';

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);


    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const invoicesData = await getAllInvoices();
                setInvoices(invoicesData);
                setLoading(false);
            } catch (error) {
                setError('Error fetching invoices. Please try again.');
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    // Define the columns with specific fields and an Actions column
    const columns = useMemo<Column<InvoiceData>[]>(() => [
        { Header: 'Invoice ID', accessor: 'invoiceId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Date', accessor: 'date' },
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
                        update
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

    // Handle Update button click
    const handleUpdateClick = (invoice: InvoiceData) => {
        setSelectedInvoice(invoice);
        setDialogOpen(true);
    };

    // Handle Delete button click
    const handleDeleteClick = (invoice: InvoiceData) => {
        setSelectedInvoice(invoice);
        setDeleteDialogOpen(true);
    };

    // Close Update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedInvoice(null);
    };

    // Close Delete dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedInvoice(null);
    };

    // Handle Update action
    const handleUpdate = () => {
        console.log('Updating invoice with ID:', selectedInvoice?.invoiceId);
        handleCloseDialog();
    };

    // Handle Delete action
    const handleDelete = () => {
        console.log('Deleting invoice with ID:', selectedInvoice?.invoiceId);
        handleCloseDeleteDialog();
    };

    // Define the table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<InvoiceData>(
        {
            columns,
            data: invoices,
            initialState: { sortBy: [{ id: 'invoiceId', desc: false }] },
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Invoice List
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Search Input */}
            <TextField
                label="Search Invoices"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />

            <TableContainer component={Paper}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Update Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update Invoice</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for invoice ID: {selectedInvoice?.invoiceId}
                    </DialogContentText>
                    {/* Add form fields here for updating the invoice details */}
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

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Delete Invoice</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete invoice ID: {selectedInvoice?.invoiceId}?
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

export default InvoiceList;
