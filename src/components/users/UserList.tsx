import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers, User } from '../../services/UserService';
import { AuthContext } from '../auth/AuthProvider';
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