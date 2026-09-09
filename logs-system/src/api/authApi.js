import axios from 'axios';

// Configure base URL - reads from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://logs-server-system-production.up.railway.app/api';

console.log('📡 API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
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
    console.log('🔐 Login attempt:', { 
      email, 
      url: `${API_BASE_URL}/login`,
      timestamp: new Date().toISOString()
    });
    
    const response = await api.post('/login', {
      email: email.trim(),
      password,
    });
    
    console.log('✅ Login successful:', {
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      userName: response.data.user?.fname || response.data.user?.email
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Login error caught:', {
      name: error.name,
      message: error.message,
      hasResponse: !!error.response,
      hasRequest: !!error.request,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Extract meaningful error message
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response) {
      // Server responded with an error
      const { status, data } = error.response;
      
      console.log('📥 Server response:', { status, data });
      
      if (status === 401) {
        errorMessage = data?.message || 'Invalid email or password';
      } else if (status === 422) {
        // Validation error
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else {
          errorMessage = data?.message || 'Validation failed';
        }
      } else if (status === 429) {
        errorMessage = data?.message || 'Too many login attempts. Please try again later.';
      } else if (status >= 500) {
        // Show actual server error in development
        errorMessage = data?.message || data?.error || 'Server error. Please try again later.';
        console.error('🚨 Server Error Details:', data);
      } else {
        errorMessage = data?.message || data?.error || errorMessage;
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server');
      throw new Error('Cannot connect to server. Please check your internet connection.');
    } else {
      // Error in request setup
      console.error('❌ Request setup error:', error.message);
      throw new Error(error.message || errorMessage);
    }
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
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Logout failed');
    }
    throw new Error('Logout failed');
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
