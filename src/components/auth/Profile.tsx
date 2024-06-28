import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Adjust the import path if necessary
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types';

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);
  const calls = useSelector((state: RootState) => state.calls.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage.errorMessage); // Corrected here
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          const username = storedUser ? JSON.parse(storedUser).username : null;
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
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
            console.log('Calls Data:', response);
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

  // Log the current state for debugging
  console.log('userData:', userData);
  console.log('calls:', calls);
  console.log('errorMessage:', errorMessage);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {userData ? (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {userData.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {userData.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {userData.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {userData.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {userData.role}
            </Typography>
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      ) : (
        <Typography variant="body1" align="center">
          No user data found
        </Typography>
      )}
    </Container>
  );
};

export default Profile;


/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Adjust the import path if necessary
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types';

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);
  const calls = useSelector((state: RootState) => state.calls.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage.errorMessage); // Corrected here
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          const username = storedUser ? JSON.parse(storedUser).username : null;
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
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
            console.log('Calls Data:', response);
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

  // Log the current state for debugging
  console.log('userData:', userData);
  console.log('calls:', calls);
  console.log('errorMessage:', errorMessage);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      
      {userData ? (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {userData.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {userData.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {userData.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {userData.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {userData.role}
            </Typography>
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                

/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions';
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
  Alert
} from '@mui/material';
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

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          console.log('User Data - username :', userData);
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
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

  // Log the current state for debugging
  console.log('userData:', userData);
  console.log('calls:', calls);
  console.log('errorMessage:', errorMessage);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {userData ? (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {userData.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {userData.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {userData.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {userData.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {userData.role}
            </Typography>
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      ) : (
        <Typography variant="body1" align="center">
          No user data found
        </Typography>
      )}
    </Container>
  );
};

export default Profile;
*/
/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Adjust the import path if necessary
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types';

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.user);
  const calls = useSelector((state: RootState) => state.calls.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage);
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            dispatch(setUser(userData)); // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}

      {userData && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {userData.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {userData.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {userData.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {userData.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {userData.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {userData.role}
            </Typography>
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/
/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Import actions accordingly
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; 

const Profile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user); 
  const calls = useSelector((state: RootState) => state.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage); 
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            dispatch(setUser(userData)); // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      
      {userData && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          {userData.map((user: { id: React.Key | null | undefined; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; firstName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; lastName: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; emailAddress: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; telephone: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; role: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
            <CardContent key={user.id}>
              <Typography variant="body1" gutterBottom>
                <strong>Username:</strong> {user.username}
                <br />
              </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                <strong>First Name:</strong> {user.firstName}
              </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                <strong>Last Name:</strong> {user.lastName}
              </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                <strong>Email Address:</strong> {user.emailAddress}
              </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                <strong>Phone number:</strong> {user.telephone}
              </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                <strong>Roles:</strong> {user.role}
              </Typography>
            </CardContent>
          ))}
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver) ? call.receiver.map((receiver: { telephone: any; }) => receiver.telephone).join(', ') : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/

/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage, setUser } from '../../store/actions'; // Import actions accordingly
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; // Adjust the path as necessary

const Profile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const calls = useSelector((state: RootState) => state.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage); // Assuming errorMessage is a string
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;
  //const userData;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            dispatch(setUser(userData)); // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{auth.errorMessage}</Alert>}
      {auth.user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {auth.user.username}
              <br />
            </Typography>
            <Divider />
            {userData && ( // Assuming userData is defined correctly
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>First Name:</strong> {userData.firstName}
                </Typography>
                <Divider />
                <Typography variant="body1" gutterBottom>
                  <strong>Last Name:</strong> {userData.lastName}
                </Typography>
                <Divider />
                <Typography variant="body1" gutterBottom>
                  <strong>Email Address:</strong> {userData.emailAddress}
                </Typography>
                <Divider />
                <Typography variant="body1" gutterBottom>
                  <strong>Phone number:</strong> {userData.telephone}
                </Typography>
                <Divider />
                <Typography variant="body1" gutterBottom>
                  <strong>Roles:</strong> {userData.role}
                </Typography>
              </>
            )}
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/

/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage } from '../../store/actions';
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
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; // Adjust the path as necessary

const Profile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const calls = useSelector((state: RootState) => state.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage);
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{auth.errorMessage}</Alert>}
      {auth.user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {auth.user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {auth.user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {auth.user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {auth.user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone Number:</strong> {auth.user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {auth.user.role}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Typography variant="h4" align="center" gutterBottom>
        Call History
      </Typography>
      {calls.length > 0 ? (
        <TableContainer component={Paper}>
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
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.callId}</TableCell>
                  <TableCell>{call.startTime}</TableCell>
                  <TableCell>{call.endTime}</TableCell>
                  <TableCell>
                    {Array.isArray(call.receiver)
                      ? call.receiver
                        .map((receiver: { telephone: any; }) => receiver.telephone)
                        .join(', ')
                      : ''}
                  </TableCell>
                  <TableCell>{call.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">
          No calls found
        </Typography>
      )}
    </Container>
  );
};

export default Profile;

* /


/*import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage } from '../../store/actions';
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; // Adjust the path as necessary

const Profile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const calls = useSelector((state: RootState) => state.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage); // Assuming errorMessage is a string
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{auth.errorMessage}</Alert>}
      {auth.user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {auth.user.username}
              <br />
            </Typography>
            {user && (
              <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  User Information
                </Typography>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <strong>Username:</strong> {user.username}
                  </Typography>
                  <Divider />
                  <Typography variant="body1" gutterBottom>
                    <strong>First Name:</strong> {user.firstName}
                  </Typography>
                  <Divider />
                  <Typography variant="body1" gutterBottom>
                    <strong>Last Name:</strong> {user.lastName}
                  </Typography>
                  <Divider />
                  <Typography variant="body1" gutterBottom>
                    <strong>Email Address:</strong> {user.emailAddress}
                  </Typography>
                  <Divider />
                  <Typography variant="body1" gutterBottom>
                    <strong>Phone number:</strong> {user.telephone}
                  </Typography>
                  <Divider />
                  <Typography variant="body1" gutterBottom>
                    <strong>Roles:</strong> {user.role}
                  </Typography>
            <Divider />
            {/* Render other user details */
          /*}
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver) ? call.receiver.map((receiver: { telephone: any; }) => receiver.telephone).join(', ') : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
   
*/
/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage } from '../../store/actions';
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; // Adjust the path as necessary

const Profile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const calls = useSelector((state: RootState) => state.calls);
  const errorMessage = useSelector((state: RootState) => state.errorMessage); // Assuming errorMessage is a string
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>}*/  /*}
      {auth.user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {auth.user.username}
              <strong>First name:</strong> {auth.user.firstName}
            </Typography>
            <Divider />
            {/* Render other user details */  /*}
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver) ? call.receiver.map((receiver: { telephone: any; }) => receiver.telephone).join(', ') : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/
/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername } from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setCalls, setErrorMessage } from '../../store/actions';
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
  Alert
} from '@mui/material';
import { RootState } from '../../store/store';
import { User, Call } from '../../store/types'; // Adjust the path as necessary

const Profile: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const calls = useSelector((state: RootState) => state.calls); // Assuming calls is in the root state
  const errorMessage = useSelector((state: RootState) => state.errorMessage);
  const dispatch = useDispatch<any>();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData: User = await getUser(username);
            console.log('User Data:', userData);
            // Dispatch action to update user data in Redux state
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response: Call[] = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {auth.user && ( // Accessing auth.user assuming it's part of your auth state
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {auth.user.username}
            </Typography>
            <Divider />
            {/* Render other user details */ /*}
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/




/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../services/UserService';
import { getCallsByUsername} from '../../services/CallService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setUser, setCalls, setErrorMessage } from '../../store/actions';
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
  Alert
} from '@mui/material';
import { State } from '../../store/types';

const Profile: React.FC = () => {
  const user = useSelector((state: State) => state.user);
  const calls = useSelector((state: State) => state.calls);
  const errorMessage = useSelector((state: State) => state.errorMessage);
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;
 // setUser= ActionTypes

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData = await getUser(username);
            console.log('User Data:', userData);
            dispatch(setUser(userData));
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {user.role}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/

/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCallsByUsername, getUser } from '../../services';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { setUser, setCalls, setErrorMessage } from '../../redux/actions';
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
  Alert
} from '@mui/material';
import { State } from '../../redux/types';

const Profile: React.FC = () => {
  const user = useSelector((state: State) => state.user);
  const calls = useSelector((state: State) => state.calls);
  const errorMessage = useSelector((state: State) => state.errorMessage);
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const username = localStorage.getItem('user.username');
          if (username) {
            const userData = await getUser(username);
            console.log('User Data:', userData);
            dispatch(setUser(userData));
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
          const username = localStorage.getItem('user.username');
          if (username) {
            const response = await getCallsByUsername(username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {user.role}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/


/*
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';
import { setUser, setCalls, setErrorMessage } from './actions';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
  roles: string[];
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const calls = useSelector((state: any) => state.calls);
  const errorMessage = useSelector((state: any) => state.errorMessage);
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const userData: User = await getUser(parsedUser.username);
            console.log('User Data:', userData);
            dispatch(setUser(userData));
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
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const response: Call[] = await getCallsByUsername(parsedUser.username);
            console.log('Calls Data:', response);
            dispatch(setCalls(response));
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          dispatch(setErrorMessage(error.message));
        }
      }
    };

    fetchCalls();
  }, [authContext, dispatch]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {user.roles ? user.roles.join(', ') : 'No roles assigned'}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/

/*

import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
  roles: string[];
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  //const user = useSelector(state => state)

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const userData: User = await getUser(parsedUser.username);
            console.log('User Data:', userData);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [authContext]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const response: Call[] = await getCallsByUsername(parsedUser.username);
            console.log('Calls Data:', response);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [authContext]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/

/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
  roles: string[];
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const userData: User = await getUser(parsedUser.username);
            console.log('User Data:', userData);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [authContext]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const response: Call[] = await getCallsByUsername(parsedUser.username);
            console.log('Calls Data:', response);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [authContext]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {user.roles.join(', ')}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/

/*

import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
  roles: string[];
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const userId = localStorage.getItem('user.username');
          if (userId) {
            const userData: User = await getUser(userId);
            console.log('User Data:', userData);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [authContext]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const userId = localStorage.getItem('user.username');
          if (userId) {
            const response: Call[] = await getCallsByUsername(userId);
            console.log('Calls Data:', response);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [authContext]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Roles:</strong> {user.roles.join(', ')}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/


/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userData: User = await getUser(userId);
            console.log('User Data:', userData);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [authContext]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (authContext?.isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response: Call[] = await getCallsByUsername(userId);
            console.log('Calls Data:', response);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [authContext]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/




/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { isLoggedIn } = useContext(AuthContext) || {};
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn && isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userData: User = await getUser(userId);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage('Failed to fetch user details.');
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchUserCalls = async () => {
      if (isLoggedIn && isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userCalls: Call[] = await getCallsByUsername(userId);
            setCalls(userCalls);
          }
        } catch (error: any) {
          console.error('Error fetching user calls: ', error.message);
          setErrorMessage('Failed to fetch user calls.');
        }
      }
    };

    fetchUserCalls();
  }, [isLoggedIn]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;


*/
/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isLoggedIn, handleLogout } = useContext(AuthContext) || {}; // Default empty object if context is undefined
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn && isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userData: User = await getUser(userId);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (isLoggedIn && isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response: Call[] = await getCallsByUsername(userId);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [isLoggedIn]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/
/*
import React, { useState, useEffect, useContext } from 'react';


import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const message = location.state && location.state.message;

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const userData: User = await getUser(userId);
            setUser(userData);
          }
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCalls = async () => {
      if (isLoggedIn()) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response: Call[] = await getCallsByUsername(userId);
            setCalls(response);
          }
        } catch (error: any) {
          console.error('Error fetching calls: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchCalls();
  }, [isLoggedIn]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/

/*import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
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
  Alert
} from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Receiver {
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: Receiver[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const location = useLocation();
  const message = location.state && location.state.message;

  //const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      //if (isLoggedIn()) {
        try {
          const userData: User = await getUser(userId!);
          setUser(userData);
          setCurrentUser(localStorage.getItem('userId'));
        } catch (error: any) {
          console.error('Error fetching user details: ', error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response: Call[] = await getCallsByUsername(userId!);
        setCalls(response);
      } catch (error: any) {
        console.error('Error fetching calls: ', error.message);
        setErrorMessage(error.message);
      }
    };

    fetchCalls();
  }, [userId, token]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: 'whitesmoke' }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : ''}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;

*/

/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { Container, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Paper, Alert } from '@mui/material';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: { telephone: string }[];
  status: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const location = useLocation();
  const message = location.state && location.state.message;

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        try {
          const userData: User = await getUser(userId!);
          setUser(userData);
          setCurrentUser(localStorage.getItem("userId"));
        } catch (error) {
          console.error("Error fetching user details: ", error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response: Call[] = await getCallsByUsername(userId!);
        setCalls(response);
      } catch (error) {
        console.error("Error fetching calls: ", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchCalls();
  }, [userId, token]);

  return (
    <Container sx={{ mb: 3 }}>
      {message && <Alert severity="info">{message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {user && (
        <Card sx={{ p: 3, mt: 5, backgroundColor: "whitesmoke" }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Information
          </Typography>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>First Name:</strong> {user.firstName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Last Name:</strong> {user.lastName}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Email Address:</strong> {user.emailAddress}
            </Typography>
            <Divider />
            <Typography variant="body1" gutterBottom>
              <strong>Phone number:</strong> {user.telephone}
            </Typography>
            <Divider />
          </CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Call History
          </Typography>
          {calls.length > 0 ? (
            <TableContainer component={Paper}>
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
                        {Array.isArray(call.receiver)
                          ? call.receiver.map(receiver => receiver.telephone).join(', ')
                          : call.receiver.telephone}
                      </TableCell>
                      <TableCell>{call.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">
              No calls found
            </Typography>
          )}
        </Card>
      )}
    </Container>
  );
};

export default Profile;
*/
/*
import React, { useState, useEffect, useContext } from 'react';
import { getCallsByUsername } from '../../services/CallService';
import { getUser } from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephone: string;
}

interface Call {
  id: string;
  callId: string;
  startTime: string;
  endTime: string;
  receiver: { telephone: string }[];
  status: string;
}


const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");


  const location = useLocation();
  const message = location.state && location.state.message;

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        try {
          const userData: User = await getUser(userId!);
          setUser(userData);
          setCurrentUser(localStorage.getItem("userId"));
        } catch (error) {
          console.error("Error fetching user details: ", error.message);
          setErrorMessage(error.message);
        }
      }
    };

    fetchUser();
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response: Call[] = await getCallsByUsername(userId!);
        setCalls(response);
      } catch (error) {
        console.error("Error fetching calls: ", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchCalls();
  }, [userId, token]);

  return (
    <div className='container mb-3'>
      {user && (
        <div className='card p-5 mt-5' style={{ backgroundColor: "whitesmoke" }}>
          <h4 className='card-title text-center'>User Information</h4>
          <div className='card-body'>
            <div className='col-md-10 mx-auto'>
              <div className='card mb-3 shadow'>
                <div className='row g-0'>
                  <div className='col-md-2'></div>
                  <div className='col-md-10'>
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Username</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.username}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>First Name</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.firstName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Last Name</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.lastName}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Email Address</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.emailAddress}</p>
                      </div>
                    </div>
                    <hr />
                    <div className='form-group row'>
                      <label className='col-md-2 col-form-label fw-bold'>Phone number</label>
                      <div className='col-md-10'>
                        <p className='card-text'>{user.telephone}</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h4 className='card-title text-center'>Call History</h4>
          {calls.length > 0 ? (
            <table className="table table-bordered table-hover shadow">
              <thead>
                <tr>
                  <th scope="col">Call ID</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Receiver Telephone</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {calls.map(call => (
                  <tr key={call.id}>
                    <td>{call.callId}</td>
                    <td>{call.startTime}</td>
                    <td>{call.endTime}</td>
                    <td>{Array.isArray(call.receiver) ? call.receiver.map(receiver => (receiver as { telephone: string }).telephone).join(', ') : (call.receiver as { telephone: string }).telephone}</td>
                    <td>{call.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No calls found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

*/