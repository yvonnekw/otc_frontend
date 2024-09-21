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

/*
import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
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

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleActionClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };
/*
    const handleUpdate = async () => {
        if (selectedUser) {
            try {
                await updateUserByUsername(selectedUser.username!);
                setSuccessMessage(`User with username "${selectedUser.username!}" updated successfully!`);
            } catch (error) {
                setError(`Error updating user with username "${selectedUser.username}": ${error.message}`);
            }
        }
        handleCloseDialog();
    };/*/
/*
    const handleUpdate = async () => {
        if (selectedUser) {
            try {

                await updateUserByUsername(selectedUser.username!, selectedUser);

                const updatedUsers = users.map((user) =>
                    user.username === selectedUser.username ? selectedUser : user
                );
                setUsers(updatedUsers);

                setSuccessMessage(`User with username "${selectedUser.username}" updated successfully!`);
            } catch (error) {
                setError(`Error updating user with username "${selectedUser.username}": ${error.message}`);
            }
        }
        handleCloseDialog();
    };


    const handleDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUserByUsername(selectedUser.username!);

                const updatedUsers = users.filter(user => user.username !== selectedUser.username);
                setUsers(updatedUsers);
                setSuccessMessage(`User with username "${selectedUser.username}" deleted successfully!`);
                handleCloseDeleteDialog();
            } catch (error) {
                setError(`Error deleting user with username "${selectedUser.username}": ${error.message}`);
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
                username: string, p0: {firstName: string; lastName: string; emailAddress: string; telephone:string}',
                accessor: 'actions',
                Cell: ({ row }: { row: any }) => (
                    <>
                        <Button
                            color="primary"
                            onClick={() => handleActionClick(row.original)}
                            data-testid={`update-button-${row.original.userId}`}
                        >
                            <FaEdit />
                            Update
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => handleDeleteClick(row.original)}
                            data-testid={`delete-button-${row.original.userId}`}
                        >
                            <FaTrashAlt />
                            Delete
                        </Button>
                    </>
                ),
            },
        ],
        []
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


            <Dialog open={dialogOpen} onClose={handleCloseDialog} data-testid="update-dialog">
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.username || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                username: e.target.value,
                            }));
                        }}
                        data-testid="update-username"
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.firstName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                firstName: e.target.value,
                            }));
                        }}
                        data-testid="update-firstName"
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.lastName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                lastName: e.target.value,
                            }));
                        }}
                        data-testid="update-lastName"
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.emailAddress || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                emailAddress: e.target.value,
                            }));
                        }}
                        data-testid="update-emailAddress"
                    />
                    <TextField
                        label="Telephone"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.telephone || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                telephone: e.target.value,
                            }));
                        }}
                        data-testid="update-telephone"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" data-testid="cancel-update-button">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary" variant="contained" data-testid="confirm-update-button">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} data-testid="delete-dialog">
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete user ID: {selectedUser?.userId}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary" data-testid="cancel-delete-button">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" variant="contained" data-testid="confirm-delete-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserList;
*/


