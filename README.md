# CabRide - Cab Booking Platform

A modern, responsive cab booking website with Node.js backend integration.

## Features

- **Home Section**: Hero section with booking form
- **Rides Section**: Mini, Auto, and Prime SUV options
- **Drive Section**: Driver recruitment with benefits
- **Offers Section**: Special discounts and promotions
- **Gallery Section**: Fleet showcase
- **About Section**: Company information and statistics
- **FAQs Section**: Common questions and answers
- **Footer**: Contact and social links

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **API**: RESTful endpoints

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Open in Browser

Open `CabRide.html` in your web browser or serve it through the Express server.

## API Endpoints

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings

### Drivers
- `POST /api/drivers/apply` - Apply as a driver

### Offers
- `GET /api/offers` - Get available offers
- `POST /api/offers/claim` - Claim an offer

### Fare
- `POST /api/fare/calculate` - Calculate ride fare

### Rides
- `GET /api/rides/:bookingId` - Get ride status

### Health
- `GET /api/health` - Server health check

## Features Implemented

✓ Responsive design (Mobile, Tablet, Desktop)
✓ Form validation
✓ API integration
✓ Loading states
✓ Smooth animations
✓ Mobile navigation menu
✓ Intersection Observer animations
✓ Demo mode (works without server)

## Demo Mode

If the server is not running, the application will work in demo mode with local functionality.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Structure

```
poja/
├── CabRide.html          # Main HTML file
├── CabRide_style.css     # Styling
├── script.js             # Frontend JavaScript
├── server.js             # Node.js backend
├── package.json          # Dependencies
└── README.md             # Documentation
```

## Development

For development with auto-reload:

```bash
npm run dev
```

This requires `nodemon` to be installed.

## License

ISC