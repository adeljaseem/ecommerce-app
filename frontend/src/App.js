import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import ProductListing from './components/ProductListing';
import { AuthProvider, useAuth } from './AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FFDAB9',
        },
        background: {
            default: '#FFDAB9',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/products" element={<ProductListing />} />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate replace to="/login" />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

function PrivateRoute({ children }) {
    const { auth } = useAuth();
    return auth ? children : <Navigate to="/login" />;
}

export default App;