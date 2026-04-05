# CabRide - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) - For cloning the repository

## 🚀 Quick Start

### Step 1: Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd poja

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- cors
- mysql2
- bcrypt
- dotenv (if needed)

### Step 3: Setup MySQL Database

#### Option A: Using MySQL Command Line

1. Login to MySQL:
```bash
mysql -u root -p
```

2. Create database:
```sql
CREATE DATABASE cabride;
USE cabride;
```

3. Run the database script:
```bash
mysql -u root -p cabride < database.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new database: `CREATE DATABASE cabride;`
4. Open `database.sql` file
5. Execute the script

### Step 4: Configure Environment (Optional)

Create a `.env` file in the project root:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cabride
PORT=3001
```

**Note:** If you don't create `.env`, the app uses default values.

### Step 5: Start the Server

```bash
npm start
```

You should see:
```
✓ MySQL connected
✓ CabRide server running on http://localhost:3001
```

### Step 6: Access the Application

Open your browser:
```
http://localhost:3001/CabRide.html
```

## 📁 Project Structure

```
poja/
├── CabRide.html           # Main frontend file
├── CabRide_style.css      # Styling with orange-red gradients
├── script.js              # Frontend JavaScript
├── server.js              # Node.js backend server
├── database.sql           # MySQL database schema
├── package.json           # Dependencies
├── SETUP.md              # This file
└── README.md             # Project documentation
```

## ✨ Features

### 🔐 Authentication System
- User registration with email & password
- Secure login with bcrypt encryption
- Session persistence (localStorage)
- Logout functionality

### 🚖 Booking System
- Real-time cab booking form
- Pickup & drop location selection
- Date & time scheduling
- Instant booking confirmation
- Booking ID generation

### 🚗 Ride Options
- **Mini** - Economical hatchback
- **Auto** - Quick rickshaw rides
- **Prime SUV** - Luxury family rides

### 💰 Offers & Discounts
- First ride 50% off
- Referral bonuses
- Monthly passes
- Special promotions

### 👨‍✈️ Driver Features
- Apply to become a driver
- Driver application form
- Status tracking

### 🎨 Modern UI
- Light color scheme
- Orange-red gradient design
- Fully responsive (Mobile/Tablet/Desktop)
- Smooth animations & transitions
- Card-based layouts

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/user/:userId` | Get user bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### Drivers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers/available` | Get available drivers |
| POST | `/api/drivers/apply` | Apply as driver |

### Offers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/offers` | Get active offers |
| POST | `/api/offers/claim` | Claim offer |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/fare/calculate` | Calculate fare |
| GET | `/api/rides/:bookingId/track` | Track ride |
| POST | `/api/reviews` | Submit review |
| GET | `/api/stats` | Platform statistics |
| GET | `/api/health` | Server health check |

## 🔧 Troubleshooting

### Port Already in Use
**Issue:** Port 3001 is occupied

**Solution:** The server automatically tries ports 3002-3005, or manually change:
```bash
PORT=3002 npm start
```

### MySQL Connection Error
**Issue:** Cannot connect to MySQL

**Solutions:**
1. Check if MySQL is running:
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   
   # Windows
   services.msc (look for MySQL)
   ```

2. Verify credentials in `.env` file

3. Check database exists:
   ```sql
   SHOW DATABASES;
   ```

4. Test connection:
   ```bash
   mysql -u root -p
   ```

### Dependencies Installation Error
**Issue:** npm install fails

**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Page Not Loading
**Issue:** Cannot access http://localhost:3001/CabRide.html

**Solutions:**
1. Ensure server is running
2. Check console for errors
3. Try different browser
4. Clear browser cache

### Login/Signup Not Working
**Issue:** Authentication fails

**Solutions:**
1. Check if MySQL is connected (see server logs)
2. Verify `users` table exists in database
3. Check browser console for errors

## 🎯 Demo Mode

If MySQL is not configured, the application runs in **demo mode**:
- ✓ Booking form works (local alerts)
- ✓ UI fully functional
- ✗ No data persistence
- ✗ Login/signup disabled

## 🧪 Testing the Application

### Test User Registration
1. Click "Sign Up" button
2. Fill in details
3. Click "Sign Up"
4. Should see success message

### Test Booking
1. Fill booking form on homepage
2. Enter all required fields
3. Click "Search Cabs"
4. Should receive booking confirmation with ID

### Test Driver Application
1. Scroll to "Become a Driver" section
2. Click "Apply Now"
3. Fill in details
4. Submit application

## 📝 Development

### Run with Auto-Reload
```bash
npm install -g nodemon
nodemon server.js
```

### Database Reset
```bash
mysql -u root -p cabride < database.sql
```

## 🌐 Browser Support

- ✓ Chrome (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ Mobile browsers

## 📞 Support

For issues:
1. Check server console logs
2. Check browser console (F12)
3. Review this setup guide
4. Check database connection

## 🎨 UI Customization

To modify colors, edit `CabRide_style.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff4500 100%);
    --light-bg: #fff5f0;
    --orange: #ff6b35;
}
```