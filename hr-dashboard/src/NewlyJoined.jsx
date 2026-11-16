import { useMemo, useState } from "react";

const AVATAR_COLORS = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa"];

/* Sample data. Replace with your API response later. */
const JOINED = {
  UXINTERFACELY: [
    { name: "Haripriya", id: "UXII0021", dept: "Design", joined: "16 Oct 2026", progress: 40 },
    { name: "Nikhil", id: "UXII0021", dept: "Design", joined: "16 Oct 2026", progress: 50 },
    { name: "Ramesh", id: "UXII0021", dept: "Developer", joined: "14 Oct 2026", progress: 70 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "14 Oct 2026", progress: 100 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "12 Oct 2026", progress: 50 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "14 Oct 2026", progress: 100 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "09 Oct 2026", progress: 50 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "09 Oct 2026", progress: 70 },
    { name: "Ramya", id: "UXII0021", dept: "Analyst", joined: "12 Oct 2026", progress: 100 },
  ],
  PAYROLL: [
    { name: "Suresh Kumar", id: "UXII0027", dept: "Finance", joined: "08 Oct 2026", progress: 60 },
    { name: "Priya Nair", id: "UXII0034", dept: "Marketing", joined: "05 Oct 2026", progress: 100 },
    { name: "Anil Reddy", id: "UXII0040", dept: "Design", joined: "03 Oct 2026", progress: 30 },
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

function Progress({ value }) {
  const done = value >= 100;
  return (
    <div className={`nj-progress ${done ? "done" : ""}`}>
      <span className="nj-progress-label">{done ? "Completed 100%" : `Onboarding ${value}%`}</span>
      <div className="nj-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="nj-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function NewlyJoined({ onBack }) {
  const [group, setGroup] = useState("UXINTERFACELY");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOINED[group].filter((e) => !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
  }, [group, query]);

  return (
    <main className="nj-page">
      <style>{css}</style>

      <div className="nj-crumbs">
        <button type="button" className="nj-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="nj-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/ Newly joined Employees</span>
      </div>

      <div className="nj-toolbar">
        <label className="nj-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search by name or employee ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="nj-toggle" role="group" aria-label="Employee group">
          {["UXINTERFACELY", "PAYROLL"].map((g) => (
            <button key={g} type="button" className={group === g ? "on" : ""} aria-pressed={group === g} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <section className="nj-card">
        <h2 className="nj-card-title">{group} EMPLOYEES</h2>

        <div className="table-scroll">
          <table className="nj-table">
            <thead>
              <tr>
                <th className="center">S.No.</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Joining date</th>
                <th className="center">Onboarding</th>
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
                  <td className="nj-date">{e.joined}</td>
                  <td>
                    <Progress value={e.progress} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="nj-showing">{rows.length === 0 ? "Showing 0 employees" : `Showing 1–${rows.length} employees`}</p>
      </section>
    </main>
  );
}

/* Page styles. Colour variables, avatar and name styles come from Dashboard.jsx. */
const css = `
.nj-page { padding: 20px 48px 28px 20px; display: flex; flex-direction: column; gap: 16px; }
.nj-crumbs { display: flex; align-items: center; gap: 8px; padding-left: 4px; font-size: 19px; font-weight: 500; color: #626979; }
.nj-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.nj-back { display: grid; place-items: center; margin-right: 4px; }
.nj-link:hover { text-decoration: underline; }
.nj-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.nj-search {
  display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; height: 44px;
  padding: 0 18px; background: #eef0fb; border-radius: 22px; color: #555b78;
}
.nj-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: var(--ink); font-weight: 400; }
.nj-search input::placeholder { color: #626979; }
.nj-toggle { display: flex; gap: 8px; padding: 6px 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px; }
.nj-toggle button {
  height: 30px; min-width: 120px; padding: 0 16px; background: #fff; color: var(--ink);
  border: 1px solid var(--line); border-radius: 16px; font-size: 14px; font-weight: 600;
}
.nj-toggle button.on { background: #2f5bea; border-color: #2f5bea; color: #fff; }

.nj-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 12px 12px 18px; }
.nj-card-title { margin: 0; padding: 4px 0 10px; font-size: 19.5px; font-weight: 600; letter-spacing: 0; }
.nj-table { min-width: 900px; }
.nj-table thead th:nth-child(1) { width: 13%; }
.nj-table thead th:nth-child(2) { width: 20.2%; }
.nj-table thead th:nth-child(3) { width: 22.3%; }
.nj-table thead th:nth-child(4) { width: 15.8%; }
.nj-table thead th:nth-child(5) { width: 12.9%; }
.nj-table thead th:nth-child(6) { width: 15.8%; }
.nj-date { font-size: 14px !important; font-weight: 500 !important; }
.nj-progress { display: flex; flex-direction: column; gap: 4px; width: 118px; margin: 0 auto; }
.nj-progress-label { font-size: 14px; font-weight: 500; color: #1f4de0; white-space: nowrap; }
.nj-track { height: 8px; background: #e5e7ee; border-radius: 4px; overflow: hidden; }
.nj-fill { height: 100%; background: #3730a3; border-radius: 4px; }
.nj-progress.done .nj-progress-label { color: #2fd08a; }
.nj-progress.done .nj-fill { background: #4ade9a; }
.nj-showing { margin: 12px 8px 0; font-size: 16px; color: #626979; font-weight: 400; }
@media (max-width: 720px) {
  .nj-page { padding-left: 16px; padding-right: 16px; }
}
`;