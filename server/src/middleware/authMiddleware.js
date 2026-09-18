import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'super_secret_jwt_access_key_fitness_app_2026_dev_!@#';

/**
 * Middleware to protect API routes using JWT Access Token
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
      code: 'NO_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Find the user associated with this token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
        code: 'USER_NOT_FOUND',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired. Please refresh your session.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid access token.',
      code: 'INVALID_TOKEN',
    });
  }
};
