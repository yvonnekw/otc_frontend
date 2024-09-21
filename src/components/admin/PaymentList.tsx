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
import { Payment } from '../../store/types';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const columns = useMemo<Column<Payment>[]>(() => [
        { Header: 'Payment ID', accessor: 'paymentId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Date', accessor: 'paymentDate' },
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

    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { globalFilter },
        setGlobalFilter,  // this is correctly obtained from useTable
    } = useTable<Payment>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    // Update button click handler
    const handleUpdateClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
    };

    // Close update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPayment(null);
    };

    // Update logic
    const handleUpdate = () => {
        console.log('Updating payment with ID:', selectedPayment?.paymentId);
        handleCloseDialog();
    };

    // Delete button click handler
    const handleDeleteClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedPayment(null);
    };

    // Delete logic
    const handleDelete = () => {
        console.log('Deleting payment with ID:', selectedPayment?.paymentId);
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
                Payment List
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
                        Please update the details for payment ID: {selectedPayment?.paymentId}
                    </DialogContentText>
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.amount || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
                                ...prev!,
                                amount: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.status || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
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
                        Are you sure you want to delete payment ID: {selectedPayment?.paymentId}?
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

export default PaymentList;



/*
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
    IconButton,
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
import { Payment } from '../../store/types';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Define columns including the Action column
    const columns = useMemo<Column<Payment>[]>(() => [
        { Header: 'Payment ID', accessor: 'paymentId' },
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

    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<Payment>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    // Update button click handler
    const handleUpdateClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
    };

    // Close update dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPayment(null);
    };

    // Update logic
    const handleUpdate = () => {
        console.log('Updating payment with ID:', selectedPayment?.paymentId);
        handleCloseDialog();
    };

    // Delete button click handler
    const handleDeleteClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDeleteDialogOpen(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedPayment(null);
    };

    // Delete logic
    const handleDelete = () => {
        console.log('Deleting payment with ID:', selectedPayment?.paymentId);
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
                Payment List
            </Typography>

            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
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
                        Please update the details for payment ID: {selectedPayment?.paymentId}
                    </DialogContentText>
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.amount || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
                                ...prev!,
                                amount: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.status || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
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
                        Are you sure you want to delete payment ID: {selectedPayment?.paymentId}?
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

export default PaymentList;
*/
/*
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
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { getPayments } from '../../services/PaymentService';
import { Payment } from '../../store/types';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Define columns including the Action column
    const columns = useMemo<Column<Payment>[]>(() => [
        { Header: 'Payment ID', accessor: 'paymentId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: { row: any }) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleActionClick(row.original)}
                >
                    Update
                </Button>
            ),
        },
    ], []);

    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<Payment>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    const handleActionClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPayment(null);
    };

    const handleUpdate = () => {
        // Implement your update logic here
        console.log('Updating payment with ID:', selectedPayment?.paymentId);
        // Close the dialog after update
        handleCloseDialog();
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
                Payment List
            </Typography>


            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
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
                        Please update the details for payment ID: {selectedPayment?.paymentId}
                    </DialogContentText>

                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.amount || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
                                ...prev!,
                                amount: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedPayment?.status || ''}
                        onChange={(e) => {
                            setSelectedPayment((prev) => ({
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
        </Container>
    );
};

export default PaymentList;

*/


/*
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
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { getPayments } from '../../services/PaymentService';
import { Payment } from '../../store/types';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Define columns including the Action column
    const columns = useMemo<Column<Payment>[]>(() => [
        { Header: 'Payment ID', accessor: 'paymentId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Actions',
            Cell: ({ row }: { row: any }) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleActionClick(row.original)}
                >
                    Update
                </Button>
            ),
        },
    ], []);

    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<Payment>(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter } = state;

    const handleActionClick = (payment: Payment) => {
        // Implement the action here, such as navigating to an update page or opening a modal
        console.log('Payment ID:', payment.paymentId);
        // Example: Redirect to an update form or show a modal
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
                Payment List
            </Typography>


            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
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
        </Container>
    );
};

export default PaymentList;
*/


/*
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
} from '@mui/material';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import { getPayments } from '../../services/PaymentService';
import { Payment } from '../../store/types';
import { COLUMNS } from '../tableColumns/paymentTableColumns';

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => payments, [payments]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable<Payment>(
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
                Payment List
            </Typography>


            <TextField
                label="Search Payments"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
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
        </Container>
    );
};

export default PaymentList;
*/
/*
import React, { useState, useEffect } from 'react';
import { getPayments } from '../../services/PaymentService';
import { Payment } from '../../store/types';

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
} from '@mui/material';

const PaymentRow: React.FC<{ payment: Payment }> = ({ payment }) => (
    <TableRow key={payment.paymentId}>
        <TableCell>{payment.paymentId}</TableCell>
        <TableCell>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</TableCell>
        <TableCell>{payment.amount}</TableCell>
        <TableCell>{payment.paymentDate}</TableCell>
        <TableCell>{payment.cardNumber ? payment.cardNumber.slice(-4) : 'N/A'}</TableCell>
        <TableCell>{payment.status}</TableCell>
        <TableCell>
            {payment.invoice?.calls[0]?.user
                ? `${payment.invoice.calls[0].user.firstName} ${payment.invoice.calls[0].user.lastName}`
                : 'N/A'}
        </TableCell>
        <TableCell>{payment.invoice?.calls[0]?.receiver?.telephone || 'N/A'}</TableCell>
    </TableRow>
);

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

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
                Payment List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Invoice ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Card Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <PaymentRow key={payment.paymentId} payment={payment} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PaymentList;
*/
/*
import React, { useState, useEffect } from 'react';
import { getPayments } from '../../services/PaymentService';
import { Payment, InvoiceData, Call, User, Receiver} from '../../store/types';

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
} from '@mui/material';
/*
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
}*/
/*
interface Call {
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
}*/
/*
interface Invoice {
    invoiceId: number;
    invoiceDate: string;
    status: string;
    totalAmount: number;
    calls: Call[];
}*/


/*
const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
   // const { role } = useContext(AuthContext);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

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
                Payment List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Invoiced ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Card Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Receiver</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.paymentId}>
                                <TableCell>{payment.paymentId}</TableCell>
                                <TableCell>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.paymentDate}</TableCell>
                                <TableCell>{payment.cardNumber.slice(-4)}</TableCell>
                                <TableCell>{payment.status}</TableCell>
                                <TableCell>{`${payment!.invoice!.calls[0]!.user.firstName} ${payment.invoice.calls[0].user.lastName}`}</TableCell>
                                <TableCell>{payment.invoice.calls[0].receiver.telephone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PaymentList;
*/
/*
import React, { useState, useEffect, useContext } from 'react';
import { getPayments } from '../../services/PaymentService'; 
import { AuthContext } from '../auth/AuthProvider';


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

interface AdminInvoiceTable {
    invoiceId: number;
    invoiceDate: string;
    status: string;
    totalAmount: number;
    calls: Call[];
}

interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    fullNameOnPaymentCard: string;
    cardNumber: string;
    expiringDate: string;
    issueNumber: string;
    securityNumber: string;
    status: string;
    invoice: AdminInvoiceTable;
}

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.');
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Payment List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Invoiced ID</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>Card Number</th>
                        <th>Status</th>
                        <th>User</th>
                        <th>Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                            <td>{payment.paymentId}</td>
                            <td>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.paymentDate}</td>
                            <td>{payment.cardNumber.slice(-4)}</td>
                            <td>{payment.status}</td>
                            <td>{`${payment.invoice.calls[0].user.firstName} ${payment.invoice.calls[0].user.lastName}`}</td>
                            <td>{payment.invoice.calls[0].receiver.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;
*/

/*
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

interface Payment {
    paymentId: number;
    amount: number;
    paymentDate: string;
    cardNumber: string;
    invoice: {
        invoiceId: string;
    };
    user: User;
    receiver: Receiver;
    status: string
}

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    // Render the page only if the user has the admin role
    if (role !== "ADMIN") {
        return <div>You don't have permission to access this page.</div>;
    }

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments(); 
                setPayments(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching payments. Please try again.'); 
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div>
            <h2>Payment List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Paymemt ID</th>
                        <th>Invoiced ID</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>status</th>
                        <th>Payment Details</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                            <td>{payment.paymentId}</td>
                            <td>{payment.invoice ? payment.invoice.invoiceId : 'N/A'}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.paymentDate}</td>
                            <td>{payment.status}</td>
                            <td>{payment.cardNumber.slice(-4)}</td>
                            <td>{`${payment.user.firstName} ${payment.user.lastName}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;

*/