/*
import React, { useState, useEffect, ChangeEvent } from 'react';
import {deleteUserByUsername, getAllUsers, updateUserByUsername} from '../../services/UserService';
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

    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
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

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleActionClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

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
            try {
                await updateUserByUsername(selectedUser!.username!);
                console.log('Updating user with username:', selectedUser.username);

                setSuccessMessage(`User with username "${selectedUser.username}" updated successfully!`);
            } catch (error) {
                setError(`Error updating user with username "${selectedUser.username}": ${error.message}`);
            }
        }
        handleCloseDialog();
    };

    const handleDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUserByUsername(selectedUser!.username!);

                const updatedUsers = users.filter(user => user.username !== selectedUser.username);
                setUsers(updatedUsers);
                setSuccessMessage(`User with username "${selectedUser.username}" deleted successfully!`);
                handleCloseDeleteDialog();
            } catch (error) {
                setError(`Error deleting user with username "${selectedUser.username}": ${error.message}`);
            }
        }
    };

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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
            <Typography variant="h4" gutterBottom align='center'>
                User List
            </Typography>
            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
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
            />
            <TableContainer component={Paper} data-testid="user-table-container">
                <Table data-testid="user-table">
                    <TableHead>
                        <TableRow data-testid="table-header-row">
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'userId'}
                                    direction={orderBy === 'userId' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('userId')}
                                    data-testid="sort-userId"
                                >
                                    User ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'username'}
                                    direction={orderBy === 'username' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('username')}
                                    data-testid="sort-username"
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell data-testid="actions-header">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody data-testid="table-body">
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId} data-testid={`user-row-${user.userId}`}>
                                <TableCell data-testid={`user-id-${user.userId}`}>{user.userId}</TableCell>
                                <TableCell data-testid={`username-${user.userId}`}>{user.username}</TableCell>
                                <TableCell data-testid={`actions-${user.userId}`}>
                                    <Button
                                        color="primary"
                                        startIcon={<FaEdit />}
                                        onClick={() => handleActionClick(user)}
                                        sx={{ marginRight: 1 }}
                                        data-testid={`update-button-${user.userId}`}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        color="secondary"
                                        startIcon={<FaTrashAlt />}
                                        onClick={() => handleDeleteClick(user)}
                                        data-testid={`delete-button-${user.userId}`}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.username || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                username: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.firstName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                firstName: e.target.value,
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
                <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete user ID: {selectedUser?.userId}?
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

export default UserList;
*/
/*
import React, { useState, useEffect, ChangeEvent } from 'react';
import { deleteUserByUsername, getAllUsers } from '../../services/UserService';
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
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('userId');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
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

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleActionClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = () => {
        if (selectedUser) {
            // Implement your update logic here
            console.log('Updating user with ID:', selectedUser.userId);
        }
        handleCloseDialog();
    };

    const handleDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUserByUsername(selectedUser!.username!);
                // Refresh the user list after deletion
                const updatedUsers = users.filter(user => user.username !== selectedUser.username);
                setUsers(updatedUsers);
                handleCloseDeleteDialog();
            } catch (error) {
                setError(`Error deleting user: ${error.message}`);
            }
        }
    };

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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
                User List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'userId'}
                                    direction={orderBy === 'userId' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('userId')}
                                >
                                    User ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'username'}
                                    direction={orderBy === 'username' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('username')}
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        startIcon={<FaEdit />}
                                        onClick={() => handleActionClick(user)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        color="secondary"
                                        startIcon={<FaTrashAlt />}
                                        onClick={() => handleDeleteClick(user)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.username || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                username: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.firstName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                firstName: e.target.value,
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
                <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete user ID: {selectedUser?.userId}?
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

export default UserList;
*/
/*
import React, { useState, useEffect, ChangeEvent } from 'react';
import {deleteUserByUsername, getAllUsers } from '../../services/UserService';
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
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('userId');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect( () => {
        const fetchUser = async () =>{
            try {
                const response = deleteUserByUsername()

            }catch(error) {
                throw(error.message());
            }
        }

        fetchUser();
    }, []);

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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

    const handleSort = (property: keyof User) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleActionClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = () => {
        if (selectedUser) {
            // Implement your update logic here
            console.log('Updating user with ID:', selectedUser.userId);
        }
        handleCloseDialog();
    };

    const handleDelete = () => {
        if (selectedUser) {
            // Implement delete logic here
            console.log('Deleting user with ID:', selectedUser.userId);
        }
        handleCloseDeleteDialog();
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                User List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'userId'}
                                    direction={orderBy === 'userId' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('userId')}
                                >
                                    User ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'username'}
                                    direction={orderBy === 'username' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('username')}
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        startIcon={<FaEdit />}
                                        onClick={() => handleActionClick(user)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        color="secondary"
                                        startIcon={<FaTrashAlt />}
                                        onClick={() => handleDeleteClick(user.username)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.username || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                username: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.firstName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                firstName: e.target.value,
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
                <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete user ID: {selectedUser?.userId}?
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

export default UserList;
*/
/*
import React, {useState, useEffect, ChangeEvent} from 'react';
import {getAllUsers, User} from '../../services/UserService';
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
import {Authority} from '../../store/types';

type SortDirection = 'asc' | 'desc';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('userId');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (role !== 'ADMIN') {
        return (
            <Container sx={{mt: 5}}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container sx={{mt: 5, display: 'flex', justifyContent: 'center'}}>
                <CircularProgress/>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{mt: 5}}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const handleSort = (property: keyof User) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleActionClick = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = () => {
        if (selectedUser) {
            // Implement your update logic here
            console.log('Updating user with ID:', selectedUser.userId);
        }
        handleCloseDialog();
    };

    return (
        <Container sx={{mt: 5}}>
            <Typography variant="h4" gutterBottom>
                User List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                sx={{width: '50%', mb: 2}}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'userId'}
                                    direction={orderBy === 'userId' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('userId')}
                                >
                                    User ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'username'}
                                    direction={orderBy === 'username' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('username')}
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'firstName'}
                                    direction={orderBy === 'firstName' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('firstName')}
                                >
                                    First Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'lastName'}
                                    direction={orderBy === 'lastName' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('lastName')}
                                >
                                    Last Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'emailAddress'}
                                    direction={orderBy === 'emailAddress' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('emailAddress')}
                                >
                                    Email Address
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'telephone'}
                                    direction={orderBy === 'telephone' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('telephone')}
                                >
                                    Telephone
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'authorities'}
                                    direction={orderBy === 'authorities' ? sortDirection : 'asc'}
                                    onClick={() => handleSort('authorities')}
                                >
                                    Roles
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.telephone || '-'}</TableCell>
                                <TableCell>
                                    {user.authorities && user.authorities.length > 0
                                        ? user.authorities.map((auth: Authority) => auth.authority).join(', ')
                                        : 'No roles'}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleActionClick(user)}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="update-dialog-title"
            >
                <DialogTitle id="update-dialog-title">Update User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please update the details for user ID: {selectedUser?.userId}
                    </DialogContentText>

                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.username || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                username: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.firstName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                firstName: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.lastName || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                lastName: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.emailAddress || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                emailAddress: e.target.value,
                            }));
                        }}
                    />
                    <TextField
                        label="Telephone"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={selectedUser?.telephone || ''}
                        onChange={(e) => {
                            setSelectedUser((prev) => ({
                                ...prev!,
                                telephone: e.target.value,
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

export default UserList;
*/
/*
import React, { useState, useEffect } from 'react';
import { getAllUsers, User } from '../../services/UserService';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField, TableSortLabel } from '@mui/material';
import { Authority } from '../../store/types';

type SortDirection = 'asc' | 'desc';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('userId');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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

    const handleSort = (property: keyof User) => {
        const isAsc = orderBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const columns = [
        { field: 'userId', headerName: 'User ID', width: 100 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'emailAddress', headerName: 'Email Address', width: 200 },
        { field: 'telephone', headerName: 'Telephone', width: 150 },
        {
            field: 'authorities',
            headerName: 'Roles',
            width: 200,
            valueGetter: (params: GridValueGetterParams<User>) => {
                return params.row?.authorities?.map((auth: Authority) => auth.authority).join(', ') || 'No roles';
            },
        },
    ];

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                User List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                sx={{ width: '50%', mb: 2 }}
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.field}>
                                    <TableSortLabel
                                        active={orderBy === column.field}
                                        direction={orderBy === column.field ? sortDirection : 'asc'}
                                        onClick={() => handleSort(column.field as keyof User)}
                                    >
                                        {column.headerName}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.telephone || '-'}</TableCell>
                                <TableCell>
                                    {user.authorities && user.authorities.length > 0
                                        ? user.authorities.map((auth: Authority) => auth.authority).join(', ')
                                        : 'No roles'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserList;
*/
/*
import React, { useState, useEffect } from 'react';
import { getAllUsers, User } from '../../services/UserService';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { Authority } from '../../store/types';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const storedUser = localStorage.getItem('user');
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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
                User List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Telephone</TableCell>
                            <TableCell>Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.telephone || '-'}</TableCell>
                                <TableCell>
                                    {user.authorities && user.authorities.length > 0
                                        ? user.authorities.map((auth: Authority) => auth.authority).join(', ')
                                        : 'No roles'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserList;

*/


