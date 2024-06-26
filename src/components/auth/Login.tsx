import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Alert, Container, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { loginUser } from '../../services/UserService'; // Ensure this imports the actual login service
import { loginSuccess } from '../../store/authSlice';
import { RootState } from '../../store/store';
import loginIcon from '../../assets/login.png';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import jwtDecode from 'jwt-decode';

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    try {
      const response = await loginUser(user); // Make sure this calls your actual login service
      if (response.success) {
        toast.success(response.message);
        const token = response.data;
        console.log("logon response data in login ", response.data)
        const decodedToken: { userId: string, sub: string, firstName: string, lastName: string, emailAddress: string, roles: string } = jwtDecode(token);
        //const decodedToken = jwtDecode(token);
        console.log("decoded token in login ", decodedToken);

        const userA = {
          //username: decodedToken.username,
          username: decodedToken.sub,
          roles: decodedToken.roles,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          emailAddress: decodedToken.emailAddress,
          role: decodedToken.roles,
        };

        console.log("User object before dispatch: ", user);

        dispatch(loginSuccess(userA));
        console.log("dispatch from login ", user.username);

        localStorage.setItem('token', token);
        navigate("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setErrMsg('Login failed. Please try again.');
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }} className='mx-auto container p-4'>
      {errMsg && <Alert severity="error">{errMsg}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <div className='bg-white p-4 w-full max-w-md mx-auto'>
        <div className='w-20 h-20 mx-auto'>
          <img src={loginIcon} alt='login icon' />
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login Here
          </Typography>
          <form onSubmit={handleSubmit} className='pt-6 flex flex-col gap-2'>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div>
              <Link to="/forgot-password" className='block w-fit ml-auto hover:underline hover:bg-blue-400'>Forgot password?</Link>
            </div>
            <Button type="submit" variant="contained" color="primary" className="w-1/2 rounded-full hover:scale-110 transition-all mx-auto block mt-4" sx={{ mt: 2 }}>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }} className='block w-fit ml-auto hover:underline hover:bg-blue-400'>
              Not registered yet? <Link to="/register">Register here</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;


/*

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Alert, Container, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { loginUser } from '../../services/UserService';
import { login } from './authSlice';
import { RootState } from './store';
import loginIcon from '../../assets/login.png';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const userContext = useContext(Context)
  
  console.log("a user ", userContext.fetchUserDetails())

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    const response = await loginUser(user);
    if (response.success) {
      toast.success(response.message);
      const token = response.data;
      const decodedToken: { id: string, name: string, email: string, role: string } = jwt_decode(token);
      dispatch(login({
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
      }));
      navigate("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }} className='mx-auto container p-4'>
      {errMsg && <Alert severity="error">{errMsg}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <div className='bg-white p-4 w-full max-w-md mx-auto'>
        <div className='w-20 h-20 mx-auto'>
          <img src={loginIcon} alt='login icon' />
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login Here
          </Typography>
          <form onSubmit={handleSubmit} className='pt-6 flex flex-col gap-2'>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div>
              <Link to="/forgot-password" className='block w-fit ml-auto hover:underline hover:bg-blue-400'>Forgot password?</Link>
            </div>
            <Button type="submit" variant="contained" color="primary" className="w-1/2 rounded-full hover:scale-110 transition-all mx-auto block mt-4" sx={{ mt: 2 }}>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }} className='block w-fit ml-auto hover:underline hover:bg-blue-400'>
              Not registered yet? <Link to="/register">Register here</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;

// Mock authentication function
async function authenticate(email: string, password: string): Promise<string> {
  // Replace this with your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = 'your.jwt.token';
      resolve(token);
    }, 1000);
  });
}

*/
/*
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Container, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { loginUser } from '../../services/UserService';
import { AuthContext } from './AuthProvider';
import loginIcon from '../../assets/login.png';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 
  const [errMsg, setErrMsg] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { handleLogin, isLoggedIn } = useContext(AuthContext);

  
  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        navigate("/dashboard");
      }
    };
    fetchUser();
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
/*
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    const response = await loginUser(user);

    if (response.success) {
      toast.success(response.message);
      const token = response.data;
      handleLogin(token);
      navigate("/dashboard");
    } else {
      toast.error(response.message);
    }
  };

  */
