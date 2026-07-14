import axios from 'axios';

// Configure base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== APPOINTMENT APIs ====================

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise} API response
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', {
      purpose: appointmentData.purpose,
      street_house_no: appointmentData.street,
      brgy: appointmentData.barangay,
      municipality: appointmentData.city,
      province: appointmentData.province,
      schedule_date: appointmentData.scheduleDate,
      time_slot: appointmentData.timeSlot,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to request appointment' };
  }
};

/**
 * Get user's appointments
 * @returns {Promise} API response with appointments
 */
export const getUserAppointments = async () => {
  try {
    const response = await api.get('/my-appointments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch appointments' };
  }
};

/**
 * Get all appointments (admin)
 * @returns {Promise} API response with all appointments
 */
export const getAllAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch appointments' };
  }
};

/**
 * Get a single appointment
 * @param {number} appointmentId - Appointment ID
 * @returns {Promise} API response
 */
export const getAppointment = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch appointment' };
  }
};

/**
 * Update user's appointment
 * @param {number} appointmentId - Appointment ID
 * @param {Object} appointmentData - Updated appointment details
 * @returns {Promise} API response
 */
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}`, {
      purpose: appointmentData.purpose,
      street_house_no: appointmentData.street,
      brgy: appointmentData.barangay,
      municipality: appointmentData.city,
      province: appointmentData.province,
      schedule_date: appointmentData.scheduleDate,
      time_slot: appointmentData.timeSlot,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update appointment' };
  }
};

/**
 * Cancel user's appointment
 * @param {number} appointmentId - Appointment ID
 * @returns {Promise} API response
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel appointment' };
  }
};

/**
 * Update appointment status (admin)
 * @param {number} appointmentId - Appointment ID
 * @param {string} status - New status (pending, approved, completed, cancelled)
 * @returns {Promise} API response
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await api.put(`/appointments/${appointmentId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update appointment status' };
  }
};

/**
 * Delete appointment (admin)
 * @param {number} appointmentId - Appointment ID
 * @returns {Promise} API response
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete appointment' };
  }
};

/**
 * Get available time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response with available slots
 */
export const getAvailableSlots = async (date) => {
  try {
    const response = await api.get('/appointments/available-slots', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch available slots' };
  }
};

export default {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
};
