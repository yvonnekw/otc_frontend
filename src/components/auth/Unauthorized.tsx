
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Unauthorized: React.FC = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h5" align="center" color="error">
                You are not authorized to access this page.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Go to Homepage
            </Button>
        </Container>
    );
};

export default Unauthorized;


/*
import React from 'react';

const Unauthorized: React.FC = () => {
    return <div>You are not authorized to access this page.</div>;
};

export default Unauthorized;

*/