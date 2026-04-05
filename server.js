const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cabride',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('✓ MySQL connected');
        conn.release();
    })
    .catch(err => {
        console.log('⚠ MySQL not connected. Using demo mode.');
    });

// User registration
app.post('/api/users/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword]
        );
        
        res.json({ success: true, userId: result.insertId, message: 'Registration successful' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    const { name, phone, date, time, pickup, drop, rideType, userId } = req.body;
    
    if (!name || !phone || !date || !time || !pickup || !drop) {
        return res.status(400).json({ error: 'All fields required' });
    }
    
    try {
        const [result] = await pool.execute(
            'INSERT INTO bookings (user_id, name, phone, pickup_location, drop_location, ride_type, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId || null, name, phone, pickup, drop, rideType || 'mini', date, time, 'confirmed']
        );
        
        const [booking] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
        
        res.json({ success: true, booking: booking[0] });
    } catch (error) {
        res.status(500).json({ error: 'Booking failed', details: error.message });
    }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const [bookings] = await pool.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get user bookings
app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const [bookings] = await pool.execute(
            'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.userId]
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const [bookings] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(bookings[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Cancel booking
app.put('/api/bookings/:id/cancel', async (req, res) => {
    try {
        await pool.execute('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
        res.json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Get available drivers
app.get('/api/drivers/available', async (req, res) => {
    try {
        const [drivers] = await pool.execute(
            'SELECT id, name, vehicle_type, vehicle_number, rating FROM drivers WHERE is_available = TRUE AND status = "active"'
        );
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
});

// Driver application
app.post('/api/drivers/apply', async (req, res) => {
    const { name, phone, email, licenseNumber, vehicleType, vehicleNumber } = req.body;
    
    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    
    try {
        const [result] = await pool.execute(
            'INSERT INTO drivers (name, email, phone, license_number, vehicle_type, vehicle_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone, licenseNumber || null, vehicleType || null, vehicleNumber || null, 'pending']
        );
        
        res.json({ success: true, message: 'Application submitted', driverId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Application failed' });
    }
});

// Get active offers
app.get('/api/offers', async (req, res) => {
    try {
        const [offers] = await pool.execute(
            'SELECT * FROM offers WHERE is_active = TRUE AND valid_until >= CURDATE()'
        );
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// Claim offer
app.post('/api/offers/claim', async (req, res) => {
    const { userId, offerCode } = req.body;
    
    try {
        const [offers] = await pool.execute('SELECT * FROM offers WHERE code = ? AND is_active = TRUE', [offerCode]);
        
        if (offers.length === 0) {
            return res.status(404).json({ error: 'Offer not found' });
        }
        
        await pool.execute(
            'INSERT INTO user_offers (user_id, offer_id) VALUES (?, ?)',
            [userId, offers[0].id]
        );
        
        res.json({ success: true, message: 'Offer claimed successfully', offer: offers[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to claim offer' });
    }
});

// Calculate fare
app.post('/api/fare/calculate', async (req, res) => {
    const { distance, rideType } = req.body;
    
    const baseFares = { mini: 50, auto: 30, suv: 100 };
    const perKmRate = { mini: 15, auto: 10, suv: 25 };
    
    const baseFare = baseFares[rideType] || 50;
    const rate = perKmRate[rideType] || 15;
    const fare = baseFare + (distance * rate);
    
    res.json({ 
        success: true, 
        fare: Math.round(fare),
        breakdown: { baseFare, distance, ratePerKm: rate, total: Math.round(fare) }
    });
});

// Track ride
app.get('/api/rides/:bookingId/track', async (req, res) => {
    try {
        const [tracking] = await pool.execute(
            'SELECT * FROM ride_tracking WHERE booking_id = ? ORDER BY updated_at DESC LIMIT 1',
            [req.params.bookingId]
        );
        
        const [booking] = await pool.execute(
            'SELECT b.*, d.name as driver_name, d.vehicle_type, d.vehicle_number, d.rating FROM bookings b LEFT JOIN drivers d ON b.driver_id = d.id WHERE b.id = ?',
            [req.params.bookingId]
        );
        
        if (booking.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json({
            booking: booking[0],
            tracking: tracking[0] || null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track ride' });
    }
});

// Submit review
app.post('/api/reviews', async (req, res) => {
    const { bookingId, userId, driverId, rating, comment } = req.body;
    
    if (!bookingId || !rating) {
        return res.status(400).json({ error: 'Booking ID and rating required' });
    }
    
    try {
        await pool.execute(
            'INSERT INTO reviews (booking_id, user_id, driver_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [bookingId, userId, driverId, rating, comment || null]
        );
        
        // Update driver rating
        if (driverId) {
            const [reviews] = await pool.execute('SELECT AVG(rating) as avg_rating FROM reviews WHERE driver_id = ?', [driverId]);
            await pool.execute('UPDATE drivers SET rating = ? WHERE id = ?', [reviews[0].avg_rating, driverId]);
        }
        
        res.json({ success: true, message: 'Review submitted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// Get booking statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [totalBookings] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
        const [totalDrivers] = await pool.execute('SELECT COUNT(*) as count FROM drivers WHERE status = "active"');
        const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const [recentBookings] = await pool.execute('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
        
        res.json({
            totalBookings: totalBookings[0].count,
            totalDrivers: totalDrivers[0].count,
            totalUsers: totalUsers[0].count,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server running', timestamp: new Date() });
});

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`✓ CabRide server running on http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use. Trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

const PORT = process.env.PORT || 3001;
startServer(PORT);