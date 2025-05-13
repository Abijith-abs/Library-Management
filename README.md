# 📚 Library Management System

## Overview
A comprehensive full-stack Library Management System built with React, Node.js, and MongoDB, designed to streamline book management and borrowing processes.

## 🌟 Features

### User Features
- User Authentication with combined login interface
- Browse Books
- View Book Details
- Borrow Books
- Track Borrowed Books
- View Late Fee Calculations
- Return Books with Late Fee Information

### Admin Features
- Admin Authentication through the same login interface
- Add New Books
- Update Book Information
- Delete Books
- Manage Book Inventory
- User Management
- Monitor Late Fees and Returns

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- SweetAlert2

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Abijith-abs/Library-Mangemnet.git
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Set Up Environment Variables
- Create `.env` files in both backend and frontend directories
- Add necessary configuration (DB_URL, JWT_SECRET, etc.)

### Running the Application

1. Start Backend Server
```bash
cd backend
npm start
```

2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

## 🔐 Authentication
- Combined login interface for both Admin and User roles
- Role-based access control
- JWT-based authentication
- Secure login and registration
- Password visibility toggle

## 📊 Database Schema
- Books Collection
- Users Collection
- Transactions Collection

## ✨ Latest Updates

### Combined Login System
- Single interface for both user and admin login
- Easy toggle between user and admin modes
- Improved user experience with form validation
- Clear error messages and success notifications

### Late Fee System
- Automated late fee calculation
- Tiered fee structure based on overdue duration
- Grace period support
- Clear fee breakdown display
- Integration with book return process

## 🔜 Planned Features
- Advanced Search
- Book Recommendations
- User Reviews
- Notification System
- Payment Integration for Late Fees

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is open-source and available under the MIT License.

## 👨‍💻 Author
Abijith Vineesh

## 📧 Contact
- Email: avineesh@chisquarelabs.loc
- GitHub: @Abijith-abs

---

**Happy Reading! 📖**
