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
  const { isLoggedIn, role } = useContext(AuthContext);

  const userId = localStorage.getItem('userId') ?? '';

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            sx={{ ml: 'auto' }} // Aligns 'Account' button to the right
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
            {userId && (
              <MenuItem disabled>
                <Typography variant="body2" color="success">
                  You are logged in as: {userId}
                </Typography>
              </MenuItem>
            )}
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
            {isLoggedIn() ? (
              <>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
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



/*
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
  const { isLoggedIn, role } = useContext(AuthContext);

  const userId = localStorage.getItem('userId') ?? '';

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
            {isLoggedIn() && role === 'ADMIN' && (
              <li style={{ marginRight: '10px' }}>
                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div style={{ display: 'flex' }}>
            <Button
              color="inherit"
              aria-haspopup="true"
              onClick={handleMenuClick}
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
              {userId && (
                <MenuItem disabled>
                  <Typography variant="body2" color="success">
                    You are logged in as: {userId}
                  </Typography>
                </MenuItem>
              )}
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
              {isLoggedIn() ? (
                <>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

*/
/*
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
  const { isLoggedIn, role } = useContext(AuthContext);

  const userId = localStorage.getItem('userId') ?? '';

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
            {isLoggedIn() && role === 'ADMIN' && (
              <li style={{ marginRight: '10px' }}>
                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div style={{ display: 'flex' }}>
            <Button
              color="inherit"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              Account
            <div>
              {userId && (
                <Typography variant="body2" color="success" sx={{ ml: 1 }}>
                  You are logged in as: {userId}
                </Typography>
                )}
              </div>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={Link} to="/payment" onClick={handleMenuClose}>
                Pay for calls
              </MenuItem>
              <MenuItem component={Link} to="/user-calls/paid" onClick={handleMenuClose}>
                Paid Calls
              </MenuItem>
              <MenuItem component={Link} to="/user-calls/invoiced" onClick={handleMenuClose}>
                Invoiced Calls
              </MenuItem>
              <MenuItem component={Link} to="/add-new-receiver" onClick={handleMenuClose}>
                Add A New Call Receiver
              </MenuItem>
              <MenuItem component={Link} to="/make-call" onClick={handleMenuClose}>
                Make A Call
              </MenuItem>
              {isLoggedIn() ? (
                <>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
*/
/*
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
  const [showAccount, setShowAccount] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const userId = localStorage.getItem('userId') ?? '';

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
            {isLoggedIn() && role === 'ADMIN' && (
              <li style={{ marginRight: '10px' }}>
                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div style={{ display: 'flex' }}>
            <Button
              color="inherit"
              aria-haspopup="true"
              onClick={handleAccountClick}
            >
              Account
            <br/>
              {userId && (
                <Typography variant="body2" color="success">
                  You are logged in as: {userId}
                </Typography>
              )}
            </Button>
            <Menu
              anchorEl={null}
              open={showAccount}
              onClose={() => setShowAccount(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={Link} to="/payment">
                Pay for calls
              </MenuItem>
              <MenuItem component={Link} to="/user-calls/paid">
                Paid Calls
              </MenuItem>
              <MenuItem component={Link} to="/user-calls/invoiced">
                Invoiced Calls
              </MenuItem>
              <MenuItem component={Link} to="/add-new-receiver">
                Add A New Call Receiver
              </MenuItem>
              <MenuItem component={Link} to="/make-call">
                Make A Call
              </MenuItem>
              {isLoggedIn() ? (
                <>
                  <Divider />
                  <Logout />
                </>
              ) : (
                <MenuItem component={Link} to="/login">
                  Login
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

*/


/*
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
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import Logout from '../auth/Logout';
import { AuthContext } from '../auth/AuthProvider';

const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const userId = localStorage.getItem('userId') ?? '';

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ display: { xs: 'none', md: 'flex' } }}>
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-scroll">
            {isLoggedIn() && role === 'ADMIN' && (
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex navbar-nav">
            <div className="nav-item dropdown">
              <Button
                className={`nav-link dropdown-toggle ${showAccount ? 'show' : ''
                  }`}
                color="inherit"
                aria-haspopup="true"
                onClick={handleAccountClick}
              >
                Account
                {userId && (
                  <Typography variant="body2" color="success">
                    You are logged in as: {userId}
                  </Typography>
                )}
              </Button>
              <Menu
                anchorEl={null}
                open={showAccount}
                onClose={() => setShowAccount(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                getContentAnchorEl={null}
              >
                <MenuItem component={Link} to="/payment">
                  Pay for calls
                </MenuItem>
                <MenuItem component={Link} to="/user-calls/paid">
                  Paid Calls
                </MenuItem>
                <MenuItem component={Link} to="/user-calls/invoiced">
                  Invoiced Calls
                </MenuItem>
                <MenuItem component={Link} to="/add-new-receiver">
                  Add A New Call Receiver
                </MenuItem>
                <MenuItem component={Link} to="/make-call">
                  Make A Call
                </MenuItem>
                {isLoggedIn() ? (
                  <>
                    <Divider />
                    <Logout />
                  </>
                ) : (
                  <MenuItem component={Link} to="/login">
                    Login
                  </MenuItem>
                )}
              </Menu>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
*/
/*
import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logout from "../auth/Logout";
import { AuthContext } from '../auth/AuthProvider';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // 

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const userId = localStorage.getItem("userId") ?? '';

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to={"/"} style={{ color: 'inherit', textDecoration: 'none' }}>
            Optical Telephone Company
          </Link>
        </Typography>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/payment" style={{ color: 'inherit', textDecoration: 'none' }}>
              Pay for calls
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/user-calls/paid" style={{ color: 'inherit', textDecoration: 'none' }}>
              Paid Calls
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/user-calls/invoiced" style={{ color: 'inherit', textDecoration: 'none' }}>
              Invoiced Calls
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/add-new-receiver" style={{ color: 'inherit', textDecoration: 'none' }}>
              Add A New Call Receiver
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/make-call" style={{ color: 'inherit', textDecoration: 'none' }}>
              Make A Call
            </Link>
          </MenuItem>
          {isLoggedIn() ? (
            <MenuItem onClick={handleClose}>
              <Logout />
            </MenuItem>
          ) : (
            <MenuItem onClick={handleClose}>
              <Link to={'/login'} style={{ color: 'inherit', textDecoration: 'none' }}>
                Login
              </Link>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
*/

/*

import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import Logout from '../auth/Logout';
import { AuthContext } from '../auth/AuthProvider';

const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const userId = localStorage.getItem('userId') ?? '';

  const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/">
            Optical Telephone Company
          </Link>
        </Typography>
        {isMdUp && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleAccountClick}
            sx={{ display: 'flex', md: 'none' }}
          >
            Account
            {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
          </IconButton>
        )}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          <MenuItem>
            <Link to="/payment" className="dropdown-item">Pay for calls</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/user-calls/paid" className="dropdown-item">Paid Calls</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/user-calls/invoiced" className="dropdown-item">Invoiced Calls</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/add-new-receiver" className="dropdown-item">Add A New Call Receiver</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/make-call" className="dropdown-item">Make A Call</Link>
          </MenuItem>
          {isLoggedIn() ? (
            <MenuItem>
              <Logout />
            </MenuItem>
          ) : (
            <MenuItem>
              <Link to="/login" className="dropdown-item">Login</Link>
            </MenuItem>
          )}
          {isLoggedIn() && role === 'ADMIN' && (
            <MenuItem>
              <NavLink className='nav-link' aria-current='page' to={'/admin'}>
                Admin
              </NavLink>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

*/


/*
import React, { useState, useContext} from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logout from "../auth/Logout"
import { AuthContext } from '../auth/AuthProvider'


const NavBar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext);
  const { role } = useContext(AuthContext);

  const userId = localStorage.getItem("userId") ?? '';

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };

  const userRole = user ? user.scope : null;

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top'>
      <div className='container-fluid'>
        <Link to={"/"}>
          <span className='navbar-brand'>Optical Telephone Company</span>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbar-scroll'
          aria-controls='#navbar-scroll'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toogler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarScroll'>
          <ul className='navbar-nav me-auto my-2 my-lg-0 navbar-scroll'>
            {isLoggedIn() && role === "ADMIN" && (
              <li className='nav-item'>
                <NavLink className='nav-link' aria-current='page' to={'/admin'}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className='d-flex navbar-nav'>
            <li className='nav-item dropdown'>
              <a
                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                href='#'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                onClick={handleAccountClick}>
                {" "}
                Account
                {userId && <h6 className='text-success text-center'>You are logged in as: {userId}</h6>}
              </a>
              <ul
                className={`dropdown-menu ${showAccount ? "show" : ""}`}
                id="navbarDropdown" aria-labelledby="navbarDropdown">
                <li>
                  <Link className='dropdown-item' to="/payment" >
                    Pay for calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/user-calls/paid" >
                    Paid Calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/user-calls/invoiced" >
                    Invoiced Calls
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to="/add-new-receiver" >
                    Add A New Call Receiver
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to={'/make-call'} >
                    Make A Call
                  </Link>
                </li>
                {isLoggedIn() ? (
                  <Logout />
                ) : (
                  <li>
                    <Link className='dropdown-item' to={'/login'} >
                      Login
                    </Link>
                  </li>

                )}

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
*/