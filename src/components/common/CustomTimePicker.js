import React from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
const hours = [...Array(24).keys()].map(h => String(h).padStart(2, "0"));
const minutes = [...Array(60).keys()].map(m => String(m).padStart(2, "0"));
const seconds = [...Array(60).keys()].map(s => String(s).padStart(2, "0"));
export default function CustomTimePicker({ label, value, onChange }) {
    const [h, m, s] = value ? value.split(":") : ["00", "00", "00"];
    return (
        <>
            <label className="form-label small">{label}</label>
            {/* <TimePicker
        onChange={onChange}
        value={value}
        format="HH:mm:ss"
        disableClock={false}
        clearIcon={null}
        maxDetail="second"
        minTime="00:00:00"
        maxTime="23:59:59"
        className="form-control shadow-none outline-0"
      /> */}

            <div className="d-flex gap-2">
                <select value={h} onChange={(e) => onChange(`${e.target.value}:${m}:${s}`)}>
                    {hours.map((hr) => <option key={hr}>{hr}</option>)}
                </select>
                <select value={m} onChange={(e) => onChange(`${h}:${e.target.value}:${s}`)}>
                    {minutes.map((min) => <option key={min}>{min}</option>)}
                </select>
                <select value={s} onChange={(e) => onChange(`${h}:${m}:${e.target.value}`)}>
                    {seconds.map((sec) => <option key={sec}>{sec}</option>)}
                </select>
            </div>
        </>
    );
}
