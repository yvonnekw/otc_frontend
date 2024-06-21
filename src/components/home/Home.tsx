import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const Home: React.FC = () => {
  const location = useLocation();
  const message = location.state && location.state.message;
  const currentUser = localStorage.getItem('userId');

  return (
    <section>
      {message && (
        <Typography variant="body2" color="warning" align="center" sx={{ px: 5 }}>
          {message}
        </Typography>
      )}

      <Container sx={{ mt: 5 }}>
        <Typography variant="h1" align="center" gutterBottom>
          Welcome to Optical Telephone Company
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Optical Telephone Company platform where you can initiate and manage calls easily.
        </Typography>

        <div style={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Get Started
          </Typography>
          <Typography variant="body1" paragraph>
            New to Your App Name? Register now to get started!
          </Typography>
          <Button component={Link} to="/register" variant="contained" color="primary" sx={{ mb: 2 }}>
            Register
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography variant="h3" gutterBottom>
            Already have an account?
          </Typography>
          <Typography variant="body1" paragraph>
            Log in to access your dashboard and initiate calls.
          </Typography>
          <Button component={Link} to="/login" variant="outlined" color="primary" sx={{ mb: 2 }}>
            Login
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Home;

/*
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const message = location.state && location.state.message;
  const currentUser = localStorage.getItem("userId");

  return (
    <section>
      {message && <p className='text-warning px-5'>{message}</p>}
      
      <div className="container mt-5">
        <h1 className="mb-4" >Welcome to Optical Telephone Company</h1>
        <p className="lead">
          Optical Telephone Company platform where you can initiate and manage calls easily.
        </p>
        <div className="my-4">
          <h2>Get Started</h2>
          <p>New to Your App Name? Register now to get started!</p>
          <Link to="/register" className="mb-2 md-mb-0">Register</Link>
        </div>

        <div className="my-4">
          <h2>Already have an account?</h2>
          <p>Log in to access your dashboard and initiate calls.</p>
          <Link to="/login" className="mb-2 md-mb-0">Login</Link>
        </div>
      </div>
    </section>
  );
};

export default Home;

*/