import { useEffect, useState } from "react";

const TIME_ZONES = ["(UTC+05:30) Kolkata", "(UTC+04:00) Dubai", "(UTC+00:00) London", "(UTC-05:00) New York"];
const DATE_FORMATS = ["DD / MM / YYYY", "MM / DD / YYYY", "YYYY / MM / DD"];

const NOTIFICATIONS = [
  { key: "email", title: "Email Notifications", text: "Receive important updates by email" },
  { key: "attendance", title: "Attendance Alerts", text: "Late arrivals and attendance exceptions" },
  { key: "leave", title: "Leave Request Notifications", text: "New requests and approval updates" },
  { key: "payroll", title: "Payroll Notifications", text: "Payroll processing and payslip alerts" },
  { key: "employees", title: "Employee Updates", text: "New joiners and profile changes" },
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
const Chevron = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
const EyeIcon = ({ off }) => (
  <Icon>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m4 4 16 16" />}
  </Icon>
);

function Field({ label, children }) {
  return (
    <label className="st-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SelectBox({ value, options, onChange, label }) {
  return (
    <span className="st-select">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Chevron />
    </span>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <span className="st-pass">
      <input type={show ? "text" : "password"} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        <EyeIcon off={!show} />
      </button>
    </span>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`st-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export default function Settings({ onBack }) {
  const [general, setGeneral] = useState({
    company: "Interfacely",
    email: "hr@uxinterfacely.com",
    phone: "+91 98765 43210",
    address: "Hyderabad, Telangana",
    timeZone: TIME_ZONES[0],
    dateFormat: DATE_FORMATS[0],
  });
  const [profile, setProfile] = useState({
    name: "Haripriya",
    email: "hr@uxinterfacely.com",
    phone: "+91 98765 43211",
    designation: "HR Administrator",
  });
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [notify, setNotify] = useState({ email: true, attendance: true, leave: false, payroll: false, employees: false });
  const [pass, setPass] = useState({ current: "", next: "", confirm: "" });
  const [twoFactor, setTwoFactor] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(""), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  const setG = (k) => (e) => setGeneral((g) => ({ ...g, [k]: e.target.value }));
  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));

  const saveGeneral = () => {
    setSaved(/^\S+@\S+\.\S+$/.test(general.email) ? "Changes saved." : "Enter a valid company email.");
  };

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return setPhotoError("Choose a JPG or PNG image.");
    if (file.size > 2 * 1024 * 1024) return setPhotoError("The image must be 2 MB or smaller.");
    setPhotoError("");
    setPhoto(URL.createObjectURL(file));
  };

  return (
    <main className="st-page">
      <style>{css}</style>

      <div className="st-crumbs">
        <button type="button" className="st-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="st-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Settings</span>
      </div>

      <div className="st-grid">
        {/* General */}
        <section className="st-card">
          <h2>General Settings</h2>
          <p className="st-sub">Your organization details and regional preferences.</p>
          <div className="st-form">
            <Field label="Company Name">
              <input value={general.company} onChange={setG("company")} />
            </Field>
            <Field label="Company Email">
              <input type="email" value={general.email} onChange={setG("email")} />
            </Field>
            <Field label="Contact Number">
              <input type="tel" value={general.phone} onChange={setG("phone")} />
            </Field>
            <Field label="Company Address">
              <input value={general.address} onChange={setG("address")} />
            </Field>
            <Field label="Time Zone">
              <SelectBox label="Time Zone" value={general.timeZone} options={TIME_ZONES} onChange={(v) => setGeneral((g) => ({ ...g, timeZone: v }))} />
            </Field>
            <Field label="Date Format">
              <SelectBox label="Date Format" value={general.dateFormat} options={DATE_FORMATS} onChange={(v) => setGeneral((g) => ({ ...g, dateFormat: v }))} />
            </Field>
          </div>
          <div className="st-actions">
            {saved && <span className="st-saved" role="status">{saved}</span>}
            <button type="button" className="st-save" onClick={saveGeneral}>Save Changes</button>
          </div>
        </section>

        {/* Profile */}
        <section className="st-card">
          <h2>Profile Settings</h2>
          <p className="st-sub">Manage your personal information and admin profile.</p>
          <div className="st-photo">
            {photo ? <img src={photo} alt="Admin profile" /> : <span className="st-initial">{profile.name.charAt(0) || "H"}</span>}
            <div>
              <strong>Admin Profile Picture</strong>
              <label className="st-change">
                Change photo
                <input type="file" accept="image/png,image/jpeg" onChange={pickPhoto} />
              </label>
              <small className={photoError ? "err" : ""}>{photoError || "JPG or PNG · Max. 2 MB"}</small>
            </div>
          </div>
          <div className="st-form">
            <Field label="Full Name">
              <input value={profile.name} onChange={setP("name")} />
            </Field>
            <Field label="Email Address">
              <input type="email" value={profile.email} onChange={setP("email")} />
            </Field>
            <Field label="Phone Number">
              <input type="tel" value={profile.phone} onChange={setP("phone")} />
            </Field>
            <Field label="Designation">
              <input value={profile.designation} onChange={setP("designation")} />
            </Field>
          </div>
        </section>

        {/* Notifications */}
        <section className="st-card">
          <h2>Notification Settings</h2>
          <p className="st-sub">Choose which updates you want to receive.</p>
          <ul className="st-list">
            {NOTIFICATIONS.map((n) => (
              <li key={n.key}>
                <div>
                  <strong>{n.title}</strong>
                  <span>{n.text}</span>
                </div>
                <Toggle label={n.title} on={notify[n.key]} onChange={(v) => setNotify((s) => ({ ...s, [n.key]: v }))} />
              </li>
            ))}
          </ul>
        </section>

        {/* Security */}
        <section className="st-card">
          <h2>Security Settings</h2>
          <p className="st-sub">Keep your account secure and protected.</p>
          <h3>Change Password</h3>
          <div className="st-form st-form-1">
            <Field label="Current Password">
              <PasswordInput value={pass.current} onChange={(v) => setPass((p) => ({ ...p, current: v }))} placeholder="Enter current password" />
            </Field>
          </div>
          <div className="st-form">
            <Field label="New Password">
              <PasswordInput value={pass.next} onChange={(v) => setPass((p) => ({ ...p, next: v }))} placeholder="Enter new password" />
            </Field>
            <Field label="Confirm Password">
              <PasswordInput value={pass.confirm} onChange={(v) => setPass((p) => ({ ...p, confirm: v }))} placeholder="Confirm password" />
            </Field>
          </div>
          <div className="st-twofa">
            <div>
              <strong>Two-Factor Authentication</strong>
              <span>Add an extra layer of account security.</span>
            </div>
            <Toggle label="Two-Factor Authentication" on={twoFactor} onChange={setTwoFactor} />
          </div>
        </section>
      </div>
    </main>
  );
}

/* Page styles. Colour variables come from Dashboard.jsx. */
const css = `
.st-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.st-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; }
.st-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.st-back { display: grid; place-items: center; }
.st-link:hover { text-decoration: underline; }

.st-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
.st-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px 20px; }
.st-card h2 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: -.2px; }
.st-card h3 { margin: 16px 0 6px; font-size: 21px; font-weight: 500; }
.st-sub { margin: 2px 0 14px; font-size: 15px; color: var(--muted); }

.st-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 16px; }
.st-form-1 { grid-template-columns: 1fr; margin-bottom: 14px; }
.st-field { display: flex; flex-direction: column; gap: 6px; font-size: 18px; font-weight: 500; color: #1a2038; }
.st-field input, .st-select select {
  width: 100%; height: 40px; padding: 0 12px; background: #fff; color: #555b78;
  border: 1px solid #e2e8f0; border-radius: 6px; font: inherit; font-size: 16px; font-weight: 400;
}
.st-field input:focus, .st-select select:focus { border-color: #6847d6; outline: 0; }
.st-select { position: relative; display: block; }
.st-select select { appearance: none; padding-right: 36px; }
.st-select svg { position: absolute; right: 12px; top: 12px; pointer-events: none; color: #555b78; }
.st-pass { position: relative; display: block; }
.st-pass input { padding-right: 42px; }
.st-pass button { position: absolute; right: 8px; top: 0; height: 40px; width: 30px; display: grid; place-items: center; border: 0; background: transparent; color: #555b78; }

.st-actions { display: flex; justify-content: flex-end; align-items: center; gap: 14px; margin-top: 22px; }
.st-saved { font-size: 15px; font-weight: 500; color: var(--green); }
.st-save {
  height: 44px; padding: 0 22px; background: #fff; color: #6847d6;
  border: 1px solid #6847d6; border-radius: 6px; font-size: 16px; font-weight: 500;
}
.st-save:hover { background: #f4f1fd; }

.st-photo { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
.st-photo img, .st-initial { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.st-initial { display: grid; place-items: center; background: #ddd6fe; color: #2c3150; font-size: 24px; font-weight: 600; }
.st-photo strong { display: block; font-size: 20px; font-weight: 500; }
.st-change { display: inline-block; margin: 2px 0; color: #2563eb; font-size: 16px; font-weight: 500; cursor: pointer; }
.st-change:hover { text-decoration: underline; }
.st-change input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.st-change:focus-within { outline: 2px solid var(--brand); outline-offset: 2px; }
.st-photo small { display: block; font-size: 13px; color: var(--muted); }
.st-photo small.err { color: var(--red); }

.st-list { list-style: none; margin: 0; padding: 0; }
.st-list li, .st-twofa { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 10px 0; }
.st-list li { border-bottom: 1px solid var(--line); }
.st-list li:last-child { border-bottom: 0; }
.st-list strong, .st-twofa strong { display: block; font-size: 18px; font-weight: 500; }
.st-list span, .st-twofa span { display: block; font-size: 16px; color: var(--muted); }
.st-twofa { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); }

.st-switch {
  position: relative; flex-shrink: 0; width: 36px; height: 24px; padding: 0;
  border: 0; border-radius: 12px; background: #d5dae4; transition: background .15s;
}
.st-switch span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .15s; }
.st-switch.on { background: #2563eb; }
.st-switch.on span { transform: translateX(12px); }

@media (max-width: 1000px) {
  .st-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .st-page { padding-left: 16px; padding-right: 16px; }
  .st-form { grid-template-columns: 1fr; }
}
`;