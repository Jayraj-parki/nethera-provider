"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./buses.module.scss";
import SeatGrid from "./SeatGrid.js";
import Link from "next/link";
import { nav_links } from "@/utils/constants";
import { createBus } from "@/services/busService";
const routesMock = [{ id: "r1", name: "Mumbai-Delhi Express (Mumbai → Delhi)" }];
import { fetchDrivers } from "@/services/driverService";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addBus } from "@/store/busSlice";
import { useDispatch } from "react-redux";
import TimeField from "../common/TimeField";
export default function AddBusInline() {
    const router = useRouter();
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        number: "",
        type: "Sleeper",
        totalSeats: "",
        driverId: "",
        routeId: "",
        pricePerKm: "",
        departure: "",
        startDate: null,
        status: "Active",
        amenities: [],
        agentSeats: [],
    });
    const AMENITIES_OPTIONS = [
        "WiFi",
        "Charging Point",
        "Water Bottle",
        "Blanket",
        "CCTV",
        "TV",
        "Emergency Exit",
        "AC",
    ];
    const [drivers, setDrivers] = useState([]);
    function generateSeats(totalSeats, seat_type) {
        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seat_number: `S${i}`,
                seat_type: 'Window',
            });
        }

        return seats;
    }

    const handleSubmit = async () => {
        if (form.amenities.length === 0) {
            alert("Please select at least one amenity");
            return;
        }
        const seats = generateSeats(form.totalSeats, form.type);

        try {
            const apiPayload = {
                operator: 1,
                bus_number: form.number,
                type: form.type,
                total_seats: form.totalSeats,
                amenities: "",
                status: form.status.toLowerCase(),
                start_date: form.startDate
                    ? format(form.startDate, "yyyy-MM-dd")
                    : null,
                price_per_km: form.pricePerKm,
                departure_time: form.departure,
                driver: form.driverId,
                assigned_for_trip: false,
                amenities: form.amenities.join(", "),

                // seats: form.agentSeats.map((seat) => ({
                //     seat_number: seat,
                //     seat_type: "Seater",
                // })),
                seats: seats
            };

            const res = await dispatch(addBus(apiPayload)).unwrap();
            
            alert("Bus created successfully");
            router.push(nav_links['buses']);

        } catch (err) {

            alert(JSON.stringify(err.data));
        }
    };
    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const data = await fetchDrivers();

            const mapped = data.map((d) => ({
                id: d.id,
                name: d.name,
                license: d.license_number,
            }));

            setDrivers(mapped);
        } catch (err) {
            console.error("Failed to load drivers", err);
        }
    };
    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-3">
                <Link href={nav_links['buses']} className="btn border p-2 btn-outline-secondary">
                    <i className="bi bi-arrow-left"></i> Back
                </Link>
                <h4 className="mb-0">Add New Bus</h4>
            </div>

            {/* Basic Information */}
            <section className={styles.panel + " mb-3"}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-bus-front text-primary"></i>
                    <div className="fw-semibold">Basic Information</div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">Bus Number *</label>
                        <input
                            className="form-control shadow-none outline-0"
                            placeholder="e.g., EXP-001"
                            value={form.number}
                            onChange={(e) => setForm({ ...form, number: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Bus Type *</label>
                        <select
                            className="form-select shadow-none outline-0"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option>Sleeper</option>
                            <option>Seater</option>
                            <option>AC</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small">Total Seats *</label>
                        <input
                            className="form-control shadow-none outline-0"
                            type="number"
                            min="1"
                            value={form.totalSeats}
                            onChange={(e) => setForm({ ...form, totalSeats: Number(e.target.value) })}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Status *</label>
                        <select
                            className="form-select shadow-none outline-0"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-semibold">Amenities</label>

                        <div className="row g-2">
                            {AMENITIES_OPTIONS.map((item) => (
                                <div key={item} className="col-md-3 col-6">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`amenity-${item}`}
                                            checked={form.amenities.includes(item)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setForm({
                                                        ...form,
                                                        amenities: [...form.amenities, item],
                                                    });
                                                } else {
                                                    setForm({
                                                        ...form,
                                                        amenities: form.amenities.filter((a) => a !== item),
                                                    });
                                                }
                                            }}
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor={`amenity-${item}`}
                                        >
                                            {item}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Route and Schedule */}
            <section className={styles.panel + " mb-3"}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-diagram-3 text-primary"></i>
                    <div className="fw-semibold"> Schedule</div>
                </div>
                <div className="row g-3">
                    {/* <div className="col-md-6">
                        <label className="form-label small">Route *</label>
                        <select
                            className="form-select shadow-none outline-0"
                            value={form.routeId}
                            onChange={(e) => setForm({ ...form, routeId: e.target.value })}
                        >
                            <option value="">Select a route</option>
                            {routesMock.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small">Start Date *</label>
                        <div className={styles.datePickerWrap}>
                            <DatePicker
                                selected={form.startDate}
                                onChange={(d) => setForm({ ...form, startDate: d || null })}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                className="form-control shadow-none outline-0"
                                calendarClassName={styles.calendar}
                                popperClassName={styles.popper}
                                showPopperArrow={false}
                            />
                            <i className={`bi bi-calendar3 ${styles.calIcon}`}></i>
                        </div>
                    </div> */}

                    <div className="col-md-6">
                        <label className="form-label small">Departure Time *</label>
                        {/* <input
                            className="form-control shadow-none outline-0"
                            placeholder="--:--"
                            value={form.departure}
                            onChange={(e) => setForm({ ...form, departure: e.target.value })}
                        /> */}
                        <TimeField
                            label="Departure Time *"
                            value={form.departure}
                            onChange={(norm) => setForm({ ...form, departure: norm })}
                            stepSeconds={60}
                            required={true}
                        />
                    </div>
                </div>
            </section>

            {/* Driver Assignment */}
            <section className={styles.panel + " mb-3"}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-person text-primary"></i>
                    <div className="fw-semibold">Driver Assignment</div>
                </div>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label small">Assign Driver *</label>
                        <select
                            className="form-select shadow-none outline-0"
                            value={form.driverId}
                            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                        >
                            <option value="">Select a driver</option>
                            {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.license})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className={styles.panel + " mb-3"}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-currency-rupee text-primary"></i>
                    <div className="fw-semibold">Pricing</div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">Price per Kilometer (₹) *</label>
                        <input
                            className="form-control shadow-none outline-0"
                            type="number"
                            min="0"
                            value={form.pricePerKm}
                            onChange={(e) => setForm({ ...form, pricePerKm: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </section>

            {/* Agent Seat Assignment */}
            <section className={styles.panel}>
                <div className="fw-semibold mb-1">Agent Seat Assignment</div>
                <div className="text-muted small mb-2">
                    Select seats that can be sold by agents. Selected: {form.agentSeats.length} seats
                </div>

                <SeatGrid
                    totalRows={10}
                    columns={["A", "B", "C", "D"]}
                    selected={form.agentSeats}
                    onToggle={(seat) =>
                        setForm((f) =>
                            f.agentSeats.includes(seat)
                                ? { ...f, agentSeats: f.agentSeats.filter((x) => x !== seat) }
                                : { ...f, agentSeats: [...f.agentSeats, seat] }
                        )
                    }
                />

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Link href={nav_links['buses']} className="btn btn-outline-secondary">
                        Cancel
                    </Link>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Add Bus
                    </button>
                </div>
            </section>
        </div>
    );
}
