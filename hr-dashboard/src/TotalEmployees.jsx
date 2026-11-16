import { useMemo, useState } from "react";

const PAGE_SIZE = 9;
const AVATAR_COLORS = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa"];

const Icon = ({ children, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
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
const ChevronLeft = () => (
  <Icon size={16}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);
const ChevronRight = () => (
  <Icon size={16}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

function Avatar({ name, index }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="avatar" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
      {initials}
    </span>
  );
}

function getPages(current, total, windowSize = 5) {
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function TotalEmployees({ employees, onBack }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState("PAYROLL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      const okFilter = filter === "All" || e.status === filter;
      const okQuery = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
      return okFilter && okQuery;
    });
  }, [employees, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <main className="te-page">
      <style>{css}</style>

      <div className="te-crumbs">
        <button type="button" className="te-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="te-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Total Employees</span>
      </div>

      <div className="te-toolbar">
        <label className="te-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name or employee ID"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>

        <div className="te-toggle" role="group" aria-label="Employee group">
          {["UXINTERFACELY", "PAYROLL"].map((g) => (
            <button
              key={g}
              type="button"
              className={group === g ? "on" : ""}
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <section className="table-card">
        <div className="table-head">
          <h2 className="te-card-title">{group} EMPLOYEES</h2>
          <div className="segmented" role="tablist">
            {["All", "Active", "Inactive"].map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? "on" : ""}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="center">S.No.</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No employees match your search.
                  </td>
                </tr>
              )}
              {rows.map((e, i) => (
                <tr key={e.sno}>
                  <td className="center">{startIdx + i + 1}</td>
                  <td>
                    <span className="name-cell">
                      <Avatar name={e.name} index={e.sno} />
                      {e.name}
                    </span>
                  </td>
                  <td>{e.id}</td>
                  <td>{e.dept}</td>
                  <td>
                    <span className={`badge ${e.status === "Active" ? "active" : "inactive"}`}>{e.status}</span>
                  </td>
                  <td>
                    <a href={`#employee-${e.sno}`} className="view-link">
                      View More
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="table-foot">
          <span className="showing">
            {filtered.length === 0
              ? "Showing 0 employees"
              : `Showing ${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, filtered.length)} of ${filtered.length} employees`}
          </span>
          <div className="pager">
            <button className="page-btn" aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft />
            </button>
            {getPages(safePage, totalPages).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === safePage ? "current" : ""}`}
                aria-current={p === safePage ? "page" : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="page-btn" aria-label="Next page" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>
              <ChevronRight />
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}

/* Page styles. The table, badge and pager styles come from Dashboard.jsx. */
const css = `
.te-page { padding: 20px 48px 28px 28px; display: flex; flex-direction: column; gap: 16px; }
.te-crumbs { display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 500; color: #626979; }
.te-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.te-back { display: grid; place-items: center; }
.te-link:hover { text-decoration: underline; }
.te-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.te-search {
  display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; height: 44px;
  padding: 0 18px; background: #eef0fb; border-radius: 22px; color: #555b78;
}
.te-search input {
  flex: 1; min-width: 0; border: 0; outline: 0; background: transparent;
  font: inherit; font-size: 16px; color: var(--ink); font-weight: 400;
}
.te-search input::placeholder { color: #626979; }
.te-toggle { display: flex; gap: 8px; padding: 6px 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px; }
.te-toggle button {
  height: 30px; min-width: 120px; padding: 0 16px; background: #fff; color: var(--ink);
  border: 1px solid var(--line); border-radius: 16px; font-size: 14px; font-weight: 600;
}
.table-head .te-card-title { margin: 0; font-size: 19.5px; font-weight: 600; letter-spacing: 0; }
.te-toggle button.on { background: #2f5bea; border-color: #2f5bea; color: #fff; }
@media (max-width: 720px) {
  .te-page { padding-left: 16px; padding-right: 16px; }
}
`;