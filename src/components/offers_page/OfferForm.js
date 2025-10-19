"use client";

import styles from "./offers.module.scss";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { format, parse,isValid } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const typeOptions = ["Percentage", "Flat"];
const statusOptions = ["Active", "Upcoming", "Expired"];
const routesMock = [{ id: 10, name: "Mumbai-Delhi Express (Mumbai → Delhi)" }];


// Accepts dd-MM-yyyy | yyyy-MM-dd | falsy -> Date|null
const toDateSafe = (val) => {
    if (!val) return null;
    // dd-MM-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
        const d = parse(val, "dd-MM-yyyy", new Date());
        return isValid(d) ? d : null;
    }
    // yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const d = new Date(val + "T00:00:00");
        return isValid(d) ? d : null;
    }
    // Anything else: try Date()
    const d = new Date(val);
    return isValid(d) ? d : null;
};

const toDdMmYyyy = (d) => (d ? format(d, "dd-MM-yyyy") : "");

export default function OfferForm({ mode, initial, onCancel, onSubmit }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        title: initial?.title || "",
        description: initial?.description || "",
        status: initial?.status || "Active",
        type: initial?.type || "Percentage",
        value: initial?.value ?? 0,
        minAmount: initial?.minAmount ?? 0,
        maxDiscount: initial?.maxDiscount ?? "",
        // initialize Date objects from dd-MM-yyyy strings if present
        validFrom: toDateSafe(initial?.validFrom) || null,
        validTill: toDateSafe(initial?.validTill) || null,
        routes: initial?.routes?.map((r) => r.id) || [],
    });

    const valid = useMemo(() => {
        return (
            form.title &&
            form.description &&
            form.value >= 0 &&
            form.routes.length > 0 &&
            form.validFrom &&
            form.validTill
        );
    }, [form]);

    const toggleRoute = (id) => {
        setForm((f) =>
            f.routes.includes(id) ? { ...f, routes: f.routes.filter((x) => x !== id) } : { ...f, routes: [...f.routes, id] }
        );
    };

    const submit = () => {
        if (!valid) return;
        const data = {
            title: form.title.trim(),
            description: form.description.trim(),
            status: form.status,
            type: form.type,
            value: Number(form.value),
            minAmount: Number(form.minAmount) || 0,
            maxDiscount: form.maxDiscount === "" ? "" : Number(form.maxDiscount),
            // output dd-MM-yyyy to match booking format
            validFrom: toDdMmYyyy(form.validFrom),
            validTill: toDdMmYyyy(form.validTill),
            routes: routesMock.filter((r) => form.routes.includes(r.id)),
        };
        onSubmit(data);
    };

    return (
        <div className={styles.panel}>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="m-0">{isEdit ? `Edit Offer - ${initial?.title}` : "Create New Offer"}</h6>
                <button className="btn btn-light btn-sm" onClick={onCancel}>Cancel</button>
            </div>

            <div className="row g-3">
                <div className="col-md-8">
                    <label className="form-label small">Offer Title *</label>
                    <input className="form-control shadow-none outline-0 " placeholder="e.g., New Year Special" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Status *</label>
                    <select className="form-select outline-0 shadow-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="col-12">
                    <label className="form-label small">Description *</label>
                    <textarea className="form-control shadow-none outline-0 " placeholder="Describe your offer..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="col-md-8">
                    <label className="form-label small">Discount Type *</label>
                    <select className="form-select outline-0 shadow-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Discount Value *</label>
                    <input className="form-control shadow-none outline-0 " type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>

                <div className="col-md-8">
                    <label className="form-label small">Minimum Booking Amount (₹) *</label>
                    <input className="form-control shadow-none outline-0 " type="number" min="0" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Maximum Discount (₹) - Optional</label>
                    <input className="form-control shadow-none outline-0 " type="number" min="0" placeholder="No limit" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
                </div>

                <div className={styles.datesRow}>
                    <div>
                        <label className="form-label small">Valid From *</label>
                        <div className={styles.datePickerWrap}>
                            <DatePicker
                                selected={form.validFrom ?? null}
                                onChange={(d) => setForm({ ...form, validFrom: d || null })}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                className="form-control shadow-none outline-0 py-0 "
                                calendarClassName={styles.calendar}
                                popperClassName={styles.popper}
                                showPopperArrow={false}
                            />
                            {/* <i className="bi bi-calendar3"></i> */}
                        </div>
                    </div>

                    <div>
                        <label className="form-label small">Valid Until *</label>
                        <div className={styles.datePickerWrap}>
                            <DatePicker
                                selected={form.validTill ?? null}
                                onChange={(d) => setForm({ ...form, validTill: d || null })}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                className="form-control shadow-none outline-0  py-0"
                                calendarClassName={styles.calendar}
                                popperClassName={styles.popper}
                                showPopperArrow={false}
                            />
                            {/* <i className="bi bi-calendar3"></i> */}
                        </div>
                    </div>
                </div>


                <div className="col-12">
                    <label className="form-label small">Applicable Routes * (Select at least one)</label>
                    <div className={styles.routePicker + " form-control shadow-none outline-0 "}>
                        {routesMock.map((r) => (
                            <label key={r.id} className="d-flex align-items-center gap-2">
                                <input type="checkbox" checked={form.routes.includes(r.id)} onChange={() => toggleRoute(r.id)} />
                                <span>{r.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="text-muted small mt-1">
                        Selected: {form.routes.length} route{form.routes.length !== 1 ? "s" : ""}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
                <button className="btn btn-primary" disabled={!valid} onClick={submit}>
                    {isEdit ? "Update Offer" : "Create Offer"}
                </button>
            </div>
        </div>
    );
}
