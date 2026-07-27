// Session Management Utility

/**
 * Set session data
 */
export const setSession = (token, userData) => {
  // Store in both localStorage and sessionStorage
  sessionStorage.setItem('user_session', 'active');
  sessionStorage.setItem('auth_token', token);
  sessionStorage.setItem('user_data', JSON.stringify(userData));
  
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
};

/**
 * Check if session is active
 */
export const isSessionActive = () => {
  const session = sessionStorage.getItem('user_session');
  const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || localStorage.getItem('token');
  return session === 'active' && !!token;
};

/**
 * Clear session data
 */
export const clearSession = () => {
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear localStorage
  localStorage.clear();
};

/**
 * Get session token
 */
export const getSessionToken = () => {
  return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || localStorage.getItem('token');
};

/**
 * Get session user
 */
export const getSessionUser = () => {
  const userData = sessionStorage.getItem('user_data') || localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export default {
  setSession,
  isSessionActive,
  clearSession,
  getSessionToken,
  getSessionUser,
};
