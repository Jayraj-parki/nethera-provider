"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./cancelled.module.scss";

export default function ProcessRefundModal({ ticket, onCancel, onProcess }) {
    const [tx, setTx] = useState("");
    const [notes, setNotes] = useState("");

    const disabled = !tx.trim();

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalDialog}>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-cash-coin"></i>
                    <h6 className="m-0">Process Refund</h6>
                </div>

                <div className={styles.ticketBox + " small mb-3"}>
                    <div>
                        <strong>Ticket:</strong> {ticket.id}
                    </div>
                    <div>
                        <strong>Passenger:</strong> {ticket.passenger}
                    </div>
                    <div>
                        <strong>Refund Amount:</strong> ₹{ticket.refund.toLocaleString()}
                    </div>
                </div>

                <label className="form-label small">Transaction ID *</label>
                <input
                    className="form-control outline-0 shadow-none mb-3"
                    placeholder="Enter transaction/reference ID"
                    value={tx}
                    onChange={(e) => setTx(e.target.value)}
                />

                <label className="form-label small">Notes (Optional)</label>
                <textarea
                    className="form-control outline-0 shadow-none"
                    rows={3}
                    placeholder="Add any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-outline-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={disabled}
                        onClick={() => onProcess(tx.trim(), notes.trim())}
                    >
                        Process Refund
                    </button>
                </div>
            </div>
        </div>
    );
}
