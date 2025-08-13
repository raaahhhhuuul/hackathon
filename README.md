# AI Business Analytics Dashboard

A comprehensive AI-powered business analytics dashboard for small businesses, featuring inventory management, customer analytics, sales tracking, and intelligent insights.

## Features

### 🔐 Authentication System
- **User Registration & Login**: Secure user accounts with JWT authentication
- **SQLite Database**: Persistent storage for user profiles and data
- **Password Security**: Bcrypt hashing for secure password storage

### 📦 Inventory Management
- **Product Management**: Add, edit, delete, and view products
- **Stock Tracking**: Real-time stock level monitoring with status indicators
- **CSV Import**: Bulk upload products from CSV files
- **Smart Status**: Automatic status updates based on stock levels (in-stock, low-stock, out-of-stock)

### 📊 Analytics & Insights
- **AI Recommendations**: Intelligent suggestions for inventory optimization
- **Real-time Statistics**: Live inventory metrics and financial data
- **Performance Tracking**: Monitor business performance over time

### 👥 Customer Management
- **Customer Database**: Store and manage customer information
- **Sales Tracking**: Record and analyze sales transactions
- **Relationship Management**: Build and maintain customer relationships

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **SQLite3** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **CSV Parser** for data import

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend Server
```bash
npm run server
```
The backend server will start on port 5001 and automatically initialize the SQLite database.

### 4. Start the Frontend (in a new terminal)
```bash
npm start
```
The React app will start on port 3000.

### 5. Run Both Simultaneously (Optional)
```bash
npm run dev
```
This command runs both the backend server and frontend concurrently.

## Database Schema

The application automatically creates the following tables:

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `created_at`: Account creation timestamp

### Products Table
- `id`: Primary key
- `name`: Product name
- `category`: Product category
- `sku`: Unique stock keeping unit
- `stock`: Current stock quantity
- `price`: Selling price
- `cost`: Product cost
- `status`: Stock status (auto-calculated)
- `last_updated`: Last modification timestamp
- `supplier`: Supplier information
- `user_id`: Foreign key to users table

### Customers Table
- `id`: Primary key
- `name`: Customer name
- `email`: Customer email
- `phone`: Phone number
- `address`: Customer address
- `created_at`: Customer creation timestamp
- `user_id`: Foreign key to users table

### Sales Table
- `id`: Primary key
- `product_id`: Foreign key to products table
- `customer_id`: Foreign key to customers table
- `quantity`: Sold quantity
- `price`: Sale price
- `total`: Total sale amount
- `sale_date`: Sale timestamp
- `user_id`: Foreign key to users table

## CSV Upload Format

To bulk import products, use the following CSV format:

```csv
name,category,sku,stock,price,cost,supplier
Laptop Pro X1,Electronics,LP-X1-001,45,1299.99,850.00,TechCorp Inc.
Smartphone Galaxy S24,Electronics,SG-S24-002,8,899.99,600.00,MobileTech Ltd.
```

**Required columns**: name, category, sku, stock, price, cost
**Optional columns**: supplier

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/upload-csv` - Upload CSV file

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer

**Note**: The backend API runs on port 5001 (http://localhost:5001)

## Usage

### 1. Create an Account
- Navigate to the landing page
- Click "Get Started" and create a new account
- Log in with your credentials

### 2. Add Products
- Go to the Inventory page
- Click "Add Product" to manually add products
- Or use "Upload CSV" to bulk import products

### 3. Manage Inventory
- View all products in the inventory table
- Filter by category or status
- Search for specific products
- Delete products as needed

### 4. Monitor Analytics
- View real-time inventory statistics
- Check AI recommendations for inventory optimization
- Monitor stock levels and alerts

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **User Isolation**: Each user can only access their own data
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## File Structure

```
hackathon/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AddProductModal.tsx
│   │   ├── CSVUploadModal.tsx
│   │   ├── Sidebar.tsx
│   │   └── Chatbot.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── Inventory.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   └── api.ts
│   └── App.tsx
├── server/                 # Backend server
│   └── index.js
├── uploads/                # CSV upload directory
└── package.json
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `server/index.js` or kill existing process
   - Frontend: React will automatically suggest an alternative port

2. **Database Errors**
   - Ensure the server has write permissions in the project directory
   - Check that SQLite3 is properly installed

3. **CSV Upload Issues**
   - Verify CSV format matches the required structure
   - Check file size (should be reasonable for CSV files)
   - Ensure all required columns are present

### Development Tips

- Use `npm run dev` to run both frontend and backend simultaneously
- Check browser console and server logs for debugging information
- The database file (`server/database.sqlite`) is created automatically on first run

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team. 