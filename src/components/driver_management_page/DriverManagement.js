"use client";
import Select from "react-select";
import styles from "./driver.module.scss";
import { useMemo, useState } from "react";
import DriverCard from "./DriverCard.js";
import DriverForm from "./DriverForm.js";
import DriverDetailsModal from "./DriverDetailsModal.js";

const MOCK = [
    {
        id: 1,
        name: "Rajesh Kumar",
        status: "Active",
        level: "Expert",
        license: "DL123456789",
        phone: "+91 9876543210",
        email: "rajesh@example.com",
        experienceYears: 8,
        avatarInitial: "R",
    },
    {
        id: 2,
        name: "Suresh Patel",
        status: "Active",
        level: "Expert",
        license: "DL987654321",
        phone: "+91 9876543211",
        email: "suresh@example.com",
        experienceYears: 12,
        avatarInitial: "S",
    },
];

const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];

export default function DriverManagement() {
    const [drivers, setDrivers] = useState(MOCK);
    const [mode, setMode] = useState("list"); // list | create | edit | view
    const [current, setCurrent] = useState(null);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState(statusOptions[0]);

    const kpis = useMemo(() => {
        const total = drivers.length;
        const active = drivers.filter((d) => d.status === "Active").length;
        const avgExp =
            Math.round(
                (drivers.reduce((a, b) => a + (b.experienceYears || 0), 0) / Math.max(1, total)) * 10
            ) / 10;
        return { total, active, avgExp };
    }, [drivers]);

    const filtered = drivers.filter((d) => {
        const s = status.value === "ALL" || d.status === status.value;
        const text = `${d.name} ${d.license} ${d.phone} ${d.email}`.toLowerCase();
        return s && text.includes(q.toLowerCase());
    });

    const openCreate = () => {
        setCurrent(null);
        setMode("create");
    };

    const openView = (d) => {
        setCurrent(d);
        setMode("view");
    };

    const openEdit = (d) => {
        setCurrent(d);
        setMode("edit");
    };

    const onCreate = (data) => {
        const next = { ...data, id: Math.max(...drivers.map((x) => x.id)) + 1, avatarInitial: data.name?.[0] || "D" };
        setDrivers([next, ...drivers]);
        setMode("list");
    };

    const onUpdate = (data) => {
        setDrivers(drivers.map((d) => (d.id === data.id ? { ...d, ...data } : d)));
        setMode("list");
    };

    return (
        <div className="container py-4">
            {/* Header + Add */}
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
                <div className="row g-3">
                    {filtered.map((d) => (
                        <div className="col-lg-6" key={d.id}>
                            <DriverCard
                                driver={d}
                                onView={() => openView(d)}
                                onAssign={() =>
                                    alert(`Assign bus functionality for ${d.name} would be implemented here`)
                                }
                                onEdit={() => openEdit(d)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {mode === "create" && (
                <DriverForm
                    title="Add New Driver"
                    submitText="Add Driver"
                    onCancel={() => setMode("list")}
                    onSubmit={(data) => onCreate(data)}
                />
            )}

            {mode === "edit" && (
                <DriverForm
                    title={`Edit Driver - ${current?.name}`}
                    initial={current}
                    submitText="Update Driver"
                    onCancel={() => setMode("list")}
                    onSubmit={(data) => onUpdate({ ...current, ...data })}
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
