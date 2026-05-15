// utils/routesMap.js
// UI -> API
export function uiToApiRoute(form) {
  const distance_km = Number(form.totalDistanceKm) || 0;
  const src = (form.source || "").trim();
  const dst = (form.destination || "").trim();

  const stops = (form.stops || []).map((s, i) => ({
    name: (s.name || "").trim(),
    order: i + 1,
    arrival_time: (s.arrival || "").trim(),       // "HH:MM"
    departure_time: (s.departure || "").trim(),   // "HH:MM"
    distance_from_start: Number(s.distanceKm) || 0,
  }));

  return {
    // API fields
    source_city: src,
    destination_city: dst,
    distance_km,
    duration_estimate: inferDurationFromStops(stops) || "00:00:00",
    stops,
  };
}

// API -> UI (for edit/view)
export function apiToUiRoute(api) {
  return {
    id: api.id,
    name: api.name || `${api.source_city}–${api.destination_city}`,
    source: api.source_city,
    destination: api.destination_city,
    totalDistanceKm: api.distance_km,
    durationText: (api.duration_estimate || "00:00:00").replace(/:00$/, "m").replace(/:/g, "h "),
    stops: (api.stops || []).map((s) => ({
      name: s.name,
      arrival: s.arrival_time || "",
      departure: s.departure_time || "",
      distanceKm: s.distance_from_start ?? 0,
      tag: s.order === 1 ? "Start" : "", // UI nicety; end can be added when matched to last
    })),
  };
}

// naive duration using first departure and last arrival
function inferDurationFromStops(stops) {
  if (!stops || stops.length < 1) return null;
  const firstDep = toMinutes(stops[0]?.departure_time || stops[0]?.arrival_time);
  const lastArr = toMinutes(stops[stops.length - 1]?.arrival_time || stops[stops.length - 1]?.departure_time);
  if (firstDep == null || lastArr == null) return null;
  let delta = lastArr - firstDep;
  if (delta < 0) delta += 24 * 60; // pass midnight
  const hh = String(Math.floor(delta / 60)).padStart(2, "0");
  const mm = String(delta % 60).padStart(2, "0");
  return `${hh}:${mm}:00`;
}

function toMinutes(hhmm) {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm || "");
  if (!m) return null;
  const h = Number(m[1]), mm = Number(m[2]);
  if (isNaN(h) || isNaN(mm)) return null;
  return h * 60 + mm;
}
