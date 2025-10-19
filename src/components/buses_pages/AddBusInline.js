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

const routesMock = [{ id: "r1", name: "Mumbai-Delhi Express (Mumbai → Delhi)" }];
const driversMock = [
    { id: "d1", name: "Rajesh Kumar", license: "DL123456789" },
    { id: "d2", name: "Suresh Patel", license: "DL987654321" },
];

export default function AddBusInline() {
    const [form, setForm] = useState({
        number: "",
        totalSeats: 40,
        type: "Sleeper",
        status: "Active",

        routeId: "",
        startDate: null, // Date object
        departure: "",

        driverId: "",
        pricePerKm: 1,

        agentSeats: [],
    });
    const handleSubmit = (payload) => {
        console.log(payload)
    }
    const addBus = () => {
        const payload = {
            ...form,
            routeName: routesMock.find((r) => r.id === form.routeId)?.name || "",
            driverDisplay:
                driversMock.find((d) => d.id === form.driverId)?.name +
                " (" +
                (driversMock.find((d) => d.id === form.driverId)?.license || "") +
                ")" || "",
            startDateText: form.startDate ? format(form.startDate, "dd-MM-yyyy") : "",
        };
        handleSubmit(payload);
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
                </div>
            </section>

            {/* Route and Schedule */}
            <section className={styles.panel + " mb-3"}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-diagram-3 text-primary"></i>
                    <div className="fw-semibold">Route and Schedule</div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
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
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small">Departure Time *</label>
                        <input
                            className="form-control shadow-none outline-0"
                            placeholder="--:--"
                            value={form.departure}
                            onChange={(e) => setForm({ ...form, departure: e.target.value })}
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
                            {driversMock.map((d) => (
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
                    <button className="btn btn-primary" onClick={addBus}>
                        Add Bus
                    </button>
                </div>
            </section>
        </div>
    );
}
