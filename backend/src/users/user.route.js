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

module.exports = router;
