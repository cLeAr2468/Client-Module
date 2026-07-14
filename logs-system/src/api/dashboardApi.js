import api from './api';

// ==================== DASHBOARD APIs ====================

/**
 * Get dashboard statistics
 * @returns {Promise} API response with statistics
 */
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
  }
};

/**
 * Get recent activity
 * @returns {Promise} API response with recent activities
 */
export const getRecentActivity = async () => {
  try {
    const response = await api.get('/dashboard/recent-activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch recent activity' };
  }
};

export default {
  getDashboardStatistics,
  getRecentActivity,
};
