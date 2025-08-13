# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application
```bash
# Option A: Use the startup script (recommended)
./start.sh

# Option B: Start manually
npm run dev
```

### Step 3: Open Your Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📋 What's New

### ✅ Working Features
- **User Authentication**: Register, login, and logout
- **SQLite Database**: Persistent data storage
- **Inventory Management**: Add, edit, delete products
- **CSV Upload**: Bulk import products from CSV files
- **Real-time Updates**: Live inventory statistics
- **Smart Status**: Automatic stock level indicators

### 🔧 Database Tables Created Automatically
- Users (authentication)
- Products (inventory)
- Customers (customer management)
- Sales (transaction tracking)

## 🧪 Test the Application

### 1. Create an Account
- Go to http://localhost:3000
- Click "Get Started"
- Fill in your details and create an account

### 2. Add Products
- Navigate to Inventory page
- Click "Add Product" to add manually
- Or use "Upload CSV" with the sample file

### 3. Test CSV Upload
- Use the included `sample_inventory.csv` file
- Click "Upload CSV" in the Inventory page
- Select the CSV file and upload

## 📁 Sample Files

- `sample_inventory.csv` - Test CSV file with 10 sample products
- `start.sh` - Quick startup script

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Database Issues
- The SQLite database is created automatically
- Check file permissions in the project directory
- Ensure the server has write access

### Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Default Configuration

- **Backend Port**: 5001
- **Frontend Port**: 3000
- **Database**: SQLite (server/database.sqlite)
- **JWT Secret**: 'your-secret-key' (change in production)

## 📚 Next Steps

1. **Add Real Products**: Use the CSV upload or manual entry
2. **Manage Customers**: Add customer information
3. **Track Sales**: Record transactions
4. **Customize**: Modify categories, status thresholds, etc.

## 🚨 Security Notes

- Change the JWT secret in production
- Use environment variables for sensitive data
- Implement proper CORS policies for production
- Add rate limiting for production use

---

**Need Help?** Check the main README.md for detailed documentation. 