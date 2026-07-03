const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "gridlock_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.detail || data?.message || "Something went wrong. Please try again.";
    throw new ApiError(typeof message === "string" ? message : "Request failed.", res.status);
  }

  return data;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  verifyOtp: (payload) => request("/api/auth/verify-otp", { method: "POST", body: payload }),
  verifyEmail: (payload) => request("/api/auth/verify-email", { method: "POST", body: payload }),
  forgotPassword: (payload) => request("/api/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/api/auth/reset-password", { method: "POST", body: payload }),
  me: () => request("/api/auth/me", { auth: true }),

  updateProfile: (payload) => request("/api/users/profile", { method: "PUT", body: payload, auth: true }),
  changePassword: (payload) => request("/api/users/change-password", { method: "PUT", body: payload, auth: true }),
  deleteAccount: () => request("/api/users/account", { method: "DELETE", auth: true }),

  getActivity: () => request("/api/activity", { auth: true }),

  getDevices: () => request("/api/devices", { auth: true }),
  removeDevice: (id) => request(`/api/devices/${id}`, { method: "DELETE", auth: true }),
  logoutAllDevices: () => request("/api/devices/logout-all", { method: "POST", auth: true }),

  getSecurityScore: () => request("/api/security/score", { auth: true }),
  getStats: () => request("/api/security/stats", { auth: true }),
};

export { ApiError };
