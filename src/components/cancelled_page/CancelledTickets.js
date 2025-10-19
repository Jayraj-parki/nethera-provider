"use client";
import Select from "react-select";
import { useMemo, useState } from "react";
import ProcessRefundModal from "./ProcessRefundModal.js";

const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Processed", label: "Processed" },
];

// Mock tickets
const MOCK = [
    {
        id: "TKT001",
        passenger: "John Doe",
        bus: "EXP-001 (sleeper)",
        seats: ["A1", "A2"],
        cancelledOn: "1/12/2024",
        refund: 2160,
        status: "Pending",
        processedOn: null,
        transactionId: null,
        notes: null,
    },
    {
        id: "TKT002",
        passenger: "Jane Smith",
        bus: "EXP-001 (sleeper)",
        seats: ["B3"],
        cancelledOn: "1/13/2024",
        refund: 1530,
        status: "Processed",
        processedOn: "1/14/2024",
        transactionId: "TXN123456",
        notes: "Refund processed via UPI",
    },
];

export default function CancelledTickets() {
    const [tickets, setTickets] = useState(MOCK);
    const [filter, setFilter] = useState(statusOptions[0]);
    const [q, setQ] = useState("");
    const [modal, setModal] = useState({ open: false, ticketId: null });

    const kpis = useMemo(() => {
        const total = tickets.length;
        const processed = tickets.filter(t => t.status === "Processed").length;
        const pending = total - processed;
        const totalRefunds = tickets
            .filter(t => t.status === "Processed")
            .reduce((a, b) => a + (b.refund || 0), 0);
        return { total, processed, pending, totalRefunds };
    }, [tickets]);

    const filtered = tickets.filter(t => {
        const ok = filter.value === "ALL" || t.status === filter.value;
        const text = `${t.id} ${t.passenger}`.toLowerCase();
        return ok && text.includes(q.toLowerCase());
    });

    const openModal = (id) => setModal({ open: true, ticketId: id });
    const closeModal = () => setModal({ open: false, ticketId: null });

    const processRefund = (payload) => {
        const { ticketId, transactionId, notes } = payload;
        setTickets(tickets.map(t =>
            t.id === ticketId
                ? {
                    ...t,
                    status: "Processed",
                    processedOn: new Date().toLocaleDateString(),
                    transactionId,
                    notes: notes || null,
                }
                : t
        ));
        closeModal();
    };

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="mb-2">
                <h4 className="mb-1">Cancelled Tickets</h4>
                <div className="text-muted">Process refunds for cancelled bookings</div>
            </div>

            {/* KPI row */}
            <div className="row g-3 mb-3">
                <KpiCard icon="bi-ticket-perforated" label="Total Cancelled" value={kpis.total} tone="text-danger" />
                <KpiCard icon="bi-clock-history" label="Pending" value={kpis.pending} />
                <KpiCard icon="bi-check2-circle" label="Processed" value={kpis.processed} tone="text-success" />
                <KpiCard icon="bi-currency-rupee" label="Total Refunds" value={`₹${kpis.totalRefunds.toLocaleString()}`} tone="text-purple" />
            </div>

            {/* Toolbar */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <div className="flex-grow-1 d-flex align-items-center border rounded-3 bg-white" style={{ paddingInline: ".4rem" }}>
                    <i className="bi bi-search text-muted ms-1 me-2"></i>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by ticket ID or passenger name..."
                        className="form-control outline-0 shadow-none"
                    />
                </div>
                <div style={{ minWidth: 180 }}>
                    <Select
                        instanceId="cancelled-ticket-status-select"
                        classNamePrefix="rs"
                        options={statusOptions}
                        value={filter}
                        onChange={(opt) => setFilter(opt)}
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

            {/* Ticket list */}
            <div className="d-flex flex-column gap-3">
                {filtered.map((t) => (
                    <TicketRow key={t.id} t={t} onProcess={() => openModal(t.id)} />
                ))}
            </div>

            {/* Modal */}
            {modal.open && (
                <ProcessRefundModal
                    ticket={tickets.find((x) => x.id === modal.ticketId)}
                    onCancel={closeModal}
                    onProcess={(tx, notes) => processRefund({ ticketId: modal.ticketId, transactionId: tx, notes })}
                />
            )}
        </div>
    );
}

function KpiCard({ icon, label, value, tone }) {
    return (
        <div className="col-lg-3 col-md-6">
            <div className="bg-white border rounded-4 p-3 shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="text-muted small">{label}</div>
                    <i className={`bi ${icon} ${tone || "text-primary"} fs-5`}></i>
                </div>
                <div className="fw-bold" style={{ fontSize: "1.4rem", marginTop: ".25rem" }}>{value}</div>
            </div>
        </div>
    );
}

function TicketRow({ t, onProcess }) {
    return (
        <div className="bg-white border rounded-4 p-3">
            <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex flex-column">
                    <div className="fw-semibold">{t.id}</div>
                    <div className="d-flex align-items-center gap-2">
                        <StatusBadge text={t.status} />
                    </div>
                    <div className="small text-muted mt-2">
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-person"></i> {t.passenger}
                            <i className="bi bi-grid ms-3"></i> Seats: {t.seats.join(", ")}
                            <i className="bi bi-calendar ms-3"></i> Cancelled: {t.cancelledOn}
                            <i className="bi bi-currency-rupee ms-3"></i> Refund: ₹{t.refund.toLocaleString()}
                        </div>
                        <div className="mt-1">Bus: {t.bus}</div>
                    </div>
                </div>

                {t.status === "Pending" ? (
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onProcess}>
                        <i className="bi bi-credit-card"></i> Process Refund
                    </button>
                ) : null}
            </div>

            {t.status === "Processed" && (
                <div className="rounded-3 p-2 mt-3" style={{ background: "#eaf9ec", border: "1px solid #d5f1da" }}>
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check2-circle text-success"></i>
                        <span className="small">Processed on {t.processedOn}</span>
                    </div>
                    <div className="small mt-1"><strong>Transaction ID:</strong> {t.transactionId}</div>
                    {t.notes && <div className="small"><strong>Notes:</strong> {t.notes}</div>}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ text }) {
    if (text === "Processed") return <span className="badge bg-success-subtle text-success">Processed</span>;
    if (text === "Pending") return <span className="badge bg-warning-subtle text-warning">Pending</span>;
    return <span className="badge bg-secondary-subtle text-secondary">{text}</span>;
}
