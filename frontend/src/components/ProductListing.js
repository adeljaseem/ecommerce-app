import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleGoBack = () => {
        navigate('/admin');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                minHeight: '100vh',
                py: 4,
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Product Listing
                    </Typography>
                    <Box>
                        <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mr: 2 }}>
                            Back to Dashboard
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Box>


                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock: {product.stock}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ProductListing;