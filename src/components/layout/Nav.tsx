import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import accountAvatar from '../../assets/account-50.png';
import { Divider } from "@mui/material";
import { AuthContext } from '../auth/AuthProvider';
import { useContext } from "react";

// Data for dropdowns
const callRelated = [
    { label: 'Make Call', path: '/make-call' },
    { label: 'Pay for Calls', path: '/payment' },
    { label: 'Invoices', path: '/user-calls/invoiced' },
    { label: 'Paid Calls', path: '/user-calls/paid' }
];

const callReceiverRelated = [
    { label: 'View Your Call Receiver List', path: '/user-call-receiver-list' },
    { label: 'Register a New Call Receiver', path: '/add-new-receiver' },
];

const other = [{ label: 'Register', path: '/register' }];

const settings = [
    { label: 'Profile', path: '/profile' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Login', path: '/login' },
];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElCall, setAnchorElCall] = React.useState<null | HTMLElement>(null);
    const [anchorElReceiver, setAnchorElReceiver] = React.useState<null | HTMLElement>(null);

    const authContext = useContext(AuthContext);
    if (!authContext) {
        return null;
    }

    const { isLoggedIn, role, handleLogout } = authContext;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handlers for dropdown menus
    const handleOpenCallMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElCall(event.currentTarget);
    };

    const handleCloseCallMenu = () => {
        setAnchorElCall(null);
    };

    const handleOpenReceiverMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElReceiver(event.currentTarget);
    };

    const handleCloseReceiverMenu = () => {
        setAnchorElReceiver(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }} className="navbar-dark mb-5">
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/">
                            <Logo w={100} h={50} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'black' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/* Register Button */}
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
                                Register
                            </Link>
                        </Button>

                        {/* Call Related Dropdown */}
                        <Button
                            onClick={handleOpenCallMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Call Related
                        </Button>
                        <Menu
                            anchorEl={anchorElCall}
                            open={Boolean(anchorElCall)}
                            onClose={handleCloseCallMenu}
                        >
                            {callRelated.map((item) => (
                                <MenuItem key={item.label} onClick={handleCloseCallMenu}>
                                    <Link to={item.path} style={{ textDecoration: 'none', color: 'black' }}>
                                        {item.label}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>

                        {/* Call Receiver Related Dropdown */}
                        <Button
                            onClick={handleOpenReceiverMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Call Receiver Related
                        </Button>
                        <Menu
                            anchorEl={anchorElReceiver}
                            open={Boolean(anchorElReceiver)}
                            onClose={handleCloseReceiverMenu}
                        >
                            {callReceiverRelated.map((item) => (
                                <MenuItem key={item.label} onClick={handleCloseReceiverMenu}>
                                    <Link to={item.path} style={{ textDecoration: 'none', color: 'black' }}>
                                        {item.label}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>

                        {isLoggedIn() && role === 'ADMIN' && (
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Admin
                                </NavLink>
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="account" src={accountAvatar} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {isLoggedIn() ? (
                                <>
                                    {settings.filter(setting => setting.label !== 'Login').map((setting) => (
                                        <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                                            <Link to={setting.path} style={{ textDecoration: 'none', color: 'black' }}>
                                                {setting.label}
                                            </Link>
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem onClick={() => {
                                        handleLogout();
                                        handleCloseUserMenu();
                                    }}>
                                        Logout
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem component={Link} to="/login" onClick={handleCloseUserMenu}>
                                    Login
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ResponsiveAppBar;

/*
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import accountAvatar from '../../assets/account-50.png';
import { Divider } from "@mui/material";
import { AuthContext } from '../auth/AuthProvider';
import { useContext } from "react";

// Data for dropdowns
const callRelated = [
    { label: 'Make Call', path: '/make-call' },
    { label: 'Pay for Calls', path: '/payment' },
    { label: 'Invoices', path: '/user-calls/invoiced' },
    { label: 'Paid Calls', path: '/user-calls/paid' }
];

const callReceiverRelated = [
    { label: 'View Your Call Receiver List', path: '/user-call-receiver-list' },
    { label: 'Register a New Call Receiver', path: '/add-new-receiver' },
];

const settings = [
    { label: 'Profile', path: '/profile' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Login', path: '/login' },
];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElCall, setAnchorElCall] = React.useState<null | HTMLElement>(null);
    const [anchorElReceiver, setAnchorElReceiver] = React.useState<null | HTMLElement>(null);

    const authContext = useContext(AuthContext);
    if (!authContext) {
        return null;
    }

    const { isLoggedIn, role, handleLogout } = authContext;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handlers for dropdown menus
    const handleOpenCallMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElCall(event.currentTarget);
    };

    const handleCloseCallMenu = () => {
        setAnchorElCall(null);
    };

    const handleOpenReceiverMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElReceiver(event.currentTarget);
    };

    const handleCloseReceiverMenu = () => {
        setAnchorElReceiver(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }} className="navbar-dark mb-5">
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/">
                            <Logo w={100} h={50} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'black' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                        <Button
                            onClick={handleOpenCallMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Call Related
                        </Button>
                        <Menu
                            anchorEl={anchorElCall}
                            open={Boolean(anchorElCall)}
                            onClose={handleCloseCallMenu}
                        >
                            {callRelated.map((item) => (
                                <MenuItem key={item.label} onClick={handleCloseCallMenu}>
                                    <Link to={item.path} style={{ textDecoration: 'none', color: 'black' }}>
                                        {item.label}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>


                        <Button
                            onClick={handleOpenReceiverMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                            Call Receiver Related
                        </Button>
                        <Menu
                            anchorEl={anchorElReceiver}
                            open={Boolean(anchorElReceiver)}
                            onClose={handleCloseReceiverMenu}
                        >
                            {callReceiverRelated.map((item) => (
                                <MenuItem key={item.label} onClick={handleCloseReceiverMenu}>
                                    <Link to={item.path} style={{ textDecoration: 'none', color: 'black' }}>
                                        {item.label}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>

                        {isLoggedIn() && role === 'ADMIN' && (
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Admin
                                </NavLink>
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="account" src={accountAvatar} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {isLoggedIn() ? (
                                <>
                                    {settings.filter(setting => setting.label !== 'Login').map((setting) => (
                                        <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                                            <Link to={setting.path} style={{ textDecoration: 'none', color: 'black' }}>
                                                {setting.label}
                                            </Link>
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem onClick={() => {
                                        handleLogout();
                                        handleCloseUserMenu();
                                    }}>
                                        Logout
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem component={Link} to="/login" onClick={handleCloseUserMenu}>
                                    Login
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ResponsiveAppBar;
*/
/*
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import accountAvatar from '../../assets/account-50.png';
import { Divider } from "@mui/material";

import { AuthContext } from '../auth/AuthProvider';
import { useContext } from "react";

const callRelated =[
    { label: 'Make Call', path: '/make-call' },
    { label: 'Pay for Calls', path: '/payment' },
    { label: 'Invoices', path: '/user-calls/invoiced' },
    { label: 'Paid Calls', path: '/user-calls/paid' }
];

const callReceiverRelated = [
    { label: 'View Your call receiver list', path: '/user-call-receiver-list'},
        { label: 'Register a new call receiver', path: '/add-new-receiver' },
];

const other = [{ label: 'Register', path: '/register' }];

const settings = [
    { label: 'Profile', path: '/profile' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Login', path: '/login' }, // Moved login here
];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const { isLoggedIn, role, handleLogout } = authContext;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }} className="navbar-dark mb-5">
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/">
                            <Logo w={100} h={50} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'black' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={page.path} style={{ textDecoration: 'none', color: 'black' }}>
                                            {page.label}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                <Link to={page.path} style={{ textDecoration: 'none', color: 'black' }}>
                                    {page.label}
                                </Link>
                            </Button>
                        ))}
                        {isLoggedIn() && role === 'ADMIN' && (
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                <NavLink to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Admin
                                </NavLink>
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="account" src={accountAvatar} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {isLoggedIn() ? (
                                <>
                                    {settings.filter(setting => setting.label !== 'Login').map((setting) => (
                                        <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                                            <Link to={setting.path} style={{ textDecoration: 'none', color: 'black' }}>
                                                {setting.label}
                                            </Link>
                                        </MenuItem>
                                    ))}
                                    <Divider />
                                    <MenuItem onClick={() => {
                                        handleLogout();
                                        handleCloseUserMenu();
                                    }}>
                                        Logout
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem component={Link} to="/login" onClick={handleCloseUserMenu}>
                                    Login
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ResponsiveAppBar;

*/

/*
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from "react-router-dom";
import Logo from "../Logo";

const pages = [
    { label: 'Register', path: '/register' },
    { label: 'Register a new call receiver', path: '/add-new-receiver' },
    { label: 'Make Call', path: '/make-call' },
    { label: 'Pay for Calls', path: '/payment' },
    { label: 'Invoices', path: '/user-calls/invoiced' },
    { label: 'Paid Calls', path: '/user-calls/paid' }
];
const settings = [{ label: 'Profile', path: '/profile' },
    {label: 'Account', path: '' },
    {label: 'Dashboard', path: '' },
    {label: 'Logout', path:'' }
];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/">
                            <Logo w={100} h={50} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'black' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={page.path} style={{ textDecoration: 'none', color: 'black' }}>
                                            {page.label}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                <Link to={page.path} style={{ textDecoration: 'none', color: 'black' }}>
                                    {page.label}
                                </Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="account" src="src/assets/account-50.png" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center', color: 'black' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
*/

/*
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link} from "react-router-dom";
import Logo from "../Logo";

const pages = ['Register', 'Register a new call receiver', 'Make Call', 'Pay for Calls', 'Invoices', 'Paid Calls'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to={"/"}>
                            <Logo w={100} h={50} />
                        </Link>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
*/