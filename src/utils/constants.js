
export const nav_links = {
  "dashboard": "/operator/dashboard",
  "add-bus": "/operator/add-bus",
  "buses": "/operator/buses",
  "routes": "/operator/routes",
  "drivers": "/operator/drivers",
  "trips": "/operator/create-trip",
  "cancelled": "/operator/cancelled",
  "offers": "/operator/offers",
  "login": "/operator/login",
}
export const urls = [
  { href: nav_links['dashboard'], icon: "bi-grid", label: "Dashboard", pill: true },
  // { href: nav_links['add-bus'], icon: "bi-plus-lg", label: "Add Bus" },
    { href: nav_links['buses'], icon: "bi-bus-front", label: "Bus Management" },
    { href: nav_links['routes'], icon: "bi-diagram-3", label: "Route Management" },
    { href: nav_links['drivers'], icon: "bi-person-lines-fill", label: "Driver Management" },
    { href: nav_links['trips'], icon: "bi-calendar-check", label: "Trip Management" },
  // { href: nav_links['cancelled'], icon: "bi-ticket-detailed", label: "Cancelled Tickets" },
  // { href: nav_links['offers'], icon: "bi-tag", label: "Offer Management" },
];

// Temporary constants – move these to env for production
export const OP_API_BASE = process.env.NEXT_PUBLIC_OPERATOR_API_BASE || "http://127.0.0.1:8000";
export const OP_DRIVER_CREATE_PATH = "/buses/drivers/";
export const OP_DRIVER_LIST_PATH = "/buses/drivers/";
export const OP_ROUTES_PATH = "/buses/routes/";
export const OP_TRIPS_PATH = "/buses/create_trip/";
export const OP_BUS_PATH = "/buses/buses/";
export const OP_BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyMDgyNjU0LCJpYXQiOjE3NjIwODIzNTQsImp0aSI6IjNlZDc1YjExODY5MTQzYTE4MGU5YmQ2YjRiZWYxYTk0IiwidXNlcl9pZCI6MX0.likZSonVMx2StmHE8Ro6S9gpJCvh3wrb4wbAbs381bw";
