import { useMemo, useState } from "react";

/* Sample data. Replace with your API response later. */
const ASSETS = [
  { name: "MacBook Pro 14-inch", id: "IT-024", category: "Laptop", assignee: "Haripriya", date: "12 Jun 2023", status: "Assigned" },
  { name: "Dell 27-inch Monitor", id: "IT-057", category: "Monitor", assignee: "Haripriya", date: "12 Jun 2023", status: "Assigned" },
  { name: "MacBook Air 13-inch", id: "IT-031", category: "Laptop", assignee: "Nikhil", date: "15 Jan 2024", status: "Assigned" },
  { name: "Lenovo ThinkPad T14", id: "IT-042", category: "Laptop", assignee: "Ramya", date: "02 Feb 2024", status: "Assigned" },
  { name: "Dell Latitude 5440", id: "IT-068", category: "Laptop", assignee: "Unassigned", date: "", status: "Available" },
  { name: "Dell 24-inch Monitor", id: "IT-071", category: "Monitor", assignee: "Unassigned", date: "", status: "Available" },
  { name: "HP EliteBook 840", id: "IT-046", category: "Laptop", assignee: "IT Team", date: "06 Oct 2026", status: "Maintenance" },
];

/* The inventory has 72 assets but only 7 sample rows, so the summary cards use fixed numbers for now. */
const STATS = [
  { label: "Total assets", value: 72, note: "Laptops, monitors & accessories" },
  { label: "Assigned", value: 54, note: "Linked to employee records" },
  { label: "Available", value: 12, note: "Ready for new assignments" },
  { label: "Maintenance", value: 6, note: "Service or repair in progress" },
];
const TOTAL_ASSETS = 72;
const PAGE_SIZE = 10;

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const ArrowLeft = () => (
  <Icon>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);
const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
const InfoIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);

function exportCsv(rows) {
  const header = ["S.No.", "Asset", "Asset ID", "Category", "Assigned to", "Assigned date", "Status"];
  const lines = rows.map((a, i) => [i + 1, a.name, a.id, a.category, a.assignee, a.date || "-", a.status]);
  const csv = [header, ...lines].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "asset-inventory.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Assets({ onBack }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(ASSETS.map((a) => a.category))], []);
  const statuses = ["All", "Assigned", "Available", "Maintenance"];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ASSETS.filter(
      (a) =>
        (category === "All" || a.category === category) &&
        (status === "All" || a.status === status) &&
        (!q || a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.assignee.toLowerCase().includes(q))
    ).slice(0, PAGE_SIZE);
  }, [query, category, status]);

  const filtering = query.trim() !== "" || category !== "All" || status !== "All";
  const showing = rows.length === 0
    ? "Showing 0 assets"
    : filtering
      ? `Showing 1–${rows.length} matching assets`
      : `Showing 1–${rows.length} of ${TOTAL_ASSETS} assets · ${PAGE_SIZE} rows per page`;

  return (
    <main className="as-page">
      <style>{css}</style>

      <div className="as-crumbs">
        <button type="button" className="as-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="as-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Assets</span>
      </div>

      <section className="as-hero">
        <div>
          <h1>Asset Management</h1>
          <p>Track equipment, ownership and the lifecycle of every asset.</p>
        </div>
        <button type="button" className="as-add">Add Asset</button>
      </section>

      <section className="as-stats">
        {STATS.map((s) => (
          <div className="as-stat" key={s.label}>
            <span className="as-stat-label">{s.label}</span>
            <strong>{s.value}</strong>
            <span className="as-stat-note">{s.note}</span>
          </div>
        ))}
      </section>

      <section className="as-card">
        <div className="as-card-head">
          <h2>Asset Inventory</h2>
          <button type="button" className="as-export" onClick={() => exportCsv(rows)}>
            Export inventory
          </button>
        </div>

        <div className="as-toolbar">
          <label className="as-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search asset ID, name or assignee"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select className="as-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "Category" : c}</option>
            ))}
          </select>
          <select className="as-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            {statuses.map((s) => (
              <option key={s} value={s}>{s === "All" ? "Statuses" : s}</option>
            ))}
          </select>
        </div>

        <div className="table-scroll">
          <table className="as-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Asset</th>
                <th>Asset ID</th>
                <th>Category</th>
                <th>Assigned to</th>
                <th>Assigned date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty">No assets match your filters.</td>
                </tr>
              )}
              {rows.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.id}</td>
                  <td>{a.category}</td>
                  <td>{a.assignee}</td>
                  <td>{a.date || "—"}</td>
                  <td><span className={`as-status ${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td><button type="button" className="as-view">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="as-foot">
          <span>{showing}</span>
          {!filtering && (
            <div className="as-pager" aria-label="Pagination">
              <button type="button" disabled aria-label="Previous page">‹</button>
              <button type="button" className="on" aria-current="page">1</button>
              <button type="button" disabled aria-label="Next page">›</button>
            </div>
          )}
        </div>
      </section>

      <p className="as-note">
        <InfoIcon />
        IT-024 and IT-057 are assigned to Haripriya. Employee records and asset assignments share the same source of truth.
      </p>
    </main>
  );
}

/* Page styles. Colour variables and base table styles come from Dashboard.jsx. */
const css = `
.as-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.as-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; }
.as-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.as-back { display: grid; place-items: center; }
.as-link:hover { text-decoration: underline; }

