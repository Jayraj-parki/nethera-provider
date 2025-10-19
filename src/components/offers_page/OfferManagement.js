"use client";
import { useMemo, useState } from "react";
import styles from "./offers.module.scss";
import OfferForm from "./OfferForm.js";
import Select from "react-select";
const statusFilterOptions = [
    { value: "ALL", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Expired", label: "Expired" },
];
const MOCK = [
    {
        id: 1,
        title: "New Year Special",
        description: "20% off on all bookings",
        status: "Active", // Active | Upcoming | Expired
        type: "Percentage", // Percentage | Flat
        value: 20,
        minAmount: 1000,
        maxDiscount: 500,
        validFrom: "1/1/2024",
        validTill: "1/31/2024",
        routes: [{ id: 10, name: "Mumbai-Delhi Express" }],
    },
];

export default function OfferManagement() {
    const [offers, setOffers] = useState(MOCK);
    const [q, setQ] = useState("");
    const [mode, setMode] = useState("list"); // list | create | edit
    const [current, setCurrent] = useState(null);
    const [statusFilter, setStatusFilter] = useState(statusFilterOptions[0]);

    const filtered = offers
        .filter((o) => (statusFilter.value === "ALL" ? true : o.status === statusFilter.value))
        .filter((o) => `${o.title} ${o.description}`.toLowerCase().includes(q.toLowerCase()));


    const stats = useMemo(() => {
        const total = offers.length;
        const active = offers.filter((o) => o.status === "Active").length;
        const upcoming = offers.filter((o) => o.status === "Upcoming").length;
        const expired = offers.filter((o) => o.status === "Expired").length;
        return { total, active, upcoming, expired };
    }, [offers]);

    const openCreate = () => {
        setCurrent(null);
        setMode("create");
    };
    const openEdit = (o) => {
        setCurrent(o);
        setMode("edit");
    };

    const onCreate = (data) => {
        const next = { ...data, id: Math.max(0, ...offers.map((x) => x.id)) + 1 };
        setOffers([next, ...offers]);
        setMode("list");
    };
    const onUpdate = (data) => {
        setOffers(offers.map((o) => (o.id === data.id ? { ...o, ...data } : o)));
        setMode("list");
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h4 className="mb-1">Offer Management</h4>
                    <div className="text-muted">Create and manage promotional offers</div>
                </div>
                {mode === "list" && (
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
                        <i className="bi bi-plus-lg" /> Create New Offer
                    </button>
                )}
            </div>

            {/* KPI row */}
            {mode === "list" && (
                <>
                    <div className="row g-3 mb-3">
                        <Kpi icon="bi-tag" label="Total Offers" value={stats.total} />
                        <Kpi icon="bi-eye" label="Active" value={stats.active} />
                        <Kpi icon="bi-calendar-event" label="Upcoming" value={stats.upcoming} />
                        <Kpi icon="bi-eye-slash" label="Expired" value={stats.expired} />
                    </div>

                    {/* Search */}
                    
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <div className={styles.searchWrap + " d-flex align-items-center flex-grow-1"}>
                            <i className="bi bi-search text-muted ms-2 me-2"></i>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search offers by title or description..."
                                className="form-control border-0 shadow-none"
                            />
                        </div>
                        <div className={styles.selectWrap}>
                            <Select
                            instanceId='offer-status-select'
                                classNamePrefix="rs"
                                options={statusFilterOptions}
                                value={statusFilter}
                                onChange={(opt) => setStatusFilter(opt)}
                                isSearchable={false}
                                styles={{
                                    container: (b) => ({ ...b, width: "100%", minWidth: 180 }),
                                    control: (b) => ({ ...b, minHeight: 42, borderRadius: "0.7rem" }),
                                    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                                }}
                                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                menuPosition="fixed"
                                menuShouldScrollIntoView={false}
                            />
                        </div>
                    </div>

                    {/* Offer list */}
                    <div className="d-flex flex-column gap-3">
                        {filtered.map((o) => (
                            <div className={styles.card + " bg-white border rounded-4 p-3"} key={o.id}>
                                <div className="d-flex align-items-start justify-content-between">
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="fw-semibold">{o.title}</div>
                                            <span className="badge bg-success-subtle text-success">{o.status}</span>
                                            {o.status === "Expired" && (
                                                <span className="badge bg-secondary-subtle text-secondary">Expired</span>
                                            )}
                                        </div>
                                        <div className="text-muted small mt-1">{o.description}</div>

                                        <div className="d-flex flex-wrap gap-4 small mt-2">
                                            <div>
                                                <i className="bi bi-percent"></i>{" "}
                                                {o.type === "Percentage" ? `${o.value}%` : `₹${o.value}`}{" "}
                                                {o.maxDiscount ? `(max ₹${o.maxDiscount})` : ""}
                                            </div>
                                            <div>
                                                <i className="bi bi-currency-rupee"></i> Min: ₹{o.minAmount}
                                            </div>
                                            <div>
                                                <i className="bi bi-calendar"></i> {o.validFrom} - {o.validTill}
                                            </div>
                                            <div>
                                                <i className="bi bi-tags"></i> {o.routes.length} route
                                            </div>
                                        </div>

                                        <div className="small mt-2">
                                            <div className="fw-semibold">Applicable Routes:</div>
                                            <div>{o.routes.map((r) => r.name).join(", ")}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <button className="btn btn-light btn-sm" onClick={() => openEdit(o)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-light btn-sm text-danger"
                                            onClick={() => alert("Delete (UI only)")}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {mode !== "list" && (
                <OfferForm
                    mode={mode}
                    initial={mode === "edit" ? current : null}
                    onCancel={() => setMode("list")}
                    onSubmit={(data) =>
                        mode === "create" ? onCreate(data) : onUpdate({ ...current, ...data })
                    }
                />
            )}
        </div>
    );
}

function Kpi({ icon, label, value }) {
    return (
        <div className="col-lg-3 col-md-6">
            <div className="bg-white border rounded-4 p-3 shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="text-muted small">{label}</div>
                    <i className={`bi ${icon} text-primary fs-5`}></i>
                </div>
                <div className="fw-bold" style={{ fontSize: "1.4rem", marginTop: ".25rem" }}>{value}</div>
            </div>
        </div>
    );
}
