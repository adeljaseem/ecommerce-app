const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// db connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }
};

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin'], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            return res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error hashing password' });
    }
});


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error during login' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

                return res.status(200).json({ message: 'Login successful', token: token });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error comparing passwords' });
        }
    });
});

app.post('/api/products', verifyToken, verifyAdmin, (req, res) => {
    const { name, description, price, stock, image } = req.body;

    db.query(
        'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, stock, image],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error creating product' });
            }
            return res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
        }
    );
});

app.put('/api/products/:id', verifyToken, verifyAdmin, (req, res) => {
    const productId = req.params.id;
    const { name, description, price, stock, image } = req.body;

    db.query(
        'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?',
        [name, description, price, stock, image, productId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error updating product' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({ message: 'Product updated successfully' });
        }
    );
});

app.delete('/api/products/:id', verifyToken, verifyAdmin, (req, res) => {
    const productId = req.params.id;

    db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error deleting product' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
    });
});

app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        return res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'user'], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering user' });
            }

            return res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error hashing password' });
    }
});