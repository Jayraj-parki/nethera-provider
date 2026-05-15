// services/routeService.js
import { OP_API_BASE, OP_ROUTES_PATH, OP_TRIPS_PATH } from "@/utils/constants";
import { httpJSON } from "@/services/http";

// List
export const listRoutes = () =>
  httpJSON(`${OP_API_BASE}${OP_ROUTES_PATH}`, { method: "GET" });

// Retrieve
export const getRoute = (id) =>
  httpJSON(`${OP_API_BASE}${OP_ROUTES_PATH}${id}/`, { method: "GET" });

// Create (JSON)
export const createTrip = (payload) =>
  httpJSON(`${OP_API_BASE}${OP_TRIPS_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Update (PATCH JSON)
export const patchRoute = (id, patch) =>
  httpJSON(`${OP_API_BASE}${OP_ROUTES_PATH}${id}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

// Replace (PUT JSON)
export const putRoute = (id, payload) =>
  httpJSON(`${OP_API_BASE}${OP_ROUTES_PATH}${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Delete
export const deleteRoute = (id) =>
  httpJSON(`${OP_API_BASE}${OP_ROUTES_PATH}${id}/`, { method: "DELETE" });
