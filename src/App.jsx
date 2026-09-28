import React, { useEffect, useState } from "react";
import { useStore } from "./lib/store";
import Login from "./components/Login";
import Layout, { MorePanel } from "./components/Layout";
import Dashboard from "./components/Dashboard";
import DepartmentModule from "./components/DepartmentModule";
import Reports from "./components/Reports";
import Users from "./components/Users";
import Settings from "./components/Settings";
import { DEPARTMENTS } from "./lib/constants";

export default function App() {
  const store = useStore();
  const [page, setPage] = useState("dashboard");
  const [online, setOnline] = useState(navigator.onLine);

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

  const currentUser = store.currentUser();

  if (!currentUser) {
    return <Login onLogin={store.login} />;
  }

  const deptIds = DEPARTMENTS.map((d) => d.id);

  function renderPage() {
    if (page === "dashboard") return <Dashboard store={store} onNavigate={setPage} />;
    if (deptIds.includes(page)) return <DepartmentModule dept={page} store={store} currentUser={currentUser} />;
    if (page === "reports") return <Reports store={store} />;
    if (page === "more") return <MorePanel onNavigate={setPage} isAdmin={currentUser.role === "admin"} />;
    if (page === "users" && currentUser.role === "admin") return <Users store={store} currentUser={currentUser} />;
    if (page === "settings") return <Settings store={store} currentUser={currentUser} onLogout={store.logout} />;
    return <Dashboard store={store} onNavigate={setPage} />;
  }

  return (
    <Layout current={page} onNavigate={setPage} online={online}>
      {renderPage()}
    </Layout>
  );
}
