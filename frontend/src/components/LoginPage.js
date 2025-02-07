import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { TextField, Button, Container, Paper, Typography, Box, Tabs, Tab } from '@mui/material';

const LoginPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password,
            });

            if (response.status === 200) {
                login(response.data.token);
                navigate('/admin');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                email,
                password,
            });

            if (response.status === 201) {
                alert('Signup successful! Please login.');
                setTabValue(0);
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Signup failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'primary.main',
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                E-Commerce Site Title
            </Typography>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Login
                            </Typography>
                            {error && <Typography color="error" align="center">{error}</Typography>}
                            <form onSubmit={handleLoginSubmit}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                >
                                    Login
                                </Button>
                            </form>
                        </Box>
                    )}

                    {tabValue === 1 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Signup
                            </Typography>
                            {error && <Typography color="error" align="center">{error}</Typography>}
                            <form onSubmit={handleSignupSubmit}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                >
                                    Signup
                                </Button>
                            </form>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;