const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('assetflow_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ── Auth ──
export const authAPI = {
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

// ── Departments ──
export const departmentAPI = {
  getAll: () => request('/departments'),
  create: (data) =>
    request('/departments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) =>
    request(`/departments/${id}`, { method: 'DELETE' }),
};

// ── Employees ──
export const employeeAPI = {
  getAll: () => request('/employees'),
  update: (id, data) =>
    request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Assets ──
export const assetAPI = {
  getAll: () => request('/reports/assets'),
  create: (data) =>
    request('/assets', { method: 'POST', body: JSON.stringify(data) }),
  allocate: (data) =>
    request('/assets/allocate', { method: 'POST', body: JSON.stringify(data) }),
  return: (data) =>
    request('/assets/return', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Maintenance ──
export const maintenanceAPI = {
  getAll: () => request('/reports/maintenance'),
  raise: (data) =>
    request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id) =>
    request(`/maintenance/approve/${id}`, { method: 'PUT' }),
  resolve: (id) =>
    request(`/maintenance/resolve/${id}`, { method: 'PUT' }),
};

// ── Bookings ──
export const bookingAPI = {
  getAll: () => request('/bookings'),
  create: (data) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  cancel: (id) =>
    request(`/bookings/${id}/cancel`, { method: 'PUT' }),
};

// ── Dashboard ──
export const dashboardAPI = {
  get: () => request('/dashboard'),
};

// ── Notifications ──
export const notificationAPI = {
  getAll: () => request('/notifications'),
  create: (data) =>
    request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  markRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),
};

// ── Reports ──
export const reportAPI = {
  assets: () => request('/reports/assets'),
  departments: () => request('/reports/departments'),
  maintenance: () => request('/reports/maintenance'),
};
