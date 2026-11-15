import { useMemo, useState } from "react";
import AddEmployee from "./AddEmployee.jsx";
import TotalEmployees from "./TotalEmployees.jsx";
import EmployeesLeft from "./EmployeesLeft.jsx";
import NewlyJoined from "./NewlyJoined.jsx";
import Assets from "./Assets.jsx";

/* ---------------------------------------------------------------
   Data
---------------------------------------------------------------- */
const seed = [
  { name: "Haripriya", id: "UXII0021", dept: "Design", status: "Active" },
  { name: "Nikhil", id: "UXII0021", dept: "Design", status: "Active" },
  { name: "Ramesh", id: "UXII0021", dept: "Developer", status: "Inactive" },
  { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Active" },
  { name: "Ramya", id: "UXII0021", dept: "Analyst", status: "Active" },
  { name: "Suresh Kumar", id: "UXII0027", dept: "Finance", status: "Active" },
  { name: "Priya Nair", id: "UXII0034", dept: "Marketing", status: "Active" },
];

const extraNames = [
  "Anil Reddy", "Divya Sharma", "Karthik Rao", "Meera Iyer", "Arjun Das",
  "Sneha Pillai", "Vikram Singh", "Lakshmi Devi", "Rohit Verma", "Pooja Menon",
  "Sanjay Gupta", "Anjali Nair", "Manoj Kumar", "Deepa Joshi", "Harish Babu",
  "Swathi Reddy", "Naveen Raj", "Kavya Shetty", "Imran Khan", "Bhavana Rao",
  "Suman Ghosh", "Tejas Patil", "Nisha Thomas", "Prakash Jain", "Rekha Menon",
  "Gopal Krishna", "Shruti Desai", "Varun Malhotra", "Aditi Bose", "Faisal Ahmed",
  "Ishita Roy", "Mohan Lal", "Neha Kapoor", "Pranav Hegde", "Rashmi Kulkarni",
  "Sachin Yadav", "Tara Mathew", "Uday Bhat", "Vidya Nambiar", "Yash Agarwal",
  "Zoya Siddiqui",
];
const depts = ["Design", "Developer", "Analyst", "Finance", "Marketing", "HR", "Sales"];

const initialEmployees = [
  ...seed,
  ...extraNames.map((name, i) => ({
    name,
    id: `UXII${String(40 + i).padStart(4, "0")}`,
    dept: depts[i % depts.length],
    status: i % 6 === 2 ? "Inactive" : "Active",
  })),
].map((e, i) => ({ ...e, sno: i + 1 }));

const PAGE_SIZE = 7;
const AVATAR_COLORS = ["#fde68a", "#bfdbfe", "#fbcfe8", "#bbf7d0", "#ddd6fe", "#fed7aa"];

/* ---------------------------------------------------------------
   Small icon set (inline SVG, no extra dependencies)
---------------------------------------------------------------- */
const Icon = ({ children, size = 18, ...rest }) => (
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
    {...rest}
  >
    {children}
  </svg>
);

const DashboardIcon = () => (
  <Icon>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);
const UsersIcon = ({ size }) => (
  <Icon size={size}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M18 14.3c2.2.7 3.5 2.7 3.5 5.7" />
  </Icon>
);
const MonitorIcon = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </Icon>
);
const DocumentIcon = () => (
  <Icon>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6" />
  </Icon>
);
const SettingsIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Icon>
);
const SearchIcon = () => (
  <Icon size={18}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
const BellIcon = () => (
  <Icon size={22}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
  </Icon>
);
const ChevronDown = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
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
const TrendIcon = () => (
  <Icon size={16}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Icon>
);
const HelpIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
    <path d="M12 17h.01" />
  </Icon>
);
const ArrowRight = () => (
  <Icon size={14}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

/* ---------------------------------------------------------------
   Pieces
---------------------------------------------------------------- */
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

function StatCard({ label, value, icon, tone, footer, onClick }) {
  const clickable = onClick
    ? {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && onClick(),
      }
    : {};
  return (
    <div className={`stat-card ${onClick ? "clickable" : ""}`} {...clickable}>
      <div className="stat-head">
        <span>{label}</span>
        <span className={`stat-icon ${tone}`}>{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      {footer}
    </div>
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

/* ---------------------------------------------------------------
   Main component
---------------------------------------------------------------- */
export default function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [employees, setEmployees] = useState(initialEmployees);
  const [view, setView] = useState("list");
  const [notice, setNotice] = useState("");

  const goTo = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  const addEmployee = (emp) => {
    const total = employees.length + 1;
    setEmployees((prev) => [...prev, { ...emp, sno: prev.length + 1 }]);
    setFilter("All");
    setQuery("");
    setPage(Math.ceil(total / PAGE_SIZE));
    setNotice(`${emp.name} was added to the employee list.`);
    goTo("list");
  };

  const today = new Date();
  const dateLabel = today
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .replace(/^(\w+)\s/, "$1, ")
    .toLowerCase();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      const matchesFilter = filter === "All" || e.status === filter;
      const matchesQuery =
        !q || e.id.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [employees, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon /> },
    { label: "Employees", icon: <UsersIcon /> },
    { label: "Assets", icon: <MonitorIcon /> },
    { label: "Documents", icon: <DocumentIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <div className="app">
      <style>{css}</style>

      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/logonew.png" alt="Interfacely" style={{ width: "100%", maxWidth: 90, height: "auto", display: "block" }} />
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item.label);
                setView(
                  item.label === "Employees" ? "employees" : item.label === "Assets" ? "assets" : "list"
                );
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="help-card">
          <HelpIcon />
          <strong>Need Help?</strong>
          <a href="#contact" className="help-link">
            Contact HR <ArrowRight />
          </a>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="main">
        <header className="topbar">
          <label className="search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search by employee id,department..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <div className="topbar-right">
            <button className="bell" aria-label="Notifications">
              <BellIcon />
              <span className="bell-dot" />
            </button>
            <div className="profile">
              <span className="profile-avatar">H</span>
              <div className="profile-text">
                <span className="profile-name">Haripriya</span>
                <span className="profile-role">HR Admin</span>
              </div>
              <ChevronDown />
            </div>
          </div>
        </header>

        {view === "add" ? (
          <AddEmployee
            nextId={`UXII${String(employees.length + 1).padStart(4, "0")}`}
            onBack={() => goTo("list")}
            onSave={addEmployee}
          />
        ) : view === "employees" ? (
          <TotalEmployees
            employees={employees}
            onBack={() => {
              setActiveNav("Dashboard");
              goTo("list");
            }}
          />
        ) : view === "left" ? (
          <EmployeesLeft
            onBack={() => {
              setActiveNav("Dashboard");
              goTo("list");
            }}
          />
        ) : view === "assets" ? (
          <Assets
            onBack={() => {
              setActiveNav("Dashboard");
              goTo("list");
            }}
          />
        ) : view === "joined" ? (
          <NewlyJoined
            onBack={() => {
              setActiveNav("Dashboard");
              goTo("list");
            }}
          />
        ) : (
        <main className="content">
          <div className="welcome">
            <div>
              <p className="date">{dateLabel}</p>
              <h1>{greeting}, HR</h1>
              <p className="sub">Here’s what needs your attention today.</p>
            </div>
            <button className="primary-btn" onClick={() => { setNotice(""); goTo("add"); }}>
              + Add Employee
            </button>
          </div>

          {notice && (
            <div className="notice" role="status">
              {notice}
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          <section className="stats">
            <StatCard
              label="Total Employees"
              onClick={() => {
                setActiveNav("Employees");
                goTo("employees");
              }}
              value={String(employees.length)}
              tone="blue"
              icon={<UsersIcon size={16} />}
              footer={
                <span className="stat-foot good">
                  <TrendIcon /> +2 this month
                </span>
              }
            />
            <StatCard
              label="Employees Left"
              onClick={() => {
                setActiveNav("Employees");
                goTo("left");
              }}
              value="16"
              tone="red"
              icon={<UsersIcon size={16} />}
              footer={<span className="stat-foot">Reporting period not specified</span>}
            />
            <StatCard
              label="Newly joined Employees"
              onClick={() => {
                setActiveNav("Employees");
                goTo("joined");
              }}
              value="18"
              tone="sky"
              icon={<UsersIcon size={16} />}
              footer={<span className="stat-foot">Joined this month</span>}
            />
          </section>

          <section className="table-card">
            <div className="table-head">
              <h2>Employees</h2>
              <div className="segmented" role="tablist">
                {["All", "Active", "Inactive"].map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    className={filter === f ? "on" : ""}
                    onClick={() => changeFilter(f)}
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
                        No employees match your search. Try a different ID or department.
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
                        <span className={`badge ${e.status === "Active" ? "active" : "inactive"}`}>
                          {e.status}
                        </span>
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
                <button
                  className="page-btn"
                  aria-label="Previous page"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                >
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
                <button
                  className="page-btn"
                  aria-label="Next page"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </footer>
          </section>
        </main>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Styles (kept in the file so the component is drop-in)
---------------------------------------------------------------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.app {
  --bg: #f4f5f9;
  --surface: #ffffff;
  --ink: #1f2540;
  --muted: #7a8097;
  --line: #e7e9f1;
  --brand: #4a3fdb;
  --brand-soft: #eef0fd;
  --green-bg: #e3f6ea;
  --green: #1c7a45;
  --red-bg: #fde4ea;
  --red: #c4244b;

  display: flex;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
}
.app *, .app *::before, .app *::after { box-sizing: border-box; }
.app button, .app input, .app table, .app a { font-family: inherit; }
.app button { cursor: pointer; }
.app :focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

/* Sidebar */
.sidebar {
  width: 233px;
  flex-shrink: 0;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  padding: 16px 26px 22px 26px;
  border-right: 1px solid var(--line);
}
.logo { display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
.nav { display: flex; flex-direction: column; gap: 14px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  height: 41px; padding: 0 16px; border: 0; border-radius: 8px;
  background: transparent; color: #2a3050;
  font-size: 16px; font-weight: 400; text-align: left;
}
.nav-item:hover { background: #f3f4fa; }
.nav-item.active, .nav-item.active:hover { background: var(--brand-soft); color: var(--brand); font-weight: 500; }
.help-card {
  margin-top: auto;
  display: flex; flex-direction: column; gap: 6px;
  padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px;
  font-size: 14px; font-weight: 500;
}
.help-card svg { color: var(--brand); }
.help-link { display: flex; align-items: center; justify-content: space-between; color: var(--brand); text-decoration: none; font-weight: 400; }

/* Main */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  height: 68px; padding: 0 48px 0 28px; background: var(--surface); border-bottom: 1px solid var(--line);
}
.search {
  display: flex; align-items: center; gap: 14px;
  width: 100%; max-width: 435px; height: 40px; padding: 0 16px;
  background: #eef0fb; border: 1px solid #dfe3f6; border-radius: 8px; color: #555b78;
}
.search input {
  flex: 1; min-width: 0; border: 0; outline: 0; background: transparent;
  font: inherit; font-size: 14px; color: var(--ink);
}
.search input::placeholder { color: #6f7590; }
.topbar-right { display: flex; align-items: center; gap: 36px; }
.bell { position: relative; border: 0; background: transparent; color: #a99be6; display: grid; place-items: center; padding: 4px; }
.bell-dot { position: absolute; top: 2px; right: 3px; width: 8px; height: 8px; border-radius: 50%; background: #f08a7c; }
.profile { display: flex; align-items: center; gap: 14px; }
.profile-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; font-weight: 600; font-size: 16px;
  background: #c8e6e3; color: #1d5a55;
}
.profile-text { display: flex; flex-direction: column; line-height: 1.3; }
.profile-name { font-weight: 500; font-size: 18px; color: #3a3f58; }
.profile-role { font-size: 14px; color: var(--muted); }

.content { padding: 20px 48px 28px 28px; display: flex; flex-direction: column; gap: 20px; }
.welcome { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.date { margin: 0; color: #6a7088; font-weight: 500; font-size: 18px; }
.welcome h1 { margin: 4px 0 6px; font-size: 32px; font-weight: 600; line-height: 1.2; }
.sub { margin: 0; font-size: 16px; font-weight: 400; color: #4d536b; }
.primary-btn {
  height: 44px; background: var(--brand); color: #fff; border: 0; border-radius: 6px;
  padding: 0 32px; font-size: 16px; font-weight: 600; white-space: nowrap;
}
.primary-btn:hover { background: #3b31c4; }

/* Stats */
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.stat-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 20px 24px; min-height: 144px; }
.stat-head { display: flex; justify-content: space-between; align-items: center; color: #5c627c; font-size: 18px; font-weight: 400; }
.stat-icon { width: 36px; height: 36px; border-radius: 8px; display: grid; place-items: center; }
.stat-icon.blue { background: #e4e8fb; color: #4a5bd8; }
.stat-icon.red { background: #fde6e0; color: #e4573d; }
.stat-icon.sky { background: #dbe9fb; color: #3a76d8; }
.stat-value { font-size: 44px; font-weight: 700; line-height: 1.25; margin: 4px 0; }
.stat-foot { display: inline-flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 400; color: var(--muted); }
.stat-foot.good { color: var(--green); }

.stat-card.clickable { cursor: pointer; transition: box-shadow .15s, transform .15s; }
.stat-card.clickable:hover { box-shadow: 0 6px 16px rgba(20, 26, 51, .14); }

/* Table */
.table-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 12px 12px 18px; }
.table-head { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px 12px; gap: 12px; }
.table-head h2 { margin: 0; font-size: 32px; font-weight: 500; line-height: 1.2; }
.segmented { display: flex; padding: 6px; background: #eef0f6; border-radius: 8px; gap: 4px; }
.segmented button {
  border: 0; background: transparent; padding: 7px 22px; border-radius: 6px;
  font-size: 14px; font-weight: 600; color: #4d5370;
}
.segmented button.on { background: #fff; color: var(--ink); font-weight: 700; box-shadow: 0 1px 2px rgba(20, 26, 51, .1); }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 860px; table-layout: fixed; }
thead th:nth-child(1) { width: 13%; }
thead th:nth-child(2) { width: 23.6%; }
thead th:nth-child(3) { width: 22.3%; }
thead th:nth-child(4) { width: 15.8%; }
thead th:nth-child(5) { width: 12.8%; }
thead th:nth-child(6) { width: 12.5%; }
thead th {
  background: #f1f2f8; text-align: left; font-weight: 500; font-size: 18px;
  color: #646a85; height: 55px; padding: 0 16px;
}
thead th:first-child { border-radius: 8px 0 0 8px; }
thead th:last-child { border-radius: 0 8px 8px 0; }
tbody td { height: 64px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 16px; font-weight: 500; color: #1a2038; }
tbody tr:last-child td { border-bottom: 0; }
.center { text-align: center !important; }
.name-cell { display: inline-flex; align-items: center; gap: 9px; font-weight: 500; color: #131a33; }
.avatar {
  width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
  font-size: 14px; font-weight: 600; color: #2c3150;
}
.badge { display: inline-block; padding: 3px 10px; border-radius: 8px; font-size: 16px; font-weight: 500; }
.badge.active { background: var(--green-bg); color: var(--green); }
.badge.inactive { background: var(--red-bg); color: var(--red); }
.view-link { color: #2f3cd6; text-decoration: underline; font-size: 16px; font-weight: 500; }
.empty { text-align: center; color: var(--muted); padding: 32px 16px !important; }

.table-foot { display: flex; justify-content: space-between; align-items: center; padding: 14px 8px 0; gap: 12px; flex-wrap: wrap; }
.showing { font-size: 16px; color: var(--muted); }
.pager { display: flex; gap: 10px; }
.page-btn {
  min-width: 26px; height: 26px; padding: 0 6px; display: grid; place-items: center;
  border: 1px solid var(--line); background: #fff; border-radius: 4px;
  font-size: 14px; color: #4d5370;
}
.page-btn:hover:not(:disabled):not(.current) { background: #f3f4fa; }
.page-btn.current { background: #2f5bea; border-color: #2f5bea; color: #fff; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }

/* Responsive */
@media (max-width: 1366px) {
  .app { zoom: .85; }
}
@media (max-width: 900px) {
  .stats { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .app { zoom: 1; }
  .sidebar { display: none; }
  .topbar, .content { padding-left: 16px; padding-right: 16px; }
  .profile-text { display: none; }
  .welcome { flex-direction: column; }
}

`;