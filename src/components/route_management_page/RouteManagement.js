"use client";
import styles from "./route.module.scss";
import { useState } from "react";
import RouteSummary from "./RouteSummary.js";
import RouteEditForm from "./RouteEditForm.js";
import RouteCreateForm from "./RouteCreateForm.js";


const mockRoute = {
  id: 1,
  name: "Mumbai–Delhi Express",
  source: "Mumbai",
  destination: "Delhi",
  totalDistanceKm: 1400,
  durationText: "20h 0m",
  stops: [
    { name: "Mumbai", arrival: "00:00", departure: "10:30", distanceKm: 0, tag: "Start" },
    { name: "Pune", arrival: "13:30", departure: "13:45", distanceKm: 150 },
    { name: "Nashik", arrival: "15:30", departure: "15:45", distanceKm: 210 },
    { name: "Indore", arrival: "22:30", departure: "22:45", distanceKm: 590 },
    { name: "Delhi", arrival: "06:30", departure: "06:30", distanceKm: 1400, tag: "End" },
  ],
};

export default function RouteManagement() {
  const [mode, setMode] = useState("display"); // "display" | "edit" | "create"
  const route = mockRoute;

  const StatCard = ({ icon, label, value, tone }) => (
    <div className="col-lg-4 col-md-6">
      <div className={styles.statCard}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">{label}</div>
          <i className={`bi ${icon} ${tone || "text-primary"} fs-5`}></i>
        </div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Header row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="mb-1">Route Management</h4>
          <div className="text-muted">Manage bus routes and stops</div>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setMode("create")}
        >
          <i className="bi bi-plus-lg" /> Add New Route
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <StatCard icon="bi-diagram-3" label="Total Routes" value="1" />
        <StatCard icon="bi-geo-alt" label="Total Distance" value={`${route.totalDistanceKm} km`} />
        <StatCard icon="bi-clock-history" label="Average Distance" value={`${route.totalDistanceKm} km`} tone="text-pink" />
      </div>

      {/* Body by mode */}
      {mode === "display" && (
        <RouteSummary
          route={route}
          onEdit={() => setMode("edit")}
          onDelete={() => alert("Delete route (UI only)")}
        />
      )}

      {mode === "edit" && (
        <RouteEditForm
          initial={route}
          onCancel={() => setMode("display")}
          onSave={(data) => {
            console.log("Update route", data);
            setMode("display");
          }}
        />
      )}

      {mode === "create" && (
        <RouteCreateForm
          onCancel={() => setMode("display")}
          onCreate={(data) => {
            console.log("Create route", data);
            setMode("display");
          }}
        />
      )}
    </div>
  );
}
