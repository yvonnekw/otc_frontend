import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Payment } from '../../store/types';
import { getPaidCallsByUsername } from '../../services/PaymentService';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';


interface Props {
    username: string;
}

const UserPaidTable: React.FC<Props> = ({ username }) => {
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
    }, [username]);

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
            <Typography variant="h4" gutterBottom>
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
                <div style={{ height: 600, width: '100%' }}>
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



/*

import React, { useEffect, useMemo, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { Payment } from '../../store/types';
import { getPaidCallsByUsername } from '../../services/PaymentService';
import { COLUMNS } from '../tableColumns/paymentTableColumns';

interface Props {
    username: string;
}

const UserPaidTable: React.FC<Props> = ({ username }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]); // State for filtered payments
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Payment>(
        {
            columns,
            data: filteredPayments, // Use filtered payments for table data
        },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getPaidCallsByUsername(username)
            .then((data) => {
                setPayments(data);
                setFilteredPayments(data); // Initialize filtered payments with the fetched data
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        // Filter payments based on the search term
        if (searchTerm) {
            setFilteredPayments(
                payments.filter(payment =>
                    Object.values(payment).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredPayments(payments);
        }
    }, [searchTerm, payments]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Paid Calls</h2>


            <div className="search-container mb-3">
                <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                />
            </div>

            {filteredPayments && filteredPayments.length === 0 ? (
                <p>No payments to display.</p>
            ) : (
                <table className='table table-striped table-bordered' {...getTableProps()}>
                    <caption>Paid Payments</caption>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserPaidTable;
*/

/*
import React, { useEffect, useMemo, useState } from 'react';
import {useSortBy, useTable} from 'react-table';
import { Payment } from '../../store/types';
import {getPaidCallsByUsername} from "../../services/PaymentService";
import {COLUMNS} from "../tableColumns/paymentTableColumns";


interface Props {
    username: string;
}

const UserPaidTable: React.FC<Props> = ({ username }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Payment>({
        columns,
        data: payments,
    },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getPaidCallsByUsername(username)
            .then((data) => {
                setPayments(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Paid calls</h2>
            {payments && payments.length === 0 ? (
                <p>No invoices to display.</p>
            ) : (
                <table className='table table-striped table-bordered' {...getTableProps()}>
                    <caption>Paid Invoices</caption>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserPaidTable;
*/