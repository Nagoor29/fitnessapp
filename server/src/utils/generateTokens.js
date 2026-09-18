import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'super_secret_jwt_access_key_fitness_app_2026_dev_!@#';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_fitness_app_2026_dev_$%^';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

/**
 * Generate short-lived Access Token for API requests
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

/**
 * Generate long-lived Refresh Token for issuing new access tokens
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

/**
 * Configure and attach the Refresh Token in a secure httpOnly cookie
 */
export const setRefreshTokenCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents client-side JS XSS access
    secure: isProduction, // HTTPS required for sameSite: 'none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' is mandatory for cross-site (Vercel <-> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/api/auth', // Scoped to auth refresh/logout endpoints
  });
};

/**
 * Clear the refresh token cookie upon logout
 */
export const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth',
  });
};
