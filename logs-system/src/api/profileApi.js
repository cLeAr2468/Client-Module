import api from './api';

// ==================== PROFILE APIs ====================

/**
 * Get current user's profile
 * @returns {Promise} API response with user data
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

/**
 * Update current user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Change user's password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} API response
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
