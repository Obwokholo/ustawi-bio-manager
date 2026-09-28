import { UNITS } from "./constants";

export const SCHEMAS = {
  inventory: {
    label: "Inventory",
    dateField: "updatedAt",
    fields: [
      { key: "name", label: "Item Name", type: "text", required: true },
      { key: "type", label: "Category", type: "select", options: ["Raw Material", "Finished Product"], required: true },
      { key: "qty", label: "Quantity", type: "number", required: true },
      { key: "unit", label: "Unit", type: "select", options: UNITS, required: true },
      { key: "location", label: "Storage Location", type: "text" },
      { key: "reorderLevel", label: "Reorder Level", type: "number" },
    ],
  },
  finance: {
    label: "Finance",
    dateField: "date",
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "type", label: "Type", type: "select", options: ["Income", "Expenditure"], required: true },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "amount", label: "Amount (KES)", type: "number", required: true },
      { key: "reference", label: "Transaction Reference", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "receiptPhoto", label: "Receipt Photo", type: "photo" },
    ],
  },
  production: {
    label: "Production",
    dateField: "date",
    fields: [
      { key: "batchNo", label: "Batch Number", type: "text", required: true },
      { key: "date", label: "Production Date", type: "date", required: true },
      { key: "product", label: "Product", type: "text", required: true },
      { key: "formulation", label: "Formulation", type: "textarea" },
      { key: "microorganisms", label: "Microorganisms Used", type: "textarea" },
      { key: "quantityProduced", label: "Quantity Produced", type: "number" },
      { key: "unit", label: "Unit", type: "select", options: UNITS },
      { key: "qcStatus", label: "Quality Control Status", type: "select", options: ["Pending", "Passed", "Failed"] },
      { key: "viability", label: "Viability Check", type: "text" },
      { key: "correctiveActions", label: "Corrective Actions", type: "textarea" },
    ],
  },
  technical: {
    label: "Technical / R&D",
    dateField: "date",
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "title", label: "Trial / Formulation Title", type: "text", required: true },
      { key: "objective", label: "Objective", type: "textarea" },
      { key: "method", label: "Method", type: "textarea" },
      { key: "observations", label: "Laboratory Observations", type: "textarea" },
      { key: "conclusion", label: "Conclusion / Improvement", type: "textarea" },
      { key: "photo", label: "Lab Photo Evidence", type: "photo" },
    ],
  },
  demoplots: {
    label: "Demo Plots",
    dateField: "plantingDate",
    fields: [
      { key: "location", label: "Plot Location", type: "text", required: true },
      { key: "crop", label: "Crop", type: "text", required: true },
      { key: "treatment", label: "Treatment", type: "text" },
      { key: "plantingDate", label: "Planting Date", type: "date" },
      { key: "observations", label: "Observations", type: "textarea" },
      { key: "yieldTreated", label: "Yield - Treated", type: "number" },
      { key: "yieldControl", label: "Yield - Control", type: "number" },
      { key: "unit", label: "Yield Unit", type: "text" },
      { key: "photo", label: "Field Photo", type: "photo" },
    ],
  },
  governance: {
    label: "Governance",
    dateField: "date",
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "meetingType", label: "Meeting / Record Type", type: "text", required: true },
      { key: "agenda", label: "Agenda", type: "textarea" },
      { key: "decisions", label: "Decisions Made", type: "textarea" },
      { key: "attendees", label: "Attendees", type: "textarea" },
    ],
  },
};

export const EDIT_PERMISSIONS = {
  admin: ["inventory", "finance", "production", "technical", "demoplots", "governance"],
  chairperson: ["governance"],
  coordinator: ["demoplots", "governance"],
  technical: ["technical"],
  production: ["production", "inventory"],
  finance: ["finance"],
  member: [],
};

export function canEdit(role, dept) {
  if (role === "admin") return true;
  return (EDIT_PERMISSIONS[role] || []).includes(dept);
}
