import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAuthApi } from "@/services/adminAuthApi";

const initialState = {
    status: "anonymous",
    user: null,
    token: null,
    loading: false,
    error: null,
    onboardResult: null,
};

// 🔥 LOGIN
export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await adminAuthApi.login({ email, password });

      return {
        user: data.user,
        token: data.token,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔥 LOGOUT
export const adminLogout = createAsyncThunk(
    "adminAuth/logout",
    async () => {
        await adminAuthApi.logout();
        return true;
    }
);
export const onboardOperator = createAsyncThunk(
    "admin/onboardOperator",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await adminAuthApi.onboardOperator(payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const slice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {},

    extraReducers: (b) => {
        b.addCase(adminLogin.pending, (s) => {
            s.loading = true;
            s.error = null;
        });

        b.addCase(adminLogin.fulfilled, (s, a) => {
            s.loading = false;
            s.status = "authenticated";
            s.user = a.payload.user;
            s.token = a.payload.token;
        });

        b.addCase(adminLogin.rejected, (s, a) => {
            s.loading = false;
            s.error = a.payload || "Login failed";
        });

        b.addCase(adminLogout.fulfilled, (s) => {
            s.status = "anonymous";
            s.user = null;
            s.token = null;
        });
        b.addCase(onboardOperator.pending, (s) => {
            s.loading = true;
            s.error = null;
        });

        b.addCase(onboardOperator.fulfilled, (s, a) => {
            s.loading = false;
            s.onboardResult = a.payload;
        });

        b.addCase(onboardOperator.rejected, (s, a) => {
            s.loading = false;
            s.error = a.payload || "Onboarding failed";
        });
    },
});

export default slice.reducer;