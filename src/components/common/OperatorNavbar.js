"use client";

import Link from "next/link";
import style from "./operatorNavbar.module.scss";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPathByLevel } from "@/utils/navigation_path";
import { urls } from "@/utils/constants";
const items = [
  { href: "#/operator/dashboard", icon: "bi-grid", label: "Dashboard", pill: true },
  { href: "#/operator/add-bus", icon: "bi-plus-lg", label: "Add Bus" },
  { href: "#/operator/buses", icon: "bi-bus-front", label: "Bus Management" },
  { href: "#/operator/routes", icon: "bi-diagram-3", label: "Route Management" },
  { href: "#/operator/drivers", icon: "bi-person-lines-fill", label: "Driver Management" },
  { href: "#/operator/cancelled", icon: "bi-ticket-detailed", label: "Cancelled Tickets" },
  { href: "#/operator/offers", icon: "bi-tag", label: "Offer Management" },
];

export default function OperatorNavbar() {
  const [collapse, setCollapse] = useState(true);
  const [activeLink, setActiveLink] = useState("/landing_page")

  const url = usePathname()
  useEffect(() => {
    setActiveLink(getPathByLevel(url, 1))
  }, [url])

  return (
    <nav className={`${style.nav} navbar navbar-expand-lg border-bottom`}>
      <div className="container-fluid px-3 ">
        {/* Brand */}
        <div className="d-flex align-items-center me-3">
          <i className="bi bi-bus-front fs-5 me-2 text-primary"></i>
          <div className="d-flex flex-column lh-1">
            <span className={`${style.brand} fw-bold`}>Operator</span>
            <small className={`${style.small} text-muted `}>Express Travels</small>
          </div>
        </div>

        {/* Toggler */}
        <button
          onClick={() => setCollapse((v) => !v)}
          className={`navbar-toggler shadow-none border-0 ${collapse ? "collapsed" : ""}`}
          type="button"
          aria-expanded={!collapse}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${!collapse ? "show" : ""}`}>
          {/* Main links */}
          <ul className="navbar-nav me-auto align-items-center gap-1 gap-lg-2">
            {urls.map((it) => (
              <li className="nav-item" key={it.label}>
                <Link
                  className={`${style.link} ${activeLink == it.href && style.active_links}  nav-link d-flex align-items-center rounded-3 gap-2 p-2 ${
                    it.pill ? style.pill : ""
                  }`}
                  href={it.href}
                  onClick={() => setActiveLink(it.href)}
                >
                  <i className={`bi ${it.icon}`}></i>
                  <span>{it.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-3 ms-lg-3">
            <div className="d-none d-md-flex flex-column text-end lh-1">
              <span className="small text-muted">Operator Admin</span>
              <span className="small text-muted">operator@example.com</span>
            </div>
            <div className={`${style.avatar} d-flex align-items-center justify-content-center`}>O</div>
            <button className={`${style.logout} btn btn-link text-danger p-0`}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
