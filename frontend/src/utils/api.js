const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('ew_token');
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

const handleRes = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  // Destinations
  getDestinations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/destinations${qs ? '?' + qs : ''}`, { headers: headers(true) }).then(handleRes);
  },
  getFeatured: () => fetch(`${BASE}/destinations/featured`, { headers: headers(true) }).then(handleRes),
  getStats: () => fetch(`${BASE}/destinations/stats`, { headers: headers() }).then(handleRes),
  getDestination: (id) => fetch(`${BASE}/destinations/${id}`, { headers: headers(true) }).then(handleRes),
  saveDestination: (id) =>
    fetch(`${BASE}/destinations/${id}/save`, { method: 'POST', headers: headers(true) }).then(handleRes),
  createDestination: (data) =>
    fetch(`${BASE}/destinations`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleRes),

  // Auth
  register: (data) =>
    fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleRes),
  login: (data) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleRes),
  getMe: () => fetch(`${BASE}/auth/me`, { headers: headers(true) }).then(handleRes),
  updateProfile: (data) =>
    fetch(`${BASE}/auth/profile`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleRes),

  updateDestination: (id, data) =>
    fetch(`${BASE}/destinations/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleRes),

  // Admin
  getAdminDestinations: () => fetch(`${BASE}/admin/destinations`, { headers: headers(true) }).then(handleRes),
  getAdminStats: () => fetch(`${BASE}/admin/stats`, { headers: headers(true) }).then(handleRes),
  updateDestinationStatus: (id, status) =>
    fetch(`${BASE}/destinations/${id}/status`, { method: 'PATCH', headers: headers(true), body: JSON.stringify({ status }) }).then(handleRes),
  deleteDestination: (id) =>
    fetch(`${BASE}/destinations/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleRes),

  // Reviews
  getReviews: (destId) => fetch(`${BASE}/reviews/destination/${destId}`, { headers: headers() }).then(handleRes),
  getUserReviews: (userId) => fetch(`${BASE}/reviews/user/${userId}`, { headers: headers() }).then(handleRes),
  createReview: (data) =>
    fetch(`${BASE}/reviews`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleRes),
  markHelpful: (id) =>
    fetch(`${BASE}/reviews/${id}/helpful`, { method: 'POST', headers: headers() }).then(handleRes),
};
