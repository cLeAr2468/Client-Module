import api from './api';

/**
 * Log user activity
 * @param {string} action - Action performed (e.g., 'created', 'updated', 'viewed')
 * @param {string} module - Module name (e.g., 'appointments', 'profile', 'feedback')
 * @param {string} description - Human-readable description
 * @param {Object} metadata - Additional data (optional)
 * @returns {Promise} API response
 */
export const logActivity = async (action, module, description, metadata = null) => {
  try {
    const response = await api.post('/activity-logs', {
      action,
      module,
      description,
      metadata,
    });
    return response.data;
  } catch (error) {
    // Don't throw errors for activity logging - fail silently
    console.warn('Failed to log activity:', error);
    return null;
  }
};

/**
 * Helper functions for common actions
 */
export const ActivityLogger = {
  // Appointment actions
  appointmentCreated: (appointmentData) =>
    logActivity('created', 'appointments', 'Created a new appointment request', {
      purpose: appointmentData.purpose,
      schedule_date: appointmentData.schedule_date,
    }),

  appointmentUpdated: (appointmentId, changes) =>
    logActivity('updated', 'appointments', `Updated appointment #${appointmentId}`, {
      appointment_id: appointmentId,
      changes,
    }),

  appointmentCancelled: (appointmentId) =>
    logActivity('cancelled', 'appointments', `Cancelled appointment #${appointmentId}`, {
      appointment_id: appointmentId,
    }),

  appointmentViewed: () =>
    logActivity('viewed', 'appointments', 'Viewed appointments page'),

  // Profile actions
  profileViewed: () =>
    logActivity('viewed', 'profile', 'Viewed profile page'),

  profileUpdated: (changes) =>
    logActivity('updated', 'profile', 'Updated profile information', { changes }),

  passwordChanged: () =>
    logActivity('updated', 'profile', 'Changed account password'),

  // Feedback actions
  feedbackSubmitted: (feedbackData) =>
    logActivity('created', 'feedback', 'Submitted feedback', {
      rating: feedbackData.rating,
      category: feedbackData.category,
    }),

  feedbackViewed: () =>
    logActivity('viewed', 'feedback', 'Viewed feedback page'),

  // Dashboard actions
  dashboardViewed: () =>
    logActivity('viewed', 'dashboard', 'Viewed dashboard'),

  // Announcement actions
  announcementViewed: (announcementId = null) =>
    logActivity('viewed', 'announcements', 
      announcementId ? `Viewed announcement #${announcementId}` : 'Viewed announcements page',
      announcementId ? { announcement_id: announcementId } : null
    ),
};

export default {
  logActivity,
  ActivityLogger,
};
