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
                console.log("Fetched users: ", response); // Log the fetched users
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
