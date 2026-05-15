"use client";
import styles from "./AdminLogin.module.scss";
export default function AdminSidebar({ setActiveTab }) {
  return (
    <>
      {/* Toggle button (mobile) */}
      <button
        className="btn btn-primary d-md-none m-2"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
      >
        ☰
      </button>

      <div
        className={`${styles.AdminSidebar} offcanvas-md offcanvas-start bg-light text-dark p-3`}
        tabIndex="-1"
        id="sidebar"
        style={{ width: "250px" }}
      >
        <h5 className="mb-4">Admin Panel</h5>

        <ul className="nav flex-column">
          <li className="nav-item ">
            <button
            type="button"
              className="btn btn-primary bg-gradient text-decoration-none text-start small w-100"
              onClick={() => setActiveTab("onboard")}
            >
            Onboard Operator
            </button>
          </li>

          <li className="nav-item ">
            <button
              className="btn btn-primary bg-gradient text-decoration-none text-start small w-100"
              onClick={() => setActiveTab("list")}
            >
              View Operators
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}