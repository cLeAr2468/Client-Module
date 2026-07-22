import api from './api';

// ==================== PURPOSE APIs ====================

/**
 * Get all purposes (for dropdowns)
 * @returns {Promise} API response with purposes list
 */
export const getAllPurposes = async () => {
  try {
    const response = await api.get('/purposes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch purposes' };
  }
};

export default {
  getAllPurposes,
};
