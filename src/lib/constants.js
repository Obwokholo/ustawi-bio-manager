export const DEPARTMENTS = [
  { id: "inventory", label: "Inventory", icon: "📦" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "production", label: "Production", icon: "🏭" },
  { id: "technical", label: "Technical / R&D", icon: "🔬" },
  { id: "demoplots", label: "Demo Plots", icon: "🌱" },
  { id: "governance", label: "Governance", icon: "🗳️" },
];

export const ROLES = [
  { id: "admin", label: "Administrator" },
  { id: "chairperson", label: "Chairperson" },
  { id: "coordinator", label: "Project Coordinator" },
  { id: "technical", label: "Technical / Product Development Officer" },
  { id: "production", label: "Production Officer" },
  { id: "finance", label: "Finance Officer" },
  { id: "member", label: "View-only Member" },
];

export const UNITS = ["g", "kg", "L", "mL", "CFU", "packs", "pieces"];

export function roleLabel(roleId) {
  return ROLES.find((r) => r.id === roleId)?.label || roleId;
}

export function deptLabel(deptId) {
  return DEPARTMENTS.find((d) => d.id === deptId)?.label || deptId;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtMoney(n) {
  const v = Number(n) || 0;
  return "KES " + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
