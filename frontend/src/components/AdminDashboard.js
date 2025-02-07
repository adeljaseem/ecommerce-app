import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import {
    TextField,
    Button,
    Container,
    Paper,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: '',
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { token, logout } = useAuth();
    const navigate = useNavigate();


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

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/api/products', newProduct, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
            setNewProduct({ name: '', description: '', price: '', stock: '', image: '' });
        } catch (error) {
            console.error('Error adding product:', error);
            if (error.response && error.response.status === 403) {
                logout();
            }
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, selectedProduct, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response && error.response.status === 403) {
                logout();
            }
        }
    };


    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            if (error.response && error.response.status === 403) {
                logout();
            }
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleGoToProducts = () => {
        navigate('/products');
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
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleGoToProducts}>
                        Go to Products
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Add Product
                            </Typography>
                            <form onSubmit={handleAddProduct}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Price"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="number"
                                />
                                <TextField
                                    label="Stock"
                                    name="stock"
                                    value={newProduct.stock}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="number"
                                />
                                <TextField
                                    label="Image URL"
                                    name="image"
                                    value={newProduct.image}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Add Product
                                </Button>
                            </form>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Product List
                            </Typography>
                            <List>
                                {products.map((product) => (
                                    <ListItem
                                        key={product.id}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditProduct(product)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProduct(product.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`$${product.price} - Stock: ${product.stock}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {selectedProduct && (
                    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Product
                        </Typography>
                        <form onSubmit={handleUpdateProduct}>
                            <TextField
                                label="Name"
                                name="name"
                                value={selectedProduct.name}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={selectedProduct.description}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Price"
                                name="price"
                                value={selectedProduct.price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="number"
                            />
                            <TextField
                                label="Stock"
                                name="stock"
                                value={selectedProduct.stock}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="number"
                            />
                            <TextField
                                label="Image URL"
                                name="image"
                                value={selectedProduct.image}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Update Product
                            </Button>
                        </form>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default AdminDashboard;