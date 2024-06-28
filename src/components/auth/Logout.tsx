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




/*
import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { List, ListItem, Divider, Button, Container } from '@mui/material';

const Logout: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  //  auth.handleLogout();
    navigate("/", { state: { message: "You have been logged out." } });
  };

  return (
     <Container >
      <List>
        <ListItem component={Link} to="/profile">
          Profile
        </ListItem>
        <Divider />
      </List>
      <Button variant="text" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Logout;

*/

/*
import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { useNavigate, Link } from 'react-router-dom';

const Logout: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.handleLogout();
    navigate("/", { state: { message: "You have been logged out." } });
  };

  return (
    <>
      <ul>
        <li>
          <Link className="dropdown-item" to="/profile">
            Profile
          </Link>
        </li>
        <li>
          <hr className='dropdown-divider' />
        </li>
      </ul>
      <button className='dropdown-item' onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default Logout;
*/