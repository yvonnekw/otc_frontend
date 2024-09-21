import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Container, Alert, TextField } from '@mui/material';
import { Call } from "../../store/types";

interface Props {
    userId: string;
    status: string;
    refresh: boolean;  // Add a prop for refresh
}

const CallsTable: React.FC<Props> = ({ userId, status, refresh }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    const columns: GridColDef[] = [
        { field: 'callId', headerName: 'Call ID', flex: 1 },
        { field: 'callDate', headerName: 'Call Date', flex: 1 },
        { field: 'startTime', headerName: 'Start Time', flex: 1 },
        { field: 'endTime', headerName: 'End Time', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        { field: 'costPerSecond', headerName: 'Cost Per Second', flex: 1 },
        { field: 'discountForCalls', headerName: 'Discount', flex: 1 },
        { field: 'grossCost', headerName: 'Gross Cost', flex: 1 },
        { field: 'vat', headerName: 'VAT', flex: 1 },
        { field: 'netCost', headerName: 'Net Cost', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ];

    // Use `refresh` prop to trigger data reload
    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                const dataWithId = data.map(call => ({ ...call, id: call.callId }));
                setCalls(dataWithId);
                setFilteredCalls(dataWithId);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId, status, refresh]); // Add refresh to dependency array

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
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
            <Typography variant="h4" gutterBottom align="center">
                {getHeadingText(status)}
            </Typography>
            {message && (
                <Typography color="warning" align="center" sx={{ mb: 2 }}>
                    {message}
                </Typography>
            )}
            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="calls-table-search-input"
            />
            <div id="table-header" style={{ height: 'auto', width: '100%', marginTop: 16 }}>
                <div id="table-content" style={{ height: 600, width: '100%' }} data-testid="call-table">
                    <DataGrid
                        rows={filteredCalls}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            </div>
        </Container>
    );
};

export default CallsTable;

