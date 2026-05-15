import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenExpired, operatorAuthApi, saveTokens } from "@/services/operatorAuthApi";
import { setTokenProvider } from "@/services/http";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { nav_links } from "@/utils/constants";

const AUTH_KEY = "op-auth:v1";
const ACCESS_KEY = "op:access";

const initialState = {
  status: "anonymous",
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const operatorLogin = createAsyncThunk(
  "operatorAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await operatorAuthApi.login({ email, password });
      data.user = {
        email,
        role: data.role,
        operator_id: data.operator_id,
        must_change_password: data.must_change_password,
      };
      return data;
    } catch (err) {
      return rejectWithValue({ message: err?.message || "Login failed" });
    }
  }
);
export const operatorSignup = createAsyncThunk(
  "operatorAuth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await operatorAuthApi.signup(payload);
      return data;
    } catch (err) {
      return rejectWithValue({ message: err?.message || "Signup failed" });
    }
  }
);

export const operatorMe = createAsyncThunk("operatorAuth/me", async (_, { rejectWithValue }) => {
  try { return await operatorAuthApi.me(); }
  catch (err) { return rejectWithValue({ message: err?.message || "Failed to fetch profile" }); }
});

export const operatorLogout = createAsyncThunk(
  "operatorAuth/logout",
  async () => {
    await operatorAuthApi.logout();
    return true;
  }
);

export const createTrip = createAsyncThunk(
  "trip/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createTrip(payload);
    } catch (err) {
      return rejectWithValue(err?.message || "Trip creation failed");
    }
  }
);
const slice = createSlice({
  name: "operatorAuth",
  initialState,
  reducers: {
    restore(state, { payload }) {
      if (!payload) return;
      state.status = payload.status || "anonymous";
      state.user = payload.user || null;
      state.token = payload.token || null;
      state.error = null;
    },
    clear(state) {
      state.status = "anonymous"; state.user = null; state.token = null; state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(operatorLogin.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(operatorLogin.fulfilled, (s, a) => {
      s.loading = false;
      s.status = "authenticated";
      s.user = a.payload.user;
      s.token = a.payload.access_token;

      setItem(AUTH_KEY, { status: s.status, user: s.user, token: s.token });
      setItem(ACCESS_KEY, s.token);
      document.cookie = `op_access=${a.payload.access_token}; path=/`;

    });
    b.addCase(operatorLogin.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload?.message || a.error?.message || "Login failed";
    });

    b.addCase(operatorMe.fulfilled, (s, a) => {
      s.status = "authenticated";
      s.user = a.payload?.user || a.payload || s.user;
    });

    b.addCase(operatorSignup.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(operatorSignup.fulfilled, (s, a) => {
      s.loading = false;
      s.status = "registered";
    });

    b.addCase(operatorSignup.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload?.message || a.error?.message || "Signup failed";
    });
    b.addCase(operatorLogout.fulfilled, (state) => {
      state.status = "anonymous";
      state.user = null;
      state.token = null;
      setItem(AUTH_KEY, { status: "anonymous", user: null, token: null });
      setItem(ACCESS_KEY, null);
      document.cookie ="op_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

  },
});

export const { restore, clear } = slice.actions;

export const selectOperatorAuth = (s) => s.operatorAuth;
export const selectOperatorUser = (s) => s.operatorAuth.user;
export const selectOperatorIsAuthed = (s) => s.operatorAuth.status === "authenticated";

export const persistOperatorAuth = (store) => {
  if (typeof window === "undefined") return;
  store.subscribe(() => {
    const { status, user, token } = store.getState().operatorAuth;
    try { setItem(AUTH_KEY, { status, user, token }); } catch { }
  });
  setTokenProvider(() => store.getState().operatorAuth.token);
};

export const restoreOperatorAuth = (store) => {
  if (typeof window === "undefined") return;

  try {
    const data = getItem(AUTH_KEY);

    if (!data) return;

    // token missing
    if (!data?.token) {
      removeItem(AUTH_KEY);
      return;
    }

    // token expired
    if (isTokenExpired(data.token)) {
      removeItem(AUTH_KEY);
      removeItem(ACCESS_KEY);

      store.dispatch(clear());

      // redirect login
      window.location.replace(nav_links['login']);

      return;
    }

    // restore redux state
    store.dispatch(restore(data));

  } catch (err) {
    console.error(err);
  }

  setTokenProvider(() => store.getState().operatorAuth.token);
};

export default slice.reducer;
