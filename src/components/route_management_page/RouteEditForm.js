"use client";

import styles from "./route.module.scss";
import { useState } from "react";

export default function RouteEditForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: initial.name,
    totalDistanceKm: initial.totalDistanceKm,
    source: initial.source,
    destination: initial.destination,
    stops: initial.stops.map((s) => ({ ...s })),
  });

  const updateStop = (idx, field, value) => {
    const next = [...form.stops];
    next[idx] = { ...next[idx], [field]: value };
    setForm({ ...form, stops: next });
  };

  return (
    <div className={styles.panel}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="m-0">Edit Route</h6>
        <button className="btn btn-light btn-sm" onClick={onCancel}>Cancel</button>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small">Route Name</label>
          <input className="form-control shadow-none outline-0" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Total Distance (km)</label>
          <input className="form-control shadow-none outline-0" value={form.totalDistanceKm} onChange={(e) => setForm({ ...form, totalDistanceKm: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Source City</label>
          <input className="form-control shadow-none outline-0" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Destination City</label>
          <input className="form-control shadow-none outline-0" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-semibold">Route Stops</div>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setForm({ ...form, stops: [...form.stops, { name: "", arrival: "", departure: "", distanceKm: "" }] })}
          >
            <i className="bi bi-plus-lg me-1"></i> Add Stop
          </button>
        </div>

        {form.stops.map((s, idx) => (
          <div className={styles.stopRow} key={idx}>
            <div className="row g-2">
              <div className="col-md-3">
                <label className="form-label small">Stop Name</label>
                <input className="form-control shadow-none outline-0" value={s.name} onChange={(e) => updateStop(idx, "name", e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Arrival Time</label>
                <input className="form-control shadow-none outline-0" placeholder="--:--" value={s.arrival} onChange={(e) => updateStop(idx, "arrival", e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Departure Time</label>
                <input className="form-control shadow-none outline-0" placeholder="--:--" value={s.departure} onChange={(e) => updateStop(idx, "departure", e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label small">Distance (km)</label>
                <input className="form-control shadow-none outline-0" value={s.distanceKm} onChange={(e) => updateStop(idx, "distanceKm", e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-outline-light text-danger w-100" onClick={() => setForm({ ...form, stops: form.stops.filter((_, i) => i !== idx) })}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave(form)}>Update Route</button>
      </div>
    </div>
  );
}