.as-hero {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  padding: 16px 30px 16px 24px; background: #ece8fb; border-radius: 12px;
}
.as-hero h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.2; }
.as-hero p { margin: 6px 0 0; font-size: 17px; color: #4d5370; }
.as-add {
  height: 44px; padding: 0 28px; border: 0; border-radius: 6px;
  background: #5b3fd0; color: #fff; font-size: 16px; font-weight: 600;
}
.as-add:hover { background: #4d32bd; }

.as-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.as-stat {
  display: flex; flex-direction: column; gap: 2px; padding: 14px 18px 12px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
}
.as-stat-label { font-size: 19px; color: #4d5370; }
.as-stat strong { font-size: 40px; font-weight: 600; line-height: 1.2; }
.as-stat-note { font-size: 15px; color: var(--muted); }

.as-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 20px 18px; }
.as-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.as-card-head h2 { margin: 0; font-size: 20px; font-weight: 600; }
.as-export { border: 0; background: transparent; padding: 0; color: #5b3fd0; font-size: 16px; font-weight: 600; }
.as-export:hover { text-decoration: underline; }

.as-toolbar { display: flex; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.as-search {
  flex: 1; min-width: 220px; display: flex; align-items: center; gap: 12px; height: 44px;
  padding: 0 16px; background: #f6f7fc; border: 1px solid var(--line); border-radius: 8px; color: #555b78;
}
.as-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 15px; color: var(--ink); }
.as-search input::placeholder { color: #6f7590; }
.as-select {
  height: 44px; min-width: 126px; padding: 0 14px; background: #fff; color: var(--ink);
  border: 1px solid var(--line); border-radius: 8px; font: inherit; font-size: 17px;
}

.as-table { min-width: 900px; }
.as-table thead th { font-size: 16px; height: 40px; padding: 0 12px; }
.as-table tbody td { height: 42px; padding: 0 12px; font-size: 16px; font-weight: 400; }
.as-table thead th:nth-child(1) { width: 8%; }
.as-table thead th:nth-child(2) { width: 22%; }
.as-table thead th:nth-child(3) { width: 11%; }
.as-table thead th:nth-child(4) { width: 11%; }
.as-table thead th:nth-child(5) { width: 14%; }
.as-table thead th:nth-child(6) { width: 14%; }
.as-table thead th:nth-child(7) { width: 11%; }
.as-table thead th:nth-child(8) { width: 9%; }
.as-status { font-weight: 500; }
.as-status.assigned, .as-status.available { color: var(--green); }
.as-status.maintenance { color: #9a6200; }
.as-view { border: 0; background: transparent; padding: 0; color: #4a3fdb; font-size: 16px; font-weight: 500; }
.as-view:hover { text-decoration: underline; }

.as-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 10px; font-size: 16px; color: var(--muted); }
.as-pager { display: flex; gap: 8px; }
.as-pager button { min-width: 22px; border: 0; background: transparent; color: var(--muted); font-size: 14px; }
.as-pager button.on { color: #4a3fdb; font-weight: 700; }
.as-pager button:disabled { cursor: default; opacity: .6; }

.as-note {
  display: flex; align-items: center; gap: 10px; margin: 0; padding: 12px 16px;
  background: #ece8fb; border-radius: 8px; color: #4a3fdb; font-size: 15px; font-weight: 500;
}
@media (max-width: 900px) {
  .as-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .as-page { padding-left: 16px; padding-right: 16px; }
}
`;