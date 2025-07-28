const jwt = require('jsonwebtoken');
const  SECRET_KEY = process.env.JWT_SECRET;
const EXPIRESIN = process.env.EXPIRESIN;

const generateToken = (user) => {
    const payload = {
  id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio,
  profilePicture: user.profilePicture
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRESIN }); 
}

// Function to verify token
const verifyToken = (token) => {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error('Invalid token');
    }
  };

  module.exports = {
    generateToken,
    verifyToken
  };