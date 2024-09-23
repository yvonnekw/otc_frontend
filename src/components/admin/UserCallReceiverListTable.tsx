import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Receiver} from '../../store/types';
import {TextField, Container, Typography, CircularProgress, Alert} from '@mui/material';
import {getUserCallReceiverList} from "../../services/CallReceiverService";

interface Props {
    username: string;
}

const UserCallReceiverListTable: React.FC<Props> = ({username}) => {
    const [userCallReceivers, setUserCallReceivers] = useState<Receiver[]>([]);
    const [filteredUserCallReceivers, setFilteredUserCallReceivers] = useState<Receiver[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const columns: GridColDef[] = [
        {field: 'callReceiverId', headerName: 'Call Receiver ID', width: 150},
        {field: 'fullName', headerName: 'Full Name', width: 180},
        {field: 'telephone', headerName: 'Telephone', width: 180},
        {field: 'relationship', headerName: 'Relationship', width: 200},
        {field: 'user_id', headerName: 'user_id', width: 200},
    ];

    useEffect(() => {
        const fetchCallReceivers = async () => {
            setLoading(true);
            try {
                const data: Receiver[] = await getUserCallReceiverList();

                const callReceiversWithId = Array.isArray(data)
                    ? data.map((callReceiver: Receiver) => ({
                        ...callReceiver,
                        id: callReceiver.callReceiverId
                    }))
                    : [];

                setUserCallReceivers(callReceiversWithId);
                setFilteredUserCallReceivers(callReceiversWithId);
            } catch (error) {
                setError('Error fetching call receivers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCallReceivers();
    }, [username]);


    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        setFilteredUserCallReceivers(
            userCallReceivers.filter(callReceiver =>
                Object.values(callReceiver).some(value =>
                    value?.toString().toLowerCase().includes(lowercasedSearchTerm)
                )
            )
        );
    }, [searchTerm, userCallReceivers]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return (
            <Container data-testid="user-call-receiver-list-table-loading"
                       sx={{mt: 5, display: 'flex', justifyContent: 'center'}}>
                <CircularProgress/>
            </Container>
        );
    }

    if (error) {
        return (
            <Container data-testid="user-call-receiver-list-table-error" sx={{mt: 5}}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container data-testid="user-call-receiver-list-table" sx={{mt: 5}}>
            <Typography variant="h4" gutterBottom align="center">
                User Call Receiver List
            </Typography>
            <TextField
                label="Search Call Receiver"
                variant="outlined"
                sx={{width: '50%', mb: 2}}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="user-call-receiver-search-field"
            />
            <div style={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={filteredUserCallReceivers}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    getRowId={(row) => row.callReceiverId}
                    data-testid="call-receiver-data-grid"
                />
            </div>
        </Container>
    );
};

export default UserCallReceiverListTable;
