import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ListAllCalls from '../calls/ListAllCalls';
import { AuthContext } from '../auth/AuthProvider';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';

const AdminUI: React.FC = () => {
  const { role } = useContext(AuthContext);


  if (role !== 'ADMIN') {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">You don't have permission to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Admin Panel
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={3}>
        <Button variant="contained" color="primary" component={Link} to="/get-all-calls">
          Manage Calls
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/get-all-invoices">
          Manage Invoices
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/get-all-payments">
          Manage Payments
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/get-all-users">
          Manage Users
        </Button>
      </Box>
      <Box mt={5}>
        <ListAllCalls />
      </Box>
    </Container>
  );
}

export default AdminUI;



/*
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import ListAllCalls from '../calls/ListAllCalls'
import { AuthContext } from '../auth/AuthProvider';

const AdminUI: React.FC = () => {
  const { role } = useContext(AuthContext);

  // Render the page only if the user has the admin role
  if (role !== "ADMIN") {
    return <div>You don't have permission to access this page.</div>;
  }

  return (
    <>
      <section className='container mt-5'>
        <h2>Welcome to the Admin Panel</h2>
      </section>
      <Link to={"/get-all-calls"}>
        Manage Calls
      </Link>
      <br></br>
      <Link to={"/get-all-invoices"}>
        Manage invoices
      </Link>
      <br></br>
      <Link to={"/get-all-payments"}>
        Manage Payments
      </Link>
      <br></br>
      <Link to={"/get-all-users"}>
        Manage Users
      </Link>
      <div>
        <ListAllCalls />
      </div>
    </>
  );
}

export default AdminUI;

*/