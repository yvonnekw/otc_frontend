import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';
import { Container, Card, Typography } from '@mui/material';

const NewTelephoneNumberPage: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.user);
    const username = userData ? userData.username : "";

    const handleSuccess = () => {
        console.log('New telephone number added successfully!');
    };

    return (
        <Container maxWidth="sm">
            <Card variant="outlined" sx={{ mt: 5, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Telephone Number
                </Typography>
                <NewTelephoneNumberForm onSuccess={handleSuccess} user={username} />
            </Card>
        </Container>
    );
};

export default NewTelephoneNumberPage;


/*
import React from 'react';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';
import { Container, Card, Typography } from '@mui/material';

const NewTelephoneNumberPage: React.FC = () => {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).username : null;
    const handleSuccess = () => {
        console.log('New telephone number added successfully!');
    };

    return (
        <Container maxWidth="sm">
            <Card variant="outlined" sx={{ mt: 5, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Telephone Number
                </Typography>
                <NewTelephoneNumberForm onSuccess={handleSuccess} user={username} />
            </Card>
        </Container>
    );
};

export default NewTelephoneNumberPage;

*/

/*
import React from 'react';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';

const NewTelephoneNumberPage: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const handleSuccess = () => {
       
        console.log('New telephone number added successfully!');
    };

    return (
        <section className='container col-6 mt-5 mb-5'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h1>Add New Telephone Number</h1>
                        <NewTelephoneNumberForm onSuccess={handleSuccess} user={currentUser} />
                </div>
            </div>
        </section>
    );
};

export default NewTelephoneNumberPage;

*/