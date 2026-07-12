# AssetFlow – Enterprise Asset & Resource Management System

AssetFlow is a full-stack Enterprise Asset & Resource Management System developed for a hackathon. The platform helps organizations manage physical assets, employee allocations, maintenance requests, shared resource bookings, departments, and operational reports through a centralized dashboard.

## Features

* 🔐 JWT Authentication & Role-Based User Management
* 🏢 Department Management
* 👨 Employee Management
* 💻 Asset Registration & Asset Categories
* 🔄 Asset Allocation & Return Workflow
* 🛠 Maintenance Request Management
* 📅 Resource Booking with Overlap Validation
* 🔔 Notification Management
* 📊 Dashboard with KPIs
* 📑 Reports for Assets, Departments, and Maintenance

## Tech Stack

### Frontend

* React
* Vite
* CSS / Tailwind CSS (Optional)

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Project Structure

```text
client/
server/
```

## Backend Modules

* Authentication
* Departments
* Employees
* Asset Categories
* Assets
* Asset Allocation
* Maintenance
* Resource Booking
* Notifications
* Dashboard
* Reports

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

## API Base URL

```text
http://localhost:5000/api
```

## Main APIs

* `/api/auth`
* `/api/departments`
* `/api/employees`
* `/api/assets`
* `/api/bookings`
* `/api/maintenance`
* `/api/dashboard`
* `/api/notifications`
* `/api/reports`

## Future Improvements

* Role-based authorization middleware
* File upload for asset documents
* QR Code asset tracking
* Email notifications
* PDF & Excel report export
* Audit Logs
* Analytics Dashboard

## Team

Developed as part of a Hackathon project using the MERN Stack.

## License

This project is created for educational and hackathon purposes.
