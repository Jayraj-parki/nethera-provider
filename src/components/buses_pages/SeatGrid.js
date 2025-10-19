"use client";

import styles from "./buses.module.scss";

export default function SeatGrid({ totalRows = 10, columns = ["A","B","C","D"], selected = [], onToggle }) {
  const rows = Array.from({ length: totalRows }, (_, i) => i + 1);

  return (
    <div className={styles.seatGrid}>
      <div className="text-center text-muted mb-2">Front of Bus</div>
      <div className={styles.seatCols}>
        {columns.map((col) => (
          <div key={col} className={styles.seatCol}>
            {rows.map((r) => {
              const id = `${col}${r}`;
              const isSel = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={`${styles.seatBtn} ${isSel ? styles.seatSelected : ""}`}
                  onClick={() => onToggle(id)}
                >
                  {id}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-3 mt-2 small">
        <div className="d-flex align-items-center gap-2">
          <span className={`${styles.legend} ${styles.legendAvail}`}></span> Available for Agent
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`${styles.legend} ${styles.legendSel}`}></span> Selected for Agent
        </div>
      </div>
    </div>
  );
}
