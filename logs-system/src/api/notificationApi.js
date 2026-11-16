import api from './api';

export const getNotifications = async (page = 1, perPage = 15) => {
  const response = await api.get('/notifications', {
    params: { page, per_page: perPage }
  });
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};
