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




/*


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
*/
 /*

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
import { listCalls, updateCall } from '../../services/CallService'; // Assuming updateCall exists in your service
import { useAppDispatch } from '../../store/hooks/useAppDispatch';
import { fetchCalls } from '../../store/callsSlice';
import { useAppSelector } from '../../store/hooks/useAppSelector';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<Call>>({});

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

    const columns = useMemo<Column<Call>[]>(() => [
        { Header: 'Call ID', accessor: 'callId' },
        { Header: 'Start Time', accessor: 'startTime' },
        { Header: 'End Time', accessor: 'endTime' },
        { Header: 'Receiver Telephone', accessor: 'receiverTelephone' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: any) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpen(row.original)}
                >
                    Update
                </Button>
            ),
        },
    ], []);

    const handleClickOpen = (call: Call) => {
        setSelectedCall(call);
        setUpdatedData(call); // Pre-fill the form with current data
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCall(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatedData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (selectedCall && updatedData) {
            try {
                const response = await updateCall(selectedCall.callId, updatedData);
                setCalls(calls.map(call => call.callId === selectedCall.callId ? response : call));
                setOpen(false);
            } catch (error) {
                console.error('Error updating call:', error);
                // Handle error (e.g., display a notification)
            }
        }
    };

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


            <Dialog open={open} onClose={handleClose}>
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
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ListAllCalls;

*/

/*
//import React, { useEffect, useMemo, useState } from 'react';

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
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { Call } from '../../store/types';
import { listCalls } from '../../services/CallService';
import { useAppDispatch } from '../../store/hooks/useAppDispatch';
import { fetchCalls } from '../../store/callsSlice';
import { useAppSelector } from '../../store/hooks/useAppSelector';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const columns = useMemo<Column<Call>[]>(() => [
        { Header: 'Call ID', accessor: 'callId' },
        { Header: 'Start Time', accessor: 'startTime' },
        { Header: 'End Time', accessor: 'endTime' },
        { Header: 'Receiver Telephone', accessor: 'receiverTelephone' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: any) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(row.original)}
                >
                    Update
                </Button>
            ),
        },
    ], []);

    const handleUpdate = (call: Call) => {
        // Logic to handle the update action
        console.log('Updating call:', call);
    };

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
        </Container>
    );
};

export default ListAllCalls;
*/
/*
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
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { Call } from "../../store/types";
import { listCalls } from "../../services/CallService";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { fetchCalls } from "../../store/callsSlice";
import { useAppSelector } from "../../store/hooks/useAppSelector";
import { COLUMNS } from '../tableColumns/callTableColumns';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const columns = useMemo(() => COLUMNS, []);
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


            <TextField
                label="Search Calls"
                variant="outlined"
                sx={{ width: '50%', mb: 4 }}
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                sx={{ mb: 2 }}
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
        </Container>
    );
};

export default ListAllCalls;
*/
/*
import React, { useEffect, useState } from 'react';
import { Call } from "../../store/types";
import { listCalls } from "../../services/CallService";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { fetchCalls } from "../../store/callsSlice";
import { useAppSelector } from "../../store/hooks/useAppSelector";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, TableFooter, TableSortLabel,
    Container
} from '@mui/material';

// Helper function to sort data
const sortData = (data: Call[], orderBy: string, order: 'asc' | 'desc') => {
    return data.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('callId');

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

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedCalls = sortData(calls, orderBy, order);

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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sortDirection={orderBy === 'callId' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'callId'}
                                direction={orderBy === 'callId' ? order : 'asc'}
                                onClick={() => handleRequestSort('callId')}
                            >
                                Call ID
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'startTime' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'startTime'}
                                direction={orderBy === 'startTime' ? order : 'asc'}
                                onClick={() => handleRequestSort('startTime')}
                            >
                                Start Time
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'endTime' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'endTime'}
                                direction={orderBy === 'endTime' ? order : 'asc'}
                                onClick={() => handleRequestSort('endTime')}
                            >
                                End Time
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'duration' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'duration'}
                                direction={orderBy === 'duration' ? order : 'asc'}
                                onClick={() => handleRequestSort('duration')}
                            >
                                Duration
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'user' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'user'}
                                direction={orderBy === 'user' ? order : 'asc'}
                                onClick={() => handleRequestSort('user')}
                            >
                                User
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === 'receiver' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'receiver'}
                                direction={orderBy === 'receiver' ? order : 'asc'}
                                onClick={() => handleRequestSort('receiver')}
                            >
                                Receiver
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedCalls.map((call) => (
                        <TableRow key={call.callId}>
                            <TableCell>{call.callId}</TableCell>
                            <TableCell>{call.startTime}</TableCell>
                            <TableCell>{call.endTime}</TableCell>
                            <TableCell>{call.duration}</TableCell>
                            <TableCell>{call.user.firstName} {call.user.lastName}</TableCell>
                            <TableCell>{call.receiver.fullName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>
                            <Typography variant="body2">Total Calls: {calls.length}</Typography>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>

        </Container>
    );
};

export default ListAllCalls;

*/

