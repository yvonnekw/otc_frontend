import React, { useEffect, useState } from 'react';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InvoiceData } from '../../store/types';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Props {
    username: string;
    refresh: boolean; // Add the refresh prop
}

const UserInvoiceTable: React.FC<Props> = ({ username, refresh }) => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const columns: GridColDef[] = [
        { field: 'invoiceId', headerName: 'Invoice ID', width: 150 },
        { field: 'invoiceDate', headerName: 'Invoice Date', width: 180 },
        { field: 'totalAmount', headerName: 'Total Amount', width: 180 },
        { field: 'callIds', headerName: 'Call IDs', width: 200 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
    ];

    // Fetch invoices whenever the component mounts or when the refresh prop changes
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const data = await getInvoicesByUsername(username);
                // Ensure data has unique id
                const invoicesWithId = data.map((invoice) => ({
                    ...invoice,
                    id: invoice.invoiceId // Make sure invoiceId is unique
                }));
                setInvoices(invoicesWithId);
                setFilteredInvoices(invoicesWithId);
                setLoading(false);
            } catch (error) {
                setError('Error fetching invoices. Please try again.');
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [username, refresh]); // Add `refresh` as a dependency

    // Handle search term filtering
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredInvoices(
            invoices.filter(invoice =>
                Object.values(invoice).some(value =>
                    value?.toString().toLowerCase().includes(lowercasedSearchTerm)
                )
            )
        );
    }, [searchTerm, invoices]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return (
            <Container data-testid="user-invoice-table-loading" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container data-testid="user-invoice-table-error" sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container data-testid="user-invoice-table" sx={{ mt: 5 }}>
            <Typography variant="h1" gutterBottom align="center">
                Invoices
            </Typography>
            <TextField
                label="Search Invoices"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="invoice-search-field"
            />
            <span data-testid="invoice-table-title" style={{ display: 'none' }}>
                User Invoice Table
            </span>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredInvoices}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    getRowId={(row) => row.invoiceId} // Specify the unique ID field
                    data-testid="invoice-data-grid"
                />
            </div>
        </Container>
    );
};

export default UserInvoiceTable;
