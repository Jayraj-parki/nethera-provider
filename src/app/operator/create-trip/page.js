"use client";

import { useEffect, useState } from "react";
import { listRoutes } from "@/services/routeService";
import { listBuses } from "@/services/busService";
import { createTrip } from "@/services/tripService";

export default function CreateTrip() {

  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  const [form, setForm] = useState({
    bus_id: "",
    route_id: "",
    discount: "",
    is_recurring_trip: false,
    recurrence_type: "daily",
    start_date: "",
    end_date: "",
    day_of_month: "",
    days_of_week: "",
    custom_dates: "",
    stop_times: [],
  });

  // ✅ Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [routeRes, busRes] = await Promise.all([
        listRoutes(),
        listBuses()
      ]);
      setRoutes(routeRes);
 
    };
    fetchData();
  }, []);

  // ✅ Route select → auto stops
  const handleRouteChange = (routeId) => {
    const route = routes.find(r => r.id === Number(routeId));

    const stopTimes = route?.stops?.map(stop => ({
      stop_id: stop.id,
      stop_name: stop.name,
      arrival_time: "",
      departure_time: "",
    })) || [];

    setForm(prev => ({
      ...prev,
      route_id: routeId,
      stop_times: stopTimes,
    }));
  };

  // ✅ Time update
  const updateStopTime = (i, field, val) => {
    setForm(prev => {
      const updated = [...prev.stop_times];
      updated[i][field] = val;
      return { ...prev, stop_times: updated };
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      bus_id: Number(form.bus_id),
      route_id: Number(form.route_id),
      discount: form.discount,
      stop_times: form.stop_times.map(s => ({
        stop_id: s.stop_id,
        arrival_time: s.arrival_time,
        departure_time: s.departure_time,
      })),
    };

    if (form.is_recurring_trip) {
      payload.is_recurring_trip = true;
      payload.recurrence_type = form.recurrence_type;

      if (form.recurrence_type !== "custom") {
        payload.start_date = form.start_date;
        payload.end_date = form.end_date;
      }

      if (form.recurrence_type === "weekly") {
        payload.days_of_week = form.days_of_week;
      }

      if (form.recurrence_type === "monthly") {
        payload.day_of_month = Number(form.day_of_month);
      }

      if (form.recurrence_type === "custom") {
        payload.custom_dates = form.custom_dates
          .split(",")
          .map(d => d.trim());
      }
    }
    await createTrip(payload);
  };

  return (
    <div className="container py-4">
      <h4>Create Trip</h4>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 border">

        {/* ✅ Bus Dropdown */}
        <div className="mb-3">
          <label>Select Bus</label>
          <select
            className="form-select"
            value={form.bus_id}
            onChange={(e) =>
              setForm(prev => ({ ...prev, bus_id: e.target.value }))
            }
          >
            <option value="">Select Bus</option>
            {buses?.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.name || `Bus ${bus.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Route Dropdown */}
        <div className="mb-3">
          <label>Select Route</label>
          <select
            className="form-select"
            value={form.route_id}
            onChange={(e) => handleRouteChange(e.target.value)}
          >
            <option value="">Select Route</option>
            {routes?.map(r => (
              <option key={r.id} value={r.id}>
                {r.source_city} → {r.destination_city}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Stops */}
        {form.stop_times.length > 0 && (
          <div className="mt-4">
            <h6>Stop Times</h6>

            {form.stop_times.map((s, i) => (
              <div className="row g-2 mb-2" key={i}>

                <div className="col-md-4">
                  <input className="form-control" value={s.stop_name} disabled />
                </div>

                <div className="col-md-4">
                  <input
                    type="time"
                    className="form-control"
                    value={s.arrival_time}
                    onChange={(e) =>
                      updateStopTime(i, "arrival_time", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="time"
                    className="form-control"
                    value={s.departure_time}
                    onChange={(e) =>
                      updateStopTime(i, "departure_time", e.target.value)
                    }
                  />
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ✅ Discount */}
        <div className="mt-3">
          <label>Discount</label>
          <input
            className="form-control"
            value={form.discount}
            onChange={(e) =>
              setForm(prev => ({ ...prev, discount: e.target.value }))
            }
          />
        </div>

        {/* ✅ Recurring */}
        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.is_recurring_trip}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                is_recurring_trip: e.target.checked,
              }))
            }
          />
          <label className="form-check-label">Recurring Trip</label>
        </div>

        {form.is_recurring_trip && (
          <div className="mt-3 border p-3 rounded-3">

            <select
              className="form-select mb-2"
              value={form.recurrence_type}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  recurrence_type: e.target.value,
                }))
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>

            {/* ✅ Date Picker */}
            {form.recurrence_type !== "custom" && (
              <>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm(prev => ({ ...prev, start_date: e.target.value }))
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm(prev => ({ ...prev, end_date: e.target.value }))
                  }
                />
              </>
            )}

            {form.recurrence_type === "weekly" && (
              <input
                placeholder="Days (0-6 e.g 1,3,5)"
                className="form-control"
                value={form.days_of_week}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    days_of_week: e.target.value,
                  }))
                }
              />
            )}

            {form.recurrence_type === "monthly" && (
              <input
                type="number"
                min="1"
                max="31"
                className="form-control"
                value={form.day_of_month}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    day_of_month: e.target.value,
                  }))
                }
              />
            )}

            {form.recurrence_type === "custom" && (
              <input
                placeholder="YYYY-MM-DD,YYYY-MM-DD"
                className="form-control"
                value={form.custom_dates}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    custom_dates: e.target.value,
                  }))
                }
              />
            )}

          </div>
        )}

        <button className="btn btn-primary mt-4">
          Create Trip
        </button>

      </form>
    </div>
  );
}