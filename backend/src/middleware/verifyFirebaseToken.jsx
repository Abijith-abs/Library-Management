const admin = require('../firebase/firebaseAdmin');
const User = require('../users/user.model'); // MongoDB user model

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: 'User not found in DB' });

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
}

module.exports = verifyFirebaseToken;