/*
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Container, Alert, TextField } from '@mui/material';
import { Call } from "../../store/types";

interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    // Adjusted column definitions using `flex` to make them fit the page
    const columns: GridColDef[] = [
        { field: 'callId', headerName: 'Call ID', flex: 1 },
        { field: 'callDate', headerName: 'Call Date', flex: 1 },
        { field: 'startTime', headerName: 'Start Time', flex: 1 },
        { field: 'endTime', headerName: 'End Time', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        { field: 'costPerSecond', headerName: 'Cost Per Second', flex: 1 },
        { field: 'discountForCalls', headerName: 'Discount', flex: 1 },
        { field: 'grossCost', headerName: 'Gross Cost', flex: 1 },
        { field: 'vat', headerName: 'VAT', flex: 1 },
        { field: 'netCost', headerName: 'Net Cost', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ];

    // Fetch the calls with a delay
    useEffect(() => {
        setLoading(true);
        // Simulate a delay with setTimeout
        const timeoutId = setTimeout(() => {
            getCallsByUsernameAndStatus(userId, status)
                .then((data) => {
                    const dataWithId = data.map(call => ({ ...call, id: call.callId }));
                    setCalls(dataWithId);
                    setFilteredCalls(dataWithId);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }, 3000); // 3-second delay

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [userId, status]);

    // Filter calls based on search term
    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
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
            <Typography variant="h4" gutterBottom align="center">
                {getHeadingText(status)}
            </Typography>
            {message && (
                <Typography color="warning" align="center" sx={{ mb: 2 }}>
                    {message}
                </Typography>
            )}
            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="calls-table-search-input"
            />
            <div id="table-header" style={{ height: 'auto', width: '100%', marginTop: 16 }}>
                <div id="table-content" style={{ height: 600, width: '100%' }} data-testid="call-table">
                    <DataGrid
                        rows={filteredCalls}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            </div>
        </Container>
    );
};

export default CallsTable;

*/
/*
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Container, Alert, TextField } from '@mui/material';
import { Call } from "../../store/types";

interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    // Adjusted column definitions using `flex` to make them fit the page
    const columns: GridColDef[] = [
        { field: 'callId', headerName: 'Call ID', flex: 1 },
        { field: 'callDate', headerName: 'Call Date', flex: 1 },
        { field: 'startTime', headerName: 'Start Time', flex: 1 },
        { field: 'endTime', headerName: 'End Time', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        { field: 'costPerSecond', headerName: 'Cost Per Second', flex: 1 },
        { field: 'discountForCalls', headerName: 'Discount', flex: 1 },
        { field: 'grossCost', headerName: 'Gross Cost', flex: 1 },
        { field: 'vat', headerName: 'VAT', flex: 1 },
        { field: 'netCost', headerName: 'Net Cost', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ];

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                const dataWithId = data.map(call => ({ ...call, id: call.callId }));
                setCalls(dataWithId);
                setFilteredCalls(dataWithId);
                setLoading(true, setTimeout=3000);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId, status]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
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
            <Typography variant="h4" gutterBottom align="center">
                {getHeadingText(status)}
            </Typography>
            {message && (
                <Typography color="warning" align="center" sx={{ mb: 2 }}>
                    {message}
                </Typography>
            )}
            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="calls-table-search-input"
            />
            <div id="table-header" style={{ height: 'auto', width: '100%', marginTop: 16 }}>
                <div id="table-content" style={{ height: 600, width: '100%' }} data-testid="call-table">
                    <DataGrid
                        rows={filteredCalls}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20]}
                        pagination
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            </div>
        </Container>
    );
};

export default CallsTable;
*/
/*
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Container, Alert, TextField } from '@mui/material';
import { Call } from "../../store/types";

interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    // Adjusted column definitions using `flex` to make them fit the page
    const columns: GridColDef[] = [
        { field: 'callId', headerName: 'Call ID', flex: 1 },
        { field: 'callDate', headerName: 'Call Date', flex: 1 },
        { field: 'startTime', headerName: 'Start Time', flex: 1 },
        { field: 'endTime', headerName: 'End Time', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1 },
        { field: 'costPerSecond', headerName: 'Cost Per Second', flex: 1 },
        { field: 'discountForCalls', headerName: 'Discount', flex: 1 },
        { field: 'grossCost', headerName: 'Gross Cost', flex: 1 },
        { field: 'vat', headerName: 'VAT', flex: 1 },
        { field: 'netCost', headerName: 'Net Cost', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
    ];

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                const dataWithId = data.map(call => ({ ...call, id: call.callId }));
                setCalls(dataWithId);
                setFilteredCalls(dataWithId);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId, status]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
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
            <Typography variant="h4" gutterBottom align="center">
                {getHeadingText(status)}
            </Typography>
            {message && (
                <Typography color="warning" align="center" sx={{ mb: 2 }}>
                    {message}
                </Typography>
            )}
            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="calls-table-search-input"
            />
            <div style={{ height: 600, width: '100%', marginTop: 16 }} data-testid="call-table">
                <DataGrid
                    rows={filteredCalls}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    disableSelectionOnClick
                    autoHeight
                />
            </div>
        </Container>
    );
};

export default CallsTable;

*/

