// middleware.js
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(401).json({ msg: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin only access' });
    }
    next();
};

module.exports = { auth, adminOnly };
