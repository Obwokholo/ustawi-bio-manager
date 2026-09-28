import React from "react";
import { DEPARTMENTS, fmtMoney } from "../lib/constants";

export default function Dashboard({ store, onNavigate }) {
  const s = store.state;
  const income = s.finance.filter((f) => f.type === "Income").reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const expenditure = s.finance.filter((f) => f.type === "Expenditure").reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const balance = income - expenditure;
  const lowStock = s.inventory.filter((i) => Number(i.qty) <= Number(i.reorderLevel || 0));
  const totalBatches = s.production.length;
  const totalTrials = s.technical.length;
  const totalPlots = s.demoplots.length;

  const recentActivity = [
    ...s.inventory.map((r) => ({ dept: "Inventory", label: r.name, at: r.updatedAt || r.createdAt })),
    ...s.finance.map((r) => ({ dept: "Finance", label: `${r.type}: ${r.category}`, at: r.createdAt })),
    ...s.production.map((r) => ({ dept: "Production", label: `Batch ${r.batchNo}`, at: r.createdAt })),
    ...s.technical.map((r) => ({ dept: "Technical", label: r.title, at: r.createdAt })),
    ...s.demoplots.map((r) => ({ dept: "Demo Plots", label: r.location, at: r.createdAt })),
    ...s.governance.map((r) => ({ dept: "Governance", label: r.meetingType, at: r.createdAt })),
  ]
    .filter((a) => a.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);

  return (
    <div className="module">
      <h2>Committee Dashboard</h2>

      <div className="stat-grid">
        <div className="stat-card income">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">{fmtMoney(income)}</div>
        </div>
        <div className="stat-card expense">
          <div className="stat-label">Total Expenditure</div>
          <div className="stat-value">{fmtMoney(expenditure)}</div>
        </div>
        <div className="stat-card balance">
          <div className="stat-label">Balance</div>
          <div className="stat-value">{fmtMoney(balance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value">{lowStock.length}</div>
        </div>
      </div>

      <div className="mini-stats-row">
        <div className="mini-stat" onClick={() => onNavigate("production")}>
          <div className="mini-stat-value">{totalBatches}</div>
          <div className="mini-stat-label">Production Batches</div>
        </div>
        <div className="mini-stat" onClick={() => onNavigate("technical")}>
          <div className="mini-stat-value">{totalTrials}</div>
          <div className="mini-stat-label">R&D Trials</div>
        </div>
        <div className="mini-stat" onClick={() => onNavigate("demoplots")}>
          <div className="mini-stat-value">{totalPlots}</div>
          <div className="mini-stat-label">Demo Plots</div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alert-box">
          ⚠️ {lowStock.length} inventory item(s) at or below reorder level: {lowStock.map((i) => i.name).join(", ")}
        </div>
      )}

      <h3 className="section-title">Recent Activity</h3>
      <div className="record-list">
        {recentActivity.length === 0 && <div className="empty-state">No activity yet.</div>}
        {recentActivity.map((a, idx) => (
          <div key={idx} className="activity-row">
            <span className="activity-dept">{a.dept}</span>
            <span className="activity-label">{a.label}</span>
          </div>
        ))}
      </div>

      <h3 className="section-title">Departments</h3>
      <div className="dept-grid">
        {DEPARTMENTS.map((d) => (
          <button key={d.id} className="dept-tile" onClick={() => onNavigate(d.id)}>
            <span className="dept-tile-icon">{d.icon}</span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