/*
import React, { useEffect, useMemo, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, Column } from 'react-table';
import { TablePagination, TableSortLabel, TextField, Typography, CircularProgress, Container, Alert, Grid } from '@mui/material';
import { COLUMNS } from '../tableColumns/callTableColumns';
import { Call } from "../../store/types";
import {GridColDef} from "@mui/x-data-grid";

interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    const columns = useMemo<GridColDef<Call>[]>(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Call>(
        {
            columns,
            data: filteredCalls,
        },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                setCalls(data);
                setFilteredCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId, status, page, rowsPerPage]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
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
            <Typography variant="h4" gutterBottom align="center">
                {getHeadingText(status)}
            </Typography>
            {message && (
                <Typography color="warning" align="center" sx={{ mb: 2 }}>
                    {message}
                </Typography>
            )}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Search Calls"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        data-testid="calls-table-search-input"
                    />
                </Grid>
            </Grid>
            <div style={{ height: 600, width: '100%', marginTop: 16 }} data-test-id="call-table">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} data-test-id="table-Header-row">
                            {headerGroups.map(headerGroup => (
                                <div key={headerGroup.id} style={{ display: 'flex', flexDirection: 'row' }} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <div
                                            key={column.id}
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)', flex: 1 }}
                                        >
                                            <TableSortLabel
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                            >
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div {...getTableBodyProps()} style={{ overflowY: 'auto' }}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <div key={row.id} {...row.getRowProps()} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                                        {row.cells.map(cell => (
                                            <div
                                                key={cell.column.id}
                                                {...cell.getCellProps()}
                                                style={{ padding: '10px', borderBottom: '1px solid rgba(224, 224, 224, 1)', flex: 1 }}
                                            >
                                                {cell.render('Cell')}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <TablePagination
                component='div'
                count={filteredCalls.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                data-testid="calls-table-pagination"
            />
        </Container>
    );
};

export default CallsTable;
*/
/*
import React, { useEffect, useMemo, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, Column } from 'react-table';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { COLUMNS } from '../tableColumns/callTableColumns';
import { Call } from "../../store/types";


interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    const columns = useMemo<Column<Call>[]>(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Call>(
        {
            columns,
            data: filteredCalls,
        },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                setCalls(data);
                setFilteredCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [userId, status, page, rowsPerPage]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
    };

    if (loading) {
        return <div data-testid="calls-table-loading">Loading...</div>;
    }

    if (error) {
        return <div data-testid="calls-table-error">Error: {error.message}</div>;
    }

    return (
        <div className='container' data-testid="calls-table-container">
            {message && <p className='text-warning px-5' data-testid="calls-table-message">{message}</p>}
            <br/><br/>
            <h4 className='text-center' data-testid="calls-table-heading">{getHeadingText(status)}</h4>

            <div className="search-container mb-3" data-testid="calls-table-search-container">
                <input
                    type="text"
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                    data-testid="calls-table-search-input"
                />
            </div>
            <span data-testid="invoice-table-title" style={{display: 'none'}}>
                User Invoice Table
            </span>

            {filteredCalls && filteredCalls.length === 0 ? (
                <p data-testid="calls-table-no-calls">No calls to display.</p>
            ) : (
                <div style={{ height: 600, width: '100%' }}>
                <div className="grid-container">
                    <div className="grid-header" data-testid="calls-table-header">
                        {headerGroups.map((headerGroup) => (
                            <div className="grid-row" {...headerGroup.getHeaderGroupProps()}
                                 data-testid="calls-table-header-row">
                                {headerGroup.headers.map((column) => (
                                    <div
                                        className="grid-cell grid-header-cell"
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        data-testid={`calls-table-header-${column.id}`}
                                    >
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        >
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="grid-body" {...getTableBodyProps()} data-testid="calls-table-body">
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <div className="grid-row" {...row.getRowProps()} data-testid="calls-table-row">
                                    {row.cells.map((cell) => (
                                        <div className="grid-cell" {...cell.getCellProps()}
                                             data-testid={`calls-table-cell-${cell.column.id}`}>
                                            {cell.render('Cell')}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                </div>
            )}
            <TablePagination
                component='div'
                count={filteredCalls.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                data-testid="calls-table-pagination"
            />
        </div>
    );
};

export default CallsTable;
*/

