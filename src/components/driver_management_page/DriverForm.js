"use client";

import Select from "react-select";
import styles from "./driver.module.scss";
import { useMemo, useState, useEffect, useRef } from "react";
import CustomDatePicker from "../common/CustomDatePicker";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const idProofOptions = [
  { value: "Aadhar", label: "Aadhar" },
  { value: "PAN", label: "PAN" },
  { value: "Passport", label: "Passport" },
  { value: "DrivingLicense", label: "Driving License" },
  { value: "VoterID", label: "Voter ID" },
];

const toISO = (val) => {
  if (!val) return "";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(val);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    return val;
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, "0");
    const d = String(val.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
};

export default function DriverForm({
  title,
  initial,
  submitText,
  onCancel,
  onSubmit,
  mode = "create", // "create" | "edit"
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    license: initial?.license || initial?.license_number || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    experienceYears: initial?.experienceYears ?? 0,

    address: initial?.address || "",
    dob: initial?.dob || "",
    license_expiry: initial?.license_expiry || "",

    id_proof_type: initial?.id_proof_type
      ? idProofOptions.find((o) => o.value === initial.id_proof_type)
      : idProofOptions[0],
    id_number: initial?.id_number || "",

    status: initial?.status
      ? statusOptions.find(
          (s) => s.value.toLowerCase() === String(initial.status).toLowerCase()
        )
      : statusOptions[0],
  });

  // Refs to allow clearing native file inputs
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Start empty in create, else show server assets in edit
  const initialImageUrl = mode === "edit" ? initial?.image || "" : "";
  const initialDocUrl = mode === "edit" ? initial?.document || "" : "";

  // Selected file + preview URL
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [docFile, setDocFile] = useState(null);
  const [docPreviewUrl, setDocPreviewUrl] = useState(initialDocUrl);

  // Replace flags to decide what to send
  const [replaceImage, setReplaceImage] = useState(false);
  const [replaceDocument, setReplaceDocument] = useState(false);

  // Sync when switching rows in edit
  useEffect(() => {
    if (mode === "edit") {
      setImagePreview(initial?.image || "");
      setDocPreviewUrl(initial?.document || "");
    } else {
      setImagePreview("");
      setDocPreviewUrl("");
    }
    setImageFile(null);
    setDocFile(null);
    setReplaceImage(false);
    setReplaceDocument(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  }, [mode, initial?.id]);

  const valid = useMemo(
    () => form.name && form.license && form.phone && form.email && form.id_number,
    [form]
  );

  const pickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setReplaceImage(true);
  };

  const clearImage = () => {
    // Clear native input so the same file can be reselected
    if (imageInputRef.current) imageInputRef.current.value = "";
    setImageFile(null);
    setReplaceImage(false);
    setImagePreview(mode === "edit" ? initial?.image || "" : "");
  };

  const pickDocument = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setDocFile(f);
    setDocPreviewUrl(URL.createObjectURL(f));
    setReplaceDocument(true);
  };

  const clearDocument = () => {
    if (docInputRef.current) docInputRef.current.value = "";
    setDocFile(null);
    setReplaceDocument(false);
    setDocPreviewUrl(mode === "edit" ? initial?.document || "" : "");
  };

  const submit = () => {
    if (!valid) return;
    onSubmit({
      name: form.name.trim(),
      license: form.license.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      experienceYears: Number(form.experienceYears) || 0,

      address: form.address.trim(),
      dob: toISO(form.dob),
      license_expiry: toISO(form.license_expiry),
      id_proof_type: form.id_proof_type.value,
      id_number: form.id_number.trim(),
      status: form.status.value,

      // Only send files if user picked new ones; keep null for create if not chosen
      image: replaceImage ? imageFile : null,
      document: replaceDocument ? docFile : null,

      // Useful hints to parent (optional)
      keepExistingImage: mode === "edit" && !replaceImage && !!initial?.image,
      keepExistingDocument: mode === "edit" && !replaceDocument && !!initial?.document,

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
        {/* Basic fields */}
        <div className="col-md-6">
          <label className="form-label small">Driver Name *</label>
          <input
            className="form-control shadow-none outline-0"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">License Number *</label>
          <input
            className="form-control shadow-none outline-0"
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
            placeholder="e.g., DL123456789"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small">Phone Number *</label>
          <input
            className="form-control shadow-none outline-0"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="9876543211"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">Email Address *</label>
          <input
            className="form-control shadow-none outline-0"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="driver@example.com"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small">Experience (Years) *</label>
          <input
            className="form-control shadow-none outline-0"
            type="number"
            min="0"
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
          />
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

        <div className="col-md-12">
          <label className="form-label small">Address</label>
          <input
            className="form-control shadow-none outline-0"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="123 Main St"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small">Date of Birth</label>
          <CustomDatePicker
            selected={form.dob}
            onChange={(date) => setForm({ ...form, dob: date })}
            placeholder="dd-mm-yyyy"
            mode="past"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">License Expiry</label>
          <CustomDatePicker
            selected={form.license_expiry}
            onChange={(date) => setForm({ ...form, license_expiry: date })}
            placeholder="dd-mm-yyyy"
            mode="future"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small">ID Proof Type</label>
          <Select
            instanceId="driver-form-idproof-select"
            classNamePrefix="react-select"
            options={idProofOptions}
            value={form.id_proof_type}
            onChange={(opt) => setForm({ ...form, id_proof_type: opt })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small">ID Number *</label>
          <input
            className="form-control shadow-none outline-0"
            value={form.id_number}
            onChange={(e) => setForm({ ...form, id_number: e.target.value })}
            placeholder="e.g., 1234-5678-9012"
          />
        </div>

        {/* Uploads */}
        <div className="col-md-6">
          <label className="form-label small">Profile Image</label>
          <div className="position-relative">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="form-control shadow-none outline-0"
              onChange={pickImage}
            />
            {imagePreview && (
              <div className="d-flex align-items-center gap-3 mt-2">
                <div>
                  <div className="small text-muted mb-1">
                    {replaceImage ? "New image preview" : mode === "edit" ? "Current image" : "Selected image"}
                  </div>
                  <div className={styles.previewBox}>
                    <img src={imagePreview} alt="preview" />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearImage}
                  aria-label="Clear image"
                  title="Clear image"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label small">Document (Image/PDF)</label>
          <input
            ref={docInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="form-control shadow-none outline-0"
            onChange={pickDocument}
          />
          <div className="mt-2">
            {mode === "edit" && initial?.document && !replaceDocument && (
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Current document:</span>
                <a href={initial.document} target="_blank" rel="noreferrer">View</a>
              </div>
            )}
            {(docFile || (mode === "create" && docPreviewUrl)) && (
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="small text-muted">{docFile ? "New file:" : "Selected file:"}</span>
                <span className="small text-muted">{docFile?.name || ""}</span>
                {docPreviewUrl && (
                  <a href={docPreviewUrl} target="_blank" rel="noreferrer">Preview</a>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearDocument}
                  aria-label="Clear document"
                  title="Clear document"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={!valid} onClick={submit}>{submitText}</button>
      </div>
    </div>
  );
}
