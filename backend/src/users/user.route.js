const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

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
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

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

module.exports = router;
