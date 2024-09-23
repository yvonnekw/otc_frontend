import React, { useEffect, useMemo, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    TextField,
    TableSortLabel,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { Call } from '../../store/types';
import { listCalls, updateCall, deleteCall } from '../../services/CallService'; // Assuming deleteCall exists in your service
import { useAppDispatch } from '../../store/hooks/useAppDispatch';
import { fetchCalls } from '../../store/callsSlice';
import { useAppSelector } from '../../store/hooks/useAppSelector';

// React Icons
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<Call>>({});
    const [callToDelete, setCallToDelete] = useState<Call | null>(null);

    const status = useAppSelector(state => state.calls.status);

    useEffect(() => {
        const fetchCallsData = async () => {
            try {
                const response = await listCalls();
                setCalls(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching calls. Please try again.');
                setLoading(false);
            }
        };

        fetchCallsData();
    }, []);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    const handleClickOpenUpdate = (call: Call) => {
        setSelectedCall(call);
        setUpdatedData(call); // Pre-fill the form with current data
        setOpenUpdate(true);
    };

    const handleClickOpenDelete = (call: Call) => {
        setCallToDelete(call);
        setOpenDelete(true);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedCall(null);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setCallToDelete(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatedData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitUpdate = async () => {
        if (selectedCall && updatedData) {
            try {
                const response = await updateCall(selectedCall.callId, updatedData);
                setCalls(calls.map(call => call.callId === selectedCall.callId ? response : call));
                setOpenUpdate(false);
            } catch (error) {
                console.error('Error updating call:', error);
            }
        }
    };

    const handleSubmitDelete = async () => {
        if (callToDelete) {
            try {
                await deleteCall(callToDelete.callId);
                setCalls(calls.filter(call => call.callId !== callToDelete.callId));
                setOpenDelete(false);
            } catch (error) {
                console.error('Error deleting call:', error);
            }
        }
    };

    const columns = useMemo<Column<Call>[]>(() => [
        { Header: 'Call ID', accessor: 'callId' },
        { Header: 'Start Time', accessor: 'startTime' },
        { Header: 'End Time', accessor: 'endTime' },
        { Header: 'Receiver Telephone', accessor: 'receiverTelephone' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: any) => (
                <>
                    <Button
                        variant="text"
                        color="primary"
                        startIcon={<FaEdit />}
                        onClick={() => handleClickOpenUpdate(row.original)}
                    >
                        Update
                    </Button>
                    <Button
                        variant="text"
                        color="error"
                        startIcon={<FaTrashAlt />}
                        onClick={() => handleClickOpenDelete(row.original)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ], [calls]);

    const data = useMemo(() => calls, [calls]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<Call>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography variant="h6" color="error">Error: {error}</Typography>
            </div>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                All Call List
            </Typography>

            {/* Search Input */}
            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 4 }}
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />

            <TableContainer component={Paper}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <TableSortLabel
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        />
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

            {/* Update Dialog */}
            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                <DialogTitle>Update Call</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="startTime"
                        label="Start Time"
                        type="text"
                        fullWidth
                        value={updatedData.startTime || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="endTime"
                        label="End Time"
                        type="text"
                        fullWidth
                        value={updatedData.endTime || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="receiverTelephone"
                        label="Receiver Telephone"
                        type="text"
                        fullWidth
                        value={updatedData.receiverTelephone || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="status"
                        label="Status"
                        type="text"
                        fullWidth
                        value={updatedData.status || ''}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmitUpdate} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Delete Call</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this call?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmitDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ListAllCalls;
