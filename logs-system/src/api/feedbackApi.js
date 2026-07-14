import api from './api';

// ==================== FEEDBACK APIs ====================

/**
 * Submit new feedback
 * @param {number} rating - Rating from 1 to 5
 * @param {string} message - Feedback message
 * @returns {Promise} API response
 */
export const submitFeedback = async (rating, message) => {
  try {
    const response = await api.post('/feedback', {
      rating,
      message,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit feedback' };
  }
};

/**
 * Get current user's feedback history
 * @returns {Promise} API response with feedback list
 */
export const getMyFeedback = async () => {
  try {
    const response = await api.get('/my-feedback');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch feedback' };
  }
};

/**
 * Get all feedback (Admin only)
 * @param {Object} filters - Optional filters (rating)
 * @returns {Promise} API response with feedback list
 */
export const getAllFeedback = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/feedback?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all feedback' };
  }
};

/**
 * Get feedback statistics (Admin only)
 * @returns {Promise} API response with statistics
 */
export const getFeedbackStatistics = async () => {
  try {
    const response = await api.get('/feedback/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch statistics' };
  }
};

/**
 * Delete feedback (Admin only)
 * @param {number} id - Feedback ID
 * @returns {Promise} API response
 */
export const deleteFeedback = async (id) => {
  try {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete feedback' };
  }
};

export default {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackStatistics,
  deleteFeedback,
};