/*
import React, { useState, useEffect } from 'react';
import { getAllUsers, User } from '../../services/UserService';
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
    TableRowProps,
} from '@mui/material';

interface Authority {
    authority: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortColumn, setSortColumn] = useState<string>('userId');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const storedUser = localStorage.getItem('user');
    //const username = storedUser ? JSON.parse(storedUser).username : null;
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log('Fetched users: ', response);
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (column: string) => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (a[sortColumn as keyof User] < b[sortColumn! as keyof User]) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (a[sortColumn as keyof User] > b[sortColumn as keyof User]) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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
                User List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'userId'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('userId')}
                                >
                                    User ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'username'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('username')}
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'firstName'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('firstName')}
                                >
                                    First Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'lastName'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('lastName')}
                                >
                                    Last Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'emailAddress'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('emailAddress')}
                                >
                                    Email Address
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortColumn === 'telephone'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('telephone')}
                                >
                                    Telephone
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.telephone || '-'}</TableCell>
                                <TableCell>{user.authorities.map((auth: Authority) => auth.authority).join(', ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserList;
*/
/*
import React, { useState, useEffect } from 'react';
import { getAllUsers, User } from '../../services/UserService';

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
} from '@mui/material';

interface Authority {
    authority: string;
}
/*
interface User {
    userId: number;
   // username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephone?: string | null;
    authorities: Authority[];
}*/
/*
const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;
    const role = storedUser ? JSON.parse(storedUser).role : null;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log('Fetched users: ', response);
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (role !== 'ADMIN') {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">You don't have permission to access this page.</Alert>
            </Container>
        );
    }

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
                User List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Telephone</TableCell>
                            <TableCell>Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.telephone || '-'}</TableCell>
                                <TableCell>{user.authorities.map((auth: { authority: any; }) => auth.authority).join(', ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserList;
*/
/*
import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers } from '../../services/UserService';
import { AuthContext } from '../auth/AuthProvider';

interface Authority {
    authority: string;
}

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephone?: string | null;
    authorities: Authority[];
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { role } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                console.log("Fetched users: ", response);
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (role !== "ADMIN") {
        return <div>You don't have permission to access this page.</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>User List</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Telephone</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.emailAddress}</td>
                            <td>{user.telephone || '-'}</td>
                            <td>{user.authorities.map((auth) => auth.authority).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
*/