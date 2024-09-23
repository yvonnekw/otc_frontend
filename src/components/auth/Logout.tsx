import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { List, ListItem, Divider, Button, Container } from '@mui/material';

const Logout: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (auth) {
      auth.handleLogout();
    }
    navigate("/", { state: { message: "You have been logged out." } });
  };

  return (
    <Container>
      <Button variant="text" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Logout;
