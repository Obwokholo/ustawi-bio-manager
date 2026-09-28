import React, { useState } from "react";
import { ROLES } from "../lib/constants";

const emptyUser = { name: "", username: "", password: "", role: "member" };

export default function Users({ store, currentUser }) {
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.username || (!editingId && !form.password)) {
      alert("Please fill in name, username and password.");
      return;
    }
    if (editingId) {
      const patch = { ...form };
      if (!patch.password) delete patch.password;
      store.updateUser(editingId, patch);
    } else {
      store.addUser(form);
    }
    setForm(emptyUser);
    setEditingId(null);
    setShowForm(false);
  }

  function openEdit(u) {
    setForm({ ...u, password: "" });
    setEditingId(u.id);
    setShowForm(true);
  }

  function toggleActive(u) {
    store.updateUser(u.id, { active: !u.active });
  }

  function remove(u) {
    if (u.id === currentUser.id) return alert("You cannot delete your own account.");
    if (confirm(`Remove user "${u.name}"?`)) store.deleteUser(u.id);
  }

  return (
    <div className="module">
      <div className="module-header">
        <h2>User Management</h2>
        <button className="btn-fab-inline" onClick={() => { setForm(emptyUser); setEditingId(null); setShowForm(true); }}>+ New</button>
      </div>
      <p className="section-hint">Administrators can create additional assistants, assign roles, and control access.</p>

      <div className="record-list">
        {store.state.users.map((u) => (
          <div key={u.id} className="record-card">
            <div className="record-card-top">
              <div>
                <div className="record-title">{u.name} {!u.active && <span className="badge-disabled">Disabled</span>}</div>
                <div className="record-sub">@{u.username} · {ROLES.find((r) => r.id === u.role)?.label}</div>
              </div>
            </div>
            <div className="record-actions">
              <button className="btn-tiny" onClick={() => openEdit(u)}>Edit</button>
              <button className="btn-tiny" onClick={() => toggleActive(u)}>{u.active ? "Disable" : "Enable"}</button>
              <button className="btn-tiny danger" onClick={() => remove(u)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit" : "New"} User</h3>
              <button className="btn-tiny" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={submit} className="entry-form">
              <div className="form-field">
                <label>Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Username *</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Password {editingId ? "(leave blank to keep unchanged)" : "*"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
