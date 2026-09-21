import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (payload) => api.put('/users/profile', payload),
};

export const foodService = {
  list: (params) => api.get('/foods', { params }),
  get: (id) => api.get(`/foods/${id}`),
  createCustom: (payload) => api.post('/foods/custom', payload),
  remove: (id) => api.delete(`/foods/${id}`),
};

export const foodLogService = {
  today: (params) => api.get('/food-logs/today', { params }),
  list: (params) => api.get('/food-logs', { params }),
  create: (payload) => api.post('/food-logs', payload),
  update: (id, payload) => api.put(`/food-logs/${id}`, payload),
  remove: (id) => api.delete(`/food-logs/${id}`),
};

export const exerciseService = {
  list: (params) => api.get('/exercises', { params }),
  get: (id) => api.get(`/exercises/${id}`),
};

export const workoutService = {
  list: () => api.get('/workouts'),
  get: (id) => api.get(`/workouts/${id}`),
  create: (payload) => api.post('/workouts', payload),
  remove: (id) => api.delete(`/workouts/${id}`),
};

export const healthService = {
  list: (params) => api.get('/health', { params }),
  upsert: (payload) => api.post('/health', payload),
  update: (id, payload) => api.put(`/health/${id}`, payload),
  remove: (id) => api.delete(`/health/${id}`),
};

export const dashboardService = {
  get: () => api.get('/dashboard'),
};

export const progressService = {
  get: (params) => api.get('/progress', { params }),
};
