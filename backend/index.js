const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config()


app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))



const bookRoutes = require("./src/books/book.route")
const userRoutes = require("./src/users/user.route")
const adminRoutes = require("./src/stats/admin.stats")
const transactionRoutes = require('./src/transactions/transaction.routes');


app.use('/api/transactions', transactionRoutes);
app.use("/api/books", bookRoutes)
app.use("/api/auth",userRoutes)
app.use("/api/admin",adminRoutes)



async function main() {
    await mongoose.connect(process.env.DB_URL);

    // Debugging: Log all registered routes
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path) {
        console.log(`Registered route: ${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
      }
    });

    // Health check route
    app.get('/', (req, res) => {
        res.json({ status: 'ok', message: 'Library Management API is running' })
    });

    // Specific routes
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/books', bookRoutes);
    app.use('/api/auth', userRoutes);
    app.use('/api/admin', adminRoutes);

    // Catch-all route for undefined routes
    app.use((req, res) => {
        console.log(`Unhandled route: ${req.method} ${req.path}`);
        res.status(404).json({ status: 'error', message: 'Route not found' });
    });

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

  main().then(() => console.log('Connected to DB')).catch(err => console.log(err))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})