# 🇪🇹 EthioExplore — Full-Stack Travel Platform

Modern full-stack Ethiopian itinerary planning and destination discovery platform with React (JSX) frontend and secure Node.js/Express + MySQL authentication backend.

---

## 🚀 Key Features

* **Complete TS/TSX to JS/JSX Conversion**: Clean, modern, maintainable JavaScript with React functional components and hooks.
* **Real MySQL Authentication**: Secure registration and login backed by MySQL database with parameterized queries.
* **Password Security**: Passwords hashed with `bcryptjs` (salt rounds: 10). Never stored or transmitted in plain text.
* **JWT Token Authentication**: Signed JWT tokens stored in `localStorage` and verified via `Authorization: Bearer <token>` middleware.
* **Protected Routes**: `/planner` and `/favorites` are protected via `<ProtectedRoute>`, redirecting unauthenticated users to `/login`.
* **State Management**:
  * `AuthContext` with persistent session validation (`/api/auth/me`).
  * `TripContext` for itinerary planning, budget calculations (USD & ETB conversion at 161 ETB/$), and favorites wishlist with `localStorage` persistence.
* **Responsive Modern UI**: Built with Tailwind CSS, Lucide icons, responsive navigation with mobile drawer, and Sonner toast notifications.

---

## 📂 Project Structure

```text
pixel-perfect-show-565/
├── server/                    # Node.js + Express Backend
│   ├── config/
│   │   └── database.js        # MySQL connection pool (mysql2/promise)
│   ├── controllers/
│   │   └── authController.js  # Registration, Login, Profile (me), Logout
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT Bearer token authentication
│   ├── models/
│   │   └── userModel.js       # Prepared SQL statements for users
│   ├── routes/
│   │   └── authRoutes.js      # REST API endpoints
│   ├── utils/
│   │   └── token.js           # JWT sign & verify utilities
│   ├── scripts/
│   │   └── initDb.js          # Database & table initialization script
│   ├── database.sql           # MySQL schema definition
│   ├── app.js                 # Express application & middleware
│   └── server.js              # Server entry point (port 5000)
├── src/                       # React Frontend (JS/JSX)
│   ├── assets/                # Images and static assets
│   ├── components/            # Reusable UI components
│   │   ├── AuthShell.jsx      # Split-screen auth layout with motif
│   │   ├── DestinationCard.jsx# Interactive destination cards with favorites
│   │   ├── Footer.jsx         # Site footer
│   │   ├── Navbar.jsx         # Navigation with active states & user status
│   │   ├── ProtectedRoute.jsx # Route authentication guard
│   │   ├── RouteMotif.jsx     # Visual SVG trail motif
│   │   └── ui/sonner.jsx      # Toast notification system
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication provider & useAuth hook
│   ├── lib/
│   │   ├── api.js             # Universal API request helper
│   │   ├── data.js            # Curated Ethiopian destinations & metadata
│   │   ├── trip-store.jsx     # Itinerary & favorites context store
│   │   └── utils.js           # Classname merger
│   ├── pages/                 # Application Pages
│   │   ├── HomePage.jsx
│   │   ├── DestinationsPage.jsx
│   │   ├── DestinationDetailPage.jsx
│   │   ├── PlannerPage.jsx    # (Protected)
│   │   ├── FavoritesPage.jsx  # (Protected)
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx                # React Router root configuration
│   ├── main.jsx               # React DOM root entry
│   └── styles.css             # Tailwind CSS styles and theme variables
├── index.html                 # Vite HTML entry
├── vite.config.js             # Vite configuration with /api proxy
├── tailwind.config.js         # Tailwind theme & color configurations
├── postcss.config.js          # PostCSS configuration
├── .env.example               # Example environment variables
└── package.json               # Dependencies & scripts
```

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Default configuration in `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ethioexplore_db

# JWT Authentication
JWT_SECRET=ethioexplore_secure_jwt_secret_key_change_in_production_2026
JWT_EXPIRES_IN=7d

# Frontend API URL (for Vite)
VITE_API_URL=http://localhost:5000
```

### 3. Initialize MySQL Database

Make sure MySQL server is running, then initialize the database and tables:

```bash
npm run db:init
```

Or manually execute `server/database.sql` in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS ethioexplore_db;
USE ethioexplore_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Start the Application

You can start the backend and frontend in separate terminals:

#### Start Backend:
```bash
npm run server
# or with auto-reload during development:
npm run server:dev
```
Backend runs at: **`http://localhost:5000`**

#### Start Frontend:
```bash
npm run dev
```
Frontend runs at: **`http://localhost:5173`**

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in with email & password | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (`Bearer <token>`) |
| `POST` | `/api/auth/logout` | Log out session | No |
| `GET` | `/api/health` | Backend health check | No |

---

## 🧪 Build Verification

To verify production frontend build:

```bash
npm run build
```
