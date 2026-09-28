import React, { useRef, useState } from "react";
import { compressImage } from "../lib/compress";

export default function PhotoField({ value, onChange }) {
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photo-field">
      {value ? (
        <div className="photo-preview">
          <img src={value} alt="attachment" />
          <button type="button" className="btn-tiny danger" onClick={() => onChange(null)}>Remove</button>
        </div>
      ) : (
        <button type="button" className="btn-secondary" onClick={() => inputRef.current.click()} disabled={busy}>
          {busy ? "Compressing…" : "📷 Add Photo"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
