# Safarni 🌍

> Your Ultimate Travel Booking Platform

A modern travel booking platform where users can search and book flights, hotels, tours, and car rentals — all in one place. Built as a React SPA with Vite, Redux Toolkit, and styled with Tailwind CSS, connected to an Express/MongoDB backend.

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express-Node.js-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer)

-----

## ✨ Features

### 🏠 Landing Page

- Full-screen parallax hero with floating booking cards
- Quick search bar with tabs (Flights / Hotels / Tours / Cars)
- Popular destinations grid
- Featured tours & hotels sections
- Why Safarni section
- Stats counter (2M+ travelers, 150+ destinations)
- Newsletter CTA

### ✈️ Flights

- Search flights with From / To / Date / Passengers
- Filter by Airline, Stops, Class, Max Price
- Sort by Price, Duration, Rating
- Visual route display with flight path animation
- Detailed flight page with includes and booking sidebar
- Seat availability indicator

### 🏨 Hotels

- Search hotels by City, Stars, Amenities, Price
- Image gallery on detail page
- Full amenities display with icons
- Check-in / Check-out / Guests selector
- Dynamic price calculation per night

### 🗺️ Tours

- Filter by Category, Difficulty, Duration
- Tour highlights and what’s included
- Group size and duration display
- Persons selector with max group validation
- Difficulty badge (Easy / Moderate / Hard)

### 🚗 Car Rentals

- Filter by Type, Brand, Transmission, Location
- Pick-up and Drop-off date selector
- Dynamic total price calculation per days
- Car specs (seats, transmission, features)

### 💳 Checkout

- 2-step flow (Passenger Details → Payment)
- Order summary sidebar
- Booking confirmation with unique reference number
- Connects securely to the bookings database

### 👤 Dashboard

- My bookings (All / Flight / Hotel / Tour / Car)
- Stats cards (Total, Upcoming, Spent, Trip Types)
- Cancel booking functionality
- Real-time status updates from the Express API

### 🔐 Auth

- Email/Password registration & login
- Secure JWT Authentication stored in HTTP-Only cookies (`access_token`, `refresh_token`)
- Protected frontend routes via React Router

-----

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Single Page Application via Vite) |
| Routing | React Router DOM v6 |
| Language | TypeScript |
| State Management | Redux Toolkit |
| Animations | Framer Motion |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Backend API | Express (Node.js) |
| Database | MongoDB (via Mongoose) |

-----

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/booking-app-dev/Booking-Frontend.git
cd Booking-Frontend
npm install
```

### 2. Configure Vite Dev Server Proxy

Vite is pre-configured to proxy all API requests to the Express backend running on port `3000`. You can change the target in [vite.config.ts](vite.config.ts):

```typescript
server: {
  port: 5173,
  proxy: {
    '/auth': 'http://localhost:3000',
    '/bookings': 'http://localhost:3000',
    '/hotels': 'http://localhost:3000',
    ...
  }
}
```

### 3. Run development server

```bash
npm run dev
```

Open <http://localhost:5173> 🎉 (Ensure your Express backend is running on `http://localhost:3000`).

-----

## 📡 API Endpoints

Requests are automatically proxied to the Express server:

```
POST   /auth/signup          Register new user
POST   /auth/login           Login user (sets access_token & refresh_token cookies)
POST   /auth/verify-email    Verify user email
GET    /users/my-profile     Get currently logged in user profile
GET    /bookings             Get user bookings
POST   /bookings             Create new booking
PATCH  /bookings/:id         Update booking status (e.g. cancel booking)
```

-----

## 📁 Project Structure

```
src/
├── app/
│   ├── cars/              # Search & Book Cars
│   ├── checkout/          # 2-step checkout
│   ├── dashboard/         # User dashboard (bookings & stats)
│   ├── flights/           # Flights listing & details
│   ├── hotels/            # Hotels listing & details
│   ├── tours/             # Tours listing & details
│   ├── login/             # Login page
│   ├── register/          # Sign up page
│   └── page.tsx           # Landing page
├── components/
│   ├── Navbar.tsx         # Responsive navbar
│   └── SearchBar.tsx      # Tabbed search widget
├── context/
│   └── AuthContext.tsx    # Context managing user session and fallback
├── data/
│   └── mockData.ts        # Mock flights, hotels, tours, and cars
├── lib/
│   └── utils.ts           # Helper functions & tailwind merge
├── store/
│   ├── bookingSlice.ts    # Redux slice for bookings & search params
│   ├── store.ts           # Central Redux store
│   └── bookingStore.ts    # Custom backwards-compatible hook wrapper
└── types/
    └── index.ts           # TypeScript interfaces
```

-----

## 🎨 Design System

```
Colors:
  Background:  #0d1117 (Dark 950)
  Card:        #1e2433 (Dark 800)
  Primary:     #3b82f6 (Blue 500)
  Accent:      #f59e0b (Gold)
  Text:        #ffffff

Style:
  Dark theme throughout
  Glass morphism cards
  Smooth Framer Motion animations
  Parallax scrolling on hero
  Responsive — mobile first
```

-----

## 📝 License

MIT License


