# Hospital App

A comprehensive hospital management system built with React, Express, and MongoDB. This application provides a platform for patients to book appointments, manage their profiles, and access healthcare services, while administrators and doctors can manage their schedules and patient information.

## Project Structure

The project is organized into three main directories:

- **Frontend** - Patient-facing React application
- **Admin** - Admin panel for hospital management
- **Backend** - Express.js server with MongoDB

## Features

### Patient Features
- User authentication and profile management
- Browse doctors by specialization
- Book and manage appointments
- View appointment history
- Track appointment status

### Admin Features
- Dashboard with analytics
- Manage doctor profiles
- View all appointments
- Add new doctors to the system
- Monitor system activities

### Doctor Features
- View upcoming appointments
- Manage appointment schedules
- Update personal profiles
- Track consultation history

## Tech Stack

### Frontend & Admin
- **React 19** - UI framework
- **React Router Dom** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Bcrypt** - Password hashing
- **Razorpay** - Payment gateway

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (for payment integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `.env` and add your credentials

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```
   Edit `.env` with your backend URL

4. **Admin Setup**
   ```bash
   cd admin
   npm install
   cp .env.example .env
   ```
   Edit `.env` with your backend URL

### Running the Application

**Backend** (from backend directory):
```bash
npm run dev
```
Server runs on `http://localhost:4000`

**Frontend** (from frontend directory):
```bash
npm run dev
```
App runs on `http://localhost:5173`

**Admin** (from admin directory):
```bash
npm run dev
```
Admin panel runs on `http://localhost:5174`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=<your-mongodb-connection-string>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_SECRET_KEY=<your-secret-key>
PORT=4000
ADMIN_EMAIL=<admin-email>
ADMIN_PW=<admin-password>
JWT_SECRET=<your-jwt-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
CURRENCY=INR
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=<your-razorpay-key>
```

### Admin (.env)
```
VITE_BACKEND_URL=http://localhost:4000
```

## API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Doctor Routes
- `GET /api/doctor/doctors` - Get all doctors
- `POST /api/doctor/login` - Doctor login
- `GET /api/doctor/appointments` - Get doctor appointments

### Admin Routes
- `POST /api/admin/add-doctor` - Add new doctor
- `GET /api/admin/doctors` - List all doctors
- `GET /api/admin/appointments` - View all appointments

## Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Admin:**
```bash
cd admin
npm run build
```

**Backend:**
No build step required, deploy directly from the source directory.

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
