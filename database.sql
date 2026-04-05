CREATE DATABASE IF NOT EXISTS cabride;
USE cabride;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    ride_type VARCHAR(50) DEFAULT 'mini',
    date DATE NOT NULL,
    time TIME NOT NULL,
    fare DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    driver_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    license_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    rating DECIMAL(3, 2) DEFAULT 5.0,
    status VARCHAR(50) DEFAULT 'pending',
    is_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    description TEXT,
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    offer_id INT,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ride_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    user_id INT,
    driver_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Insert sample offers
INSERT INTO offers (code, discount_type, discount_value, description, valid_from, valid_until) VALUES
('FIRST50', 'percentage', 50, 'Get 50% off on your first ride', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
('REF100', 'amount', 100, 'Refer a friend and get ₹100 credit', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
('AIRPORT', 'free', 0, 'Free airport pickup for bookings above ₹500', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
('MONTHLY20', 'percentage', 20, 'Subscribe to monthly pass and save 20%', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY));

-- Insert sample drivers
INSERT INTO drivers (name, email, phone, license_number, vehicle_type, vehicle_number, rating, status, is_available) VALUES
('Raj Kumar', 'raj@cabride.com', '9876543210', 'DL1234567890', 'Mini', 'DL01AB1234', 4.8, 'active', TRUE),
('Amit Singh', 'amit@cabride.com', '9876543211', 'DL1234567891', 'SUV', 'DL02CD5678', 4.9, 'active', TRUE),
('Vijay Sharma', 'vijay@cabride.com', '9876543212', 'DL1234567892', 'Auto', 'DL03EF9012', 4.7, 'active', TRUE);