/*
import React, {useEffect, useMemo, useState} from 'react';
import {getCallsByUsernameAndStatus} from '../../services/CallService';
import {useLocation} from 'react-router-dom';
import {useTable, useSortBy} from 'react-table';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import {COLUMNS} from '../tableColumns/callTableColumns';
import {Call} from "../../store/types";

interface Props {
    userId: string;
    status: string;
}

const CallsTable: React.FC<Props> = ({userId, status}) => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const location = useLocation();
    const message = location.state && location.state.message;

    const columns = useMemo(() => COLUMNS, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<Call>(
        {
            columns,
            data: filteredCalls,
        },
        useSortBy
    );

    useEffect(() => {
        setLoading(true);
        getCallsByUsernameAndStatus(userId, status)
            .then((data) => {
                setCalls(data);
                setFilteredCalls(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [userId, status, page, rowsPerPage]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCalls(
                calls.filter(call =>
                    Object.values(call).some(value =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        } else {
            setFilteredCalls(calls);
        }
    }, [searchTerm, calls]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getHeadingText = (status: string) => {
        switch (status) {
            case 'Invoiced':
                return 'Invoiced Calls';
            case 'Pending Invoice':
                return 'Current Calls';
            case 'Paid':
                return 'Paid Calls';
            default:
                return 'Call History';
        }
    };

    if (loading) {
        return <div data-testid="calls-table-loading">Loading...</div>;
    }

    if (error) {
        return <div data-testid="calls-table-error">Error: {error.message}</div>;
    }

    return (
        <div className='container' data-testid="calls-table-container">
            {message && <p className='text-warning px-5' data-testid="calls-table-message">{message}</p>}
            <br/> <br/>
            <h4 className='text-center' data-testid="calls-table-heading">{getHeadingText(status)}</h4>


            <div className="search-container mb-3" data-testid="calls-table-search-container">
                <input
                    type="text"
                    placeholder="Search calls..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                    data-testid="calls-table-search-input"
                />
            </div>

            {filteredCalls && filteredCalls.length === 0 ? (
                <p data-testid="calls-table-no-calls">No calls to display.</p>
            ) : (
                <div>
                    <table
                        className='table table-striped table-bordered'
                        id='callTable'
                        {...getTableProps()}
                        data-testid="calls-table"
                    >
                        <caption data-testid="calls-table-caption">{getHeadingText(status)}</caption>
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} data-testid="calls-table-header-row">
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        data-testid={`calls-table-header-${column.id}`}
                                    >
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                            {...column.getSortByToggleProps()}
                                        >
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()} data-testid="calls-table-body">
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} data-testid="calls-table-row">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} data-testid={`calls-table-cell-${cell.column.id}`}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    <TablePagination
                        component='div'
                        count={filteredCalls.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        data-testid="calls-table-pagination"
                    />
                </div>
            )}
        </div>
    );
};

export default CallsTable;

*/
/*
import React, { useEffect, useMemo, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { COLUMNS } from '../tableColumns/callTableColumns';
import { Call } from "../../store/types";

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]); // State for filtered calls
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = useMemo(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Call>(
      {
        columns,
        data: filteredCalls, // Use filtered calls for table data
      },
      useSortBy
  );

  useEffect(() => {
    setLoading(true);
    getCallsByUsernameAndStatus(userId, status)
        .then((data) => {
          setCalls(data);
          setFilteredCalls(data); // Initialize filtered calls with the fetched data
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  }, [userId, status, page, rowsPerPage]);

  useEffect(() => {
    // Filter calls based on the search term
    if (searchTerm) {
      setFilteredCalls(
          calls.filter(call =>
              Object.values(call).some(value =>
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )
          )
      );
    } else {
      setFilteredCalls(calls);
    }
  }, [searchTerm, calls]);

  const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getHeadingText = (status: string) => {
    switch (status) {
      case 'Invoiced':
        return 'Invoiced Calls';
      case 'Pending Invoice':
        return 'Current Calls';
      case 'Paid':
        return 'Paid Calls';
      default:
        return 'Call History';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <div className='container'>
        {message && <p className='text-warning px-5'>{message}</p>}
        <br /> <br />
        <h2 className='text-center'>{getHeadingText(status)}</h2>


        <div className="search-container mb-3">
          <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
          />
        </div>

        {filteredCalls && filteredCalls.length === 0 ? (
            <p>No calls to display.</p>
        ) : (
            <div>
              <table
                  className='table table-striped table-bordered'
                  id='callTable'
                  {...getTableProps()}
              >
                <caption>{getHeadingText(status)}</caption>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            <TableSortLabel
                                active={column.isSorted}
                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                {...column.getSortByToggleProps()}
                            >
                              {column.render('Header')}
                            </TableSortLabel>
                          </th>
                      ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                  );
                })}
                </tbody>
              </table>
              <TablePagination
                  component='div'
                  count={filteredCalls.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
        )}
      </div>
  );
};

export default CallsTable;
*/

