"use client";
import style from "./operatorDashboard.module.scss";
import Link from "next/link";

export default function OperatorDashboard() {
    const operations = [{
        "title": "Active Buses",
        "count": "1",
        "icon": "bi bi-bus-front text-primary"
    }, {
        "title": "Active Drivers",
        "count": "2",
        "icon": "bi bi-people text-info"
    }, {
        "title": "Routes",
        "count": "2",
        "icon": "bi bi-diagram-3 text-pink"
    }, {
        "title": "Occupancy Rate",
        "count": "38%",
        "icon": "bi bi-graph-up-arrow text-success "
    }]

    const quick_operations = [{
        "title": "Add New Bus",
        "sub_title": "Register a new bus to your fleet",
        "bg_color": "bg-primary",
        "icon": "bi bi-plus-lg "
    }, {
        "title": "Manage Buses",
        "sub_title": "View and manage existing buses",
        "bg_color": "bg-info",
        "icon": "bi bi-bus-front  "
    }, {
        "title": "Process Refunds",
        "sub_title": "1 pending refunds",
        "bg_color": "bg-warning",
        "icon": "bi bi-ticket-perforated  "
    }, {
        "title": "Create Offers",
        "sub_title": "Add promotional offers",
        "bg_color": "bg-success",
        "icon": "bi bi-tag  "
    }]

    const pending_task = [{
        "title": "Process Refunds",
        "sub_title": "1 tickets awaiting refund",
        "icon": "bi bi-ticket-perforated"
    }, {
        "title": "Update Routes",
        "sub_title": "Review and update route information",
        "icon": "bi bi-diagram-3"
    }, {
        "title": "Active Offers",
        "sub_title": "1 offers currently running",
        "icon": "bi bi-tag"
    }]
    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h5 className="mb-1">Operator Dashboard</h5>
                    <div className={`${style.sub_title} text-muted small text-body-tertiary`}>Manage your bus operations efficiently</div>
                </div>
                <div className="text-muted small d-flex align-items-center gap-2">
                    <i className="bi bi-calendar3"></i>
                    <span>12/10/2025</span>
                </div>
            </div>

            {/* KPI cards */}
            <div className="row g-3 mb-4">
                {
                    operations?.map((val) => (
                        <div key={val?.title} className="col-md-3">
                            <div className={style.statCard + ' rounded-3  px-3 py-2 bg-white border'}>
                                <div className="d-flex align-items-center justify-content-between mb-0">
                                    <div className={`${style.title} text-muted small`}>{val?.title}</div>
                                    <i className={`${val?.icon} fs-3`}></i>
                                </div>
                                <div className={style.statValue + ' m-0 p-0'}>{val?.count}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Quick Actions */}
            <h5 className="mb-2">Quick Actions</h5>
            <div className="row g-3 mb-4">
                {quick_operations?.map((val) => (
                    <Link href="#" key={val?.title} className={`col-3 ${style.quick_action}`}>
                        <div className={style.actionCard + ' bg-white border rounded-3 p-3 d-flex align-items-center gap-2'}>
                            <div className={`${style.actionIcon} ${val?.bg_color} rounded-3 me-1 d-inline-flex align-items-center justify-content-center `}>
                                <i className={`${val?.icon} text-white`}></i>
                            </div>
                            <div>
                                <div className={`${style.title}`}>{val?.title}</div>
                                <div className="text-muted small text-body-tertiary">{val?.sub_title}</div>
                            </div>
                        </div>
                    </Link>

                ))}

            </div>

            {/* Active Buses + Pending Tasks */}
            <div className="row g-3 ">
                <div className="col-lg-6">
                    <div className={style.panel + " border border rounded-3 p-3 bg-white "}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="m-0">Active Buses</h6>
                            <Link href="#" className={`${style.view_all} border p-1 px-2 rounded-3 text-decoration-none`}>View All</Link>
                        </div>
                        <div className={style.busItem + ' d-flex justify-content-between align-items-center p-2  rounded bg-light '}>
                            <div className="d-flex align-items-center gap-2 ">
                                <i className="bi bi-bus-front text-primary"></i>
                                <div>
                                    <div className="  ">EXP-001</div>
                                    <div className="text-muted  mt-1">Mumbai → Delhi</div>
                                </div>
                            </div>
                            <div className="text-end ">
                                <div>15/40</div>
                                <div className="text-muted mt-1">38% full</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className={style.panel + " border border rounded-3 p-3 bg-white"}>
                        <h6 className="mb-4">Pending Tasks</h6>
                        {

                            pending_task?.map((val) => (
                                <Link href={'#'} key={val?.title}  className={` ${style.task}   rounded-3 d-flex justify-content-between align-items-center mb-3  p-2 ${val?.title.includes("Refund")?style.taskWarning :' bg-light'}`}>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className={val?.icon}></i>
                                        <div>
                                            <div className="">{val?.title}</div>
                                            <div className="text-muted small">{val?.sub_title}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }





                    </div>
                </div>
            </div>

        </div>
    );
}
