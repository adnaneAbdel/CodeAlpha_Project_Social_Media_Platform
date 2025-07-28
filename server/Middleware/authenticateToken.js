const jwt = require('jsonwebtoken');
const { verifyToken } = require('../Controllers/jwt'); 

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = { userId: decoded.id }; 
        next();
    } catch (err) {
        console.error('Error decoding token:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;