/*
import React, { useEffect, useMemo, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { COLUMNS } from '../tableColumns/callTableColumns';
import { Call } from "../../store/types";

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = useMemo(() => COLUMNS, []); // Use the provided COLUMNS array

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Call>(
      {
        columns,
        data: calls,
      },
      useSortBy
  );

  useEffect(() => {
    setLoading(true);
    getCallsByUsernameAndStatus(userId, status)
        .then((data) => {
          setCalls(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getHeadingText = (status: string) => {
    switch (status) {
      case 'Invoiced':
        return 'Invoiced Calls';
      case 'Pending Invoice':
        return 'Current Calls';
      case 'Paid':
        return 'Paid Calls';
      default:
        return 'Call History';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <div className='container'>
        {message && <p className='text-warning px-5'>{message}</p>}
        <br /> <br />
        <h2 className='text-center'>{getHeadingText(status)}</h2>
        {calls && calls.length === 0 ? (
            <p>No calls to display.</p>
        ) : (
            <div>
              <table
                  className='table table-striped table-bordered'
                  id='callTable'
                  {...getTableProps()}
              >
                <caption>{getHeadingText(status)}</caption>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            <TableSortLabel
                                active={column.isSorted}
                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                {...column.getSortByToggleProps()}
                            >
                              {column.render('Header')}
                            </TableSortLabel>
                          </th>
                      ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                  );
                })}
                </tbody>
              </table>
              <TablePagination
                  component='div'
                  count={calls.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
        )}
      </div>
  );
};

export default CallsTable;
*/

/*
import React, { useEffect, useMemo, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, Column } from 'react-table';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';

interface Call {
  id: string;
  callId: string;
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
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns: Column<Call>[] = useMemo(
      () => [
        {
          Header: 'Call ID',
          accessor: 'callId',
        },
        {
          Header: 'Start Time',
          accessor: 'startTime',
        },
        {
          Header: 'End Time',
          accessor: 'endTime',
        },
        {
          Header: 'Duration',
          accessor: 'duration',
        },
        {
          Header: 'Cost',
          accessor: 'grossCost',
        },  {
          Header: 'Cost',
          accessor: 'grossCost',
        },
        // Add more columns as needed
      ],
      []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Call>(
      {
        columns,
        data: calls,
      },
      useSortBy
  );

  useEffect(() => {
    setTimeout(() => {
      getCallsByUsernameAndStatus(userId, status)
          .then((data) => {
            setCalls(data);
            setLoading(false);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
    }, 1000);
  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getHeadingText = (status: string) => {
    switch (status) {
      case 'Invoiced':
        return 'Invoiced Calls';
      case 'Pending AdminInvoiceTable':
        return 'Current Calls';
      case 'Paid':
        return 'Paid Calls';
      default:
        return 'Call History';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <div className='container'>
        {message && <p className='text-warning px-5'>{message}</p>}
        <br /> <br />
        <h2 className='text-center'>{getHeadingText(status)}</h2>
        {calls && calls.length === 0 ? (
            <p>No calls to display.</p>
        ) : (
            <div>
              <table
                  className='table table-striped table-bordered'
                  id='callTable'
                  {...getTableProps()}
              >
                <caption>{getHeadingText(status)}</caption>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            <TableSortLabel
                                active={column.isSorted}
                                direction={column.isSortedDesc ? 'desc' : 'asc'}
                                {...column.getSortByToggleProps()}
                            >
                              {column.render('Header')}
                            </TableSortLabel>
                          </th>
                      ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                  );
                })}
                </tbody>
              </table>
              <TablePagination
                  component='div'
                  count={calls.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
        )}
      </div>
  );
};

export default CallsTable;

*/

