import { useRef, useState } from "react";

const CATEGORIES = [
  "Leave & attendance",
  "Payroll & payslips",
  "Documents & letters",
  "Assets & equipment",
  "Employee records",
  "Other",
];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"];
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 10 * 1024 * 1024;

const QUICK_LINKS = [
  { label: "Leave & attendance policy", href: "#leave-attendance-policy" },
  { label: "Payroll & payslips", href: "#payroll-payslips" },
  { label: "Employee handbook", href: "#employee-handbook" },
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
const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);
const PhoneIcon = () => (
  <Icon>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Icon>
);
const ClockIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
const PinIcon = () => (
  <Icon>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);
const UploadIcon = () => (
  <Icon size={22}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </Icon>
);
const ShieldIcon = () => (
  <Icon>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const InfoIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);
const ExternalIcon = () => (
  <Icon size={14}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

const EMPTY = { category: "", priority: "Normal", subject: "", description: "" };

function Info({ icon, label, children, note }) {
  return (
    <div className="nh-info">
      <span className="nh-tile">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{children}</strong>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}

export default function NeedHelp({ onBack }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const takeFile = (f) => {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) return setFileError("Choose a PDF, JPG or PNG file.");
    if (f.size > MAX_SIZE) return setFileError("The file must be 10 MB or smaller.");
    setFileError("");
    setFile(f);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.category) next.category = "Select a category.";
    if (!form.subject.trim()) next.subject = "Enter a subject.";
    if (!form.description.trim()) next.description = "Describe what you need help with.";
    setErrors(next);
    if (Object.keys(next).length) return;
    /* Send `form` and `file` to your backend here. */
    setSent(true);
    setForm(EMPTY);
    setFile(null);
    window.scrollTo(0, 0);
  };

  return (
    <main className="nh-page">
      <style>{css}</style>

      <button type="button" className="nh-crumb" onClick={onBack}>
        <ArrowLeft /> Need help
      </button>
      <h1 className="nh-title">Need Help? Contact HR</h1>
      <p className="nh-lead">We’re here to help. Reach out to your HR team for support.</p>

      {sent && (
        <p className="nh-sent" role="status">
          Your request was sent. HR usually responds within 1 working day.
          <button type="button" onClick={() => setSent(false)} aria-label="Dismiss">×</button>
        </p>
      )}

      <div className="nh-grid">
        <div className="nh-col">
          <section className="nh-card">
            <h2>Your HR team</h2>
            <div className="nh-person">
              <span className="nh-avatar">H</span>
              <div>
                <strong>Haripriya</strong>
                <span>HR Admin</span>
              </div>
              <span className="nh-avail"><i /> Available</span>
            </div>
            <div className="nh-infos">
              <Info icon={<MailIcon />} label="Email us">hr@interfacely.com</Info>
              <Info icon={<PhoneIcon />} label="Call HR" note="Extension 102">+91 80 4567 8900</Info>
              <Info icon={<ClockIcon />} label="Working hours" note="Indian Standard Time (IST)">Monday – Friday, 9 AM – 6 PM</Info>
              <Info icon={<PinIcon />} label="Visit us" note="Hyderabad office">HR desk, 2nd floor</Info>
            </div>
          </section>

          <section className="nh-card">
            <h2>Looking for a quick answer?</h2>
            <ul className="nh-quick">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}<ExternalIcon /></a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <form className="nh-card nh-form" onSubmit={submit} noValidate>
          <h2>Send a support request</h2>
          <p className="nh-sub">Tell us what you need help with. We usually respond within 1 working day.</p>

          <div className="nh-row">
            <label className="nh-field">
              <span>Category *</span>
              <span className="nh-select">
                <select value={form.category} onChange={set("category")} className={form.category ? "" : "empty"} aria-invalid={!!errors.category}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <Chevron />
              </span>
              {errors.category && <em>{errors.category}</em>}
            </label>
            <label className="nh-field">
              <span>Priority *</span>
              <span className="nh-select">
                <select value={form.priority} onChange={set("priority")}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
                <Chevron />
              </span>
            </label>
          </div>

          <label className="nh-field">
            <span>Subject *</span>
            <input value={form.subject} onChange={set("subject")} placeholder="A short summary of your request" aria-invalid={!!errors.subject} />
            {errors.subject && <em>{errors.subject}</em>}
          </label>

          <label className="nh-field">
            <span>Description *</span>
            <textarea rows={4} value={form.description} onChange={set("description")} placeholder="Describe your concern and include any details that can help us support you…" aria-invalid={!!errors.description} />
            {errors.description && <em>{errors.description}</em>}
          </label>

          <div className="nh-field">
            <span>Attachment</span>
            <div
              className={`nh-drop ${dragging ? "drag" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current?.click())}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); takeFile(e.dataTransfer.files?.[0]); }}
            >
              <UploadIcon />
              <div>
                <b>{file ? file.name : "Click to upload or drag and drop"}</b>
                <small className={fileError ? "err" : ""}>{fileError || "PDF, JPG or PNG · Up to 10 MB · Optional"}</small>
              </div>
              {file && (
                <button type="button" className="nh-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => { takeFile(e.target.files?.[0]); e.target.value = ""; }}
              />
            </div>
          </div>

          <p className="nh-secure"><ShieldIcon /> Your request is confidential and will only be shared with the HR team.</p>

          <div className="nh-actions">
            <small>* Required fields</small>
            <button type="button" className="nh-cancel" onClick={onBack}>Cancel</button>
            <button type="submit" className="nh-submit">Submit request</button>
          </div>
        </form>
      </div>

      <p className="nh-urgent"><InfoIcon /> Need urgent assistance? Call HR directly during working hours.</p>
    </main>
  );
}

/* Page styles. Colour variables come from Dashboard.jsx. */
const css = `
.nh-page { padding: 20px 56px 28px 28px; display: flex; flex-direction: column; gap: 6px; }
.nh-crumb { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; border: 0; background: transparent; padding: 0; font-size: 20px; font-weight: 500; color: #3a3f58; }
.nh-crumb:hover { text-decoration: underline; }
.nh-title { margin: 6px 0 0; font-size: 32px; font-weight: 600; line-height: 1.2; }
.nh-lead { margin: 0 0 12px; font-size: 18px; color: #3a3f58; }
.nh-sent {
  display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 0 0 8px; padding: 12px 16px;
  background: var(--green-bg); color: var(--green); border-radius: 8px; font-size: 15px; font-weight: 500;
}
.nh-sent button { border: 0; background: transparent; color: inherit; font-size: 20px; line-height: 1; }

.nh-grid { display: grid; grid-template-columns: minmax(0, 350px) minmax(0, 1fr); gap: 24px; align-items: start; }
.nh-col { display: flex; flex-direction: column; gap: 20px; }
.nh-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 20px 24px 24px; }
.nh-card h2 { margin: 0 0 12px; font-size: 21px; font-weight: 600; }

.nh-person { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
.nh-avatar { width: 48px; height: 48px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: #ddd6fe; color: #2c3150; font-size: 18px; font-weight: 600; }
.nh-person strong { display: block; font-size: 18px; font-weight: 500; }
.nh-person div span { font-size: 16px; color: var(--muted); }
.nh-avail { margin-left: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #18734e; }
.nh-avail i { width: 8px; height: 8px; border-radius: 50%; background: #18734e; }

.nh-infos { display: flex; flex-direction: column; gap: 16px; padding-top: 16px; }
.nh-info { display: flex; gap: 12px; }
.nh-tile { width: 36px; height: 36px; flex-shrink: 0; display: grid; place-items: center; border-radius: 8px; background: #eef0ff; color: #4f46e5; }
.nh-info small { display: block; font-size: 13px; color: var(--muted); }
.nh-info strong { display: block; margin: 1px 0; font-size: 16px; font-weight: 500; }

.nh-quick { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.nh-quick a { display: flex; justify-content: space-between; align-items: center; color: #4f46e5; font-size: 16px; text-decoration: none; }
.nh-quick a:hover { text-decoration: underline; }

.nh-form { display: flex; flex-direction: column; gap: 14px; }
.nh-form h2 { margin: 0; }
.nh-sub { margin: -8px 0 0; font-size: 15px; color: var(--muted); }
.nh-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.nh-field { display: flex; flex-direction: column; gap: 6px; font-size: 16px; font-weight: 500; color: #1a2038; }
.nh-field em { font-style: normal; font-size: 13px; font-weight: 500; color: var(--red); }
.nh-field input, .nh-field textarea, .nh-select select {
  width: 100%; padding: 0 14px; background: #fff; color: var(--ink);
  border: 1px solid #e2e8f0; border-radius: 6px; font: inherit; font-size: 16px; font-weight: 400;
}
.nh-field input, .nh-select select { height: 46px; }
.nh-field textarea { padding: 12px 14px; resize: vertical; min-height: 116px; }
.nh-field input::placeholder, .nh-field textarea::placeholder, .nh-select select.empty { color: #8a90a6; }
.nh-field [aria-invalid="true"] { border-color: var(--red); }
.nh-field input:focus, .nh-field textarea:focus, .nh-select select:focus { border-color: #4f46e5; outline: 0; }
.nh-select { position: relative; display: block; }
.nh-select select { appearance: none; padding-right: 38px; }
.nh-select svg { position: absolute; right: 14px; top: 15px; color: #555b78; pointer-events: none; }

.nh-drop {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px; cursor: pointer;
  border: 1px dashed #cfd5e3; border-radius: 6px; color: #4f46e5;
}
.nh-drop:hover, .nh-drop.drag { background: #f7f8fc; border-color: #4f46e5; }
.nh-drop:focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; }
.nh-drop b { display: block; font-size: 16px; font-weight: 400; word-break: break-all; }
.nh-drop small { display: block; font-size: 13px; color: var(--muted); }
.nh-drop small.err { color: var(--red); }
.nh-remove { margin-left: auto; border: 0; background: transparent; color: var(--red); font-size: 14px; font-weight: 500; }

.nh-secure { display: flex; align-items: center; gap: 10px; margin: 0; padding: 12px 16px; background: #f7f8fc; border-radius: 6px; font-size: 14px; color: #4d5370; }
.nh-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.nh-actions small { margin-right: auto; font-size: 13px; color: var(--muted); }
.nh-cancel { height: 44px; padding: 0 20px; background: #fff; color: var(--ink); border: 1px solid #e2e8f0; border-radius: 6px; font-size: 16px; font-weight: 500; }
.nh-cancel:hover { background: #f7f8fc; }
.nh-submit { height: 44px; padding: 0 24px; background: #4f46e5; color: #fff; border: 0; border-radius: 6px; font-size: 16px; font-weight: 600; }
.nh-submit:hover { background: #4338ca; }

.nh-urgent { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; font-size: 15px; color: #4d5370; }

@media (max-width: 900px) {
  .nh-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .nh-page { padding-left: 16px; padding-right: 16px; }
  .nh-row { grid-template-columns: 1fr; }
}
`;