/*
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    const response = await loginUser(user);
    console.log("response token in login ", response.data);
    if (response.success) {
      toast.success(response.message);
     // setMessage(response.message);
      const token = response.data;
      handleLogin(token);
      navigate("/dashboard");
    } else {
      toast.error(response.message);
     // setErrMsg("Invalid username or password. Please try again.");
     // setTimeout(() => {
        //setErrMsg("");
      //}, 4000);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }} className='mx-auto container p-4'>
      {errMsg && <Alert severity="error">{errMsg}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <div className='bg-white p-4 w-full max-w-md mx-auto'>
        <div className='w-20 h-20 mx-auto'>
          <img src={loginIcon} alt='login icon' />
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login Here
          </Typography>
          <form onSubmit={handleSubmit} className='pt-6 flex flex-col gap-2'>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div>
              <Link to={"/forgot-password"} className='block w-fit ml-auto hover:underline hover:bg-blue-400'>Forgot password?</Link>
              </div>
            <Button type="submit" variant="contained" color="primary" className="w-1/2 rounded-full hover:scale-110 transition-all mx-auto block mt-4" sx={{ mt: 2 }}>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }} className='block w-fit ml-auto hover:underline hover:bg-blue-400'>
              Not registered yet? <Link to="/register">Register here</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;


*/
/*
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Container, Card, CardContent } from '@mui/material';
import { loginUser } from '../../services/UserService';
import { AuthContext } from './AuthProvider';
import loginIcon from '../../assets/login.png'
import { FaEye } from "react-icons/fa6";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { handleLogin, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        navigate("/dashboard");
      }
    };
    fetchUser();
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    const response = await loginUser(user);
    console.log("response token in login ", response.data.token);
    if (response) {
      setMessage(response.message);
      const token = response.data.token;
      handleLogin(token);
      navigate("/dashboard");
    } else {
      setErrMsg("Invalid username or password. Please try again.");
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }} className='mx-auto container p-4'>
      {errMsg && <Alert severity="error">{errMsg}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <div className='bg-white p-4 w-full max-w-md mx-auto'>
        <div className='w-20 h-20 mx-auto'>
          <img src='loginIcon' alt='login icon' />
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login Here
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <div>
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
                 <span>
                <FaEye />
              </span>

              />
             
            </div>

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Not registered yet? <Link to="/register">Register here</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
*/

/*

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {  loginUser } from '../../services/UserService';
import  { AuthContext } from './AuthProvider';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { handleLogin, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn()) {
        navigate("/dashboard");
      }
    };
    fetchUser();
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = { username, password };
    const response = await loginUser(user);
    console.log("response token in login ", response.data.token)
    if (response) {
      setMessage(response.message);
      const token = response.data.token;
      handleLogin(token);
      navigate("/dashboard");
    } else {
      setErrMsg("Invalid username or password. Please try again.");
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
    }
  };

  return (
    <section className='container col-6 mt-5 mb-5'>
      {errMsg && <p className='alert alert-danger'>{errMsg}</p>}
      {message && (
        <p className="alert alert-success">{message}</p>
      )}
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          <h1 className='text-center'>Login here</h1>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-2'>
                <label htmlFor="username" className="text-center">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  className="form-control"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  className="form-control"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className='btn-otc btn-otc:hover'
                  style={{ marginRight: "10px" }}
                >
                  Login
                </button>
                <span style={{ marginLeft: "10px" }}>
                  Not registered yet?<Link to={"/register"}> Register here</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
*/