"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useMemo, useState } from "react";
import { format, parse, isValid } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./buses.module.scss";
import SeatGrid from "./SeatGrid.js";
import Link from "next/link";
import { nav_links } from "@/utils/constants";
import { updateBus } from "@/services/busService";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { editBus, fetchBuses, fetchDrivers, removeBus } from "@/store/busSlice";
const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];


const toDateSafe = (val) => {
    if (!val) return null;
    if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
        const d = parse(val, "dd-MM-yyyy", new Date());
        return isValid(d) ? d : null;
    }
    return null;
};
const toDDMMYYYY = (d) => (d ? format(d, "dd-MM-yyyy") : "");

export default function BusManagementLite() {
    const [buses, setBuses] = useState([]);
    const [mode, setMode] = useState("list"); // list | edit
    const [editing, setEditing] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState(statusOptions[0]);
    const dispatch = useDispatch()
    const stats = useMemo(() => {
        const total = buses.length;
        const active = buses.filter((b) => b.status === "Active").length;
        const avgOcc =
            Math.round(
                (buses.reduce((a, b) => a + (b.occupancy?.percent || 0), 0) / Math.max(1, total)) * 100
            ) / 100;
        return { total, active, avgOcc };
    }, [buses]);

    const filtered = buses
        .filter((b) => (status.value === "ALL" ? true : b.status === status.value))
        .filter((b) => `${b.number} ${b.type}`.toLowerCase().includes(q.toLowerCase()));
   
    const onEdit = (bus) => {
        setEditing({
            ...bus,
            startDateObj: toDateSafe(bus.startDate),
            agentSeats: [],
        });

        setMode("edit");
    };
    const cancelEdit = () => {
        setEditing(null);
        setMode("list");
    };
    const onDelete = async (bus) => {

        if (!window.confirm(`Are you sure you want to delete bus ${bus.number}?`)) return;

        try {

            setDeletingId(bus.id);
            await dispatch(removeBus(bus.id));
            setDeletingId(null);

            // remove bus from UI
            setBuses(prev => prev.filter(x => x.id !== bus.id));

        } catch (err) {

            alert("Failed to delete bus");

        }

    };
    const loadDrivers = async () => {
        const data = await dispatch(fetchDrivers()).unwrap();
        const mapped = data.map(d => ({
            id: d.id,
            name: d.name,
            license: d.license_number
        }));
        

        setDrivers(mapped);
    };
    function generateSeats(totalSeats, seat_type) {
        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seat_number: `S${i}`,
                seat_type: 'Window'
            });
        }

        return seats;
    }
    const saveEdit = async () => {
        try {

            const seats = generateSeats(editing.totalSeats, editing.type);

            const payload = {
                bus_number: editing.number,
                type: editing.type,
                status: editing.status.toLowerCase(),
                price_per_km: editing.pricePerKm,
                departure_time: editing.departure,
                start_date: editing.startDateObj
                    ? format(editing.startDateObj, "yyyy-MM-dd")
                    : null,
                driver: editing.driver,
                amenities: editing.amenities.join(", "),
                seats: seats
            };

            await dispatch(editBus({ id: editing.id, payload }));

            loadBuses();
            cancelEdit();

        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };
    const toDateSafe = (val) => {

        if (!val) return null;

        // already a Date
        if (val instanceof Date) return val;

        // must be string to parse
        if (typeof val !== "string") return null;

        const formats = ["yyyy-MM-dd", "dd-MM-yyyy"];

        for (const f of formats) {
            const d = parse(val, f, new Date());
            if (isValid(d)) return d;
        }

        return null;
    };
    const loadBuses = async () => {
        try {
            const data =  await dispatch(fetchBuses()).unwrap();

            const mapped = data.map((bus) => ({
                id: bus.id,
                number: bus.bus_number,
                type: bus.type,
                status: bus.status === "active" ? "Active" : "Inactive",
                routeName: "",
                departure: bus.departure_time,
                driver: bus.driver || "",
                pricePerKm: bus.price_per_km,
                totalSeats: bus.total_seats,
                occupancy: {
                    taken: 0,
                    percent: 0,
                },
                seats: bus.seats || [],
                startDate: toDateSafe(bus.start_date),
                amenities: bus.amenities
                    ? bus.amenities.split(",").map(a => a.trim())
                    : []
            }));

            setBuses(mapped);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadBuses();
        loadDrivers();
    }, []);



    return (
        <div className="container py-4">
            {mode === "list" && (
                <>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h4 className="mb-1">Bus Management</h4>
                            <div className="text-muted">Manage your bus fleet</div>
                        </div>
                        <Link href={nav_links['add-bus']} className="btn btn-primary d-flex align-items-center gap-2" >
                            <i className="bi bi-plus-lg" /> Add New Bus
                        </Link>
                    </div>


                    {/* Search + Filter */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <div className={styles.searchWrap + " d-flex align-items-center flex-grow-1"}>
                            <i className="bi bi-search text-muted ms-2 me-2"></i>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by bus number or type..."
                                className="form-control shadow-none outline-0 border-0 shadow-none"
                            />
                        </div>
                        <div className={styles.selectWrap}>
                            <Select
                                instanceId={'bus-management-select'}
                                classNamePrefix="rs"
                                options={statusOptions}
                                value={status}
                                onChange={setStatus}
                                isSearchable={false}
                                styles={{
                                    container: (b) => ({ ...b, width: "100%", minWidth: 160 }),
                                    control: (b) => ({ ...b, minHeight: 42, borderRadius: "0.7rem" }),
                                    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                                }}
                                menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                menuPosition="fixed"
                                menuShouldScrollIntoView={false}
                            />
                        </div>
                    </div>

                    {/* KPI row */}
                    <div className="row g-3 mb-3">
                        <Kpi icon="bi-bus-front" label="Total Buses" value={stats.total} />
                        <Kpi icon="bi-circle-fill text-success" label="Active Buses" value={stats.active} />
                        <Kpi icon="bi-people" label="Average Occupancy" value={`${stats.avgOcc}%`} />
                    </div>

                    {/* Bus list */}
                    <div className="d-flex flex-column gap-3">
                        {filtered.map((b) => (
                            <div className={styles.card + " bg-white border rounded-4 p-3"} key={b.id}>
                                <div className="d-flex align-items-start justify-content-between">
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="fw-semibold">{b.number}</div>
                                            <span className="badge bg-secondary-subtle text-secondary">Sleeper</span>
                                            <span className={`badge bg-${b.status.toLowerCase() === 'inactive' ? 'danger' : 'success'}-subtle text-${b.status.toLowerCase() === 'inactive' ? 'danger' : 'success'}`}>{b.status}</span>
                                        </div>

                                        <div className="small text-muted mt-2">
                                            <div className="d-flex gap-3 flex-wrap">
                                                <span><i className="bi bi-signpost-2"></i> {b.routeName}</span>
                                                <span><i className="bi bi-clock"></i> Departure: {b.departure}</span>
                                                <span>
                                                    <i className="bi bi-person-badge"></i> Driver: {
                                                        drivers.find(d => d.id === b.driver)?.name || "Not Assigned"
                                                    }
                                                </span>
                                                <span><i className="bi bi-currency-rupee"></i> ₹{b.pricePerKm}/km</span>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="small text-muted mb-1">Seat Occupancy</div>
                                            <div className={styles.progressTrack}>
                                                <div className={styles.progressFill} style={{ width: `${b.occupancy.percent}%` }} />
                                            </div>
                                            <div className="small text-muted mt-1">
                                                {b.occupancy.taken}/{b.totalSeats} ({b.occupancy.percent}%)
                                            </div>
                                            {/* <div className="small text-muted">Agent seats: {b.seats.join(", ")}</div> */}
                                            <div className="small text-muted">amenities: {b.amenities}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start gap-2">
                                        <button className="btn btn-light btn-sm" onClick={() => onEdit(b)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-light btn-sm text-danger" disabled={deletingId === b.id} onClick={() => onDelete(b)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {mode === "edit" && editing && (
                <div className={styles.panel}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="m-0">Edit Bus</h6>
                        <button className="btn btn-light btn-sm" onClick={cancelEdit}>Cancel</button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">Bus Number *</label>
                            <input className="form-control shadow-none outline-0" value={editing.number} onChange={(e) => setEditing({ ...editing, number: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Bus Type *</label>
                            <select className="form-select shadow-none outline-0" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                                <option>Sleeper</option>
                                <option>Seater</option>
                                <option>AC</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small">Route *</label>
                            <select className="form-select shadow-none outline-0" value={"r1"} onChange={() => { }}>
                                <option value="r1">Mumbai-Delhi Express (Mumbai → Delhi)</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Driver *</label>
                            <select
                                className="form-select"
                                value={editing.driver}
                                onChange={(e) => setEditing({ ...editing, driver: e.target.value })}
                            >

                                <option value="">Select driver</option>

                                {drivers.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.name} ({d.license})
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small">Status *</label>
                            <select className="form-select shadow-none outline-0" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Total Seats *</label>
                            <input
                                className="form-control shadow-none outline-0"
                                type="number"
                                value={editing.totalSeats}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        totalSeats: Number(e.target.value)
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small">Price per KM (₹) *</label>
                            <input className="form-control shadow-none outline-0" type="number" min="0" value={editing.pricePerKm} onChange={(e) => setEditing({ ...editing, pricePerKm: Number(e.target.value) })} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Departure Time *</label>
                            <input className="form-control shadow-none outline-0" value={editing.departure} onChange={(e) => setEditing({ ...editing, departure: e.target.value })} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small">Start Date *</label>
                            <div className={styles.datePickerWrap}>
                                <DatePicker
                                    selected={editing.startDateObj ?? null}
                                    onChange={(d) => setEditing({ ...editing, startDateObj: d || null })}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="dd-mm-yyyy"
                                    className="form-control shadow-none outline-0"
                                    calendarClassName={styles.calendar}
                                    popperClassName={styles.popper}
                                    showPopperArrow={false}
                                />
                                <i className={`bi bi-calendar3 ${styles.calIcon}`}></i>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold">Amenities</label>

                            <div className="row g-2">
                                {[
                                    "WiFi",
                                    "Charging Point",
                                    "Water Bottle",
                                    "Blanket",
                                    "CCTV",
                                    "TV",
                                    "Emergency Exit",
                                    "AC"
                                ].map((item) => (
                                    <div key={item} className="col-md-3 col-6">
                                        <div className="form-check">

                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={editing.amenities?.includes(item)}
                                                onChange={(e) => {

                                                    if (e.target.checked) {
                                                        setEditing({
                                                            ...editing,
                                                            amenities: [...(editing.amenities || []), item]
                                                        })
                                                    } else {
                                                        setEditing({
                                                            ...editing,
                                                            amenities: editing.amenities.filter(a => a !== item)
                                                        })
                                                    }

                                                }}
                                            />

                                            <label className="form-check-label">
                                                {item}
                                            </label>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="fw-semibold mb-1">Agent Seats Assignment</div>
                        <div className="text-muted small mb-2">Select seats that will be assigned to agents for selling</div>

                        <SeatGrid
                            totalRows={10}
                            columns={["A", "B", "C", "D"]}
                            selected={editing.agentSeats}
                            onToggle={(seat) =>
                                setEditing((f) =>
                                    f.agentSeats.includes(seat)
                                        ? { ...f, agentSeats: f.agentSeats.filter((x) => x !== seat) }
                                        : { ...f, agentSeats: [...f.agentSeats, seat] }
                                )
                            }
                        />

                        <div className="text-muted small mt-2">
                            Selected Agent Seats: {editing.agentSeats.join(", ") || "None"}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                        <button className="btn btn-primary" onClick={saveEdit}>Update Bus</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Kpi({ icon, label, value }) {
    return (
        <div className="col-lg-4 col-md-6">
            <div className="bg-white border rounded-4 p-3 shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="text-muted small">{label}</div>
                    <i className={`bi ${icon} fs-5 text-primary`}></i>
                </div>
                <div className="fw-bold" style={{ fontSize: "1.4rem", marginTop: ".25rem" }}>{value}</div>
            </div>
        </div>
    );
}
