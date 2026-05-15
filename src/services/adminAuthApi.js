import { httpJSON } from "./http";

const API_BASE = "http://127.0.0.1:8000";

// 🔥 YOUR ADMIN LOGIN API
const ADMIN_LOGIN_PATH = "/users/rightconnect/login/";

// JWT endpoints (if needed)
const TOKEN_URL = `${API_BASE}/api/token/`;
const REFRESH_URL = `${API_BASE}/api/token/refresh/`;

// Storage keys (separate from operator)
const LS_ACCESS = "admin:access";
const LS_REFRESH = "admin:refresh";

// ---------------- TOKEN HELPERS ----------------

function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
}

export function getAdminAccessToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(LS_ACCESS);
    return token && !isTokenExpired(token) ? token : null;
}

export function getAdminRefreshToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(LS_REFRESH);
    return token && !isTokenExpired(token) ? token : null;
}

export function saveAdminTokens({ access, refresh }) {
    if (typeof window === "undefined") return;
    if (access) localStorage.setItem(LS_ACCESS, access);
    if (refresh) localStorage.setItem(LS_REFRESH, refresh);
}

export function clearAdminTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LS_ACCESS);
    localStorage.removeItem(LS_REFRESH);
}

// ---------------- API ----------------

export const adminAuthApi = {

    // 🔥 CUSTOM ADMIN LOGIN (your endpoint)
    async login({ email, password }) {
  const resp = await fetch(`${API_BASE}${ADMIN_LOGIN_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await resp.json();

  if (!resp.ok || !data.success) {
    throw new Error(data?.message || "Login failed");
  }

  // ✅ FIX HERE
  const access = data?.data?.access_token;

  saveAdminTokens({
    access,
    refresh: null, // your API doesn't return refresh
  });

  return {
    token: access,
    user: data?.data?.role || email,
  };
},

    // Optional: JWT login (if you use /api/token/)
    async obtainWithPassword({ username, password }) {
        const resp = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data?.detail || "Login failed");
        }

        saveAdminTokens({ access: data.access, refresh: data.refresh });
        return data;
    },

    async refreshAccess() {
        const refresh = getAdminRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        const resp = await fetch(REFRESH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data?.detail || "Refresh failed");
        }

        saveAdminTokens({ access: data.access, refresh: data.refresh });
        return data;
    },
    // 🔥 ONBOARD OPERATOR
    async onboardOperator(payload) {
        const token = getAdminAccessToken();

        const resp = await fetch(
            `${API_BASE}/users/rightconnect/onboard-operator/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`, // ✅ dynamic token
                },
                body: JSON.stringify(payload),
                credentials: "include",
            }
        );

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data?.message || "Onboarding failed");
        }

        return data;
    },

  async logout() {
        clearAdminTokens();
        return true;
    },
};

