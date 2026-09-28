import React, { useState } from "react";
import { DEPARTMENTS } from "../lib/constants";
import { SCHEMAS } from "../lib/schemas";
import { exportPDF, exportWord, filterByPeriod } from "../lib/report";

export default function Reports({ store }) {
  const [dept, setDept] = useState("all");
  const [period, setPeriod] = useState("monthly");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  function getSelectedDepts() {
    return dept === "all" ? DEPARTMENTS.map((d) => d.id) : [dept];
  }

  function buildTitle() {
    const label = dept === "all" ? "Organization-wide" : SCHEMAS[dept].label;
    const periodLabel = { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual", custom: "Custom" }[period];
    return `${label} ${periodLabel} Report`;
  }

  function runExport(kind) {
    const depts = getSelectedDepts();
    if (depts.length === 1) {
      const d = depts[0];
      const schema = SCHEMAS[d];
      const records = filterByPeriod(store.state[d], schema.dateField, period, customStart, customEnd);
      const fn = kind === "pdf" ? exportPDF : exportWord;
      fn({ title: buildTitle(), subtitle: `Department: ${schema.label}`, records });
    } else {
      depts.forEach((d) => {
        const schema = SCHEMAS[d];
        const records = filterByPeriod(store.state[d], schema.dateField, period, customStart, customEnd);
        const fn = kind === "pdf" ? exportPDF : exportWord;
        fn({ title: `${schema.label} - ${buildTitle()}`, subtitle: `Department: ${schema.label}`, records });
      });
    }
  }

  return (
    <div className="module">
      <h2>Reports</h2>
      <p className="section-hint">Generate reports by department or organization-wide, for the selected period, and export to PDF or Word.</p>

      <div className="form-field">
        <label>Department</label>
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="all">All Departments (Organization-wide)</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Period</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {period === "custom" && (
        <div className="form-row">
          <div className="form-field">
            <label>From</label>
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
          </div>
          <div className="form-field">
            <label>To</label>
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </div>
        </div>
      )}

      <div className="form-actions" style={{ marginTop: 16 }}>
        <button className="btn-secondary" onClick={() => runExport("word")}>⬇ Export Word</button>
        <button className="btn-primary" onClick={() => runExport("pdf")}>⬇ Export PDF</button>
      </div>

      <div className="report-note">
        {dept === "all"
          ? "Organization-wide export generates one file per department (opened as separate downloads)."
          : `This will export the "${SCHEMAS[dept].label}" department records for the selected period.`}
      </div>
    </div>
  );
}
