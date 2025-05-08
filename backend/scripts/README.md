# Database Seeding Script

## Purpose
This script populates the MongoDB database with dummy data for testing and development purposes.

## What it does
- Adds new users without duplicating existing ones
- Generates new book transactions for available books
- Avoids creating duplicate or conflicting transactions

## Prerequisites
- Ensure MongoDB connection is set up in `.env`
  - Use either `DB_URL` or `MONGODB_URI` environment variable
  - Example: `DB_URL=mongodb://localhost:27017/library`
- Install dependencies: `npm install`

## How to Run
```bash
npm run seed
```

## Credentials
### Admin User
- Email: admin@library.com
- Password: AdminPass123!

### Regular Users
- Email: john.doe@example.com (Password: Password123!)
- Email: jane.smith@example.com (Password: Password123!)
- Email: mike.johnson@example.com (Password: Password123!)
- Email: sarah.williams@example.com (Password: Password123!)

**Note:** Always use this script in development/testing environments only!
