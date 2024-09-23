import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper,
  Alert,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Adjust the import path if necessary
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types';

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);
  const calls = useSelector((state: RootState) => state.calls.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage.errorMessage);
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          const username = storedUser ? JSON.parse(storedUser).username : null;
          if (username) {
            const userData: User = await getUser(username);
            dispatch(setUser(userData));
          } else {
            console.log('No username found in localStorage');
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchUser();
  }, [authContext, dispatch]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          const username = storedUser ? JSON.parse(storedUser).username : null;
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            dispatch(setCalls(response));
          } else {
            console.log('No username found in localStorage');
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  const handleEditButtonClick = () => {
    setEditFormData(userData); // Pre-fill the form with current user data
    setEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData!,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    if (editFormData) {
      // Logic to save changes can go here, such as making an API call to update the user data
      dispatch(setUser(editFormData));
      setEditDialogOpen(false);
    }
  };

  return (
      <Container sx={{ mb: 3 }}>
        {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        {userData ? (
            <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
              <Typography variant="h4" align="center" gutterBottom>
                User Information
              </Typography>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>Username:</strong> {userData.username}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>First Name:</strong> {userData.firstName}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Last Name:</strong> {userData.lastName}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Email Address:</strong> {userData.emailAddress}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Phone number:</strong> {userData.telephone}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Roles:</strong> {userData.role}
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={handleEditButtonClick}>
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>

              <Typography variant="h4" align="center" gutterBottom>
                Call History
              </Typography>
              {calls.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Call ID</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>End Time</TableCell>
                          <TableCell>Receiver Telephone</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calls.map(call => (
                            <TableRow key={call.id}>
                              <TableCell>{call.callId}</TableCell>
                              <TableCell>{call.startTime}</TableCell>
                              <TableCell>{call.endTime}</TableCell>
                              <TableCell>
                                {Array.isArray(call.receiver) ? call.receiver.map(receiver => receiver.telephone).join(', ') : ''}
                              </TableCell>
                              <TableCell>{call.status}</TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
              ) : (
                  <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    No calls found
                  </Typography>
              )}
            </Card>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
        )}

        {/* Edit Profile Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="First Name"
                name="firstName"
                value={editFormData?.firstName || ''}
                onChange={handleFormChange}
                fullWidth
            />
            <TextField
                margin="dense"
                label="Last Name"
                name="lastName"
                value={editFormData?.lastName || ''}
                onChange={handleFormChange}
                fullWidth
            />
            <TextField
                margin="dense"
                label="Email Address"
                name="emailAddress"
                value={editFormData?.emailAddress || ''}
                onChange={handleFormChange}
                fullWidth
            />
            <TextField
                margin="dense"
                label="Phone number"
                name="telephone"
                value={editFormData?.telephone || ''}
                onChange={handleFormChange}
                fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default Profile;