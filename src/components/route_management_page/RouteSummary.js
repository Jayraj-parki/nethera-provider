"use client";

import styles from "./route.module.scss";

export default function RouteSummary({ route, onEdit, onDelete }) {
  return (
    <div className={styles.panel}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-diagram-3 text-primary"></i>
          <h6 className="m-0">{route.name}</h6>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light btn-sm" onClick={onEdit}>
            <i className="bi bi-pencil-square me-1"></i> Edit
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>
            <i className="bi bi-trash3 me-1"></i> Delete
          </button>
        </div>
      </div>

      <div className="text-muted small mb-3">
        {route.source} → {route.destination}
        <span className={styles.badgePill}>{route.totalDistanceKm} km</span>
        <span className={styles.badgePill}>{route.durationText}</span>
      </div>

      <div className="row">
        <div className="col-12">
          <div className={styles.routeList}>
            <div className="row fw-semibold mb-2">
              <div className="col-md-3">Route Stops ({route.stops.length})</div>
              <div className="col-md-3">Arrival</div>
              <div className="col-md-3">Departure</div>
              <div className="col-md-3">Distance</div>
            </div>

            {route.stops.map((s, idx) => (
              <div className="row align-items-center py-2" key={idx}>
                <div className="col-md-3 d-flex align-items-center gap-2">
                  <span className={styles.dot + " " + (s.tag === "Start" ? styles.dotStart : s.tag === "End" ? styles.dotEnd : "")}></span>
                  <div>
                    <div className="fw-semibold">{s.name}</div>
                    {s.tag && <div className="small text-muted">{s.tag}</div>}
                  </div>
                </div>
                <div className="col-md-3 small">Arrival: {s.arrival}</div>
                <div className="col-md-3 small">Departure: {s.departure}</div>
                <div className="col-md-3 small">{s.distanceKm} km</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
