import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';
import { Container, Card, Typography } from '@mui/material';

const NewTelephoneNumberPage: React.FC = () => {
    //const userData = useSelector((state: RootState) => state.user.user);
    //const username = userData ? userData.username : "";

    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;

    console.log('Username from Redux:', username);

    const handleSuccess = () => {
        console.log('New telephone number added successfully!');
    };

    return (
        <Container maxWidth="sm">
            <Card variant="outlined" sx={{ mt: 5, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Telephone Number
                </Typography>
                <NewTelephoneNumberForm onSuccess={handleSuccess} username={username} />
            </Card>
        </Container>
    );
};

export default NewTelephoneNumberPage;
