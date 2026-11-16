import { useMemo, useState } from "react";
import AssetDetail from "./AssetDetail.jsx";

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
  const [detail, setDetail] = useState(null); // { asset, mode } when an asset page is open

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

  if (detail) {
    return <AssetDetail asset={detail.asset} mode={detail.mode} onBack={() => setDetail(null)} onDashboard={onBack} />;
  }

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
        <button type="button" className="as-add" onClick={() => setDetail({ asset: ASSETS[0], mode: "add" })}>
          Add Asset
        </button>
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
                <th><span>S.No.</span></th>
                <th><span>Asset</span></th>
                <th><span>Asset ID</span></th>
                <th><span>Category</span></th>
                <th><span>Assigned to</span></th>
                <th><span>Assigned date</span></th>
                <th><span>Status</span></th>
                <th><span>Action</span></th>
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
                  <td><button type="button" className="as-view" onClick={() => setDetail({ asset: a, mode: "view" })}>
                      View
                    </button></td>
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

/* Page styles. Colour variables and base table styles come from Dashboard.jsx.
   Sizes, weights and colours below were measured from the design (font: Inter). */
const css = `
.as-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.as-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 19px; font-weight: 500; color: #626979; }
.as-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.as-back { display: grid; place-items: center; }
.as-link:hover { text-decoration: underline; }

.as-hero {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  min-height: 88px; padding: 0 24px; background: #f0ebfc; border-radius: 12px;
}
.as-hero h1 { margin: 0; font-size: 28px; font-weight: 600; line-height: 1.2; color: #202432; }
.as-hero p { margin: 4px 0 0; font-size: 16px; font-weight: 500; color: #626979; }
.as-add {
  width: 184px; height: 44px; border: 0; border-radius: 6px;
  background: #6847d6; color: #fff; font-size: 14px; font-weight: 600;
}
.as-add:hover { background: #5a3bc4; }

.as-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.as-stat {
  display: flex; flex-direction: column; justify-content: center; gap: 0; height: 120px; padding: 0 19px;
  background: var(--surface); border: 1px solid #e4e7ef; border-radius: 12px;
}
.as-stat-label { font-size: 18px; font-weight: 500; line-height: 22px; color: #626979; }
.as-stat strong { margin: 2px 0 4px; font-size: 40px; font-weight: 600; line-height: 46px; color: #202432; }
.as-stat-note { font-size: 14px; font-weight: 500; line-height: 18px; color: #626979; }

.as-card { background: var(--surface); border: 1px solid #e4e7ef; border-radius: 12px; padding: 14px 19px 14px; }
.as-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.as-card-head h2 { margin: 0; font-size: 18px; font-weight: 600; line-height: 24px; color: #202432; }
.as-export { border: 0; background: transparent; padding: 0; color: #5834bc; font-size: 16px; font-weight: 600; }
.as-export:hover { text-decoration: underline; }

.as-toolbar { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
.as-search {
  flex: 1; min-width: 220px; display: flex; align-items: center; gap: 14px; height: 42px;
  padding: 0 11px; background: #f7f8fc; border: 1px solid #e4e7ef; border-radius: 8px; color: #626979;
}
.as-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; color: #202432; }
.as-search input::placeholder { color: #626979; opacity: 1; }
.as-select {
  appearance: none; -webkit-appearance: none; height: 40px; padding: 0 34px 0 8px; background-color: #fff; color: #000;
  border: 1px solid #e4e7ef; border-radius: 8px; font: inherit; font-size: 18px; font-weight: 400; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
}

.as-table { min-width: 900px; table-layout: fixed; }
.as-table thead th { height: 36px; padding: 0 12px; background: #f7f8fc; color: #626979; font-size: 15.5px; font-weight: 600; border-radius: 0; }
.as-table thead th:first-child { border-radius: 6px 0 0 6px; }
.as-table thead th:last-child { border-radius: 0 6px 6px 0; }
.as-table thead th span { position: relative; }
.as-table thead th:nth-child(1) span { left: 1px; }
.as-table thead th:nth-child(2) span { left: 19px; }
.as-table thead th:nth-child(3) span { left: -16px; }
.as-table thead th:nth-child(4) span { left: -8px; }
.as-table thead th:nth-child(5) span { left: -9px; }
.as-table thead th:nth-child(6) span { left: -8px; }
.as-table thead th:nth-child(7) span { left: 5px; }
.as-table thead th:nth-child(8) span { left: 4px; }
.as-table tbody td { height: 42px; padding: 0 12px; font-size: 16px; font-weight: 500; color: #202432; border-bottom: 1px solid #e4e7ef; }
.as-table tbody tr:last-child td { border-bottom: 1px solid #e4e7ef; }
.as-table tbody td:nth-child(1) { color: #626979; }
.as-table tbody td:nth-child(6) { font-size: 14.7px; }
.as-table thead th:nth-child(1) { width: 5.15%; }
.as-table thead th:nth-child(2) { width: 21.55%; }
.as-table thead th:nth-child(3) { width: 12.52%; }
.as-table thead th:nth-child(4) { width: 11.36%; }
.as-table thead th:nth-child(5) { width: 14.47%; }
.as-table thead th:nth-child(6) { width: 14.17%; }
.as-table thead th:nth-child(7) { width: 12.62%; }
.as-table thead th:nth-child(8) { width: 8.16%; }
.as-status { font-weight: 500; }
.as-status.assigned, .as-status.available { color: #18734e; }
.as-status.maintenance { color: #956017; }
.as-view { border: 0; background: transparent; padding: 0; color: #5834bc; font-size: 16px; font-weight: 500; }
.as-view:hover { text-decoration: underline; }

.as-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 10px; font-size: 15.5px; font-weight: 400; color: #626979; }
.as-pager { display: flex; gap: 8px; }
.as-pager button { min-width: 14px; border: 0; background: transparent; color: #626979; font-size: 12px; padding: 0; }
.as-pager button.on { color: #202432; font-weight: 600; }
.as-pager button:disabled { cursor: default; opacity: .6; }

.as-note {
  display: flex; align-items: center; gap: 14px; margin: 0; min-height: 45px; padding: 0 15px;
  background: #f0ebfc; border-radius: 8px; color: #5834bc; font-size: 14px; font-weight: 500;
}
@media (max-width: 900px) {
  .as-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .as-page { padding-left: 16px; padding-right: 16px; }
}
`;
