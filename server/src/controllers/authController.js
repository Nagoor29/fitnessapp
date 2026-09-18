import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/generateTokens.js';
import {
  validateRegistrationInput,
  validateLoginInput,
} from '../utils/validators.js';

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_fitness_app_2026_dev_$%^';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input payload
    const validation = validateRegistrationInput({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create user record
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    user.refreshTokens = [refreshToken];
    await user.save();

    // Set HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to your AI Fitness Assistant!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input payload
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password and refreshTokens explicitly selected
    const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    // Verify password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Keep active refresh tokens list bounded (max 5 devices/sessions)
    const existingTokens = user.refreshTokens || [];
    const updatedTokens = [...existingTokens.slice(-4), refreshToken];
    user.refreshTokens = updatedTokens;
    await user.save();

    // Set HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh expired Access Token using Refresh Token cookie
 * @route   POST /api/auth/refresh
 * @access  Public (Requires valid refresh token cookie)
 */
export const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided in request cookies.',
        code: 'NO_REFRESH_TOKEN',
      });
    }

    // Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(403).json({
        success: false,
        message: 'Refresh token is invalid or expired. Please log in again.',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // Find user and verify token exists in DB whitelist
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens || !user.refreshTokens.includes(incomingRefreshToken)) {
      clearRefreshTokenCookie(res);
      return res.status(403).json({
        success: false,
        message: 'Refresh token has been revoked or session was terminated.',
        code: 'REVOKED_REFRESH_TOKEN',
      });
    }

    // Token rotation: Issue new access token & new refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter((token) => token !== incomingRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Set new HTTP-only cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully.',
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & invalidate refresh token
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      // Invalidate the specific token from DB
      await User.findOneAndUpdate(
        { refreshTokens: incomingRefreshToken },
        { $pull: { refreshTokens: incomingRefreshToken } }
      );
    }

    // Clear the HTTP-only cookie
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires Bearer token)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is attached by protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
