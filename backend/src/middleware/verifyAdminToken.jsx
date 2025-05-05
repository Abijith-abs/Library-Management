const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No access, no token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.user = decoded;

        // Check if the user is an Admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next();
    });
};

module.exports = verifyAdminToken;
