const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Database initialization
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'database.sqlite');

// Initialize database and create tables
function initializeDatabase() {
  const db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      status TEXT DEFAULT 'in-stock',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      supplier TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Sales table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      customer_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (customer_id) REFERENCES customers (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
  });

  db.close();
}

// Initialize database
initializeDatabase();

// Helper function to get database connection
function getDb() {
  return new sqlite3.Database(dbPath);
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ 
          message: 'User registered successfully',
          token,
          user: { id: this.lastID, name, email }
        });
      }
    );

    db.close();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      db.close();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        db.close();
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }

    db.close();
  });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      db.close();
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
    db.close();
  });
});

// Product routes
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, category, sku, stock, price, cost, supplier } = req.body;
  
  if (!name || !category || !sku || stock === undefined || !price || cost === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = getDb();
  
  db.run(
    'INSERT INTO products (name, category, sku, stock, price, cost, supplier, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, category, sku, stock, price, cost, supplier, req.user.id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          db.close();
          return res.status(400).json({ error: 'SKU already exists' });
        }
        db.close();
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ 
        message: 'Product added successfully',
        id: this.lastID
      });
      db.close();
    }
  );
});

// Get all products for a user
app.get('/api/products', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.all('SELECT * FROM products WHERE user_id = ? ORDER BY last_updated DESC', [req.user.id], (err, products) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(products);
    db.close();
  });
});

// Update product
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, category, sku, stock, price, cost, supplier, status } = req.body;
  
  const db = getDb();
  
  db.run(
    'UPDATE products SET name = ?, category = ?, sku = ?, stock = ?, price = ?, cost = ?, supplier = ?, status = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [name, category, sku, stock, price, cost, supplier, status, id, req.user.id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully' });
      db.close();
    }
  );
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  db.run('DELETE FROM products WHERE id = ? AND user_id = ?', [id, req.user.id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
    db.close();
  });
});

// CSV upload endpoint
app.post('/api/upload-csv', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const db = getDb();
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Process CSV data and insert into database
      let successCount = 0;
      let errorCount = 0;
      
      results.forEach((row, index) => {
        const { name, category, sku, stock, price, cost, supplier } = row;
        
        if (name && category && sku && stock && price && cost) {
          db.run(
            'INSERT OR REPLACE INTO products (name, category, sku, stock, price, cost, supplier, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, category, sku, parseInt(stock), parseFloat(price), parseFloat(cost), supplier || '', req.user.id],
            function(err) {
              if (err) {
                errorCount++;
              } else {
                successCount++;
              }
              
              // If this is the last row, send response
              if (index === results.length - 1) {
                // Clean up uploaded file
                fs.unlinkSync(req.file.path);
                
                res.json({
                  message: 'CSV upload completed',
                  successCount,
                  errorCount,
                  totalRows: results.length
                });
                db.close();
              }
            }
          );
        } else {
          errorCount++;
          if (index === results.length - 1) {
            fs.unlinkSync(req.file.path);
            res.json({
              message: 'CSV upload completed',
              successCount,
              errorCount,
              totalRows: results.length
            });
            db.close();
          }
        }
      });
    })
    .on('error', (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Error processing CSV file' });
      db.close();
    });
});

// Customer routes
app.post('/api/customers', authenticateToken, (req, res) => {
  const { name, email, phone, address } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const db = getDb();
  
  db.run(
    'INSERT INTO customers (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, address, req.user.id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ 
        message: 'Customer added successfully',
        id: this.lastID
      });
      db.close();
    }
  );
});

// Get all customers for a user
app.get('/api/customers', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.all('SELECT * FROM customers WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, customers) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(customers);
    db.close();
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database initialized at: ${dbPath}`);
}); 