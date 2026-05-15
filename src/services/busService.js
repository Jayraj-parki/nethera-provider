import { OP_API_BASE, OP_BUS_PATH } from "@/utils/constants";
import { httpJSON } from "@/services/http";

/* List buses */
export const listBuses = () =>
  httpJSON(`${OP_API_BASE}${OP_BUS_PATH}`, {
    method: "GET",
  });

/* Get single bus */
export const getBus = (id) =>
  httpJSON(`${OP_API_BASE}${OP_BUS_PATH}${id}/`, {
    method: "GET",
  });

/* Create bus */
export const createBus = (payload) =>
  httpJSON(`${OP_API_BASE}${OP_BUS_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* Update bus */
export const updateBus = (id, payload) =>
  httpJSON(`${OP_API_BASE}${OP_BUS_PATH}${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

/* Delete bus */
export const deleteBus = (id) =>
  httpJSON(`${OP_API_BASE}${OP_BUS_PATH}${id}/`, {
    method: "DELETE",
  });