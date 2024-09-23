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
