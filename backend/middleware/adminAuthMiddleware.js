const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const isAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_promptseen_jwt_key_2026');

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ message: 'Unauthorized: Admin privileges required' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no admin token provided' });
  }
};

module.exports = { isAdmin };
