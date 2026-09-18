import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setMemoryToken, getMemoryToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const updateToken = (token) => {
    setMemoryToken(token);
    setAccessTokenState(token);
  };

  /**
   * Fetch current user profile using current access token
   */
  const fetchMe = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (err) {
      console.warn('[Auth] Failed to fetch user profile:', err.response?.data?.message || err.message);
    }
    return null;
  }, []);

  /**
   * Initial check on page load: attempt silent token refresh from httpOnly cookie
   */
  useEffect(() => {
    let isMounted = true;

    const checkInitialAuth = async () => {
      try {
        // Attempt refresh using httpOnly cookie
        const response = await api.post('/auth/refresh');
        if (response.data?.accessToken && isMounted) {
          updateToken(response.data.accessToken);
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            await fetchMe();
          }
        }
      } catch (err) {
        // Expected when user is not logged in or cookie is absent/expired
        if (isMounted) {
          updateToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkInitialAuth();

    // Listen for session expiry from axios response interceptor
    const handleSessionExpired = () => {
      if (isMounted) {
        updateToken(null);
        setUser(null);
      }
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, [fetchMe]);

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: registeredUser, accessToken: newAccessToken } = response.data;

      updateToken(newAccessToken);
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    } catch (error) {
      let errorMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]);

      if (!errorMsg) {
        if (error.code === 'ERR_NETWORK' || !error.response) {
          errorMsg = 'Cannot connect to backend server. Please verify the backend is running on port 5000.';
        } else {
          errorMsg = error.message || 'Registration failed. Please try again.';
        }
      }

      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Log in an existing user
   */
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, accessToken: newAccessToken } = response.data;

      updateToken(newAccessToken);
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (error) {
      let errorMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]);

      if (!errorMsg) {
        if (error.code === 'ERR_NETWORK' || !error.response) {
          errorMsg = 'Cannot connect to backend server. Please verify the backend is running on port 5000.';
        } else {
          errorMsg = error.message || 'Login failed. Please check your credentials.';
        }
      }

      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Refresh session manually (e.g. for testing acceptance criteria)
   */
  const refreshSession = async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data?.accessToken) {
        updateToken(response.data.accessToken);
        if (response.data.user) setUser(response.data.user);
        return { success: true, accessToken: response.data.accessToken };
      }
      return { success: false, error: 'No token returned' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Token refresh failed.';
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Log out the user
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('[Auth] Logout error:', error);
    } finally {
      updateToken(null);
      setUser(null);
      setAuthError(null);
    }
  };

  const clearError = () => setAuthError(null);

  const value = {
    user,
    accessToken,
    loading,
    authError,
    isAuthenticated: !!user && !!accessToken,
    register,
    login,
    logout,
    refreshSession,
    fetchMe,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
