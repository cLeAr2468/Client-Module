import api from './api';

// ==================== PUBLIC ANNOUNCEMENT APIs ====================

/**
 * Get published announcements (Public - No authentication required)
 * @param {Object} params - Optional pagination params (page, per_page)
 * @returns {Promise} API response with published announcements
 */
export const getPublishedAnnouncements = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/public/announcements?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch announcements' };
  }
};

/**
 * Get single announcement by ID (Public)
 * @param {number} id - Announcement ID
 * @returns {Promise} API response with announcement data
 */
export const getAnnouncementById = async (id) => {
  try {
    const response = await api.get(`/public/announcements/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch announcement' };
  }
};

export default {
  getPublishedAnnouncements,
  getAnnouncementById,
};
