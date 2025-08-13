const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const geminiService = require('./geminiService');

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

// AI Analytics Endpoints

// Get comprehensive business analytics with AI insights
app.get('/api/analytics/ai-insights', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    
    // Get all business data for the user
    const products = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM products WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const customers = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM customers WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const sales = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM sales WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    // Prepare data for AI analysis
    const businessData = {
      products: {
        total: products.length,
        categories: products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {}),
        stockLevels: products.map(p => ({ name: p.name, stock: p.stock, price: p.price, cost: p.cost })),
        lowStock: products.filter(p => p.stock < 10)
      },
      customers: {
        total: customers.length,
        segments: customers.length > 0 ? 'Active customer base' : 'No customers yet'
      },
      sales: {
        total: sales.length,
        revenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        averageOrderValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0
      }
    };

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, returning mock insights');
      return res.json({
        businessData,
        aiInsights: `Based on your business data analysis:

**Key Performance Insights:**
- You have ${businessData.products.total} products across ${Object.keys(businessData.products.categories).length} categories
- Total customer base: ${businessData.customers.total} customers
- Sales performance: ${businessData.sales.total} transactions with ₹${businessData.sales.revenue.toFixed(2)} total revenue

**Recommendations:**
- Monitor low stock items (${businessData.products.lowStock.length} items need attention)
- Focus on category optimization for better revenue distribution
- Consider customer retention strategies with your current base

**Note:** Enable Gemini API for AI-powered insights and trend analysis.`
      });
    }

    // Generate AI insights
    const aiInsights = await geminiService.generateBusinessInsights(businessData);
    
    res.json({
      businessData,
      aiInsights
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ error: 'Failed to generate AI insights' });
  }
});

// Get AI-powered trend analysis
app.get('/api/analytics/trends', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    
    // Get historical sales data
    const sales = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          strftime('%Y-%m', sale_date) as month,
          COUNT(*) as order_count,
          SUM(total) as revenue,
          AVG(total) as avg_order_value
        FROM sales 
        WHERE user_id = ? 
        GROUP BY strftime('%Y-%m', sale_date)
        ORDER BY month DESC
        LIMIT 12
      `, [req.user.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    if (sales.length === 0) {
      return res.json({
        message: 'Insufficient data for trend analysis',
        trends: []
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, returning mock trend analysis');
      return res.json({
        historicalData: sales,
        trendAnalysis: `**Trend Analysis Summary:**

**Data Overview:**
- Analysis period: ${sales.length} months
- Total orders: ${sales.reduce((sum, s) => sum + s.order_count, 0)}
- Total revenue: ₹${sales.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)}
- Average order value: ₹${(sales.reduce((sum, s) => sum + s.revenue, 0) / sales.reduce((sum, s) => sum + s.order_count, 0)).toFixed(2)}

**Key Trends:**
- Revenue patterns show ${sales[0].revenue > sales[sales.length - 1].revenue ? 'growth' : 'decline'} trend
- Order volume ${sales[0].order_count > sales[sales.length - 1].order_count ? 'increasing' : 'decreasing'}
- Customer spending patterns indicate ${sales[0].avg_order_value > sales[sales.length - 1].avg_order_value ? 'higher' : 'lower'} average order values

**Recommendations:**
- Monitor monthly performance patterns
- Analyze seasonal variations in sales data
- Focus on strategies to improve order values

