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