import React, { useState } from "react";
import { SCHEMAS, canEdit } from "../lib/schemas";
import { fmtDateTime } from "../lib/constants";
import PhotoField from "./PhotoField";

function emptyRecord(fields) {
  const rec = {};
  fields.forEach((f) => {
    if (f.type === "date") rec[f.key] = new Date().toISOString().slice(0, 10);
    else rec[f.key] = "";
  });
  return rec;
}

export default function DepartmentModule({ dept, store, currentUser }) {
  const schema = SCHEMAS[dept];
  const records = store.state[dept] || [];
  const editable = canEdit(currentUser.role, dept);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyRecord(schema.fields));
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  function openNew() {
    setForm(emptyRecord(schema.fields));
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(rec) {
    setForm({ ...rec });
    setEditingId(rec.id);
    setShowForm(true);
  }

  function submit(e) {
    e.preventDefault();
    const missing = schema.fields.filter((f) => f.required && !form[f.key]);
    if (missing.length) {
      alert("Please fill required fields: " + missing.map((f) => f.label).join(", "));
      return;
    }
    const payload = { ...form, recordedBy: form.recordedBy || currentUser.name, updatedBy: currentUser.name };
    if (editingId) {
      store.updateRecord(dept, editingId, payload);
    } else {
      store.addRecord(dept, payload);
    }
    setShowForm(false);
  }

  function remove(id) {
    if (confirm("Delete this record? This cannot be undone.")) store.deleteRecord(dept, id);
  }

  const filtered = records.filter((r) =>
    query.trim() === ""
      ? true
      : JSON.stringify(r).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="module">
      <div className="module-header">
        <h2>{schema.label}</h2>
        {editable && (
          <button className="btn-fab-inline" onClick={openNew}>+ New</button>
        )}
      </div>

      <input
        className="search-input"
        placeholder={`Search ${schema.label.toLowerCase()} records…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {!editable && (
        <div className="readonly-banner">👁 Read-only access — you can view but not edit this department.</div>
      )}

      <div className="record-list">
        {filtered.length === 0 && <div className="empty-state">No records yet.</div>}
        {filtered.map((rec) => {
          const primary = schema.fields[0];
          const isOpen = expandedId === rec.id;
          return (
            <div key={rec.id} className="record-card">
              <div className="record-card-top" onClick={() => setExpandedId(isOpen ? null : rec.id)}>
                <div>
                  <div className="record-title">{rec[primary.key] || "Untitled"}</div>
                  <div className="record-sub">{fmtDateTime(rec[schema.dateField] || rec.createdAt)}</div>
                </div>
                <div className="record-chevron">{isOpen ? "▲" : "▼"}</div>
              </div>
              {isOpen && (
                <div className="record-details">
                  {schema.fields.map((f) => {
                    if (f.type === "photo") {
                      return rec[f.key] ? (
                        <div key={f.key} className="detail-row photo-row">
                          <span className="detail-label">{f.label}</span>
                          <img className="detail-photo" src={rec[f.key]} alt={f.label} />
                        </div>
                      ) : null;
                    }
                    return (
                      <div key={f.key} className="detail-row">
                        <span className="detail-label">{f.label}</span>
                        <span className="detail-value">{rec[f.key] || "-"}</span>
                      </div>
                    );
                  })}
                  <div className="detail-row">
                    <span className="detail-label">Recorded By</span>
                    <span className="detail-value">{rec.recordedBy || rec.updatedBy || "-"}</span>
                  </div>
                  {editable && (
                    <div className="record-actions">
                      <button className="btn-tiny" onClick={() => openEdit(rec)}>Edit</button>
                      <button className="btn-tiny danger" onClick={() => remove(rec.id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit" : "New"} {schema.label} Record</h3>
              <button className="btn-tiny" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={submit} className="entry-form">
              {schema.fields.map((f) => (
                <div key={f.key} className="form-field">
                  <label>{f.label}{f.required && " *"}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      rows={3}
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : f.type === "photo" ? (
                    <PhotoField value={form[f.key]} onChange={(v) => setForm({ ...form, [f.key]: v })} />
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