/*
import React, {useEffect, useState} from 'react';
import {Call} from "../../store/types";
import {listCalls} from "../../services/CallService";
import {useAppSelector} from "../../store/hooks/useAppSelector";
import {fetchCalls} from "../../store/callsSlice";
import {useAppDispatch} from "../../store/hooks/useAppDispatch";

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const [calls, setCalls] = useState<Call[]>([]);
   //const [call, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    //const calls = useAppSelector(state => state.calls.calls);
    //const [error, setError] = useState<string | null>(null);
    //const status = useAppSelector(state => state.calls.status);
    //const error = useAppSelector(state => state.calls.error);
    //const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching calls. Please try again.');
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/
/*
import React, { useEffect } from 'react';
import { fetchCalls } from '../../store/callsSlice';
import { useAppDispatch } from '../../store/hooks/useAppDispatch';  // Import typed hooks
import { useAppSelector } from '../../store/hooks/useAppSelector';

const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const calls = useAppSelector(state => state.calls.calls);
    const status = useAppSelector(state => state.calls.status);
    const error = useAppSelector(state => state.calls.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/
/*
import React, { useEffect } from 'react';
import { fetchCalls } from '../../store/callsSlice';
import { useAppDispatch } from '../../store/hooks/useAppDispatch';  // Import typed hooks
import { useAppSelector } from '../../store/hooks/useAppSelector';


const ListAllCalls: React.FC = () => {
    const dispatch = useAppDispatch();
    const calls = useAppSelector(state => state.calls.calls);
    const status = useAppSelector(state => state.calls.status);
    const error = useAppSelector(state => state.calls.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalls());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Call List</h2>
            <ul>
                {calls.map(call => (
                    <li key={call.callId}>
                        <p>Call ID: {call.callId}</p>
                        <p>Start Time: {call.startTime}</p>
                        <p>End Time: {call.endTime}</p>
                        <p>Duration: {call.duration}</p>
                        <p>User: {call.user.firstName} {call.user.lastName}</p>
                        <p>Receiver: {call.receiver.fullName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListAllCalls;
*/


/*

import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalls } from '../../store/callsSlice';
import { RootState } from '../../store/store';

const ListAllCalls: React.FC = () => {
    const dispatch = useDispatch<any>();
    const calls = useSelector((state: RootState) => state.calls.calls);
    const callsStatus = useSelector((state: RootState) => state.calls.status);
    const callsError = useSelector((state: RootState) => state.calls.error);
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;
    const role = storedUser ? JSON.parse(storedUser).role : null;

    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        if (callsStatus === 'idle') {
            dispatch(fetchCalls());
        }
    }, [callsStatus, dispatch]);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            {callsStatus === 'loading' && <Typography>Loading...</Typography>}
            {callsStatus === 'failed' && <Alert severity="error">{callsError}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver[0]?.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;
*/

