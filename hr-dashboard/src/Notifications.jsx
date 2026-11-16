import { useMemo, useState } from "react";

const CATEGORIES = ["All categories", "Leave & attendance", "Employees", "Assets", "Payroll", "Account & security"];
const RANGES = ["Today", "Last 7 days", "Last 30 days"];

/* Sample data. Replace with your API response later.
   day: 0 = today, 1 = yesterday. target: which page the action link opens. */
export const INITIAL_NOTIFICATIONS = [
  { id: 1, day: 0, icon: "calendar", title: "Nikhil requested annual leave", text: "12–14 October · 3 days · Awaiting your approval.", category: "Leave & attendance", time: "10 min ago", action: "Review request", target: "leave", unread: true },
  { id: 2, day: 0, icon: "userplus", title: "Onboarding checklist needs your attention", text: "Complete document verification for Priya Nair before 9 October.", category: "Employees", time: "45 min ago", action: "View checklist", target: "employees", unread: true },
  { id: 3, day: 0, icon: "laptop", title: "Asset return is due tomorrow", text: "Ramesh needs to return Dell Latitude · Asset ID AST-024.", category: "Assets", time: "2 hours ago", action: "View asset", target: "assets", unread: true },
  { id: 4, day: 1, icon: "wallet", title: "September payroll has been processed", text: "Payslips are now available for all 48 employees.", category: "Payroll", time: "Yesterday, 4:30 PM", action: "View payroll", target: "payroll", unread: false },
  { id: 5, day: 1, icon: "clock", title: "Attendance correction approved", text: "Suresh Kumar approved Ramya’s correction for 5 October.", category: "Leave & attendance", time: "Yesterday, 2:15 PM", action: "View attendance", target: "leave", unread: false },
  { id: 6, day: 1, icon: "shield", title: "New sign-in to your account", text: "Safari on iPhone · Bengaluru, India. Was this you?", category: "Account & security", time: "Yesterday, 9:20 AM", action: "Review activity", target: "account", unread: false },
];

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
const ArrowRight = ({ size = 13 }) => (
  <Icon size={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
const Chevron = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
const CalendarSmall = () => (
  <Icon size={16}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </Icon>
);
const ShieldSmall = () => (
  <Icon size={16}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const Sliders = () => (
  <Icon size={20}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </Icon>
);

const TYPE_ICONS = {
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4M8 14h2M12 14h2M8 17h2" />
    </>
  ),
  userplus: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6M18 8v6M15 11h6" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M3 19h18" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h11v4" />
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <circle cx="16" cy="13" r="1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`nt-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

const dayLabel = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return `${offset === 0 ? "Today" : "Yesterday"} · ${date}`;
};

/* items / setItems: the notification list, kept in Dashboard so the bell dot stays in sync.
   onBack: back to the dashboard. onSettings: opens Settings. links: { employees, assets, account } open those pages. */
export default function Notifications({ items, setItems, onBack, onSettings, links = {} }) {
  const [tab, setTab] = useState("All");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [range, setRange] = useState(RANGES[1]);
  const [prefs, setPrefs] = useState({ inApp: true, email: true, daily: false });
  const [msg, setMsg] = useState("");

  const unreadCount = items.filter((n) => n.unread).length;
  const readCount = items.length - unreadCount;

  const shown = useMemo(
    () =>
      items.filter((n) => {
        if (tab === "Unread" && !n.unread) return false;
        if (tab === "Read" && n.unread) return false;
        if (category !== CATEGORIES[0] && n.category !== category) return false;
        if (range === "Today" && n.day !== 0) return false;
        return true;
      }),
    [items, tab, category, range]
  );

  const markRead = (id) => setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAll = () => {
    setItems((list) => list.map((n) => ({ ...n, unread: false })));
    setMsg("All notifications marked as read.");
  };
  const open = (e, n) => {
    e.stopPropagation();
    markRead(n.id);
    const go = links[n.target];
    if (go) go();
    else setMsg("That page isn't available yet.");
  };

  const groups = [0, 1].map((d) => ({ day: d, rows: shown.filter((n) => n.day === d) })).filter((g) => g.rows.length);

  const tabs = [
    ["All", items.length],
    ["Unread", unreadCount],
    ["Read", readCount],
  ];

  return (
    <main className="nt-page">
      <style>{css}</style>

      <button type="button" className="nt-crumb" onClick={onBack}>
        <ArrowLeft /> My account <span>/</span>Notifications
      </button>

      <div className="nt-top">
        <div>
          <h1>Notifications</h1>
          <p>Stay up to date with your team, requests and important HR updates.</p>
        </div>
        <button type="button" className="nt-markall" onClick={markAll} disabled={unreadCount === 0}>
          Mark all as read
        </button>
      </div>

      {msg && (
        <div className="nt-msg" role="status">
          {msg}
          <button type="button" onClick={() => setMsg("")} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="nt-grid">
        <section className="nt-card nt-list">
          <div className="nt-tabs" role="tablist">
            {tabs.map(([name, count]) => (
              <button key={name} type="button" role="tab" aria-selected={tab === name} className={tab === name ? "on" : ""} onClick={() => setTab(name)}>
                {name} <span className="nt-count">{count}</span>
              </button>
            ))}
          </div>

          <div className="nt-filters">
            <span className="nt-select">
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <Chevron />
            </span>
            <span className="nt-select">
              <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
                {RANGES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <CalendarSmall />
            </span>
            <span className="nt-legend"><i /> Unread</span>
          </div>

          {groups.length === 0 && <p className="nt-empty">No notifications match your filters.</p>}

          {groups.map((g) => (
            <div key={g.day}>
              <div className="nt-day">{dayLabel(g.day)}</div>
              {g.rows.map((n) => (
                <article
                  key={n.id}
                  className={`nt-item ${n.unread ? "unread" : ""}`}
                  tabIndex={0}
                  onClick={() => markRead(n.id)}
                  onKeyDown={(e) => e.key === "Enter" && markRead(n.id)}
                >
                  <span className="nt-icon">
                    <Icon size={18}>{TYPE_ICONS[n.icon]}</Icon>
                  </span>
                  <div className="nt-body">
                    <h3>{n.title}</h3>
                    <p>{n.text}</p>
                    <div className="nt-meta">
                      <span>{n.category} <b>·</b> {n.time}</span>
                      <button type="button" className="nt-action" onClick={(e) => open(e, n)}>
                        {n.action} <ArrowRight />
                      </button>
                    </div>
                  </div>
                  {n.unread && <span className="nt-dot" aria-label="Unread" />}
                </article>
              ))}
            </div>
          ))}

          <div className="nt-foot">
            <span>
              Showing {shown.length} notification{shown.length === 1 ? "" : "s"} from the {range === "Today" ? "last day" : range.toLowerCase()}
            </span>
            <button type="button" className="nt-action" onClick={() => setMsg("Older notifications aren't available yet.")}>
              View older <ArrowRight />
            </button>
          </div>
        </section>

        <aside className="nt-side">
          <section className="nt-card">
            <h2><Sliders /> Preferences</h2>
            <p className="nt-lead">Choose how you receive updates from your HR workspace.</p>

            <div className="nt-pref first">
              <div>
                <strong>In-app notifications</strong>
                <span>Updates in your notification center</span>
              </div>
              <Toggle on={prefs.inApp} onChange={(v) => setPrefs((p) => ({ ...p, inApp: v }))} label="In-app notifications" />
            </div>
            <div className="nt-pref">
              <div>
                <strong>Email notifications</strong>
                <span>Important updates to your work email</span>
              </div>
              <Toggle on={prefs.email} onChange={(v) => setPrefs((p) => ({ ...p, email: v }))} label="Email notifications" />
            </div>
            <div className="nt-pref">
              <div>
                <strong>Daily summary</strong>
                <span>A digest of your HR activity</span>
              </div>
              <Toggle on={prefs.daily} onChange={(v) => setPrefs((p) => ({ ...p, daily: v }))} label="Daily summary" />
            </div>

            <button type="button" className="nt-manage" onClick={onSettings}>
              Manage all preferences <ArrowRight size={15} />
            </button>
          </section>

          <section className="nt-card">
            <h2>You’re in control</h2>
            <p className="nt-lead">
              Unread updates are highlighted with a dot. Marking an update as read won’t approve or dismiss a request.
            </p>
            <p className="nt-secure"><ShieldSmall /> Security alerts are always delivered to help protect your account.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

/* Page styles. Colour variables come from .app in Dashboard.jsx. */
const css = `
.nt-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.nt-crumb { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 0 0 0 10px; border: 0; background: transparent; font-size: 20px; font-weight: 500; color: #3a3f58; }
.nt-crumb:hover { text-decoration: underline; }
.nt-crumb span { margin: 0 -4px 0 -2px; }
.nt-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-left: 10px; }
.nt-top h1 { margin: 0; font-size: 32px; font-weight: 600; line-height: 1.2; }
.nt-top p { margin: 6px 0 0; font-size: 18px; color: #4d5370; }
.nt-markall { height: 44px; padding: 0 28px; background: #fff; color: var(--ink); border: 1px solid var(--line); border-radius: 6px; font-size: 15px; font-weight: 600; }
.nt-markall:hover:not(:disabled) { background: #f3f4fa; }
.nt-markall:disabled { opacity: .5; cursor: not-allowed; }
.nt-msg { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-left: 10px; padding: 10px 16px; border-radius: 8px; background: var(--green-bg); color: var(--green); font-size: 15px; font-weight: 500; }
.nt-msg button { border: 0; background: transparent; color: inherit; font-size: 20px; line-height: 1; }

.nt-grid { display: grid; grid-template-columns: minmax(0, 2.5fr) minmax(0, 1fr); gap: 24px; align-items: start; }
.nt-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
.nt-list { overflow: hidden; }

.nt-tabs { display: flex; gap: 8px; padding: 0 20px; border-bottom: 1px solid var(--line); }
.nt-tabs button { display: inline-flex; align-items: center; gap: 8px; margin-bottom: -1px; padding: 18px 4px 14px; margin-right: 14px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: #4d5370; font-size: 16px; font-weight: 500; }
.nt-tabs button:hover { color: var(--ink); }
.nt-tabs button.on { color: #4f46e5; border-bottom-color: #4f46e5; }
.nt-count { min-width: 26px; height: 24px; padding: 0 6px; display: inline-grid; place-items: center; border-radius: 999px; background: #eef0ff; color: #4f46e5; font-size: 12px; font-weight: 500; }

.nt-filters { display: flex; align-items: center; gap: 12px; padding: 14px 20px; }
.nt-select { position: relative; display: inline-block; }
.nt-select select {
  appearance: none; -webkit-appearance: none; height: 36px; padding: 0 38px 0 12px; background: #fff; color: #4d5370;
  border: 1px solid #dfe2ec; border-radius: 6px; font-size: 14px; cursor: pointer;
}
.nt-select svg { position: absolute; right: 12px; top: 10px; color: #4d5370; pointer-events: none; }
.nt-legend { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #4f46e5; }
.nt-legend i { width: 7px; height: 7px; border-radius: 50%; background: #4f46e5; }

.nt-day { padding: 9px 20px; background: #f3f4f8; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 13px; font-weight: 500; color: #4d5370; }
.nt-empty { padding: 36px 20px; text-align: center; color: var(--muted); }
.nt-item { position: relative; display: flex; gap: 16px; padding: 16px 20px; border-bottom: 1px solid var(--line); cursor: pointer; }
.nt-item:last-child { border-bottom: 0; }
.nt-item:hover { background: #fafbff; }
.nt-icon { width: 36px; height: 36px; flex-shrink: 0; display: grid; place-items: center; border-radius: 8px; background: #eef0fb; color: #4d5370; }
.nt-item.unread .nt-icon { color: #4f46e5; }
.nt-body { flex: 1; min-width: 0; padding-right: 22px; }
.nt-body h3 { margin: 0; font-size: 16px; font-weight: 500; color: var(--ink); }
.nt-item.unread .nt-body h3 { font-weight: 600; }
.nt-body p { margin: 6px 0 0; font-size: 14px; color: #6b7185; }
.nt-meta { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 8px; font-size: 12px; color: #6b7185; }
.nt-meta b { margin: 0 4px; font-weight: 400; }
.nt-dot { position: absolute; top: 20px; right: 20px; width: 8px; height: 8px; border-radius: 50%; background: #4f46e5; }
.nt-action { display: inline-flex; align-items: center; gap: 4px; border: 0; background: transparent; padding: 0; color: #2f3cd6; font-size: 13px; font-weight: 400; white-space: nowrap; }
.nt-action:hover { text-decoration: underline; }
.nt-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 20px; border-top: 1px solid var(--line); font-size: 13px; color: #6b7185; }

.nt-side { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.nt-side .nt-card { padding: 22px 24px 24px; }
.nt-side h2 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 20px; font-weight: 600; }
.nt-side h2 svg { color: #4f46e5; }
.nt-lead { margin: 14px 0 0; font-size: 15px; line-height: 1.5; color: #6b7185; }
.nt-pref { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 0 4px; }
.nt-pref.first { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line); }
.nt-pref strong { display: block; font-size: 15px; font-weight: 500; }
.nt-pref span { display: block; margin-top: 4px; font-size: 13px; color: #6b7185; }
.nt-manage { display: inline-flex; align-items: center; gap: 6px; width: 100%; margin-top: 18px; padding: 16px 0 0; border: 0; border-top: 1px solid var(--line); background: transparent; color: #4f46e5; font-size: 16px; font-weight: 500; text-align: left; }
.nt-manage:hover { text-decoration: underline; }
.nt-secure { display: flex; gap: 10px; margin: 16px 0 0; font-size: 13px; line-height: 1.5; color: #6b7185; }
.nt-secure svg { flex-shrink: 0; margin-top: 2px; }

.nt-switch { position: relative; width: 38px; height: 22px; flex-shrink: 0; padding: 0; border: 0; border-radius: 999px; background: #cfd3e3; transition: background .15s; }
.nt-switch span { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .15s; }
.nt-switch.on { background: #2f4bd6; }
.nt-switch.on span { transform: translateX(16px); }

@media (max-width: 960px) {
  .nt-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .nt-page { padding-left: 16px; padding-right: 16px; }
  .nt-top { flex-direction: column; }
  .nt-filters { flex-wrap: wrap; }
}
`;