/*

import React, { useEffect, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/callTableColumns';
import TablePagination from '@mui/material/TablePagination';

interface Call {
  id: string;
  callId: string;
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
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });


  useEffect(() => {
    setTimeout(() => {

      getCallsByUsernameAndStatus(userId, status).then((data) => {
        setCalls(data);
        setLoading(false)
      }).

        catch((error) => {
          setError(error.message)
          setLoading(false)
        });
    },1000)

  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getHeadingText = (status: string) => {
    switch (status) {
      case "Invoiced":
        return "Invoiced Calls";
      case "Pending AdminInvoiceTable":
        return "Current Calls";
      case "Paid":
        return "Paid Calls";
      default:
        return "Call History";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      <br /> <br />
      <h2 className='text-center'>{getHeadingText(status)}</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <div>
          <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
              <caption>{getHeadingText(status)}</caption>
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
          <TablePagination
            component="div"
            count={calls.length} 
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default CallsTable;

*/
/*

import React, { useEffect, useRef, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';
import TablePagination from '@mui/material/TablePagination';

interface Call {
  id: string;
  callId: string;
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
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    setTimeout(() => {
 
      getCallsByUsernameAndStatus(userId, status).then((data) => {
        setCalls(data);
        setLoading(false)
      }).
    
        catch((error) => {
          setError(error.message)
          setLoading(false)
        });
    }, 1000)

  }, [userId, status, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      <br /> <br />
      <h2 className='text-center'>Call History</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <>
          <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
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
          <TablePagination
            component="div"
            count={calls.length} // Replace with total count of calls if available from API
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default CallsTable;
*/
/*
import React, { useEffect, useRef, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';

interface Call {
  id: string;
  callId: string;
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
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();
  const message = location.state && location.state.message;

  const columns = React.useMemo<Column<Call>[]>(() => COLUMNS, []);

  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    const fetchCalls = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController();
      setLoading(true)
      try {
    
        const response = await getCallsByUsernameAndStatus(userId, status);
        {
          signal: abortControllerRef.current?.signal
        }
        //const rsp = (await response) as Call[];
        setCalls(response);
      } catch (error) {
      //  if(error.name === "AbortError"){
            //console.log("Aborted")
            //return
       // }
        
       // setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [userId, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  //if (error) {
   //return <div>Error: {error.message}</div>;
 // }

  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
    
      <br /> <br />
      <h2 className='text-center'>Call History</h2>
      {calls && calls.length === 0 ? (
        <p>No calls to display.</p>
      ) : (
        <table className="table table-striped table-bordered" id="callTable" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          {loading}
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

export default CallsTable;

*/
/*

import React, { useEffect, useState } from 'react';
import { getCallsByUsernameAndStatus } from '../../services/CallService';
import { useLocation, useParams } from 'react-router-dom';
import { useTable } from 'react-table';
import { COLUMNS } from '../tables/ callTableColumns';

interface Call {
  id: string;
  callId: string;
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
}

interface Props {
  userId: string;
  status: string;
}

const CallsTable: React.FC<Props> = ({ userId, status}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const location = useLocation();
  const message = location.state && location.state.message;
  const columns = React.useMemo(() => COLUMNS, []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  console.log("get calls by user id ", userId)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: calls });

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getCallsByUsernameAndStatus(userId, status);
        setCalls(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [userId, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
/*
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getCallsByUsernameAndStatus(userId, status!);
        setCalls(response);
        console.log("get calls by user id ", response)
      } catch (error) {
        console.error(error);
      }
    };
    fetchCalls();
  }, [userId, status]);

  */
/*
  return (
    <div className='container'>
      {message && <p className='text-warning px-5'>{message}</p>}
      {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
      <br /> <br />
        <h2 className='text-center'>Call History</h2>
        {calls && calls.length === 0 ? (
          <p>No calls to display.</p>
        ) : (
          <table className="table table-striped table-bordered" id="callTable">
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Call Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Cost Per Second</th>
                <th>Discount</th>
                <th>Call Gross cost</th>
                <th>VAT</th>
                <th>Net Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {calls && calls.map((call) => (
                <tr key={call.id}>
                  <td>{call.callId}</td>
                  <td>{call.callDate}</td>
                  <td>{call.startTime}</td>
                  <td>{call.endTime}</td>
                  <td>{call.duration}</td>
                  <td>{call.costPerSecond}</td>
                  <td>{call.discountForCalls}</td>
                  <td>{call.grossCost}</td>
                  <td>{call.vat}</td>
                  <td>{call.netCost}</td>
                  <td>{call.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

  );
//};

//export default CallsTable;
*/