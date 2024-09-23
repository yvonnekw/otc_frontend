import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const NotFound: React.FC = () => {
    return (
        <Container sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h1" gutterBottom>
                Not Found
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Go to Homepage
            </Button>
        </Container>
    );
};

export default NotFound;
