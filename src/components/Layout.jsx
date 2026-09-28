import React from "react";
import { DEPARTMENTS } from "../lib/constants";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: "🏠" },
  { id: "inventory", label: "Stock", icon: "📦" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "more", label: "More", icon: "☰" },
];

export default function Layout({ current, onNavigate, children, online }) {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="top-bar-logo">🌱 Ustawi Bio-Manager</span>
        <span className={`conn-dot ${online ? "on" : "off"}`} title={online ? "Online" : "Offline"} />
      </header>
      <main className="app-content">{children}</main>
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${current === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export function MorePanel({ onNavigate, isAdmin }) {
  return (
    <div className="module">
      <h2>More</h2>
      <div className="more-list">
        {DEPARTMENTS.filter((d) => d.id !== "inventory" && d.id !== "finance").map((d) => (
          <button key={d.id} className="more-item" onClick={() => onNavigate(d.id)}>
            <span>{d.icon}</span> {d.label}
          </button>
        ))}
        {isAdmin && (
          <button className="more-item" onClick={() => onNavigate("users")}>
            <span>👤</span> User Management
          </button>
        )}
        <button className="more-item" onClick={() => onNavigate("settings")}>
          <span>⚙️</span> Settings & Sync
        </button>
      </div>
    </div>
  );
}
