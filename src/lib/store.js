import { useEffect, useState, useCallback } from "react";
import { uid, todayISO } from "./constants";

const KEY = "afrisoil_manager_v1";

const seedUsers = [
  { id: "u1", name: "Admin User", username: "admin", password: "admin123", role: "admin", active: true },
  { id: "u2", name: "Jane Wanjiru", username: "chair", password: "chair123", role: "chairperson", active: true },
  { id: "u3", name: "Peter Otieno", username: "coordinator", password: "coord123", role: "coordinator", active: true },
  { id: "u4", name: "Grace Mutua", username: "finance", password: "fin123", role: "finance", active: true },
];

function seedState() {
  const now = new Date().toISOString();
  return {
    users: seedUsers,
    session: null,
    inventory: [
      { id: uid(), name: "Molasses", type: "Raw Material", qty: 40, unit: "L", location: "Store A", reorderLevel: 10, updatedAt: now, updatedBy: "Admin User" },
      { id: uid(), name: "AFRISOIL Biofertilizer 1L", type: "Finished Product", qty: 120, unit: "pieces", location: "Warehouse", reorderLevel: 30, updatedAt: now, updatedBy: "Admin User" },
    ],
    finance: [
      { id: uid(), date: todayISO(), type: "Income", category: "Product Sales", amount: 45000, reference: "RCPT-1001", description: "Sale of 30 x 1L units", recordedBy: "Grace Mutua", createdAt: now },
      { id: uid(), date: todayISO(), type: "Expenditure", category: "Raw Materials", amount: 12000, reference: "EXP-2001", description: "Purchase of molasses and inoculant", recordedBy: "Grace Mutua", createdAt: now },
    ],
    production: [
      {
        id: uid(), batchNo: "B-2024-001", date: todayISO(), product: "AFRISOIL Biofertilizer",
        formulation: "Molasses 20L, Water 60L, Effective Microorganism culture 5L",
        microorganisms: "Lactobacillus spp., Saccharomyces spp., Phototrophic bacteria",
        quantityProduced: 85, unit: "L", qcStatus: "Passed", viability: "8.2 x10^6 CFU/mL",
        correctiveActions: "None required", recordedBy: "Admin User", createdAt: now,
      },
    ],
    technical: [
      { id: uid(), date: todayISO(), title: "Trial: Increased molasses ratio", objective: "Improve microbial viability", method: "Increase molasses concentration by 10%", observations: "Higher CFU count observed after 7 days incubation", conclusion: "Adopt revised ratio for next batch", recordedBy: "Jane Wanjiru", createdAt: now },
    ],
    demoplots: [
      { id: uid(), location: "Kiambu Demo Farm", crop: "Maize", treatment: "AFRISOIL Biofertilizer vs Control", plantingDate: todayISO(), observations: "Improved leaf colour and vigor in treated plot", yieldTreated: 1800, yieldControl: 1200, unit: "kg/acre", photos: [], recordedBy: "Peter Otieno", createdAt: now },
    ],
    governance: [
      { id: uid(), date: todayISO(), meetingType: "Committee Meeting", agenda: "Review of quarterly progress and finances", decisions: "Approved budget for new demo plot", attendees: "Chairperson, Coordinator, Finance Officer", recordedBy: "Jane Wanjiru", createdAt: now },
    ],
    lastBackup: null,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load store", e);
  }
  const seed = seedState();
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let listeners = [];
let state = load();

function setState(updater) {
  state = typeof updater === "function" ? updater(state) : updater;
  save(state);
  listeners.forEach((l) => l(state));
}

export function useStore() {
  const [s, setS] = useState(state);
  useEffect(() => {
    const listener = (ns) => setS(ns);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const actions = useCallback(
    () => ({
      login(username, password) {
        const user = state.users.find(
          (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password && u.active
        );
        if (!user) return { ok: false, error: "Invalid username or password, or account disabled." };
        setState((st) => ({ ...st, session: user.id }));
        return { ok: true };
      },
      logout() {
        setState((st) => ({ ...st, session: null }));
      },
      currentUser() {
        return state.users.find((u) => u.id === state.session) || null;
      },
      addUser(user) {
        setState((st) => ({ ...st, users: [...st.users, { ...user, id: uid(), active: true }] }));
      },
      updateUser(id, patch) {
        setState((st) => ({ ...st, users: st.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
      },
      deleteUser(id) {
        setState((st) => ({ ...st, users: st.users.filter((u) => u.id !== id) }));
      },
      addRecord(dept, record) {
        setState((st) => ({ ...st, [dept]: [{ ...record, id: uid(), createdAt: new Date().toISOString() }, ...st[dept]] }));
      },
      updateRecord(dept, id, patch) {
        setState((st) => ({
          ...st,
          [dept]: st[dept].map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r)),
        }));
      },
      deleteRecord(dept, id) {
        setState((st) => ({ ...st, [dept]: st[dept].filter((r) => r.id !== id) }));
      },
      backupNow() {
        setState((st) => ({ ...st, lastBackup: new Date().toISOString() }));
        return state;
      },
      restoreFromJSON(json) {
        try {
          const parsed = JSON.parse(json);
          setState(parsed);
          return { ok: true };
        } catch (e) {
          return { ok: false, error: "Invalid backup file." };
        }
      },
    }),
    []
  );

  return { state: s, ...actions() };
}

export function getState() {
  return state;
}
