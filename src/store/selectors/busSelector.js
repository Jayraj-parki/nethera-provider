import { createSelector } from "@reduxjs/toolkit";

const selectBus = (state) => state.bus;

/* BASIC SELECTORS */
export const selectBuses = createSelector(
  [selectBus],
  (t) => t.buses
);
export const selectActiveBuses = createSelector(
  [selectBus],
  (t) => t.buses.filter((bus) => bus.status == "active")
);

export const selectDrivers = createSelector(
  [selectBus],
  (t) => t.drivers
);
export const selectActiveDrivers = createSelector(
  [selectBus],
  (t) => t.drivers.filter((driver) => driver.status == "active")
);

export const selectRoutes = createSelector(
  [selectBus],
  (t) => t.routes
);

export const selectLoading = createSelector(
  [selectBus],
  (t) => t.loading
);

export const selectError = createSelector(
  [selectBus],
  (t) => t.error
);

/* 🔥 ADVANCED (COMBINED DATA) */

// Example: attach route to each bus
export const selectBusesWithRoutes = createSelector(
  [selectBuses, selectRoutes],
  (buses, routes) =>
    buses?.map((bus) => ({
      ...bus,
      route: routes.find((r) => r.id === bus.route_id),
    }))
);

// Example: driver + assigned bus
export const selectDriversWithBus = createSelector(
  [selectDrivers, selectBuses],
  (drivers, buses) =>
    drivers.map((d) => ({
      ...d,
      bus: buses.find((b) => b.id === d.bus_id),
    }))
);

/* 🔥 MASTER SELECTOR (ALL DATA) */
export const selectBusAll = createSelector(
  [selectBuses, selectDrivers, selectRoutes],
  (buses, drivers, routes) => ({
    buses,
    drivers,
    routes,
  })
);