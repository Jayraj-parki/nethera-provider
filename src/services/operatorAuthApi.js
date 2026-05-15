import { httpJSON } from "./http";

const API_BASE = "http://127.0.0.1:8000";
const LOGIN_PATH = "/users/operator/login/";
const SIGNUP_PATH = "/users/";

const TOKEN_URL = `${API_BASE}/api/token/`;
const REFRESH_URL = `${API_BASE}/api/token/refresh/`;

const LS_ACCESS = "op:access";
const LS_REFRESH = "op:refresh";

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp; // in seconds
    const now = Date.now() / 1000; // convert ms → seconds

    return exp < now;
  } catch (err) {
    return true; // invalid token = treat as expired
  }
}
export function getAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(LS_ACCESS);
    if (token && !isTokenExpired(token)) return token;
    return null;

  } catch { return null; }
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  try { 
    const token = localStorage.getItem(LS_REFRESH); 
    if (token && !isTokenExpired(token)) return token;
    return null;
  } catch { return null; }
}

export function saveTokens({ access, refresh=null }) {
  
  if (typeof window === "undefined") return;
  try {
    if (access) localStorage.setItem(LS_ACCESS, access);
    if (refresh) localStorage.setItem(LS_REFRESH, refresh);
  } catch { }
}

export function clearTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(LS_ACCESS);
  localStorage.removeItem(LS_REFRESH);
}

export const operatorAuthApi = {
  
  // Legacy operator login (if you keep it)
  async login(payload) {
    
    return httpJSON(`${API_BASE}${LOGIN_PATH}`, {
      method: "POST",
      body: JSON.stringify(payload)
    },false) // avoid attaching token to login request);
  },
  async signup(payload) {
    return httpJSON(`${API_BASE}${SIGNUP_PATH}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },


  // Simple JWT obtain pair with admin/root
  async obtainWithPassword({ username, password }) {
    const resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.detail || data?.message || `Login failed (${resp.status})`;
      throw new Error(msg);
    }
    saveTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  async refreshAccess() {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Missing refresh token");
    const resp = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
      credentials: "include",
    });
    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.detail || data?.message || `Refresh failed (${resp.status})`;
      throw new Error(msg);
    }
    // Some setups also rotate refresh; save if present
    saveTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  async me() {
    const ME_PATH = process.env.NEXT_PUBLIC_OPERATOR_ME_PATH || "/api/operators/me";
    return httpJSON(`${API_BASE}${ME_PATH}`, { method: "GET" });
  },

  async logout() {
    clearTokens();
    return true;
  },
};


