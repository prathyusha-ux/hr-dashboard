import { useMemo, useState } from "react";

const AVATAR_COLORS = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa"];

/* Sample data. Replace with your API response later. */
const LEFT_EMPLOYEES = {
  UXINTERFACELY: [
    { name: "Haripriya", id: "UXII0021", dept: "Design", status: "F&F Pending", lastDay: "30 Sep 26" },
    { name: "Nikhil", id: "UXII0021", dept: "Design", status: "Settled", lastDay: "28 Sep 26" },
    { name: "Ramesh", id: "UXII0021", dept: "Developer", status: "Settled", lastDay: "28 Aug 26" },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Settled", lastDay: "28 Aug 26" },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Settled", lastDay: "25 Aug 26" },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Settled", lastDay: "25 Aug 26" },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Settled", lastDay: "26 Aug 26" },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Settled", lastDay: "26 Aug 26" },
  ],
  PAYROLL: [
    { name: "Suresh Kumar", id: "UXII0027", dept: "Finance", status: "Settled", lastDay: "15 Jul 26" },
    { name: "Priya Nair", id: "UXII0034", dept: "Marketing", status: "F&F Pending", lastDay: "10 Oct 26" },
    { name: "Anil Reddy", id: "UXII0040", dept: "Design", status: "Settled", lastDay: "02 Jun 26" },
  ],
};

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

export default function EmployeesLeft({ onBack }) {
  const [group, setGroup] = useState("UXINTERFACELY");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEFT_EMPLOYEES[group].filter((e) => !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
  }, [group, query]);

  return (
    <main className="el-page">
      <style>{css}</style>

      <div className="el-crumbs">
        <button type="button" className="el-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="el-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Employees Left</span>
      </div>

      <h1 className="el-title">Employees Left</h1>

      <div className="el-toolbar">
        <label className="el-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name or employee ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="el-toggle" role="group" aria-label="Employee group">
          {["UXINTERFACELY", "PAYROLL"].map((g) => (
            <button key={g} type="button" className={group === g ? "on" : ""} aria-pressed={group === g} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <section className="el-card">
        <h2 className="el-card-title">{group} EMPLOYEES</h2>

        <div className="table-scroll">
          <table className="el-table">
            <thead>
              <tr>
                <th className="center">S.No.</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Working Day</th>
                <th className="center">Exit Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    No employees match your search.
                  </td>
                </tr>
              )}
              {rows.map((e, i) => (
                <tr key={`${group}-${i}`}>
                  <td className="center">{i + 1}</td>
                  <td>
                    <span className="name-cell">
                      <Avatar name={e.name} index={i + 1} />
                      {e.name}
                    </span>
                  </td>
                  <td>{e.id}</td>
                  <td>{e.dept}</td>
                  <td>
                    <span className={`el-pill ${e.status === "Settled" ? "settled" : "pending"}`}>{e.status}</span>
                  </td>
                  <td>
                    <span className="el-date">{e.lastDay}</span>
                  </td>
                  <td className="center">
                    <button type="button" className="el-view">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="el-showing">{rows.length === 0 ? "Showing 0 employees" : `Showing 1–${rows.length} employees`}</p>
      </section>
    </main>
  );
}

/* Page styles. Colour variables, avatar and name styles come from Dashboard.jsx. */
const css = `
.el-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.el-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; }
.el-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.el-back { display: grid; place-items: center; }
.el-link:hover { text-decoration: underline; }
.el-title { margin: 0; padding-left: 10px; font-size: 30px; font-weight: 600; line-height: 1.2; }
.el-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.el-search {
  display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; height: 44px;
  padding: 0 18px; background: #eef0fb; border-radius: 22px; color: #555b78;
}
.el-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: var(--ink); }
.el-search input::placeholder { color: #6f7590; }
.el-toggle { display: flex; gap: 8px; padding: 6px 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px; }
.el-toggle button {
  height: 30px; min-width: 120px; padding: 0 16px; background: #fff; color: var(--ink);
  border: 1px solid var(--line); border-radius: 16px; font-size: 14px; font-weight: 600;
}
.el-toggle button.on { background: #2f5bea; border-color: #2f5bea; color: #fff; }

.el-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 12px 12px 18px; }
.el-card-title { margin: 0; padding: 4px 0 10px; font-size: 22px; font-weight: 500; letter-spacing: -.2px; }
.el-table { min-width: 980px; }
.el-table thead th { height: 55px; font-size: 14px; padding: 0 12px; }
.el-table tbody td { padding: 0 12px; }
.el-table thead th:nth-child(1) { width: 5.6%; }
.el-table thead th:nth-child(2) { width: 19.5%; }
.el-table thead th:nth-child(3) { width: 13.7%; }
.el-table thead th:nth-child(4) { width: 14.1%; }
.el-table thead th:nth-child(5) { width: 15.4%; }
.el-table thead th:nth-child(6) { width: 15.2%; }
.el-table thead th:nth-child(7) { width: 16.5%; }
.el-pill {
  display: inline-block; min-width: 120px; padding: 4px 0; text-align: center;
  border-radius: 16px; font-size: 16px; font-weight: 500;
}
.el-pill.settled { background: var(--green-bg); color: var(--green); }
.el-pill.pending { background: var(--red-bg); color: var(--red); }
.el-date { text-decoration: underline; font-weight: 500; }
.el-view {
  width: 122px; height: 34px; background: #eef2ff; color: #2f3cd6;
  border: 1px solid #c9d3f5; border-radius: 4px; font-size: 14px; font-weight: 500;
}
.el-view:hover { background: #e2e9ff; }
.el-showing { margin: 12px 8px 0; font-size: 16px; color: var(--muted); }
@media (max-width: 720px) {
  .el-page { padding-left: 16px; padding-right: 16px; }
}
`;