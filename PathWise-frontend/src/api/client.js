const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  login: `${API_BASE}/auth/login`,
  signup: `${API_BASE}/auth/signup`,
  me: `${API_BASE}/auth/me`,
  updateUser: `${API_BASE}/auth/me`,
  changePassword: `${API_BASE}/auth/change-password`,
  uploadAvatar: `${API_BASE}/auth/me/avatar`,
};

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    localStorage.clear()
    window.location.href = '/auth'
    return
  }

  return res
}