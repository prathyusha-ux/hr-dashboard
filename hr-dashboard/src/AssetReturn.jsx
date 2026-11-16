import { useState } from "react";
import AssetPicture from "./AssetPicture.jsx";

const REASONS = ["Employee exit", "Upgrade or replacement", "Role or team change", "Damaged or faulty", "No longer needed", "Other"];
const TIME_SLOTS = ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM", "02:00 PM – 03:00 PM", "03:00 PM – 04:00 PM", "04:00 PM – 05:00 PM"];
const LOCATIONS = ["Hyderabad office", "Bengaluru office"];
const TEAMS = ["IT Team", "Admin Team"];

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
const InfoIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);
const ClipboardIcon = () => (
  <Icon>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1M9 13l2 2 4-4" />
  </Icon>
);

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function Select({ value, onChange, options, placeholder, invalid, label }) {
  return (
    <span className="ar-select">
      <select value={value} onChange={onChange} className={value ? "" : "empty"} aria-label={label} aria-invalid={invalid}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <Chevron />
    </span>
  );
}

export default function AssetReturn({ asset, mode, employee, onBack, onAssets, onDashboard }) {
  const [form, setForm] = useState({
    reason: "",
    date: "",
    time: "",
    method: "Office handover",
    location: LOCATIONS[0],
    team: TEAMS[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
    setSent(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.reason) next.reason = "Select a reason.";
    if (!form.date) next.date = "Choose a return date.";
    else if (form.date < todayISO()) next.date = "The date can't be in the past.";
    if (!form.time) next.time = "Select a time slot.";
    setErrors(next);
    if (Object.keys(next).length) return;
    /* Send `form` to your backend here. */
    setSent(true);
    window.scrollTo(0, 0);
  };

  const person = asset.assignee;

  return (
    <main className="ar-page">
      <style>{css}</style>

      <div className="ar-crumbs">
        <button type="button" className="ar-back" onClick={onBack} aria-label="Back to asset">
          <ArrowLeft />
        </button>
        <button type="button" className="ar-link" onClick={onDashboard}>Dashboard</button>
        <span>/</span>
        <span>
          <button type="button" className="ar-link" onClick={onAssets}>Assets</button>
          /{mode === "add" ? "Add asset" : asset.id}/Initiate Asset Return
        </span>
      </div>

      <section className="ar-hero">
        <div>
          <h1>Initiate Return</h1>
          <p>Schedule a handover and request employee acknowledgement.</p>
        </div>
        <span className="ar-chip">{asset.id}</span>
      </section>

      {sent && (
        <p className="ar-sent" role="status">
          Return request sent to {person} and the {form.team}. The asset stays assigned until the return is completed.
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <div className="ar-grid">
          <section className="ar-card">
            <h2>Return request details</h2>

            <label className="ar-field">
              <span>Reason for return *</span>
              <Select label="Reason for return" value={form.reason} onChange={set("reason")} options={REASONS} placeholder="Select a reason" invalid={!!errors.reason} />
              {errors.reason && <em>{errors.reason}</em>}
            </label>

            <div className="ar-row">
              <label className="ar-field">
                <span>Preferred return date *</span>
                <input type="date" value={form.date} min={todayISO()} onChange={set("date")} aria-invalid={!!errors.date} />
                {errors.date && <em>{errors.date}</em>}
              </label>
              <label className="ar-field">
                <span>Preferred time *</span>
                <Select label="Preferred time" value={form.time} onChange={set("time")} options={TIME_SLOTS} placeholder="Select a time slot" invalid={!!errors.time} />
                {errors.time && <em>{errors.time}</em>}
              </label>
            </div>

            <fieldset className="ar-field ar-methods">
              <legend>Handover method *</legend>
              <div className="ar-row">
                {["Office handover", "Arrange collection"].map((m) => (
                  <label key={m} className={`ar-radio ${form.method === m ? "on" : ""}`}>
                    <input type="radio" name="method" value={m} checked={form.method === m} onChange={set("method")} />
                    <i />
                    {m}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="ar-row">
              <label className="ar-field">
                <span>Handover location *</span>
                <Select label="Handover location" value={form.location} onChange={set("location")} options={LOCATIONS} />
              </label>
              <label className="ar-field">
                <span>Receiving team *</span>
                <Select label="Receiving team" value={form.team} onChange={set("team")} options={TEAMS} />
              </label>
            </div>

            <label className="ar-field">
              <span>Handover instructions / notes (optional)</span>
              <input value={form.notes} onChange={set("notes")} placeholder="Add a meeting point, collection details or accessories to return…" />
            </label>

            <p className="ar-note"><InfoIcon /> The schedule will be shared with {person} and the IT team. All times are in IST.</p>
          </section>

          <aside className="ar-side">
            <section className="ar-card">
              <h2 className="ar-h-sm">Asset to be returned</h2>
              <div className="ar-asset">
                <div className="ar-thumb"><AssetPicture category={asset.category} /></div>
                <div>
                  <strong>{asset.name}</strong>
                  <span>{asset.id} · {asset.category}</span>
                </div>
              </div>
              <div className="ar-asset-foot">
                <span className="ar-pill">{asset.status}</span>
                <span>Company-owned</span>
              </div>
            </section>

            <section className="ar-card">
              <h2 className="ar-h-md">Assigned employee</h2>
              <div className="ar-person">
                <span className="ar-avatar">{person.charAt(0)}</span>
                <div>
                  <strong>{person}</strong>
                  <span>{employee?.role || "—"}</span>
                </div>
              </div>
              <strong className="ar-label">Employee ID / Arrangement</strong>
              <span className="ar-val">{employee?.empId || "—"}</span>
              <strong className="ar-label">Assigned on</strong>
              <span className="ar-val">{asset.date || "—"}</span>
            </section>

            <section className="ar-next">
              <h2><ClipboardIcon /> What happens next?</h2>
              <p>{person} must acknowledge the return request and handover details.</p>
              <p>After handover, IT checks the asset’s condition before completing the return.</p>
              <p className="ar-strong">The asset remains assigned until the return is completed.</p>
            </section>
          </aside>
        </div>

        <div className="ar-foot">
          <small>This sends a return request. It does not mark the asset as returned.</small>
          <button type="button" className="ar-cancel" onClick={onBack}>Cancel</button>
          <button type="submit" className="ar-save">Save changes</button>
        </div>
      </form>
    </main>
  );
}

/* Page styles. Colour variables come from Dashboard.jsx. */
const css = `
.ar-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.ar-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; flex-wrap: wrap; }
.ar-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.ar-back { display: grid; place-items: center; }
.ar-link:hover { text-decoration: underline; }

.ar-hero {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  padding: 14px 20px 16px; background: #ece8fb; border-radius: 12px;
}
.ar-hero h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.2; }
.ar-hero p { margin: 6px 0 0; font-size: 17px; color: #4d5370; }
.ar-chip { padding: 8px 12px; background: #fff; color: #4f46e5; border-radius: 6px; font-size: 14px; font-weight: 600; }
.ar-sent { margin: 0; padding: 12px 16px; background: var(--green-bg); color: var(--green); border-radius: 8px; font-size: 15px; font-weight: 500; }

.ar-grid { display: grid; grid-template-columns: minmax(0, 1fr) 263px; gap: 16px; align-items: start; }
.ar-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px 16px; }
.ar-card > h2 { margin: 0 0 8px; font-size: 22px; font-weight: 500; }
.ar-card > h2.ar-h-sm { font-size: 20px; }
.ar-card > h2.ar-h-md { font-size: 22px; }

.ar-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.ar-field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 10px; padding: 0; border: 0; min-width: 0; font-size: 18px; font-weight: 500; color: #1a2038; }
.ar-field legend { padding: 0; margin-bottom: 8px; font-size: 18px; font-weight: 500; }
.ar-field em { font-style: normal; font-size: 13px; font-weight: 500; color: var(--red); }
.ar-field input[type="date"], .ar-field input:not([type]), .ar-select select {
  width: 100%; height: 40px; padding: 0 12px; background: #fff; color: #555b78;
  border: 1px solid #e2e8f0; border-radius: 6px; font: inherit; font-size: 17px; font-weight: 400;
}
.ar-field input:not([type]) { height: 36px; font-size: 15px; }
.ar-field input::placeholder { color: #6f7590; }
.ar-select select.empty { color: #6f7590; }
.ar-field [aria-invalid="true"] { border-color: var(--red); }
.ar-field input:focus, .ar-select select:focus { border-color: #6847d6; outline: 0; }
.ar-select { position: relative; display: block; }
.ar-select select { appearance: none; padding-right: 36px; }
.ar-select svg { position: absolute; right: 12px; top: 12px; color: #555b78; pointer-events: none; }

.ar-methods .ar-row { gap: 16px; }
.ar-radio {
  position: relative; display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 12px;
  border: 1px solid #e2e8f0; border-radius: 6px; font-size: 17px; font-weight: 400; color: #555b78; cursor: pointer;
}
.ar-radio input { position: absolute; opacity: 0; }
.ar-radio i { width: 16px; height: 16px; border: 1.5px solid #c3c8d6; border-radius: 50%; flex-shrink: 0; background: #fff; }
.ar-radio.on { background: #ece8fb; border-color: #6847d6; color: #1a2038; font-size: 15px; }
.ar-radio.on i { border: 5px solid #6847d6; }
.ar-radio:focus-within { outline: 2px solid #6847d6; outline-offset: 2px; }

.ar-note { display: flex; align-items: center; gap: 10px; margin: 6px 0 0; font-size: 15px; color: #4d5370; }

.ar-side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ar-asset { display: flex; align-items: center; gap: 12px; }
.ar-thumb { width: 72px; flex-shrink: 0; border-radius: 6px; overflow: hidden; line-height: 0; }
.ar-asset strong { display: block; font-size: 15px; font-weight: 600; }
.ar-asset span { display: block; margin-top: 4px; font-size: 13px; color: var(--muted); }
.ar-asset-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 13px; color: var(--muted); }
.ar-pill { padding: 3px 10px; border-radius: 999px; background: var(--green-bg); color: var(--green); font-size: 13px; font-weight: 500; }
.ar-person { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.ar-avatar { width: 44px; height: 44px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: #ddd6fe; color: #2c3150; font-size: 18px; font-weight: 600; }
.ar-person strong { display: block; font-size: 20px; font-weight: 400; }
.ar-person span { display: block; font-size: 15px; color: var(--muted); }
.ar-label { display: block; margin-top: 10px; font-size: 18px; font-weight: 500; }
.ar-val { display: block; margin-top: 4px; font-size: 15px; color: #555b78; }

.ar-next { padding: 14px 16px 16px; background: #ece8fb; border-radius: 12px; }
.ar-next h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; font-size: 15px; font-weight: 600; color: var(--ink); }
.ar-next h2 svg { color: #4f46e5; }
.ar-next p { margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: #555b78; }
.ar-next p.ar-strong { margin: 0; color: #4f46e5; font-weight: 500; }

.ar-foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 16px;
  padding: 14px 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
}
.ar-foot small { margin-right: auto; font-size: 13px; color: #4d5370; }
.ar-cancel { height: 44px; padding: 0 22px; background: #fff; color: var(--ink); border: 1px solid #e2e8f0; border-radius: 6px; font-size: 16px; font-weight: 500; }
.ar-cancel:hover { background: #f7f8fc; }
.ar-save { height: 44px; padding: 0 24px; background: #6847d6; color: #fff; border: 0; border-radius: 6px; font-size: 16px; font-weight: 600; }
.ar-save:hover { background: #5a3bc4; }

@media (max-width: 960px) {
  .ar-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .ar-page { padding-left: 16px; padding-right: 16px; }
  .ar-row { grid-template-columns: 1fr; }
  .ar-foot { flex-wrap: wrap; }
}
`;