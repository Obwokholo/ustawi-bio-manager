import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmtDateTime } from "./constants";

function buildRows(records) {
  if (!records.length) return { head: [["No records found"]], body: [] };
  const keys = Object.keys(records[0]).filter((k) => !["id", "photos"].includes(k));
  const head = [keys];
  const body = records.map((r) => keys.map((k) => (r[k] === undefined || r[k] === null ? "" : String(r[k]))));
  return { head, body };
}

export function exportPDF({ title, subtitle, records }) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Ustawi Bio-Manager — AFRISOIL Biofertilizer Committee", 14, 16);
  doc.setFontSize(12);
  doc.text(title, 14, 24);
  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(subtitle, 14, 30);
    doc.setTextColor(0);
  }
  doc.setFontSize(9);
  doc.text("Generated: " + fmtDateTime(new Date().toISOString()), 14, 36);

  const { head, body } = buildRows(records);
  autoTable(doc, {
    startY: 42,
    head,
    body,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [47, 107, 58] },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportWord({ title, subtitle, records }) {
  const { head, body } = buildRows(records);
  const headHtml = "<tr>" + head[0].map((h) => `<th style="border:1px solid #333;padding:4px;background:#2f6b3a;color:#fff;">${h}</th>`).join("") + "</tr>";
  const bodyHtml = body
    .map((row) => "<tr>" + row.map((cell) => `<td style="border:1px solid #333;padding:4px;">${cell}</td>`).join("") + "</tr>")
    .join("");
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head><meta charset="utf-8"></head>
    <body>
      <h2>Ustawi Bio-Manager — AFRISOIL Biofertilizer Committee</h2>
      <h3>${title}</h3>
      <p>${subtitle || ""}</p>
      <p style="font-size:10px;color:#555;">Generated: ${fmtDateTime(new Date().toISOString())}</p>
      <table style="border-collapse:collapse;width:100%;font-size:12px;">
        ${headHtml}
        ${bodyHtml}
      </table>
    </body>
    </html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function filterByPeriod(records, dateField, period, customStart, customEnd) {
  const now = new Date();
  let start, end;
  if (period === "monthly") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  } else if (period === "quarterly") {
    const q = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), q * 3, 1);
    end = new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59);
  } else if (period === "annual") {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  } else if (period === "custom") {
    start = customStart ? new Date(customStart) : new Date(0);
    end = customEnd ? new Date(customEnd + "T23:59:59") : now;
  } else {
    return records;
  }
  return records.filter((r) => {
    const v = r[dateField] || r.createdAt;
    if (!v) return false;
    const d = new Date(v);
    return d >= start && d <= end;
  });
}
