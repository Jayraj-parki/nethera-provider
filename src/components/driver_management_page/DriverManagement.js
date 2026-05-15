"use client";
import Select from "react-select";
import styles from "./driver.module.scss";
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DriverCard from "./DriverCard.js";
import DriverForm from "./DriverForm.js";
import DriverDetailsModal from "./DriverDetailsModal.js";
// import { createDriver, deleteDriver, fetchDrivers, updateDriver } from "@/services/driverService";
import { selectOperatorAuth } from "@/store/operatorAuthSlice";
import { OP_BEARER_TOKEN } from "@/utils/constants";
import { addDriver, editDriver, fetchDrivers, removeDriver } from "@/store/busSlice";

const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];

export default function DriverManagement() {
    const { token } = useSelector(selectOperatorAuth);
    const dispatch = useDispatch();

    const [drivers, setDrivers] = useState([]);
    const [mode, setMode] = useState("list");
    const [current, setCurrent] = useState(null);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState(statusOptions[0]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDrivers();
    }, []);
    const normalizeDrivers = (list) =>
        list.map((d) => ({
            ...d,
            _id: d.id  ?? d.uuid ?? (d.license && d.phone ? `${d.license}-${d.phone}` : crypto.randomUUID()),
        }));

    const loadDrivers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await dispatch(fetchDrivers()).unwrap();
            const list = Array.isArray(data) ? data : data?.results || [];
            setDrivers(normalizeDrivers(list));
        } catch (err) {
            setError(err?.message || "Failed to load drivers");
        } finally {
            setLoading(false);
        }
    };

    const kpis = useMemo(() => {
        const total = drivers.length;
        const active = drivers.filter((d) => d.status === "active" || d.status === "Active").length;
        const avgExp =
            Math.round(
                (drivers.reduce((a, b) => a + (b.experienceYears || 0), 0) / Math.max(1, total)) * 10
            ) / 10;
        return { total, active, avgExp };
    }, [drivers]);

    const filtered = drivers.filter((d) => {
        const s =
            status.value === "ALL" ||
            String(d.status).toLowerCase() === status.value.toLowerCase();
        const text = `${d.name || ""} ${d.license || ""} ${d.phone || ""} ${d.email || ""}`.toLowerCase();
        return s && text.includes(q.toLowerCase());
    });

    const openCreate = () => {
        setCurrent(null);
        setMode("create");
    };

    const openView = (driverFromApi) => {
        setCurrent({
            ...driverFromApi,
            image_url: driverFromApi.image || "",         // show existing image
            document_url: driverFromApi.document || "",   // show existing document
            license: driverFromApi.license_number,        // normalize for the form
        });
        setMode("view");
    };

    const openEdit = (d) => {
        setCurrent(d);
        setMode("edit");
    };

    const onCreate = async (formPayload) => {
        setLoading(true);
        setError("");

        try {
            // Build FormData
            const fd = new FormData();
            fd.append("name", formPayload.name);
            fd.append("phone", formPayload.phone);
            fd.append("email", formPayload.email);
            fd.append("address", formPayload.address);
            fd.append("dob", formPayload.dob || "");
            fd.append("license_number", formPayload.license);
            fd.append("license_expiry", formPayload.license_expiry || "");
            fd.append("id_proof_type", formPayload.id_proof_type);
            fd.append("id_number", formPayload.id_number);
            fd.append("status", formPayload.status);
            // optional: experienceYears not in your API schema, add if your backend accepts
            // fd.append("experience_years", formPayload.experienceYears || 0);

            if (formPayload.image) fd.append("image", formPayload.image);
            if (formPayload.document) fd.append("document", formPayload.document);

            const created = await dispatch(addDriver(fd)).unwrap();
            const withId = {
                ...created,
                _id: created.id ?? created._id ?? created.uuid ?? crypto.randomUUID(),
            };
            setDrivers((prev) => [withId, ...prev]);
            setMode("list");
        } catch (err) {
            setError(err?.message || "Failed to add driver");
        } finally {
            setLoading(false);
        }
    };

    const onUpdate = async (payload) => {
        setLoading(true); setError("");
        try {
            const fd = new FormData();
            // only append fields that changed (or just send all scalars; PATCH will update)
            fd.append("name", payload.name);
            fd.append("phone", payload.phone);
            fd.append("email", payload.email);
            fd.append("address", payload.address);
            fd.append("dob", payload.dob || "");
            fd.append("license_number", payload.license);
            fd.append("license_expiry", payload.license_expiry || "");
            fd.append("id_proof_type", payload.id_proof_type);
            fd.append("id_number", payload.id_number);
            fd.append("status", payload.status);

            // files: append only if replaced
            if (payload.image) fd.append("image", payload.image);
            if (payload.document) fd.append("document", payload.document);

            const updated = await dispatch(editDriver({ id: payload.id, formData: fd })).unwrap();
            setDrivers((prev) => prev.map((d) => (d.id === payload.id ? { ...d, ...updated } : d)));
            setMode("list");
        } catch (err) {
            setError(err?.message || "Failed to update driver");
        } finally {
            setLoading(false);
        }
    };
     const onDelete = async (payload) => {
        setLoading(true); setError("");
        try {
            
            const updated = await dispatch(removeDriver(payload.id )).unwrap();
             setDrivers((prev) => prev.filter((d) => d._id !== payload.id));
            setMode("list");
        } catch (err) {
            setError(err?.message || "Failed to Delete driver");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h4 className="mb-1">Driver Management</h4>
                    <div className="text-muted">Manage your driver database</div>
                </div>
                {mode === "list" && (
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
                        <i className="bi bi-plus-lg"></i> Add New Driver
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
            )}

            {/* KPIs */}
            <div className="row g-3 mb-3">
                <div className="col-lg-4 col-md-6">
                    <div className={styles.statCard}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">Total Drivers</div>
                            <i className="bi bi-people fs-5 text-primary"></i>
                        </div>
                        <div className={styles.statValue}>{kpis.total}</div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className={styles.statCard}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">Active Drivers</div>
                            <i className="bi bi-person-check fs-5 text-primary"></i>
                        </div>
                        <div className={styles.statValue}>{kpis.active}</div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className={styles.statCard}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">Avg Experience</div>
                            <i className="bi bi-calendar3 fs-5 text-primary"></i>
                        </div>
                        <div className={styles.statValue}>{kpis.avgExp} years</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            {mode === "list" && (
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <div className="flex-grow-1">
                        <div className={styles.searchWrap + " d-flex align-items-center"}>
                            <i className="bi bi-search text-muted ms-2 me-2"></i>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by name, license, or phone..."
                                className="form-control border-0 shadow-none"
                            />
                        </div>
                    </div>
                    <div style={{ minWidth: 180 }}>
                        <Select
                            instanceId="driver-status-select"
                            classNamePrefix="react-select"
                            options={statusOptions}
                            value={status}
                            onChange={(opt) => setStatus(opt)}
                            isSearchable={false}
                            styles={{
                                container: (base) => ({ ...base, width: "100%", minWidth: 220 }),
                                control: (base) => ({ ...base, minHeight: 42, borderRadius: "0.7rem" }),
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            menuShouldScrollIntoView={false}
                        />
                    </div>
                </div>
            )}

            {/* Views */}
            {mode === "list" && (
                <>
                    {loading && <div className="text-center my-3">Loading drivers...</div>}
                    <div className="row g-3">
                        {filtered.map((d) => (
                            <div className="col-lg-6" key={d.id  ?? d.uuid ?? `${d.license}-${d.phone}`}>
                                <DriverCard
                                    driver={d}
                                    onView={() => openView(d)}
                                    onAssign={() => alert(`Assign bus functionality for ${d.name} would be implemented here`)}
                                    onEdit={() => openEdit(d)}
                                    onDelete={()=>onDelete(d)}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {mode === "create" && (
                <DriverForm
                    title="Add New Driver"
                    submitText={loading ? "Adding..." : "Add Driver"}
                    onCancel={() => setMode("list")}
                    onSubmit={onCreate}
                    mode={mode}
                />
            )}

            {mode === "edit" && (
                <DriverForm
                    title={`Edit Driver - ${current?.name}`}
                    initial={current}
                    submitText="Update Driver"
                    onCancel={() => setMode("list")}
                    onSubmit={(data) => onUpdate({ ...current, ...data })}
                    mode={mode}
                />
            )}

            {mode === "view" && current && (
                <DriverDetailsModal
                    driver={current}
                    onClose={() => setMode("list")}
                    onEdit={() => openEdit(current)}
                    onAssign={() => alert(`Assign bus functionality for ${current.name} would be implemented here`)}
                />
            )}
        </div>
    );
}
