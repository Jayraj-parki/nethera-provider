"use client";
import Logo from '../../../public/vercel.svg'
import Image from "next/image";
import styles from "./driver.module.scss";

export default function DriverCard({ driver, onView, onAssign, onEdit,onDelete }) {
  return (
    <div className={styles.card}>
      <div className="d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className={styles.avatar}>
            {/* <Image src={driver.image || Logo} alt='logo' width={100} height={100}/> */}
          </div>
          <div>
            <div className="fw-semibold">{driver.name}</div>
            <div className="d-flex align-items-center gap-1">
              <span className={styles.badge + ` bg-success-subtle text-capitalize ${driver?.status?.toLowerCase() != 'inactive' ? 'text-success':'text-danger'} `}>{driver?.status}</span>
              <span className={styles.badge + " bg-purple text-dark"}>EXP:{driver.level}5</span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light btn-sm" title="Edit" onClick={onEdit}>
            <i className="bi bi-pencil-square"></i>
          </button>
          <button className="btn btn-light btn-sm" title="Suspend" onClick={onDelete}>
            <i className="bi bi-person-dash"></i>
          </button>
        </div>
      </div>

      <div className="mt-2 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-card-text"></i> License: {driver.license}
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-telephone"></i> {driver.phone}
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-envelope"></i> {driver.email}
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-briefcase"></i> {driver.experienceYears} years experience
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-light w-50" onClick={onView}>View Details</button>
        <button className="btn btn-outline-primary w-50" onClick={onAssign}>Assign Bus</button>
      </div>
    </div>
  );
}
