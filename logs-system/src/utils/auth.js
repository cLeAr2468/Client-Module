// Authentication Utility Functions

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = sessionStorage.getItem('auth_token');
  const userData = sessionStorage.getItem('user_data');
  
  // Check if both token and user data exist
  if (!token || !userData) {
    return false;
  }
  
  // Verify user data is valid JSON
  try {
    const user = JSON.parse(userData);
    // Check if user object has required properties
    if (!user || !user.student_id) {
      return false;
    }
    return true;
  } catch (error) {
    // Invalid JSON, clear auth data
    clearAuth();
    return false;
  }
};

/**
 * Get current user data from sessionStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUser = () => {
  const userData = sessionStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
  return sessionStorage.getItem('auth_token');
};

/**
 * Logout user - clears all auth data and redirects to announcement page
 */
export const logout = () => {
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear localStorage
  localStorage.clear();
  
  window.location.href = '/';
};

/**
 * Save user data to sessionStorage
 * @param {Object} userData - User data object
 * @param {string} token - Authentication token
 */
export const saveAuth = (userData, token) => {
  sessionStorage.setItem('auth_token', token);
  sessionStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('user_data');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('remember_me');
};

/**
 * Get user's full name
 * @returns {string|null} Full name or null
 */
export const getUserFullName = () => {
  const user = getUser();
  return user ? user.full_name : null;
};

/**
 * Get user's first name
 * @returns {string|null} First name or null
 */
export const getUserFirstName = () => {
  const user = getUser();
  return user ? user.fname : null;
};

/**
 * Check if remember me is enabled
 * @returns {boolean}
 */
export const isRememberMeEnabled = () => {
  return localStorage.getItem('remember_me') === 'true';
};

export default {
  isAuthenticated,
  getUser,
  getToken,
  logout,
  saveAuth,
  clearAuth,
  getUserFullName,
  getUserFirstName,
  isRememberMeEnabled,
};
