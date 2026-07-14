import axios from 'axios';

// Configure base URL - reads from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://logs-server-system-production.up.railway.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ==================== AUTH APIs ====================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} API response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with token and user data
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Logout user
 * @param {string} token - Auth token
 * @returns {Promise} API response
 */
export const logout = async (token) => {
  try {
    const response = await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// ==================== PASSWORD RESET APIs ====================

/**
 * Send OTP to user's email for password reset
 * @param {string} email - User's email address
 * @returns {Promise} API response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send OTP' };
  }
};

/**
 * Verify OTP code
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise} API response
 */
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

/**
 * Resend OTP to user's email
 * @param {string} email - User's email address
 * @returns {Promise} API response
 */
export const resendOtp = async (email) => {
  try {
    const response = await api.post('/resend-otp', {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend OTP' };
  }
};

/**
 * Reset user password
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} password - New password
 * @param {string} passwordConfirmation - Password confirmation
 * @returns {Promise} API response
 */
export const resetPassword = async (email, otp, password, passwordConfirmation) => {
  try {
    const response = await api.post('/reset-password', {
      email,
      otp,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

// ==================== USER APIs ====================

/**
 * Update user information
 * @param {number} userId - User ID
 * @param {Object} userData - Updated user data
 * @param {string} token - Auth token
 * @returns {Promise} API response
 */
export const updateUser = async (userId, userData, token) => {
  try {
    const response = await api.put(`/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update failed' };
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @param {string} token - Auth token
 * @returns {Promise} API response
 */
export const deleteUser = async (userId, token) => {
  try {
    const response = await api.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Delete failed' };
  }
};

export default {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resendOtp,
  resetPassword,
  updateUser,
  deleteUser,
};
