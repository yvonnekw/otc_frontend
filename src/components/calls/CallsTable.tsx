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
