const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Validation function
const validateUserInput = (username, password, role) => {
    const errors = [];
    
    if (!username || username.length < 3) {
        errors.push("Username must be at least 3 characters long");
    }
    
    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }
    
    if (!['user', 'admin'].includes(role)) {
        errors.push("Invalid role. Must be 'user' or 'admin'");
    }
    
    return errors;
};

router.post("/admin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role,
            },
        });

    } catch (error) {
        console.error("failed to login", error);
        return res.status(500).json({ message: error.message });
    }
});

router.post("/user", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response with token and user details
        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: user.username,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Failed to login", error);
        return res.status(500).json({ message: error.message });
    }
});

// Registration route
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    // Validate input
    const validationErrors = [];
    
    if (!username || username.length < 3) {
        validationErrors.push("Username must be at least 3 characters long");
    }
    
    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        validationErrors.push("Invalid email address");
    }
    
    if (!password || password.length < 6) {
        validationErrors.push("Password must be at least 6 characters long");
    }
    
    if (!['user', 'admin'].includes(role)) {
        validationErrors.push("Invalid role. Must be 'user' or 'admin'");
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const errorMessage = existingUser.username === username 
                ? "Username already exists" 
                : "Email already exists";
            return res.status(409).json({ message: errorMessage });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role
        });

        // Save user (password will be hashed automatically by pre-save hook)
        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Registration failed", error);
        return res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// Get all users route (admin only)
router.get('/', async (req, res) => {
    try {
        // In a real-world scenario, you'd verify the admin token here
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get all users route (admin only)
router.get('/', async (req, res) => {
    try {
        // In a real-world scenario, you'd verify the admin token here
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;
