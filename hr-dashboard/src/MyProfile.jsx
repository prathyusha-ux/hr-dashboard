/* Sample profile. Replace with your API response later. */
const PROFILE = {
  name: "Haripriya",
  status: "Active",
  title: "HR Admin",
  department: "Human Resources",
  email: "hr@uxinterfacely.com",
  location: "Hyderabad, India",
  employeeId: "UXII0021",
  joined: "12 June 2023",
  phone: "+91 98765 43210",
  dob: "18 August 1996",
  gender: "Female",
  address: "Hyderabad, India",
  designation: "HR Administrator",
  employmentType: "Full-time",
  manager: "Suresh Kumar",
  workLocation: "Bengaluru office",
  passwordUpdated: "Last updated 30 days ago",
  twoStep: true,
  role: "HR Admin",
  roleText: "Manage employees, maintain HR records and oversee employee assets.",
};

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
const MailIcon = () => (
  <Icon size={16}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);
const PinIcon = () => (
  <Icon size={16}>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);
const CameraIcon = () => (
  <Icon size={14}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
);
const ShieldIcon = () => (
  <Icon size={15}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const ArrowRight = () => (
  <Icon size={14}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

function Field({ label, value }) {
  return (
    <div className="mp-field">
      <strong>{label}</strong>
      <span>{value || "—"}</span>
    </div>
  );
}

/* onBack: back to the dashboard. onSettings: opens the Settings page, where profile, security and notifications are edited. */
export default function MyProfile({ onBack, onSettings, onAccount, onEdit, profile, note }) {
  const p = { ...PROFILE, ...(profile || {}) };

  return (
    <main className="mp-page">
      <style>{css}</style>

      <button type="button" className="mp-crumb" onClick={onBack}>
        <ArrowLeft /> My account <span>/</span> Profile
      </button>

      {note && (
        <div className="mp-note" role="status">
          {note}
        </div>
      )}

      <div className="mp-top">
        <div>
          <h1>My profile</h1>
          <p>View and manage your personal and professional information.</p>
        </div>
        <button type="button" className="mp-edit" onClick={onEdit || onSettings}>Edit profile</button>
      </div>

      <section className="mp-hero">
        <div className="mp-avatar-wrap">
          <span className="mp-avatar">{p.photo ? <img src={p.photo} alt="Your profile" /> : p.name.charAt(0)}</span>
          <button type="button" className="mp-camera" onClick={onEdit || onSettings} aria-label="Change profile photo">
            <CameraIcon />
          </button>
        </div>
        <div className="mp-who">
          <h2>
            {p.name} <span className="mp-pill">{p.status}</span>
          </h2>
          <p className="mp-role">{p.title} · {p.department}</p>
          <p className="mp-meta">
            <span><MailIcon /> {p.email}</span>
            <span><PinIcon /> {p.location}</span>
          </p>
        </div>
        <div className="mp-id">
          <strong>Employee ID</strong>
          <span className="mp-id-num">{p.employeeId}</span>
          <span>Joined {p.joined}</span>
        </div>
      </section>

      <nav className="mp-tabs" aria-label="Account sections">
        <button type="button" className="on" aria-current="page">Profile</button>
        <button type="button" onClick={onAccount || onSettings}>Account &amp; security</button>
        <button type="button" onClick={onSettings}>Notifications</button>
      </nav>

      <div className="mp-grid">
        <section className="mp-card">
          <h2>Personal information</h2>
          <div className="mp-fields">
            <Field label="Full name" value={p.name} />
            <Field label="Work email" value={p.email} />
            <Field label="Phone number" value={p.phone} />
            <Field label="Date of birth" value={p.dob} />
            <Field label="Gender" value={p.gender} />
            <Field label="Address" value={p.address} />
          </div>
        </section>

        <section className="mp-card">
          <h2>Employment details</h2>
          <div className="mp-fields">
            <Field label="Department" value={p.department} />
            <Field label="Designation" value={p.designation} />
            <Field label="Employment type" value={p.employmentType} />
            <Field label="Date of joining" value={p.joined} />
            <Field label="Reporting manager" value={p.manager} />
            <Field label="Work location" value={p.workLocation} />
          </div>
        </section>

        <section className="mp-card mp-short">
          <div className="mp-card-head">
            <h2>Account security</h2>
            <button type="button" className="mp-link" onClick={onAccount || onSettings}>
              Manage security <ArrowRight />
            </button>
          </div>
          <div className="mp-fields">
            <div className="mp-field">
              <strong>Password</strong>
              <span className="mp-dark">{p.passwordUpdated}</span>
            </div>
            <div className="mp-field">
              <strong>Two-step verification</strong>
              <span className={p.twoStep ? "mp-enabled" : "mp-dark"}>
                {p.twoStep ? <><ShieldIcon /> Enabled</> : "Not enabled"}
              </span>
            </div>
          </div>
        </section>

        <section className="mp-card mp-short">
          <div className="mp-card-head">
            <h2>Role &amp; permissions</h2>
            <span className="mp-role-pill">{p.role}</span>
          </div>
          <p className="mp-roletext">{p.roleText}</p>
        </section>
      </div>
    </main>
  );
}

/* Page styles. Colour variables come from Dashboard.jsx. */
const css = `
.mp-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.mp-crumb { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 0 0 0 10px; border: 0; background: transparent; font-size: 20px; font-weight: 500; color: #3a3f58; }
.mp-crumb:hover { text-decoration: underline; }
.mp-crumb span { margin: 0 -2px; }

.mp-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-left: 10px; }
.mp-top h1 { margin: 0; font-size: 32px; font-weight: 600; line-height: 1.2; }
.mp-top p { margin: 6px 0 0; font-size: 15px; color: #4d5370; }
.mp-edit { height: 44px; padding: 0 31px; background: #4f46e5; color: #fff; border: 0; border-radius: 6px; font-size: 15px; font-weight: 600; }
.mp-edit:hover { background: #4338ca; }

.mp-hero {
  display: flex; align-items: center; gap: 24px; padding: 22px 24px;
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
}
.mp-avatar-wrap { position: relative; flex-shrink: 0; }
.mp-note { margin-left: 10px; padding: 12px 16px; border-radius: 8px; background: var(--green-bg); color: var(--green); font-size: 15px; font-weight: 500; }
.mp-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.mp-avatar { overflow: hidden; width: 96px; height: 96px; display: grid; place-items: center; border-radius: 50%; background: #ddd6fe; color: #2c3150; font-size: 36px; font-weight: 600; }
.mp-camera {
  position: absolute; right: -2px; bottom: 0; width: 26px; height: 26px; display: grid; place-items: center;
  border: 2px solid #fff; border-radius: 50%; background: #4f46e5; color: #fff; padding: 0;
}
.mp-who { flex: 1; min-width: 0; }
.mp-who h2 { margin: 0; font-size: 28px; font-weight: 500; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mp-pill { padding: 2px 10px; border-radius: 999px; background: var(--green-bg); color: var(--green); font-size: 12px; font-weight: 500; }
.mp-role { margin: 6px 0 0; font-size: 19px; color: #555b78; }
.mp-meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin: 6px 0 0; font-size: 16px; color: #555b78; }
.mp-meta span { display: inline-flex; align-items: center; gap: 8px; }
.mp-id { align-self: stretch; display: flex; flex-direction: column; justify-content: center; gap: 6px; min-width: 190px; padding-left: 24px; border-left: 1px solid var(--line); font-size: 17px; color: #555b78; }
.mp-id strong { font-size: 20px; font-weight: 500; color: var(--ink); }
.mp-id-num { color: #3a3f58; }

.mp-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--line); }
.mp-tabs button {
  margin-bottom: -1px; padding: 8px 4px 10px; border: 0; border-bottom: 2px solid transparent;
  background: transparent; color: #555b78; font-size: 22px; font-weight: 400; margin-right: 20px;
}
.mp-tabs button:hover { color: var(--ink); }
.mp-tabs button.on { color: #4f46e5; border-bottom-color: #4f46e5; }

.mp-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: start; }
.mp-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 18px 24px 22px; }
.mp-card h2 { margin: 0; font-size: 22px; font-weight: 500; }
.mp-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 24px; margin-top: 18px; }
.mp-field strong { display: block; font-size: 18px; font-weight: 500; }
.mp-field span { display: block; margin-top: 6px; font-size: 16px; color: #6b7280; }
.mp-field span.mp-dark { color: var(--ink); font-size: 15px; }
.mp-field span.mp-enabled { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-size: 15px; font-weight: 500; }

.mp-short { padding-top: 16px; padding-bottom: 18px; }
.mp-card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.mp-short .mp-fields { margin-top: 12px; gap: 12px 24px; }
.mp-link { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; padding: 0; color: #4f46e5; font-size: 14px; font-weight: 500; }
.mp-link:hover { text-decoration: underline; }
.mp-role-pill { padding: 4px 10px; border-radius: 6px; background: #eef0ff; color: #4f46e5; font-size: 14px; font-weight: 500; }
.mp-roletext { margin: 12px 0 0; font-size: 18px; line-height: 1.6; color: #6b7280; }

@media (max-width: 960px) {
  .mp-grid { grid-template-columns: 1fr; }
  .mp-hero { flex-wrap: wrap; }
  .mp-id { border-left: 0; padding-left: 0; }
}
@media (max-width: 720px) {
  .mp-page { padding-left: 16px; padding-right: 16px; }
  .mp-fields { grid-template-columns: 1fr; }
  .mp-tabs button { font-size: 17px; margin-right: 8px; }
}
`;