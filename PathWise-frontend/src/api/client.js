const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  login: `${API_BASE}/auth/login`,
  signup: `${API_BASE}/auth/signup`,
  me: `${API_BASE}/auth/me`,
  updateUser: `${API_BASE}/auth/me`
};