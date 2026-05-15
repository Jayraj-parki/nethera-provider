// components/operator/routes/RouteManagement.jsx
"use client";

import styles from "./route.module.scss";
import { useEffect, useMemo, useState } from "react";
import RouteSummary from "./RouteSummary";
import RouteEditForm from "./RouteEditForm";
import RouteCreateForm from "./RouteCreateForm";

import { apiToUiRoute, uiToApiRoute } from "@/utils/routesMap";
import { useDispatch, useSelector } from "react-redux";
import { getRoute } from "@/services/routeService";
import { addRoute, editRoute, fetchRouteById, fetchRoutes, removeRoute } from "@/store/busSlice";
import { selectRoutes } from "@/store/selectors/busSelector";

export default function RouteManagement() {
  const route_list = useSelector(selectRoutes);
  const [mode, setMode] = useState("display"); // display | edit | create
  const [routes, setRoutes] = useState(route_list || []);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const tagStops = (r) => ({
    ...r,
    stops: (r.stops || []).map((s, idx, arr) => ({
      ...s,
      tag: idx === 0 ? "Start" : idx === arr.length - 1 ? "End" : s.tag || "",
    })),
  });

  // Load list
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await dispatch(fetchRoutes()).unwrap();
        const list = Array.isArray(data) ? data : data?.results || [];
        const uiList = list.map((r) => tagStops(apiToUiRoute(r)));
        setRoutes(uiList);
        setCurrent(uiList[0] || null);
      } catch (e) {
        setErr(e?.message || "Failed to load routes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = useMemo(() => {
    const total = routes.length;
    const totalDistanceKm = routes.reduce((a, r) => a + (Number(r.totalDistanceKm) || 0), 0);
    return { total, totalDistanceKm };
  }, [routes]);

  // Open a specific route in edit
  const openEdit = async (routeRow) => {
    try {
      setLoading(true);
      setErr("");
      const api = await dispatch(fetchRouteById(routeRow.id)).unwrap();
      const ui = tagStops(apiToUiRoute(api));
      setCurrent(ui);
      setMode("edit");
    } catch (e) {
      setErr(e?.message || "Failed to load route");
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async (uiForm) => {
    try {
      setLoading(true);
      setErr("");
      const payload = uiToApiRoute(uiForm);
      const created = await dispatch(addRoute(payload)).unwrap();
      const uiCreated = tagStops(apiToUiRoute(created));
      setRoutes((prev) => [uiCreated, ...prev]);
      setCurrent(uiCreated);
      setMode("display");
    } catch (e) {
      setErr(e?.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  // Save current (PATCH)
  const handleSave = async (uiForm) => {
    try {
      if (!current?.id) return;
      setLoading(true);
      setErr("");
      const payload = uiToApiRoute(uiForm);
      const updated = await dispatch(editRoute({ id: current.id, payload })).unwrap();
      const uiUpdated = tagStops(apiToUiRoute(updated));
      setRoutes((prev) => prev.map((r) => (r.id === current.id ? uiUpdated : r)));
      setCurrent(uiUpdated);
      setMode("display");
    } catch (e) {
      setErr(e?.message || "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  // Delete specific
  const handleDeleteSpecific = async (id) => {
    try {
      setLoading(true);
      setErr("");
      await dispatch(removeRoute(id)).unwrap();
      const next = routes.filter((r) => r.id !== id);
      setRoutes(next);
      if (current?.id === id) setCurrent(next[0] || null);
      setMode("display");
    } catch (e) {
      setErr(e?.message || "Failed to delete route");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, tone }) => (
    <div className="col-lg-4 col-md-6">
      <div className={styles.statCard}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">{label}</div>
          <i className={`bi ${icon} ${tone || "text-primary"} fs-5`}></i>
        </div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="mb-1">Route Management</h4>
          <div className="text-muted">Manage bus routes and stops</div>
          {err && <div className="text-danger small mt-1">{err}</div>}
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setMode("create")}>
          <i className="bi bi-plus-lg" /> Add New Route
        </button>
      </div>

      <div className="row g-3 mb-4">
        <StatCard icon="bi-diagram-3" label="Total Routes" value={kpis.total} />
        <StatCard icon="bi-geo-alt" label="Total Distance" value={`${kpis.totalDistanceKm} km`} />
        <StatCard icon="bi-clock-history" label="Average Distance" value={`${kpis.totalDistanceKm} km`} tone="text-pink" />
      </div>

      {loading && <div className="my-2">Loading...</div>}

      {mode === "display" && (
        <div className="d-flex flex-column gap-3">
          {routes.map((r) => (
            <RouteSummary
              key={r.id}              // keep stable id as key
              route={r}
              onEdit={() => openEdit(r)}
              onDelete={() => handleDeleteSpecific(r.id)}
            />
          ))}
        </div>
      )}

      {mode === "edit" && current && (
        <RouteEditForm initial={current} onCancel={() => setMode("display")} onSave={handleSave} />
      )}

      {mode === "create" && <RouteCreateForm onCancel={() => setMode("display")} onCreate={handleCreate} />}
    </div>
  );
}