/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
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
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
  //  const location = useLocation();
   // const message = location.state?.message;
    const { role } = useContext(AuthContext);
    //onst userId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;

    const dispatch = useDispatch<any>();
    const location = useLocation();
    const message = location.state && location.state.message;

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setCalls(response.data);
                } else {
                    throw new Error('Invalid data received from server');
                }
            } catch (error) {
                console.error('Error fetching calls:', error);
                // Optionally handle error state or show error message
                // setCalls([]); // Uncomment to reset calls to empty array on error
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {username && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;

*/

/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
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
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setCalls(response.data);
                } else {
                    throw new Error('Invalid data received from server');
                }
            } catch (error) {
                console.error('Error fetching calls:', error);
                // Optionally handle error state or show error message
                // setCalls([]); // Uncomment to reset calls to empty array on error
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {userId && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;
*/

/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
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
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response.data);
            } catch (error) {
                console.error('Error fetching calls:', error);
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <Alert severity="error">You don't have permission to access this page.</Alert>;
    }

    return (
        <Container>
            {message && <Alert severity="warning">{message}</Alert>}
            {userId && <Typography variant="h6" color="textSecondary" align="center">You are logged in as: {userId}</Typography>}
            <Typography variant="h4" align="center" gutterBottom>
                Call List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Call Id</TableCell>
                            <TableCell>Call Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Cost Per Second</TableCell>
                            <TableCell>Discount For Call</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Gross Cost</TableCell>
                            <TableCell>Net Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Call Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.callId}>
                                <TableCell>{call.callId}</TableCell>
                                <TableCell>{new Date(call.callDate).toLocaleDateString()}</TableCell>
                                <TableCell>{call.startTime}</TableCell>
                                <TableCell>{call.endTime}</TableCell>
                                <TableCell>{call.duration}</TableCell>
                                <TableCell>{call.costPerSecond}</TableCell>
                                <TableCell>{call.discountForCalls}</TableCell>
                                <TableCell>{call.vat}</TableCell>
                                <TableCell>{call.grossCost}</TableCell>
                                <TableCell>{call.netCost}</TableCell>
                                <TableCell>{call.status}</TableCell>
                                <TableCell>{`${call.user.firstName} ${call.user.lastName}`}</TableCell>
                                <TableCell>{call.receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListAllCalls;
*/


/*
import React, { useEffect, useState, useContext } from 'react';
import { listCalls } from '../../services/CallService';
import { AuthContext } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';


interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

interface Receiver {
    callReceiverId: number;
    telephone: string;
    user: User;
}

interface Call {
    id: number;
    callId: number;
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
    user: User;
    receiver: Receiver;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await listCalls();
                setCalls(response.data);
            } catch (error) {
                console.error('Error fetching calls:', error);
            }
        };

        fetchCalls();
    }, []);

    if (role !== 'ADMIN') {
        return <div>You don't have permission to access this page.</div>;
    }

    return (
        <div className="container">
            {message && <p className="text-warning px-5">{message}</p>}
            {userId && <h6 className="text-success text-center">You are logged in as: {userId}</h6>}
            <br /><br />
            <h2 className="text-center">Call List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Call Id</th>
                        <th>Call Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Cost Per Second</th>
                        <th>Discount For Call</th>
                        <th>VAT</th>
                        <th>Gross Cost</th>
                        <th>Net Cost</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Call Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {calls.map((call) => (
                        <tr key={call.callId}>
                            <td>{call.callId}</td>
                            <td>{new Date(call.callDate).toLocaleDateString()}</td>
                            <td>{call.startTime}</td>
                            <td>{call.endTime}</td>
                            <td>{call.duration}</td>
                            <td>{call.costPerSecond}</td>
                            <td>{call.discountForCalls}</td>
                            <td>{call.vat}</td>
                            <td>{call.grossCost}</td>
                            <td>{call.netCost}</td>
                            <td>{call.status}</td>
                            <td>{`${call.user.firstName} ${call.user.lastName}`}</td>
                            <td>{call.receiver.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAllCalls;
*/

/*
interface Call {
    id: number;
    callId: string;
    startTime: string;
    endTime: string;
    duration: number;
    costPerSecond: number;
    discountForCalls: number;
    vat: number;
    netCost: number;
    grossCost: number;
    userId: number;
    callReceiver: number;
    status: string;
}

const ListAllCalls: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const location = useLocation();
    const message = location.state?.message;
    const { role } = useContext(AuthContext);
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    console.log("list calls user role ", userRole);

    if (role !== "ADMIN") {
        return <div>You don't have permission to access this page.</div>;
    }

    useEffect(() => {
        listCalls()
            .then((response) => {
                setCalls(response.data);
            })
            .catch((error) => {
                console.error('Error fetching calls:', error);
            });
    }, []);

    return (
        <div className='container'>
            {message && <p className='text-warning px-5'>{message}</p>}
            {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
            <br /><br />
            <h2 className='text-center'>Call list</h2>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Call Id</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Cost Per Second</th>
                        <th>Discount For Call</th>
                        <th>VAT</th>
                        <th>Gross Cost</th>
                        <th>Net Cost</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Call Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {calls.map((call) => (
                        <tr key={call.callId}>
                            <td>{call.callId}</td>
                            <td>{call.startTime}</td>
                            <td>{call.endTime}</td>
                            <td>{call.duration}</td>
                            <td>{call.costPerSecond}</td>
                            <td>{call.discountForCalls}</td>
                            <td>{call.vat}</td>
                            <td>{call.grossCost}</td>
                            <td>{call.netCost}</td>
                            <td>{call.status}</td>
                            <td>{call.userId}</td>
                            <td>{call.callReceiver}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default ListAllCalls;
*/