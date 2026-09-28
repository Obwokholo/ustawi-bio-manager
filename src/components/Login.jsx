import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  function submit(e) {
    e.preventDefault();
    const res = onLogin(username, password);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">🌱</div>
        <h1>Ustawi Bio-Manager</h1>
        <p className="login-sub">AFRISOIL Biofertilizer Committee</p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. admin" autoFocus />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {error && <div className="form-error">{error}</div>}
          <button className="btn-primary" type="submit">Sign In</button>
        </form>
        <button className="link-btn" onClick={() => setShowHelp((s) => !s)}>Demo credentials</button>
        {showHelp && (
          <div className="demo-help">
            <div><b>admin</b> / admin123 — Administrator</div>
            <div><b>chair</b> / chair123 — Chairperson</div>
            <div><b>coordinator</b> / coord123 — Coordinator</div>
            <div><b>finance</b> / fin123 — Finance Officer</div>
          </div>
        )}
        <div className="login-footnote">Offline-first · Private deployment · Data stored securely on this device</div>
      </div>
    </div>
  );
}
