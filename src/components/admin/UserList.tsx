import React, { useState, useEffect, ChangeEvent, useMemo, useCallback } from 'react';
import { deleteUserByUsername, getAllUsers, updateUserByUsername } from '../../services/UserService';
import { User } from '../../store/types';
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
    CircularProgress,
    Alert,
    TextField,
    TableSortLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
} from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

type SortDirection = 'asc' | 'desc';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('userId');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
            } catch (error) {
                setError('Error fetching users. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSort = (property: keyof User) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            Object.values(user).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [users, searchTerm]);

    const sortedUsers = useMemo(() => {
        return filteredUsers.slice().sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return sortDirection === 'asc' ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, orderBy, sortDirection]);

    const handleActionClick = useCallback((user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    }, []);

    const handleDeleteClick = useCallback((user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    }, []);

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = async () => {
        if (selectedUser) {
            setIsActionLoading(true);
            try {
                await updateUserByUsername(selectedUser.username!, selectedUser);

                console.log("What is being updated ", selectedUser)
                // Update local users list
                const updatedUsers = users.map((user) =>
                    user.username === selectedUser.username ? selectedUser : user
                );
                setUsers(updatedUsers);

                setSuccessMessage(`User with username "${selectedUser.username}" updated successfully!`);
            } catch (error: any) {
                setError(`Error updating user with username "${selectedUser.username}": ${error.message}`);
            } finally {
                setIsActionLoading(false);
                handleCloseDialog();
            }
        }
    };

    const handleDelete = async () => {
        if (selectedUser) {
            setIsActionLoading(true);
            try {
                await deleteUserByUsername(selectedUser.username!);

                // Update local users list
                const updatedUsers = users.filter((user) => user.username !== selectedUser.username);
                setUsers(updatedUsers);

                setSuccessMessage(`User with username "${selectedUser.username}" deleted successfully!`);
                handleCloseDeleteDialog();
            } catch (error: any) {
                setError(`Error deleting user with username "${selectedUser.username}": ${error.message}`);
            } finally {
                setIsActionLoading(false);
            }
        }
    };

    const columns = useMemo(
        () => [
            { Header: 'User ID', accessor: 'userId' },
            { Header: 'Username', accessor: 'username' },
            { Header: 'First Name', accessor: 'firstName' },
            { Header: 'Last Name', accessor: 'lastName' },
            { Header: 'Email Address', accessor: 'emailAddress' },
            { Header: 'Telephone', accessor: 'telephone' },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ row }: { row: any }) => (
                    <>
                        <Button
                            color="primary"
                            onClick={() => handleActionClick(row.original)}
                            data-testid={`update-button-${row.original.userId}`}
                        >
                            <FaEdit /> Update
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => handleDeleteClick(row.original)}
                            data-testid={`delete-button-${row.original.userId}`}
                        >
                            <FaTrashAlt /> Delete
                        </Button>
                    </>
                ),
            },
        ],
        [handleActionClick, handleDeleteClick]
    );

    if (loading) {
        return (
            <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress data-testid="loading-spinner" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error" data-testid="error-message">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align='center'>
                User List
            </Typography>
            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} data-testid="success-message">
                    {successMessage}
                </Alert>
            )}
            <TextField
                label="Search"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                data-testid="search-field"
            />
            <TableContainer component={Paper} data-testid="user-table-container">
                <Table data-testid="user-table">
                    <TableHead data-testid="table-header">
                        <TableRow data-testid="table-header-row">
                            {columns.map((column) => (
                                <TableCell key={column.Header} data-testid={`header-${column.Header}`}>
                                    {column.Header !== 'Actions' ? (
                                        <TableSortLabel
                                            active={orderBy === column.accessor}
                                            direction={orderBy === column.accessor ? sortDirection : 'asc'}
                                            onClick={() => handleSort(column.accessor as keyof User)}
                                            data-testid={`sort-${column.accessor}`}
                                        >
                                            {column.Header}
                                        </TableSortLabel>
                                    ) : (
                                        column.Header
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody data-testid="table-body">
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId} data-testid={`user-row-${user.userId}`}>
                                {columns.map((column) => (
                                    <TableCell key={column.accessor} data-testid={`user-${column.accessor}-${user.userId}`}>
                                        {column.accessor !== 'actions' ? (
                                            user[column.accessor as keyof User]
                                        ) : (
                                            column.Cell({ row: { original: user } })
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Update Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} data-testid="update-dialog">
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>
                    {selectedUser && (
                        <>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={selectedUser.username || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                data-testid="update-username"
                            />
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={selectedUser.firstName || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                data-testid="update-firstName"
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={selectedUser.lastName || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                data-testid="update-lastName"
                            />
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={selectedUser.emailAddress || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, emailAddress: e.target.value })}
                                data-testid="update-emailAddress"
                            />
                            <TextField
                                label="Telephone"
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                value={selectedUser.telephone || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, telephone: e.target.value })}
                                data-testid="update-telephone"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary" data-testid="cancel-update-button">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        color="primary"
                        variant="contained"
                        disabled={isActionLoading}
                        data-testid="confirm-update-button"
                    >
                        {isActionLoading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} data-testid="delete-dialog">
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user with username "{selectedUser?.username}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="secondary" data-testid="cancel-delete-button">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="primary"
                        variant="contained"
                        disabled={isActionLoading}
                        data-testid="confirm-delete-button"
                    >
                        {isActionLoading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserList;
