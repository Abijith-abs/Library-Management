const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/users/user.model');
const Book = require('../src/books/book.model');
const Transaction = require('../src/transactions/transaction.model');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), debug: true });

// Dummy data
const dummyUsers = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    role: 'user',
    fullName: 'John Doe',
    contactNumber: '+1-555-123-4567'
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'Password123!',
    role: 'user',
    fullName: 'Jane Smith',
    contactNumber: '+1-555-987-6543'
  },
  {
    username: 'mike_johnson',
    email: 'mike.johnson@example.com',
    password: 'Password123!',
    role: 'user',
    fullName: 'Mike Johnson',
    contactNumber: '+1-555-246-8135'
  },
  {
    username: 'sarah_williams',
    email: 'sarah.williams@example.com',
    password: 'Password123!',
    role: 'user',
    fullName: 'Sarah Williams',
    contactNumber: '+1-555-369-2580'
  },
  {
    username: 'library_admin',
    email: 'admin@library.com',
    password: 'AdminPass123!',
    role: 'admin',
    fullName: 'Library Administrator',
    contactNumber: '+1-555-111-2222'
  }
];

const dummyBooks = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780446310789',
    genre: 'Fiction',
    publicationYear: 1960,
    totalCopies: 5,
    availableCopies: 3,
    status: 'available',
    description: 'A classic novel about racial injustice in the American South.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    genre: 'Dystopian Fiction',
    publicationYear: 1949,
    totalCopies: 4,
    availableCopies: 2,
    status: 'available',
    description: 'A dystopian novel set in a totalitarian society.'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    genre: 'Classic Literature',
    publicationYear: 1925,
    totalCopies: 3,
    availableCopies: 1,
    status: 'available',
    description: 'A novel about the decadence of the Jazz Age.'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    genre: 'Romance',
    publicationYear: 1813,
    totalCopies: 4,
    availableCopies: 2,
    status: 'available',
    description: 'A romantic novel of manners in early 19th-century England.'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    genre: 'Fantasy',
    publicationYear: 1937,
    totalCopies: 3,
    availableCopies: 1,
    status: 'available',
    description: 'A fantasy novel about the adventures of Bilbo Baggins.'
  }
];

async function seedDatabase() {
  try {
    // Log environment variables for debugging
    console.log('DB_URL:', process.env.DB_URL);
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('All env vars:', Object.keys(process.env));

    // Get MongoDB connection URL and trim whitespace
    const mongoUrl = (process.env.DB_URL || process.env.MONGODB_URI || '').trim();
    
    if (!mongoUrl) {
      throw new Error('No MongoDB connection URL found. Please set DB_URL or MONGODB_URI in .env');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find existing users to avoid duplicates
    const existingUsers = await User.find({ 
      email: { $in: dummyUsers.map(u => u.email) } 
    });
    const usersToInsert = dummyUsers.filter(
      user => !existingUsers.some(existing => existing.email === user.email)
    );

    // Hash passwords for new users
    const hashedUsers = await Promise.all(usersToInsert.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));

    // Insert new users
    let insertedUsers = [];
    if (hashedUsers.length > 0) {
      insertedUsers = await User.insertMany(hashedUsers);
      console.log(`Inserted ${insertedUsers.length} new users`);
    }

    // Get all existing books and users
    const books = await Book.find({});
    const users = await User.find({ role: 'user' });

    // Create some dummy transactions
    const transactions = [];

    // Check existing transactions to avoid duplicates
    const existingTransactions = await Transaction.find({ isReturned: false });
    const existingTransactionBookIds = new Set(existingTransactions.map(t => t.book.toString()));

    // Generate transactions for books not currently borrowed
    const availableBookIds = books
      .map(book => book._id)
      .filter(bookId => !existingTransactionBookIds.has(bookId.toString()));

    for (let i = 0; i < Math.min(10, availableBookIds.length); i++) {
      const userId = users[Math.floor(Math.random() * users.length)]._id;
      const bookId = availableBookIds[i];
      
      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);

      transactions.push({
        user: userId,
        book: bookId,
        borrowDate,
        dueDate,
        status: 'active',
        isReturned: false,
        notes: 'Standard 2-week borrow'
      });
    }

    // Insert transactions
    let insertedTransactions = [];
    if (transactions.length > 0) {
      insertedTransactions = await Transaction.insertMany(transactions);
      console.log(`Inserted ${insertedTransactions.length} new transactions`);
    } else {
      console.log('No new transactions to insert');
    }

    // Update book statuses for newly borrowed books
    if (insertedTransactions.length > 0) {
      await Book.updateMany(
        { _id: { $in: insertedTransactions.map(t => t.book) } },
        { $set: { status: 'borrowed' } }
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();
