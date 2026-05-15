import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./customDatePicker.module.scss";

export default function CustomDatePicker({
  selected,
  onChange,
  placeholder,
  mode = "both", // can be "past", "future", or "both"
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Decide date restrictions based on mode
  const dateLimits =
    mode === "past"
      ? { maxDate: today }
      : mode === "future"
        ? { minDate: today }
        : {};

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholder}
      className={`${styles.input} form-control outline-0 shadow-none`}
      calendarClassName={styles.calendar}
      dateFormat="dd-MM-yyyy"
      highlightDates={[today]}
      showPopperArrow={false}
      wrapperClassName="d-block w-100"
      {...dateLimits}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select" 
    />
  );
}
