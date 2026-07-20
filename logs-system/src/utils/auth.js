// Authentication Utility Functions

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Logout user - clears all auth data and redirects to login
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('remember_me');
  window.location.href = '/';
};

/**
 * Save user data to localStorage
 * @param {Object} userData - User data object
 * @param {string} token - Authentication token
 */
export const saveAuth = (userData, token) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
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
