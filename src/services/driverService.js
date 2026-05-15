import { OP_API_BASE, OP_DRIVER_CREATE_PATH, OP_DRIVER_LIST_PATH } from "@/utils/constants";
import { httpJSON, postFormData, sendFormData } from "./http";

// Create
export async function createDriver(formData) {
  return postFormData(`${OP_API_BASE}${OP_DRIVER_CREATE_PATH}`, formData);
}

// List
export async function fetchDrivers() {
  return httpJSON(`${OP_API_BASE}${OP_DRIVER_LIST_PATH}`, { method: "GET" });
}

// Update (PATCH multipart; send only fields/files you want to change)
export async function updateDriver(driverId, formData) {
  return sendFormData(`${OP_API_BASE}${OP_DRIVER_CREATE_PATH}${driverId}/`, formData, "PATCH");
}

export async function deleteDriver(driverId) {
  return httpJSON(`${OP_API_BASE}${OP_DRIVER_CREATE_PATH}${driverId}/`, { method: "DELETE" });
}
