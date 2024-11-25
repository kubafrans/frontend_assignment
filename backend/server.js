const express = require('express');
const secretKey = 'secret';
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const port = process.env.port || 3001;
const user_db = require('./db/users');
const db = require('./db/db_conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const sql = 'SELECT * FROM registered_users WHERE username = ?';
    const rows = await user_db.pool.query(sql, [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: '1h' }
        );
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const sql = 'Select * from products';
    const result = await db.pool.query(sql);
    res.send(result);
  } catch (error) {
    throw error;
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, product_price, in_stock } = req.body;
  try {
    const sql =
      'UPDATE products SET product_name = ?, product_price = ?, in_stock = ? WHERE product_id = ?';
    const result = await db.pool.query(sql, [
      product_name,
      product_price,
      in_stock,
      id,
    ]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/products', async (req, res) => {
  const { product_name, product_price, in_stock } = req.body;
  try {
    const sql =
      'INSERT INTO products (product_name, product_price, in_stock) VALUES (?, ?, ?)';
    const result = await db.pool.query(sql, [
      product_name,
      product_price,
      in_stock,
    ]);
    res
      .status(201)
      .json({
        message: 'Product added successfully',
        productId: result.insertId,
      });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
