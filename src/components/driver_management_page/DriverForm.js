"use client";

import Select from "react-select";
import styles from "./driver.module.scss";
import { useMemo, useState } from "react";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function DriverForm({ title, initial, submitText, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    license: initial?.license || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    experienceYears: initial?.experienceYears ?? 0,
    status: initial?.status ? statusOptions.find(s => s.value === initial.status) : statusOptions[0],
  });

  const valid = useMemo(() => {
    return form.name && form.license && form.phone && form.email;
  }, [form]);

  const submit = () => {
    if (!valid) return;
    onSubmit({
      name: form.name.trim(),
      license: form.license.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      status: form.status.value,
      experienceYears: Number(form.experienceYears) || 0,
      avatarInitial: (form.name?.[0] || "D").toUpperCase(),
    });
  };

  return (
    <div className={styles.panel}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="m-0">{title}</h6>
        <button className="btn btn-light btn-sm" onClick={onCancel}>Cancel</button>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small">Driver Name *</label>
          <input className="form-control shadow-none outline-0" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
        </div>
        <div className="col-md-6">
          <label className="form-label small">License Number *</label>
          <input className="form-control shadow-none outline-0" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="e.g., DL123456789" />
        </div>

        <div className="col-md-6">
          <label className="form-label small">Phone Number *</label>
          <input className="form-control shadow-none outline-0" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Email Address *</label>
          <input className="form-control shadow-none outline-0" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="driver@example.com" />
        </div>

        <div className="col-md-6">
          <label className="form-label small">Experience (Years) *</label>
          <input className="form-control shadow-none outline-0" type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Status *</label>
          <Select
          instanceId="driver-form-status-select"
            classNamePrefix="react-select"
            options={statusOptions}
            value={form.status}
            onChange={(opt) => setForm({ ...form, status: opt })}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={!valid} onClick={submit}>{submitText}</button>
      </div>
    </div>
  );
}
