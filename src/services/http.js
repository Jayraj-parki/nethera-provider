import { operatorAuthApi, getAccessToken, saveTokens } from "./operatorAuthApi";

let tokenGetter = null;
export const setTokenProvider = (fn) => { tokenGetter = fn; };

// boot credentials (env or fallback to admin/root)
const BOOT_USER = process.env.NEXT_PUBLIC_BOOT_USER || "admin";
const BOOT_PASS = process.env.NEXT_PUBLIC_BOOT_PASS || "admin";

// ensure an access token exists, otherwise obtain with admin/root once
async function ensureAccessToken() {
  const fromHook = tokenGetter?.();
  if (fromHook) return fromHook;

  const fromLS = getAccessToken();
  if (fromLS) return fromLS;

  const pair = await operatorAuthApi.obtainWithPassword({ username: BOOT_USER, password: BOOT_PASS });
  return pair.access;
}

async function withAuthFetch(path, auth, init, retryOnce = true) {
  
  const headers = new Headers(init.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  // inject token
  if (auth === true) {
    
    let tok = tokenGetter?.() || getAccessToken();
    if (!tok) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    headers.set("Authorization", `Bearer ${tok}`);
  }

  let resp = await fetch(path, { credentials: "include", ...init, headers });
  
  // if (resp.status === 401 && retryOnce) {
  //   // try refresh and retry once
  //   await operatorAuthApi.refreshAccess();
  //   const fresh = tokenGetter?.() || getAccessToken();
  //   const headers2 = new Headers(init.headers || {});
  //   if (!headers2.has("Accept")) headers2.set("Accept", "application/json");
  //   headers2.set("Authorization", `Bearer ${fresh}`);
  //   resp = await fetch(path, { credentials: "include", ...init, headers: headers2 });
  // }
  return resp;
}

export async function httpJSON(path, init = {}, auth = true) {
  
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const resp = await withAuthFetch(path, auth, { ...init, headers });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;
  
  
  if (!resp.ok) {
    const message = data?.message || data?.detail || `HTTP ${resp.status}`;
    const err = new Error(message);
    err.status = resp.status; err.data = data;
    throw err;
  }
  return data;
}

export async function postFormData(url, formData) {
  // don’t set Content-Type; boundary is set automatically
  const resp = await withAuthFetch(url, { method: "POST", body: formData });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    const message = data?.message || data?.detail || `HTTP ${resp.status}`;
    const err = new Error(message);
    err.status = resp.status; err.data = data;
    throw err;
  }
  return data;
}

export async function sendFormData(url, formData, method = "POST") {
  const resp = await withAuthFetch(url, { method, body: formData });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;

  if (!resp.ok) {
    const message = data?.message || data?.detail || `HTTP ${resp.status}`;
    const err = new Error(message);
    err.status = resp.status; err.data = data;
    throw err;
  }
  return data;
}