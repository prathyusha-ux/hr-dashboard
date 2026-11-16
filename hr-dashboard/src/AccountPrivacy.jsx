import { useEffect, useState } from "react";

const LANGUAGES = ["English (India)", "English (US)", "English (UK)", "Hindi"];
const ZONES = ["(GMT+05:30) Kolkata", "(GMT+04:00) Dubai", "(GMT+00:00) London", "(GMT-05:00) New York"];

/* Sample data. Replace with your API response later. */
const ACCOUNT = { name: "Haripriya", email: "haripriya@interfacely.com", employeeId: "UXII0021", role: "HR Admin" };
const START_SESSIONS = [
  { id: "chrome", device: "Chrome on Windows", place: "Bengaluru, India", when: "Active now", current: true, kind: "desktop" },
  { id: "safari", device: "Safari on iPhone", place: "Bengaluru, India", when: "2 hours ago", current: false, kind: "phone" },
];
const START_FORM = { language: LANGUAGES[0], zone: ZONES[0], showPhone: false, shareBirthday: true, signInAlerts: true };

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
const ArrowRight = () => (
  <Icon size={14}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
const Chevron = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
const CheckCircle = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </Icon>
);
const LockIcon = () => (
  <Icon size={18}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" />
  </Icon>
);
const ShieldIcon = () => (
  <Icon size={18}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const BellIcon = () => (
  <Icon size={18}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
  </Icon>
);
const MonitorIcon = () => (
  <Icon size={22}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </Icon>
);
const PhoneIcon = () => (
  <Icon size={22}>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <path d="M11 18h2" />
  </Icon>
);

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`ap-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

function Select({ value, options, onChange, label }) {
  return (
    <span className="ap-select">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Chevron />
    </span>
  );
}

/* onBack: back to the dashboard. onProfile / onNotifications: the other two tabs. */
export default function AccountPrivacy({ onBack, onProfile, onNotifications }) {
  const [form, setForm] = useState(START_FORM);
  const [saved, setSaved] = useState(START_FORM);
  const [sessions, setSessions] = useState(START_SESSIONS);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState({ text: "", tone: "ok" });

  useEffect(() => {
    if (!msg.text) return;
    const t = setTimeout(() => setMsg({ text: "", tone: "ok" }), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const say = (text, tone = "ok") => setMsg({ text, tone });

  const save = () => {
    setSaved(form);
    say("Changes saved.");
  };
  const cancel = () => {
    setForm(saved);
    setPwOpen(false);
    setPw({ current: "", next: "", confirm: "" });
    say("Changes discarded.");
  };

  const updatePassword = () => {
    if (!pw.current) return say("Enter your current password.", "err");
    if (pw.next.length < 8) return say("The new password must be at least 8 characters.", "err");
    if (pw.next !== pw.confirm) return say("The new passwords do not match.", "err");
    setPw({ current: "", next: "", confirm: "" });
    setPwOpen(false);
    say("Password updated. Connect your login system to make this permanent.");
  };

  const signOutOne = (id) => {
    setSessions((s) => s.filter((x) => x.id !== id));
    say("Signed out of that device.");
  };
  const signOutOthers = () => {
    setSessions((s) => s.filter((x) => x.current));
    say("Signed out of all other sessions.");
  };

  const others = sessions.filter((s) => !s.current).length;

  return (
    <main className="ap-page">
      <style>{css}</style>

      <button type="button" className="ap-crumb" onClick={onBack}>
        <ArrowLeft /> My account <span>/</span>Account &amp; Privacy
      </button>

      <div className="ap-top">
        <h1>Account &amp; Privacy</h1>
        <p>Manage your account, keep your sign-in secure and control your privacy.</p>
      </div>

      <nav className="ap-tabs" aria-label="Account sections">
        <button type="button" onClick={onProfile}>Profile</button>
        <button type="button" className="on" aria-current="page">Account &amp; security</button>
        <button type="button" onClick={onNotifications}>Notifications</button>
      </nav>

      <div className="ap-grid">
        <div className="ap-col">
          <section className="ap-card">
            <div className="ap-head">
              <h2>Account settings</h2>
              <span className="ap-pill">{ACCOUNT.role}</span>
            </div>
            <div className="ap-fields">
              <label className="ap-field">
                <span>Full name</span>
                <input value={ACCOUNT.name} readOnly />
              </label>
              <label className="ap-field">
                <span>Work email</span>
                <input value={ACCOUNT.email} readOnly />
              </label>
              <label className="ap-field">
                <span>Language</span>
                <Select value={form.language} options={LANGUAGES} onChange={set("language")} label="Language" />
              </label>
              <label className="ap-field">
                <span>Time zone</span>
                <Select value={form.zone} options={ZONES} onChange={set("zone")} label="Time zone" />
              </label>
            </div>
            <p className="ap-verified">
              <CheckCircle /> Work email verified · Employee ID {ACCOUNT.employeeId}
            </p>
          </section>

          <section className="ap-card">
            <h2>Sign-in &amp; security</h2>

            <div className="ap-row">
              <span className="ap-icon"><LockIcon /></span>
              <div className="ap-row-text">
                <strong>Password</strong>
                <span>Last updated 30 days ago</span>
              </div>
              <button type="button" className="ap-link" onClick={() => setPwOpen((o) => !o)}>
                {pwOpen ? "Close" : "Change password"}
              </button>
            </div>

            {pwOpen && (
              <div className="ap-pw">
                <input type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                <input type="password" placeholder="New password (8+ characters)" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                <input type="password" placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                <button type="button" className="ap-btn primary" onClick={updatePassword}>Update password</button>
              </div>
            )}

            <div className="ap-row">
              <span className="ap-icon"><ShieldIcon /></span>
              <div className="ap-row-text">
                <strong>Two-step verification</strong>
                <span className="ap-green">Enabled · Authenticator app</span>
              </div>
              <button type="button" className="ap-link" onClick={() => say("Two-step settings aren't connected yet.", "err")}>
                Manage
              </button>
            </div>

            <div className="ap-row">
              <span className="ap-icon"><BellIcon /></span>
              <div className="ap-row-text">
                <strong>New sign-in alerts</strong>
                <span>Email me when a new device signs in.</span>
              </div>
              <Toggle on={form.signInAlerts} onChange={set("signInAlerts")} label="New sign-in alerts" />
            </div>
          </section>
        </div>

        <div className="ap-col">
          <section className="ap-card">
            <h2>Privacy controls</h2>

            <div className="ap-row plain">
              <div className="ap-row-text">
                <strong>Show phone in employee directory</strong>
                <span>Let colleagues see your phone number.</span>
              </div>
              <Toggle on={form.showPhone} onChange={set("showPhone")} label="Show phone in employee directory" />
            </div>

            <div className="ap-row plain">
              <div className="ap-row-text">
                <strong>Share birthday with your team</strong>
                <span>Only the day and month will be visible.</span>
              </div>
              <Toggle on={form.shareBirthday} onChange={set("shareBirthday")} label="Share birthday with your team" />
            </div>

            <div className="ap-row plain last">
              <div className="ap-row-text">
                <strong>Your personal data</strong>
                <span>Request a copy of your account data.</span>
              </div>
              <button type="button" className="ap-link" onClick={() => say("Data export isn't connected yet.", "err")}>
                Export <ArrowRight />
              </button>
            </div>
          </section>

          <section className="ap-card">
            <div className="ap-head">
              <h2>Active sessions</h2>
              <span className="ap-count">{sessions.length}</span>
            </div>

            {sessions.map((s) => (
              <div className="ap-row plain session" key={s.id}>
                <span className="ap-device">{s.kind === "phone" ? <PhoneIcon /> : <MonitorIcon />}</span>
                <div className="ap-row-text">
                  <strong>{s.device}</strong>
                  <span>{s.place} · {s.when}</span>
                </div>
                {s.current ? (
                  <span className="ap-current">Current</span>
                ) : (
                  <button type="button" className="ap-link" onClick={() => signOutOne(s.id)}>Sign out</button>
                )}
              </div>
            ))}

            <button type="button" className="ap-link ap-others" onClick={signOutOthers} disabled={others === 0}>
              Sign out of all other sessions
            </button>
          </section>
        </div>
      </div>

      <div className="ap-footer">
        <span>Some of this information is visible to authorised HR staff.</span>
        <div className="ap-actions">
          {msg.text && (
            <span className={`ap-msg ${msg.tone}`} role="status">
              {msg.text}
            </span>
          )}
          <button type="button" className="ap-btn" onClick={cancel}>Cancel</button>
          <button type="button" className="ap-btn primary" onClick={save}>Save changes</button>
        </div>
      </div>
    </main>
  );
}

/* Page styles. Colour variables come from .app in Dashboard.jsx. */
const css = `
.ap-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.ap-crumb { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 0 0 0 10px; border: 0; background: transparent; font-size: 19px; font-weight: 500; color: #626979; }
.ap-crumb:hover { text-decoration: underline; }
.ap-crumb span { margin: 0 -4px 0 -2px; }
.ap-top { padding-left: 10px; }
.ap-top h1 { margin: 0; font-size: 26px; font-weight: 600; line-height: 1.2; color: #202432; }
.ap-top p { margin: 6px 0 0; font-size: 14px; color: #626979; font-weight: 400; }

.ap-tabs { display: flex; gap: 8px; margin-left: 10px; border-bottom: 1px solid var(--line); }
.ap-tabs button {
  margin-bottom: -1px; margin-right: 20px; padding: 8px 4px 10px; border: 0; border-bottom: 2px solid transparent;
  background: transparent; color: #555b78; font-size: 22px; font-weight: 400;
}
.ap-tabs button:hover { color: var(--ink); }
.ap-tabs button.on { color: #4f46e5; border-bottom-color: #4f46e5; }

.ap-grid { display: grid; grid-template-columns: minmax(0, 1.56fr) minmax(0, 1fr); gap: 26px; align-items: start; }
.ap-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ap-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 18px 24px 20px; }
.ap-card h2 { margin: 0; font-size: 22px; font-weight: 500; }
.ap-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.ap-pill { padding: 3px 10px; border-radius: 999px; background: #eef0ff; color: #4f46e5; font-size: 14px; font-weight: 500; }
.ap-count { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: #e4e8fb; color: #3a3f58; font-size: 13px; font-weight: 500; }

.ap-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; margin-top: 10px; }
.ap-field { display: flex; flex-direction: column; gap: 8px; font-size: 18px; font-weight: 500; }
.ap-field input, .ap-select select {
  width: 100%; height: 44px; padding: 0 12px; background: #f6f7fb; color: #4d5370;
  border: 1px solid #dfe2ec; border-radius: 6px; font-size: 13px; font-weight: 400;
}
.ap-field input:focus, .ap-select select:focus { outline: none; border-color: var(--brand); }
.ap-select { position: relative; display: block; }
.ap-select select { appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer; }
.ap-select svg { position: absolute; right: 12px; top: 14px; color: #4d5370; pointer-events: none; }
.ap-verified { display: flex; align-items: center; gap: 8px; margin: 14px 0 0; font-size: 14px; color: #4d5370; }
.ap-verified svg { color: var(--green); }

.ap-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.ap-row:last-child, .ap-row.last { border-bottom: 0; }
.ap-row.plain { padding: 12px 0; }
.ap-card h2 + .ap-row { margin-top: 6px; }
.ap-icon { width: 36px; height: 36px; flex-shrink: 0; display: grid; place-items: center; border-radius: 8px; background: #eef0fb; color: #4f46e5; }
.ap-row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.ap-row-text strong { font-size: 17px; font-weight: 500; }
.ap-row-text span { font-size: 14px; color: #6b7185; }
.ap-row-text .ap-green { color: var(--green); }
.ap-link { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; padding: 0; color: #2f3cd6; font-size: 14px; font-weight: 400; white-space: nowrap; }
.ap-link:hover:not(:disabled) { text-decoration: underline; }
.ap-link:disabled { color: #a3a8bd; cursor: not-allowed; }

.ap-pw { display: grid; grid-template-columns: 1fr; gap: 10px; padding: 4px 0 16px 50px; border-bottom: 1px solid var(--line); }
.ap-pw input { height: 40px; padding: 0 12px; border: 1px solid #dfe2ec; border-radius: 6px; font-size: 14px; background: #fff; }
.ap-pw input:focus { outline: none; border-color: var(--brand); }
.ap-pw .ap-btn { justify-self: start; }

.ap-switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; padding: 0; border: 0; border-radius: 999px; background: #cfd3e3; transition: background .15s; }
.ap-switch span { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }
.ap-switch.on { background: #2f4bd6; }
.ap-switch.on span { transform: translateX(16px); }

.ap-card .ap-row.plain:first-of-type { margin-top: 4px; }
.ap-device { width: 36px; flex-shrink: 0; display: grid; place-items: center; color: #4d5370; }
.ap-current { padding: 4px 12px; border-radius: 999px; background: var(--green-bg); color: var(--green); font-size: 14px; font-weight: 500; }
.session { border-bottom: 0; }
.ap-others { margin-top: 6px; padding-top: 14px; width: 100%; border-top: 1px solid var(--line); border-radius: 0; font-size: 15px; }

.ap-footer {
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 14px 24px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  font-size: 14px; color: #6b7185;
}
.ap-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ap-btn { height: 44px; padding: 0 32px; background: #fff; color: #4f46e5; border: 1px solid var(--line); border-radius: 6px; font-size: 16px; font-weight: 600; }
.ap-btn:hover { background: #f3f4fa; }
.ap-btn.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.ap-btn.primary:hover { background: #4338ca; }
.ap-msg { font-size: 14px; font-weight: 500; }
.ap-msg.ok { color: var(--green); }
.ap-msg.err { color: var(--red); }

@media (max-width: 960px) {
  .ap-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .ap-page { padding-left: 16px; padding-right: 16px; }
  .ap-fields { grid-template-columns: 1fr; }
  .ap-tabs button { font-size: 17px; margin-right: 8px; }
}
.ap-row.plain .ap-row-text strong { font-size: 18px; }
`;
