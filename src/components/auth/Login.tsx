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
