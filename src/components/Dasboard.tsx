import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToCallHistory = () => {
    navigate('/call-history');
  };

  const makeNewCall = () => {
    navigate('/make-call');
  };

  return (
    <Container>
      <br /><br />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Welcome to Your Dashboard
              </Typography>
              <Typography variant="body1" paragraph>
                You can perform various actions and view your information here.
              </Typography>

              <Card variant="outlined" sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h5">
                    User Profile
                  </Typography>
                  <Typography variant="body2" paragraph>
                    View and edit your profile information.
                  </Typography>
                  <Button component={Link} to="/profile" variant="contained" color="primary">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h5">
                    Call History
                  </Typography>
                  <Typography variant="body2" paragraph>
                    View your call history and details of past calls.
                  </Typography>
                  <Button component={Link} to="/user-calls/Paid" variant="contained" color="primary">
                    View Call History
                  </Button>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h5">
                    Make a Call
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Click the button below to make a new call.
                  </Typography>
                  <Button component={Link} to="/make-call" variant="contained" color="primary">
                    Make a Call
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

/*
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToCallHistory = () => {
    navigate('/call-history');
  };

  const makeNewCall = () => {
    navigate('/make-call');
  };

  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          <div className='card-body'>
            <h2>Welcome to Your Dashboard</h2>
            <p>You can perform various actions and view information here.</p>

            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">User Profile</h5>
                <p className="card-text">
                  View and edit your profile information.
                </p>
                <Link to="/profile" className="mb-2 md-mb-0">View Profile</Link>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">Call History</h5>
                <p className="card-text">
                  View your call history and details of past calls.
                </p>
                <Link to="/user-calls/Paid" className="mb-2 md-mb-0">View Call History</Link>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">Make a Call</h5>
                <p className="card-text">
                  Click the button below to make a new call.
                </p>
                <Link to="/make-call" className="mb-2 md-mb-0">Make a call</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

*/