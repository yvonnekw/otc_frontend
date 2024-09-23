import React, { useState } from 'react';
import { Authority, registerUser } from '../../services/UserService';
import { Link, useLocation } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Alert, Box, InputAdornment, IconButton } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
    const location = useLocation();
    const message = location.state && location.state.message;

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
                    console.log("username ", response)
                    if (response) {
                        setSuccessMessage(`Congratulations ${firstName}! You have successfully registered. Please, note down your 
                        username for logging in. ${response}`);
                        setErrorMessage('');
                        toast.success(`Welcome, ${firstName}! You have been successfully registered.`);
                    } else {
                        setErrorMessage('Error registering user');
                        toast.error('Error registering user');
                    }
                } catch (error) {
                    setSuccessMessage('');
                    setErrorMessage(`Registration error: ${error.message}`);
                    toast.error(`Registration error: ${error.message}`);
                }
            } else {
                setErrorMessage("Please check password and confirm password");
                toast.error("Passwords do not match");
            }
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