**Note:** Enable Gemini API for advanced AI-powered trend analysis and predictions.`
      });
    }

    // Generate AI trend analysis
    const trendAnalysis = await geminiService.generateTrendAnalysis(sales);
    
    res.json({
      historicalData: sales,
      trendAnalysis
    });
  } catch (error) {
    console.error('Error generating trend analysis:', error);
    res.status(500).json({ error: 'Failed to generate trend analysis' });
  }
});

// AI Chatbot endpoint
app.post('/api/chatbot', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const db = getDb();
    
    // Get relevant business context based on the message
    let contextData = {};
    
    if (message.toLowerCase().includes('inventory') || message.toLowerCase().includes('stock') || message.toLowerCase().includes('product')) {
      const products = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM products WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      contextData.products = products;
    }
    
    if (message.toLowerCase().includes('customer') || message.toLowerCase().includes('client')) {
      const customers = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM customers WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      contextData.customers = customers;
    }
    
    if (message.toLowerCase().includes('sales') || message.toLowerCase().includes('revenue') || message.toLowerCase().includes('profit')) {
      const sales = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM sales WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      contextData.sales = sales;
    }

    db.close();

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, returning mock chatbot response');
      
      // Generate contextual response based on available data
      let response = "I'm here to help with your business questions! ";
      
      if (Object.keys(contextData).length > 0) {
        if (contextData.products) {
          response += `I can see you have ${contextData.products.length} products in your inventory. `;
          if (contextData.products.some(p => p.stock < 10)) {
            response += `Some items are running low on stock and may need reordering. `;
          }
        }
        if (contextData.customers) {
          response += `You have ${contextData.customers.length} customers in your database. `;
        }
        if (contextData.sales) {
          response += `Your sales data shows ${contextData.sales.length} transactions. `;
        }
        response += "For more detailed AI-powered insights, please configure the Gemini API key.";
      } else {
        response += "I can help you with inventory management, customer insights, and sales analysis. For AI-powered responses, please configure the Gemini API key.";
      }
      
      return res.json({
        response,
        context: Object.keys(contextData).length > 0 ? 'Data-aware response' : 'General response'
      });
    }

    // Generate AI response with context
    const aiResponse = await geminiService.generateChatbotResponse(message, contextData);
    
    res.json({
      response: aiResponse,
      context: Object.keys(contextData).length > 0 ? 'Data-aware response' : 'General response'
    });
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get specific analytics insights based on query
app.post('/api/analytics/query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const db = getDb();
    
    // Get relevant business data based on the query
    let relevantData = {};
    
    if (query.toLowerCase().includes('product') || query.toLowerCase().includes('inventory')) {
      const products = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM products WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      relevantData.products = products;
    }
    
    if (query.toLowerCase().includes('customer') || query.toLowerCase().includes('client')) {
      const customers = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM customers WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      relevantData.customers = customers;
    }
    
    if (query.toLowerCase().includes('sales') || query.toLowerCase().includes('revenue')) {
      const sales = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM sales WHERE user_id = ?', [req.user.id], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      relevantData.sales = sales;
    }

    db.close();

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, returning mock analytics response');
      
      let insights = `**Analysis for: "${query}"**\n\n`;
      
      if (Object.keys(relevantData).length > 0) {
        if (relevantData.products) {
          insights += `**Inventory Analysis:**\n`;
          insights += `- Total products: ${relevantData.products.length}\n`;
          insights += `- Categories: ${Object.keys(relevantData.products.reduce((acc, p) => { acc[p.category] = true; return acc; }, {})).join(', ')}\n`;
          insights += `- Low stock items: ${relevantData.products.filter(p => p.stock < 10).length}\n\n`;
        }
        if (relevantData.customers) {
          insights += `**Customer Analysis:**\n`;
          insights += `- Total customers: ${relevantData.customers.length}\n\n`;
        }
        if (relevantData.sales) {
          insights += `**Sales Analysis:**\n`;
          insights += `- Total transactions: ${relevantData.sales.length}\n`;
          insights += `- Total revenue: ₹${relevantData.sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}\n\n`;
        }
        insights += `**Recommendations:**\n`;
        insights += `- Monitor inventory levels regularly\n`;
        insights += `- Analyze customer purchasing patterns\n`;
        insights += `- Track sales performance trends\n\n`;
        insights += `*Note: Enable Gemini API for AI-powered insights and detailed analysis.*`;
      } else {
        insights += `I can help analyze your business data. Please ask specific questions about:\n`;
        insights += `- Inventory and products\n`;
        insights += `- Customer information\n`;
        insights += `- Sales and revenue data\n\n`;
        insights += `*Note: Enable Gemini API for AI-powered insights.*`;
      }
      
      return res.json({
        query,
        relevantData,
        insights
      });
    }

    // Generate AI insights based on the specific query
    const insights = await geminiService.generateAnalyticsInsights(relevantData, query);
    
    res.json({
      query,
      relevantData,
      insights
    });
  } catch (error) {
    console.error('Error processing analytics query:', error);
    res.status(500).json({ error: 'Failed to process analytics query' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database initialized at: ${dbPath}`);
}); 