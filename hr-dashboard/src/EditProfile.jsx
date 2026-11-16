import { useRef, useState } from "react";

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

/* Employment details are maintained by HR, so they are shown read-only.
   Sample data. Replace with your API response later. */
const EMPLOYMENT = {
  employeeId: "UXII0021",
  joined: "12 June 2023",
  department: "Human Resources",
  designation: "HR Administrator",
  employmentType: "Full-time",
  manager: "Suresh Kumar",
  workLocation: "Bengaluru office",
  role: "HR Admin",
  roleText: "Manage employees, maintain HR records and oversee employee assets.",
};
const WORK_EMAIL = "hr@uxinterfacely.com";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* "18 August 1996" -> "1996-08-18" (for the date input) and back. */
const toIso = (text) => {
  const m = /^(\d{1,2}) (\w+) (\d{4})$/.exec(text || "");
  if (!m) return "";
  const mi = MONTHS.indexOf(m[2]);
  return mi < 0 ? "" : `${m[3]}-${String(mi + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
};
const toText = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
};

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const ArrowLeft = ({ size }) => (
  <Icon size={size}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);
const LockIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
const InfoIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);
const ShieldIcon = () => (
  <Icon size={16}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const Chevron = () => (
  <Icon size={16}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

function Read({ label, value }) {
  return (
    <div className="ep-read">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

/* profile: current values { name, phone, dob, gender, address, photo }.
   onBack: back to My profile. onSave(values): called with the edited values. */
export default function EditProfile({ profile, onBack, onSave }) {
  const [f, setF] = useState({
    name: profile.name,
    phone: profile.phone,
    dob: toIso(profile.dob),
    gender: profile.gender,
    address: profile.address,
  });
  const [photo, setPhoto] = useState(profile.photo || "");
  const [photoError, setPhotoError] = useState("");
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const text = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return setPhotoError("Choose a JPG or PNG image.");
    if (file.size > 5 * 1024 * 1024) return setPhotoError("The image must be 5 MB or smaller.");
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!f.name.trim()) next.name = "Enter your full name.";
    if (!/^\+?[\d\s-]{7,}$/.test(f.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!f.dob) next.dob = "Choose your date of birth.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({
      name: f.name.trim(),
      phone: f.phone.trim(),
      dob: toText(f.dob),
      gender: f.gender,
      address: f.address.trim(),
      photo,
    });
  };

  return (
    <form className="ep-page" onSubmit={submit} noValidate>
      <style>{css}</style>

      <button type="button" className="ep-crumb" onClick={onBack}>
        <ArrowLeft /> Profile <span>/</span>Edit Profile
      </button>

      <div className="ep-top">
        <div>
          <h1>Edit profile</h1>
          <p>Update your photo, personal details and contact information.</p>
        </div>
        <button type="button" className="ep-back" onClick={onBack}>
          <ArrowLeft size={16} /> Back to profile
        </button>
      </div>

      <section className="ep-hero">
        <span className="ep-photo">
          {photo ? <img src={photo} alt="Your profile" /> : (f.name.trim().charAt(0) || "H").toUpperCase()}
        </span>
        <div className="ep-who">
          <h2>
            {f.name.trim() || profile.name} <span className="ep-active">Active</span>
          </h2>
          <p>{EMPLOYMENT.role} · {EMPLOYMENT.department}</p>
          <p className="ep-loc">{f.address.trim() || "—"}</p>
        </div>
        <div className="ep-upload">
          <button type="button" className="ep-photo-btn" onClick={() => fileRef.current?.click()}>
            Update photo
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={pickPhoto} />
          <span className="ep-hint">JPG or PNG · Up to 5 MB</span>
          {photoError && <span className="ep-error">{photoError}</span>}
        </div>
      </section>

      <div className="ep-grid">
        <section className="ep-card">
          <h2>Personal information</h2>
          <p className="ep-sub">Keep your personal and contact details up to date.</p>

          <div className="ep-fields">
            <label className="ep-field">
              <span>Full name</span>
              <input className={errors.name ? "err" : ""} value={f.name} onChange={text("name")} />
              {errors.name && <em className="ep-error">{errors.name}</em>}
            </label>

            <label className="ep-field">
              <span>Work email</span>
              <span className="ep-locked">
                <input value={WORK_EMAIL} readOnly />
                <LockIcon />
              </span>
            </label>

            <label className="ep-field">
              <span>Phone number</span>
              <input className={errors.phone ? "err" : ""} type="tel" value={f.phone} onChange={text("phone")} />
              {errors.phone && <em className="ep-error">{errors.phone}</em>}
            </label>

            <label className="ep-field">
              <span>Date of birth</span>
              <input className={errors.dob ? "err" : ""} type="date" value={f.dob} onChange={text("dob")} />
              {errors.dob && <em className="ep-error">{errors.dob}</em>}
            </label>

            <label className="ep-field">
              <span>Gender</span>
              <span className="ep-select">
                <select value={f.gender} onChange={text("gender")}>
                  {GENDERS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <Chevron />
              </span>
            </label>

            <label className="ep-field">
              <span>Address</span>
              <input value={f.address} onChange={text("address")} />
            </label>
          </div>

          <p className="ep-info">
            <InfoIcon /> Work email is managed by your organization. Contact HR to request a change.
          </p>
        </section>

        <div className="ep-col">
          <section className="ep-card">
            <div className="ep-head">
              <h2>Employment details</h2>
              <span className="ep-ro"><LockIcon size={14} /> Read only</span>
            </div>
            <div className="ep-reads">
              <Read label="Employee ID" value={EMPLOYMENT.employeeId} />
              <Read label="Date of joining" value={EMPLOYMENT.joined} />
              <Read label="Department" value={EMPLOYMENT.department} />
              <Read label="Designation" value={EMPLOYMENT.designation} />
              <Read label="Employment type" value={EMPLOYMENT.employmentType} />
              <Read label="Reporting manager" value={EMPLOYMENT.manager} />
              <Read label="Work location" value={EMPLOYMENT.workLocation} />
            </div>
            <p className="ep-small">These details are maintained by HR and can’t be edited here.</p>
          </section>

          <section className="ep-card">
            <div className="ep-head">
              <h2>Role &amp; permissions</h2>
              <span className="ep-role">{EMPLOYMENT.role}</span>
            </div>
            <p className="ep-roletext">{EMPLOYMENT.roleText}</p>
          </section>
        </div>
      </div>

      <div className="ep-footer">
        <span className="ep-priv">
          <ShieldIcon /> Your employment records remain visible only to authorized HR staff.
        </span>
        <div className="ep-actions">
          <button type="button" className="ep-btn" onClick={onBack}>Cancel</button>
          <button type="submit" className="ep-btn primary">Save changes</button>
        </div>
      </div>
    </form>
  );
}

/* Page styles. Colour variables come from .app in Dashboard.jsx. */
const css = `
.ep-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.ep-crumb { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 0 0 0 10px; border: 0; background: transparent; font-size: 18px; font-weight: 500; color: #626979; }
.ep-crumb:hover { text-decoration: underline; }
.ep-crumb span { margin: 0 -4px 0 -2px; }
.ep-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-left: 10px; }
.ep-top h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.2; color: #202432; }
.ep-top p { margin: 6px 0 0; font-size: 16px; color: #4d5370; font-weight: 400; }
.ep-back { display: inline-flex; align-items: center; gap: 8px; margin-top: 10px; padding: 0; border: 0; background: transparent; color: #2f3cd6; font-size: 16px; font-weight: 500; }
.ep-back:hover { text-decoration: underline; }

.ep-hero { display: flex; align-items: center; gap: 24px; padding: 22px 24px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
.ep-photo { width: 96px; height: 96px; flex-shrink: 0; display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: #ddd6fe; color: #2c3150; font-size: 36px; font-weight: 600; }
.ep-photo img { width: 100%; height: 100%; object-fit: cover; }
.ep-who { flex: 1; min-width: 0; }
.ep-who h2 { margin: 0; font-size: 25px; font-weight: 500; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ep-active { padding: 2px 10px; border-radius: 999px; background: var(--green-bg); color: var(--green); font-size: 12px; font-weight: 500; }
.ep-who p { margin: 6px 0 0; font-size: 16px; color: #555b78; }
.ep-who .ep-loc { font-size: 14px; color: #6b7185; }
.ep-upload { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.ep-photo-btn { height: 44px; padding: 0 12px; background: #fff; color: var(--ink); border: 1px solid var(--line); border-radius: 6px; font-size: 18px; font-weight: 400; }
.ep-photo-btn:hover { background: #f3f4fa; }
.ep-hint { font-size: 14px; color: #6b7185; }

.ep-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 24px; align-items: start; }
.ep-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ep-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 22px 24px 24px; }
.ep-card h2 { margin: 0; font-size: 20px; font-weight: 500; }
.ep-sub { margin: 14px 0 0; font-size: 14px; color: #6b7185; }
.ep-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.ep-ro { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: #6b7185; }
.ep-role { padding: 4px 8px; border-radius: 6px; background: #eef0ff; color: #4f46e5; font-size: 14px; font-weight: 500; }
.ep-roletext { margin: 18px 0 0; font-size: 16px; line-height: 1.6; color: #6b7185; }

.ep-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px; margin-top: 18px; }
.ep-field { display: flex; flex-direction: column; gap: 8px; font-size: 17px; font-weight: 500; min-width: 0; }
.ep-field input, .ep-select select {
  width: 100%; height: 44px; padding: 0 12px; background: #fff; color: #555b78;
  border: 1px solid #dfe2ec; border-radius: 6px; font-size: 15px; font-weight: 400;
}
.ep-field input:focus, .ep-select select:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(74, 63, 219, .12); }
.ep-field input.err { border-color: var(--red); }
.ep-locked { position: relative; display: block; }
.ep-locked input { background: #f3f4f8; padding-right: 40px; cursor: not-allowed; }
.ep-locked svg { position: absolute; right: 14px; top: 14px; color: #555b78; }
.ep-select { position: relative; display: block; }
.ep-select select { appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer; }
.ep-select svg { position: absolute; right: 12px; top: 14px; color: #4d5370; pointer-events: none; }
.ep-error { font-size: 13px; font-style: normal; font-weight: 400; color: var(--red); }
.ep-info { display: flex; align-items: center; gap: 10px; margin: 20px 0 0; padding: 14px 16px; background: #f3f4f8; border-radius: 6px; font-size: 14px; color: #555b78; }

.ep-reads { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px; margin-top: 16px; }
.ep-read strong { display: block; font-size: 16.5px; font-weight: 500; }
.ep-read span { display: block; margin-top: 6px; font-size: 15px; color: #6b7185; font-weight: 400; }
.ep-small { margin: 18px 0 0; font-size: 12px; color: #555b78; }

.ep-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 4px 0 0 10px; }
.ep-priv { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7185; }
.ep-actions { display: flex; gap: 12px; }
.ep-btn { height: 44px; padding: 0 32px; background: #fff; color: var(--ink); border: 1px solid var(--line); border-radius: 6px; font-size: 16px; font-weight: 600; }
.ep-btn:hover { background: #f3f4fa; }
.ep-btn.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.ep-btn.primary:hover { background: #4338ca; }

@media (max-width: 960px) {
  .ep-grid { grid-template-columns: 1fr; }
  .ep-hero { flex-wrap: wrap; }
  .ep-upload { align-items: flex-start; }
}
@media (max-width: 720px) {
  .ep-page { padding-left: 16px; padding-right: 16px; }
  .ep-fields, .ep-reads { grid-template-columns: 1fr; }
}
.ep-col .ep-head h2 { font-size: 18px; }
`;
