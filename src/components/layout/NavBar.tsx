import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import Logout from '../auth/Logout';
import { AuthContext } from '../auth/AuthProvider';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
   
    return null;
  }

  const { isLoggedIn, role, handleLogout } = authContext;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" className='navbar-dark .navbar-nav .nav-link'>
      <Toolbar className='navbar-dark .navbar-nav .nav-link'>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <div className='navbar-dark .navbar-nav .nav-link' style={{ display: 'flex', alignItems: 'center' }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, marginRight: '10px' }}>
            {isLoggedIn() && role === 'ADMIN' && (
              <li>
                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <Button
            color="inherit"
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{ ml: 'auto' }}
          >
            Account
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={Link} to="/payment" onClick={handleMenuClose}>
              Pay for Calls
            </MenuItem>
            <MenuItem component={Link} to="/user-calls/paid" onClick={handleMenuClose}>
              Paid Calls
            </MenuItem>
            <MenuItem component={Link} to="/user-calls/invoiced" onClick={handleMenuClose}>
              Invoiced Calls
            </MenuItem>
            <MenuItem component={Link} to="/add-new-receiver" onClick={handleMenuClose}>
              Add a New Call Receiver
            </MenuItem>
            <MenuItem component={Link} to="/make-call" onClick={handleMenuClose}>
              Make a Call
            </MenuItem>
            <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
              Profile
            </MenuItem>
            {isLoggedIn() ? (
              <>
                <Divider />
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  <Logout />
                </MenuItem>
              </>
            ) : (
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
