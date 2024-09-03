
import React, { useEffect, useState } from 'react';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InvoiceData } from '../../store/types';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Props {
    username: string;
}

const UserInvoiceTable: React.FC<Props> = ({ username }) => {
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
    }, [username]);

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



/*
import React, { useEffect, useState } from 'react';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InvoiceData } from '../../store/types';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Props {
    username: string;
}

const UserInvoiceTable: React.FC<Props> = ({ username }) => {
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
    }, [username]);

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
            <Typography variant="h1" gutterBottom>
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
*/

/*
import React, { useEffect, useState } from 'react';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InvoiceData } from '../../store/types';
import { TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';

interface Props {
    username: string;
}

const UserInvoiceTable: React.FC<Props> = ({ username }) => {
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
    }, [username]);

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
                Invoices
            </Typography>
            <TextField
                label="Search Invoices"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredInvoices}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    getRowId={(row) => row.invoiceId} // Specify the unique ID field
                />
            </div>
        </Container>
    );
};

export default UserInvoiceTable;

*/
/*
import React, { useEffect, useMemo, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { COLUMNS } from '../tableColumns/invoiceTableColumns'; // Your columns configuration
import { InvoiceData } from '../../store/types';

interface Props {
    username: string;
}

const UserInvoiceTable: React.FC<Props> = ({ username }) => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]); // State for filtered invoices
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
    } = useTable<InvoiceData>(
        {
            columns,
            data: filteredInvoices, // Use filtered invoices for table data
        },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getInvoicesByUsername(username)
            .then((data) => {
                setInvoices(data);
                setFilteredInvoices(data); // Initialize filtered invoices with fetched data
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        // Filter invoices based on the search term
        if (searchTerm) {
            setFilteredInvoices(
                invoices.filter(invoice =>
                    Object.values(invoice).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredInvoices(invoices);
        }
    }, [searchTerm, invoices]);

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
            <h2 className='text-center'>Invoices</h2>

            <div className="search-container mb-1">
                <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}

                    onChange={handleSearchChange}
                    className="form-control"
                />
            </div>

            {filteredInvoices && filteredInvoices.length === 0 ? (
                <p>No invoices to display.</p>
            ) : (
                <table className='table table-striped table-bordered' {...getTableProps()}>
                    <caption>Invoice List</caption>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}

                                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
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

export default UserInvoiceTable;

*/
/*
import React, { useEffect, useMemo, useState } from 'react';
import {useSortBy, useTable} from 'react-table';
import { getInvoicesByUsername } from '../../services/InvoiceService';
import { COLUMNS } from '../tableColumns/invoiceTableColumns'; // Your columns configuration
import { InvoiceData } from '../../store/types';

interface Props {
    username: string;
}

const UserInvoiceTable: React.FC<Props> = ({ username }) => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<InvoiceData>({
        columns,
        data: invoices,
    },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getInvoicesByUsername(username)
            .then((data) => {
                setInvoices(data);
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
            <h2 className='text-center'>Invoices</h2>
            {invoices && invoices.length === 0 ? (
                <p>No invoices to display.</p>
            ) : (
                <table className='table table-striped table-bordered' {...getTableProps()}>
                    <caption>Invoice List</caption>
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

export default UserInvoiceTable;
*/