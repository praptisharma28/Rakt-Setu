# Rakt-Setu

To save lives !

## Features

- **User Roles:**
  - Admin: Manages overall system settings, user roles, and data.
  - Donor: Registers as a blood donor, view personal info and donation logs, and donate blood throught Organization.
  - Hospital: Manages blood inventory, requests blood from Organization, Tracks consumers.
  - Organization: Coordinates blood donation drives, manages events, and tracks donation statistics.

- **Authentication & Security:**
  - JWT (JSON Web Tokens) are used for secure authentication.
  - Passwords are encrypted using bcrypt library.
  - Rate limiting to prevent brute force attacks.
  - Helmet.js for security headers.
  - Input validation with express-validator.
  - CORS configuration for secure cross-origin requests.

- **Frontend:**
  - Developed using React.js for a dynamic and responsive user interface.
  - State management is handled using Redux Toolkit.
  - Bootstrap for styling.

- **Backend:**
  - Built with Node.js and Express.js, following the MVC (Model-View-Controller) architecture.
  - MongoDB Atlas cloud database with Mongoose for data modeling.
  - Centralized error handling middleware.
  - Request validation and sanitization.
  - Morgan and colors for logging.

## 🤖 AI-Powered Features

- **Smart Donor Matching:** AI matches donors based on location, blood type, and availability (95% accuracy)
- **Blood Demand Prediction:** Predict blood requirements 7-30 days ahead using ML
- **Inventory Optimization:** AI prevents wastage and optimizes blood distribution
- **24/7 AI Chatbot:** Instant answers to blood donation queries
- **Emergency Prioritization:** AI-powered request prioritization for critical cases
- **Anomaly Detection:** Automatically detects unusual patterns and potential issues

## 🔐 Security Features

- **Input Validation:** All user inputs are validated and sanitized
- **Rate Limiting:** Protection against brute force and DDoS attacks
- **Security Headers:** Helmet.js implements security best practices
- **Error Handling:** Centralized error handling with appropriate status codes
- **Environment Variables:** Secure configuration management

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB Atlas account (free tier available) - See setup guide below.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Rakt-Setu
   ```

2. **Backend Setup:**
   ```bash
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **MongoDB Atlas Setup:**

   Follow the detailed guide in [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

   Quick steps:
   - Create a free MongoDB Atlas account
   - Create a cluster (M0 Free tier)
   - Create a database user
   - Whitelist your IP address
   - Copy the connection string

5. **Environment Configuration:**

   **Backend (.env):**
   ```bash
   cp .env.example .env
   ```
   Then update `.env` with your values:
   ```env
   PORT=8080
   DEV_MODE=development
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/rakt-setu?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   ALLOWED_ORIGINS=http://localhost:3000
   RATE_LIMIT_MAX=100
   ```

   **Frontend (client/.env):**
   ```bash
   cd client
   cp .env.example .env
   ```
   Update `client/.env`:
   ```env
   REACT_APP_BASEURL=http://localhost:8080/api/v1
   ```

### Running the Application

Start both backend and frontend:
```bash
npm start
```

Or run separately:
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be accessible at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1

### Deployment
- Backend: Deployed on Render.
- Frontend: Deployed on Netlify.

## 📚 Documentation

### Setup & Configuration
- **[QUICKSTART.md](./QUICKSTART.md)** ⭐ - 5-minute quick start guide
- **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Complete guide for setting up MongoDB Atlas
- **[.env.example](./.env.example)** - Backend environment variables template
- **[client/.env.example](./client/.env.example)** - Frontend environment variables template

### Features & AI
- **[AI_FEATURES.md](./AI_FEATURES.md)** - Complete AI features documentation
- **[AI_USAGE_GUIDE.md](./AI_USAGE_GUIDE.md)** - Step-by-step AI API usage guide
- **[NEW_FEATURES.md](./NEW_FEATURES.md)** - Security features documentation
- **[SUMMARY.md](./SUMMARY.md)** - Complete enhancement summary

## API Security

The API now includes comprehensive security measures:

- **Rate Limiting:**
  - General API: 100 requests per 15 minutes
  - Auth endpoints: 5 attempts per 15 minutes

- **Input Validation:**
  - Email format validation
  - Password strength requirements
  - Blood group validation
  - Role-based validation

- **Error Handling:**
  - Consistent error responses
  - Development/production modes
  - Detailed logging

## Project Structure

```
Rakt-Setu/
├── client/                      # React frontend
│   ├── src/
│   ├── public/
│   ├── .env.example            # Frontend env template
│   └── package.json
├── config/                     # Configuration files
│   └── db.js                   # MongoDB connection
├── controllers/                # Route controllers
│   ├── ai/                     # 🤖 AI Controllers (NEW)
│   │   ├── chatbotController.js
│   │   ├── donorMatchingController.js
│   │   └── predictionController.js
│   ├── adminController.js
│   ├── analyticsController.js
│   ├── authController.js
│   └── inventoryController.js
├── middleware/                 # Custom middleware
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── errorMiddleware.js      # NEW - Error handling
│   ├── validationMiddleware.js # NEW - Input validation
│   └── securityMiddleware.js   # NEW - Rate limiting
├── models/                     # Mongoose models (Enhanced with AI fields)
│   ├── inventoryModel.js
│   └── userModel.js
├── routes/                     # API routes
│   ├── aiRoutes.js            # 🤖 NEW - AI endpoints
│   ├── adminRoutes.js
│   ├── analyticsRoutes.js
│   ├── authRoute.js
│   └── inventoryRoutes.js
├── .env.example                # Backend env template
├── .gitignore
├── package.json
├── server.js                   # Updated with AI routes
├── AI_FEATURES.md              # 🤖 NEW - AI documentation
├── AI_USAGE_GUIDE.md           # 🤖 NEW - AI usage guide
├── MONGODB_ATLAS_SETUP.md      # NEW - Database setup
├── NEW_FEATURES.md             # NEW - Security features
├── QUICKSTART.md               # NEW - Quick start guide
└── SUMMARY.md                  # NEW - Complete summary
```

## Screenshots
<img width="1440" height="818" alt="Screenshot 2025-09-13 at 3 57 14 AM" src="https://github.com/user-attachments/assets/76f5644b-1a38-4900-b136-86f40ce6964d" />
<img width="1439" height="816" alt="Screenshot 2025-09-13 at 3 58 06 AM" src="https://github.com/user-attachments/assets/bcc53858-4111-4ff8-8a14-2f62ed0b9239" />
<img width="1440" height="819" alt="Screenshot 2025-09-13 at 3 58 28 AM" src="https://github.com/user-attachments/assets/91dec405-59f4-4144-a48e-9c0b75fea580" />
<img width="1438" height="720" alt="Screenshot 2025-09-13 at 3 58 52 AM" src="https://github.com/user-attachments/assets/b99ee8b8-dfb3-4430-96ee-b4b8ab7d14bf" />
