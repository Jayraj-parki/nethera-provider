import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import * as busApi from "@/services/busService";
import * as driverApi from "@/services/driverService";
import * as routeApi from "@/services/routeService";

/* =========================
   🚀 THUNKS
========================= */

// BUSES
export const fetchBuses = createAsyncThunk("bus/fetchBuses", async () => {
  return await busApi.listBuses();
});

export const addBus = createAsyncThunk("bus/addBus", async (payload) => {
  return await busApi.createBus(payload);
});

export const editBus = createAsyncThunk("bus/editBus", async ({ id, payload }) => {
  return await busApi.updateBus(id, payload);
});

export const removeBus = createAsyncThunk("bus/removeBus", async (id) => {
  await busApi.deleteBus(id);
  return id;
});

// DRIVERS
export const fetchDrivers = createAsyncThunk("bus/fetchDrivers", async () => {
  return await driverApi.fetchDrivers();
});

export const addDriver = createAsyncThunk("bus/addDriver", async (formData) => {
  return await driverApi.createDriver(formData);
});

export const editDriver = createAsyncThunk(
  "bus/editDriver",
  async ({ id, formData }) => {
    return await driverApi.updateDriver(id, formData);
  }
);

export const removeDriver = createAsyncThunk("bus/removeDriver", async (id) => {
  await driverApi.deleteDriver(id);
  return id;
});

// ROUTES
export const fetchRoutes = createAsyncThunk("bus/fetchRoutes", async () => {
  return await routeApi.listRoutes();
});

export const fetchRouteById = createAsyncThunk("bus/fetchRouteById", async (id) => {
  return await routeApi.getRoute(id);
});

export const addRoute = createAsyncThunk("bus/addRoute", async (payload) => {
  return await routeApi.createRoute(payload);
});

export const editRoute = createAsyncThunk(
  "bus/editRoute",
  async ({ id, payload }) => {
    return await routeApi.patchRoute(id, payload);
  }
);

export const removeRoute = createAsyncThunk("bus/removeRoute", async (id) => {
  await routeApi.deleteRoute(id);
  return id;
});

/* =========================
   🧠 SLICE
========================= */

const busSlice = createSlice({
  name: "bus",
  initialState: {
    buses: [],
    drivers: [],
    routes: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
  builder

    /* ===== BUSES ===== */
    .addCase(fetchBuses.fulfilled, (state, action) => {
      state.buses = action.payload;
    })
    .addCase(addBus.fulfilled, (state, action) => {
      state.buses.push(action.payload);
    })
    .addCase(editBus.fulfilled, (state, action) => {
      const i = state.buses.findIndex((b) => b.id === action.payload.id);
      if (i !== -1) state.buses[i] = action.payload;
    })
    .addCase(removeBus.fulfilled, (state, action) => {
      state.buses = state.buses.filter((b) => b.id !== action.payload);
    })

    /* ===== DRIVERS ===== */
    .addCase(fetchDrivers.fulfilled, (state, action) => {
      state.drivers = action.payload;
    })
    .addCase(addDriver.fulfilled, (state, action) => {
      state.drivers.push(action.payload);
    })
    .addCase(editDriver.fulfilled, (state, action) => {
      const i = state.drivers.findIndex((d) => d.id === action.payload.id);
      if (i !== -1) state.drivers[i] = action.payload;
    })
    .addCase(removeDriver.fulfilled, (state, action) => {
      state.drivers = state.drivers.filter((d) => d.id !== action.payload);
    })

    /* ===== ROUTES ===== */
    .addCase(fetchRoutes.fulfilled, (state, action) => {
      state.routes = action.payload;
    })
    .addCase(addRoute.fulfilled, (state, action) => {
      state.routes.push(action.payload);
    })
    .addCase(editRoute.fulfilled, (state, action) => {
      const i = state.routes.findIndex((r) => r.id === action.payload.id);
      if (i !== -1) state.routes[i] = action.payload;
    })
    .addCase(removeRoute.fulfilled, (state, action) => {
      state.routes = state.routes.filter((r) => r.id !== action.payload);
    })

    /* ===== MATCHERS (LAST) ===== */
    .addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
    )
    .addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state) => {
        state.loading = false;
      }
    );
}
});

export default busSlice.reducer;