"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { isValidTime, normalizeToHHMMSS, toHHMMDisplay } from "@/utils/time";

// Professional time field with native picker, datalist hints, live validation,
// and onChange that returns normalized "HH:mm:ss"
export default function TimeField({
  value,                // "HH:mm" | "HH:mm:ss" | ""
  onChange,             // (normalizedHHMMSS | "") => void
  label = "Time",
  required = false,
  stepSeconds = 60,     // minute precision by default
  min = "00:00",
  max = "23:59",
  errorText,            // optional external error
  className = "",
  inputClassName = "form-control shadow-none outline-0",
  disabled = false,
}) {
  const id = useId();
  const [raw, setRaw] = useState(toHHMMDisplay(value));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    // If parent updates value (e.g., when switching rows), sync it
    setRaw(toHHMMDisplay(value));
    setDirty(false);
  }, [value]);

  const localError = useMemo(() => {
    if (!dirty && !required) return "";
    if (!raw) return required ? "Required" : "";
    return isValidTime(raw) ? "" : "Enter a valid time";
  }, [raw, dirty, required]);

  const commit = (nextRaw) => {
    const norm = normalizeToHHMMSS(nextRaw);
    onChange?.(norm); // parent receives "HH:mm:ss" or "" if invalid/empty
  };

  const onInputChange = (e) => {
    const v = e.target.value;
    setRaw(v);
    setDirty(true);
    // live validate; only propagate when valid to avoid flicker
    if (isValidTime(v)) commit(v);
    else if (!v) onChange?.(""); // allow clearing
  };

  const onBlur = () => {
    setDirty(true);
    if (raw && !isValidTime(raw)) return;  // keep error visible
    commit(raw || "");
  };

  // Build a datalist of 30-minute hints for quick pick
  const hints = useMemo(() => {
    const list = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const HH = String(h).padStart(2, "0");
        const MM = String(m).padStart(2, "0");
        list.push(`${HH}:${MM}`);
      }
    }
    return list;
  }, []);

  return (
    <div className={className}>
      {label && <label className="form-label small" htmlFor={id}>{label}{required ? " *" : ""}</label>}
      <input
        id={id}
        type="time"
        list={`${id}-hints`}
        value={raw}
        onChange={onInputChange}
        onBlur={onBlur}
        min={min}
        max={max}
        step={Math.max(1, stepSeconds)}  // 60 => mm, 1 => include seconds
        className={`${inputClassName} ${localError || errorText ? "is-invalid" : ""}`}
        placeholder="--:--"
        disabled={disabled}
      />
      <datalist id={`${id}-hints`}>
        {hints.map((t) => <option key={t} value={t} />)}
      </datalist>
      {(localError || errorText) && <div className="invalid-feedback">{errorText || localError}</div>}
    </div>
  );
}
