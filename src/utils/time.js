// Accepts "H:mm", "HH:mm", "HH:mm:ss" and normalizes to "HH:mm:ss"
export function normalizeToHHMMSS(value) {
  if (!value) return "";
  // If browser gives HH:mm:ss already
  let m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!m) return ""; // invalid
  let h = Number(m[1]), mm = Number(m[2]), ss = m[3] != null ? Number(m[3]) : 0;
  if (isNaN(h) || isNaN(mm) || isNaN(ss)) return "";
  if (h < 0 || h > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) return "";
  const HH = String(h).padStart(2, "0");
  const MM = String(mm).padStart(2, "0");
  const SS = String(ss).padStart(2, "0");
  return `${HH}:${MM}:${SS}`;
}

// Returns true for "HH:mm" or "HH:mm:ss"
export function isValidTime(value) {
  if (!value) return false;
  return /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(value.trim());
}

// Convenience to display in the input (HH:mm)
export function toHHMMDisplay(value) {
  if (!value) return "";
  const norm = normalizeToHHMMSS(value);
  if (!norm) return "";
  return norm.slice(0, 5); // HH:mm
}
