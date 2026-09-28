import React, { useEffect, useState, useRef } from "react";
import { fmtDateTime, roleLabel } from "../lib/constants";

export default function Settings({ store, currentUser, onLogout }) {
  const [online, setOnline] = useState(navigator.onLine);
  const fileRef = useRef();
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  function doBackup() {
    const data = store.backupNow();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ustawi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSyncMsg("Backup saved to device and cloud sync marker updated.");
  }

  function handleRestore(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = store.restoreFromJSON(reader.result);
      setSyncMsg(res.ok ? "Data restored successfully." : res.error);
    };
    reader.readAsText(file);
  }

  return (
    <div className="module">
      <h2>Settings & Sync</h2>

      <div className="record-card">
        <div className="record-card-top">
          <div>
            <div className="record-title">{currentUser.name}</div>
            <div className="record-sub">{roleLabel(currentUser.role)} · @{currentUser.username}</div>
          </div>
        </div>
      </div>

      <h3 className="section-title">Connection Status</h3>
      <div className={`status-pill ${online ? "on" : "off"}`}>
        {online ? "🟢 Online — data will sync automatically" : "🔴 Offline — working from local device storage"}
      </div>

      <h3 className="section-title">Backup & Recovery</h3>
      <p className="section-hint">
        Last backup: {store.state.lastBackup ? fmtDateTime(store.state.lastBackup) : "Never"}. Backups let you
        recover your account and data on a new device.
      </p>
      <div className="form-actions">
        <button className="btn-secondary" onClick={() => fileRef.current.click()}>Restore Backup</button>
        <button className="btn-primary" onClick={doBackup}>Backup Now</button>
      </div>
      <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={handleRestore} />
      {syncMsg && <div className="sync-msg">{syncMsg}</div>}

      <h3 className="section-title">About</h3>
      <p className="section-hint">
        Ustawi Bio-Manager v1.0 — offline-first management system for the AFRISOIL Biofertilizer Committee.
        Optimized for entry-level Android devices. Privately deployed outside the Play Store.
      </p>

      <button className="btn-secondary logout-btn" onClick={onLogout}>Log Out</button>
    </div>
  );
}
