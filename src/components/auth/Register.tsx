import React, { useState } from 'react';
import { Authority, registerUser } from '../../services/UserService';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Alert, Box, InputAdornment, IconButton } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
    const location = useLocation();
    const message = location.state && location.state.message;

    const currentUser = localStorage.getItem("userId");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [errors, setErrors] = useState<{
        firstName: string;
        lastName: string;
        emailAddress: string;
        telephone: string;
        password: string;
        confirmPassword: string;
    }>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        telephone: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            if (password === confirmPassword) {
                
                const authorities: Authority[] = [{ authority: "USER" }];
                const user: registerUser = {
                    firstName,
                    lastName,
                    emailAddress,
                    telephone,
                    password,
                    authorities
                };
                try {
                    const response = await registerUser(user);
                    if (response) {
                        setSuccessMessage("A new user is registered");
                        setErrorMessage('');
                        toast.success(response)
                        navigate('/login');
                    } else {
                        setErrorMessage('Error registering user');
                        toast.success(response)
                    }
                } catch (error) {
                    setSuccessMessage('');
                    setErrorMessage(`Registration error: ${error.message}`);
                   
                }
                setTimeout(() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                }, 5000);
            } else {
                setErrorMessage("Please check password and confirm password")
                console.log("Please check password and confirm password")
            }
        }
    }

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (firstName.trim()) {
            errorsCopy.firstName = '';
        } else {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        }

        if (lastName.trim()) {
            errorsCopy.lastName = '';
        } else {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        }

        if (!emailAddress.trim()) {
            errorsCopy.emailAddress = 'Email address is required';
            valid = false;
        }

        if (!telephone.trim()) {
            errorsCopy.telephone = 'Telephone number is required';
            valid = false;
        }

        if (!password.trim()) {
            errorsCopy.password = 'Password is required';
            valid = false;
        }

        if (!confirmPassword.trim()) {
            errorsCopy.confirmPassword = 'Confirm password is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
            {message && <Alert severity="info">{message}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Card>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register here
                    </Typography>
                    <Box component="form" className='pt-6 flex flex-col gap-2' onSubmit={saveUser} noValidate>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email Address"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            error={Boolean(errors.emailAddress)}
                            helperText={errors.emailAddress}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            error={Boolean(errors.telephone)}
                            helperText={errors.telephone}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            required
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
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary" className="w-1/2 rounded-full hover:scale-110 transition-all mx-auto block mt-4" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                            <Typography variant="body2" align="center" sx={{ mt: 2 }} className='block w-fit ml-auto hover:underline hover:bg-blue-400'> 
                                Already registered? <Link to="/login">login here</Link>
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;

/*
import React, { useState } from 'react';
import { Authority, registerUser, User } from '../../services/UserService';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Register: React.FC = () => {
    const location = useLocation();
    const message = location.state && location.state.message;

    const currentUser = localStorage.getItem("userId");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [errors, setErrors] = useState<{
        firstName: string;
        lastName: string;
        emailAddress: string;
        telephone: string;
        password: string;
    }>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        telephone: '',
        password: ''
       
    });

    const navigate = useNavigate();

    const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const user = { firstName, lastName, emailAddress, telephone, password };
            try {
                const response = await registerUser(user);
                if (response) {
                    setSuccessMessage("A new user is registered");
                    setErrorMessage("");
                    navigate('/login');
                } else {
                    setErrorMessage("Error registering user");
                }
            } catch (error) {
                setSuccessMessage("");
                setErrorMessage(`Registration error: ${error.message}`);
            }
            setTimeout(() => {
                setErrorMessage("");
                setSuccessMessage("");
            }, 5000);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (firstName.trim()) {
            errorsCopy.firstName = '';
        } else {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        }

        if (!emailAddress.trim()) {
            errorsCopy.emailAddress = 'Email address required';
            valid = false;
        }

        if (!telephone.trim()) {
            errorsCopy.telephone = 'Telephone number is required';
            valid = false;
        }

        if (!password.trim()) {
            errorsCopy.password = 'Password is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const saveUser2 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const authorities: Authority[] = [{ authority: "USER" }];
                const user: User = {
                    firstName,
                    lastName,
                    emailAddress,
                    telephone,
                    password,
                    authorities
                };
                const response = await registerUser(user);

                if (response) {
                    setSuccessMessage("A new user is registered");
                    setErrorMessage('');
                    navigate('/login');
                } else {
                    setErrorMessage('Error registering user');
                }
            } catch (error) {
                setSuccessMessage('');
                setErrorMessage(`Registration error: ${error.message}`);
            }
            setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 5000);
        }
    }

    return (
        <section className='container col-6 mt-5 mb-5'>
            {message && <p className='text-warning px-5'>{message}</p>}
            {successMessage && <p className='text-warning px-5'>{successMessage}</p>}
            {currentUser && <h6 className='text-success text-center'>You are logged in as: {currentUser}
                <h6>Not you? <Link to="/login">login here</Link></h6></h6>}

            {errorMessage && <p className='alert alert-danger'>{errorMessage}</p>}
            {successMessage && <p className='alert alert-success'>{successMessage}</p>}

            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h1 className='text-center'>Register here</h1>
                    <div className='card-body'>
                        <form onSubmit={saveUser2}>
                            <div className='form-group mb-2'>
                                <label className='form-label'>First Name</label>
                                <input
                                    type='text'
                                    placeholder='Enter user First Name'
                                    name='firstName'
                                    value={firstName}
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Last Name</label>
                                <input
                                    type='text'
                                    placeholder='Enter user Last Name'
                                    name='lastName'
                                    value={lastName}
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Email Address</label>
                                <input
                                    type='text'
                                    placeholder='Enter your email address'
                                    name='email'
                                    value={emailAddress}
                                    className={`form-control ${errors.emailAddress ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                                {errors.emailAddress && <div className='invalid-feedback'>{errors.emailAddress}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Telephone</label>
                                <input
                                    type='number'
                                    placeholder='Enter your telephone number'
                                    name='phone'
                                    value={telephone}
                                    className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                    onChange={(e) => setTelephone(e.target.value)}
                                />
                                {errors.telephone && <div className='invalid-feedback'>{errors.telephone}</div>}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Password</label>
                                <input
                                    type='password'
                                    placeholder='Enter your password'
                                    name='password'
                                    value={password}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                            </div>
                            <div>
                                <button type='submit' className='btn-otc btn-otc:hover'>Submit</button>
                                <span style={{ marginLeft: "10px" }}>Already registered? <Link to="/login">login here</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
*/