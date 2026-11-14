import { useState } from "react";

const depts = ["Design", "Developer", "Analyst", "Finance", "Marketing", "HR", "Sales"];

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

const ArrowLeft = () => (
  <Icon size={18}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);
const UploadCloud = () => (
  <Icon size={20}>
    <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 8" />
    <path d="M12 12v8M9 15l3-3 3 3" />
  </Icon>
);

/* ---------------------------------------------------------------
   Add Employee page
---------------------------------------------------------------- */
const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const MANAGERS = ["Ananya Rao · Design Lead", "Suresh Kumar · Finance Lead", "Priya Nair · Marketing Lead", "Nikhil · Engineering Lead"];
const PAYROLL = ["Monthly · INR", "Bi-weekly · INR"];
const TEMPLATES = ["Standard · Bengaluru", "Standard · Hyderabad", "Remote · India"];

const fileSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

function Field({ label, required, error, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && " *"}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function SelectBox({ value, onChange, options, placeholder, hasError }) {
  return (
    <select className={`input select ${hasError ? "err" : ""}`} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function DropZone({ accept, text, hint, onFile }) {
  const pick = (f) => f && onFile(f);
  return (
    <label
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files[0]);
      }}
    >
      <span className="dz-icon">
        <UploadCloud />
      </span>
      <span className="dz-text">{text}</span>
      <span className="dz-hint">{hint}</span>
      <input type="file" accept={accept} hidden onChange={(e) => pick(e.target.files[0])} />
    </label>
  );
}

export default function AddEmployee({ nextId, onBack, onSave }) {
  const [f, setF] = useState({
    first: "", last: "", dob: "", gender: "",
    empId: nextId, doj: "", dept: "", designation: "", empType: "", manager: "",
    email: "", phone: "", address: "",
    payroll: PAYROLL[0], template: TEMPLATES[0],
  });
  const [errors, setErrors] = useState({});
  const [doc, setDoc] = useState(null);
  const [docError, setDocError] = useState("");
  const [sheet, setSheet] = useState(null);

  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const text = (k) => (e) => set(k)(e.target.value);

  const onDoc = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setDoc(null);
      setDocError("File is larger than 10 MB.");
      return;
    }
    setDocError("");
    setDoc(file);
  };

  const submit = (e) => {
    e.preventDefault();
    const required = ["first", "last", "dob", "empId", "doj", "dept", "designation", "empType", "manager", "email", "phone"];
    const next = {};
    required.forEach((k) => {
      if (!String(f[k]).trim()) next[k] = "Required";
    });
    if (!next.email && !/^\S+@\S+\.\S+$/.test(f.email)) next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({ name: `${f.first.trim()} ${f.last.trim()}`, id: f.empId.trim(), dept: f.dept, status: "Active" });
  };

  const downloadTemplate = () => {
    const header =
      "First name,Last name,Date of birth,Gender,Employee ID,Date of joining,Department,Designation,Employment type,Reporting manager,Work email,Phone number,Address\n";
    const url = URL.createObjectURL(new Blob([header], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const err = (k) => errors[k];
  const cls = (k) => `input ${errors[k] ? "err" : ""}`;

  return (
    <form className="add-page" onSubmit={submit} noValidate>
      <style>{css}</style>
      <div className="crumbs">
        <button type="button" className="crumb-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="crumb-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Add Employee</span>
      </div>
      <h1 className="add-title">Add Employee</h1>
      <p className="add-sub">Create a new employee record and prepare a smooth first day.</p>

      <div className="add-grid">
        <div className="add-col">
          <section className="form-card">
            <h2 className="card-title">Personal Information</h2>
            <div className="form-row">
              <Field label="First name" required error={err("first")}>
                <input className={cls("first")} placeholder="Meera" value={f.first} onChange={text("first")} />
              </Field>
              <Field label="Last name" required error={err("last")}>
                <input className={cls("last")} placeholder="Shah" value={f.last} onChange={text("last")} />
              </Field>
              <Field label="Date of birth" required error={err("dob")}>
                <input type="date" className={cls("dob")} value={f.dob} onChange={text("dob")} />
              </Field>
              <Field label="Gender">
                <SelectBox value={f.gender} onChange={set("gender")} options={GENDERS} placeholder="Select gender" />
              </Field>
            </div>
          </section>

          <section className="form-card">
            <h2 className="card-title">Employment &amp; Reporting</h2>
            <div className="form-row">
              <Field label="Employee ID" required error={err("empId")}>
                <input className={cls("empId")} value={f.empId} onChange={text("empId")} />
              </Field>
              <Field label="Date of joining" required error={err("doj")}>
                <input type="date" className={cls("doj")} value={f.doj} onChange={text("doj")} />
              </Field>
              <Field label="Department" required error={err("dept")}>
                <SelectBox value={f.dept} onChange={set("dept")} options={depts} placeholder="Select department" hasError={!!err("dept")} />
              </Field>
              <Field label="Designation" required error={err("designation")}>
                <input className={cls("designation")} placeholder="UX Researcher" value={f.designation} onChange={text("designation")} />
              </Field>
              <Field label="Employment type" required error={err("empType")}>
                <SelectBox value={f.empType} onChange={set("empType")} options={EMP_TYPES} placeholder="Select type" hasError={!!err("empType")} />
              </Field>
              <Field label="Reporting manager" required error={err("manager")}>
                <SelectBox value={f.manager} onChange={set("manager")} options={MANAGERS} placeholder="Select manager" hasError={!!err("manager")} />
              </Field>
            </div>
          </section>

          <section className="form-card">
            <h2 className="card-title">Contact Information</h2>
            <div className="form-row">
              <Field label="Work email" required error={err("email")}>
                <input type="email" className={cls("email")} placeholder="name@interfacely.com" value={f.email} onChange={text("email")} />
              </Field>
              <Field label="Phone number" required error={err("phone")}>
                <input type="tel" className={cls("phone")} placeholder="+91 98450 11223" value={f.phone} onChange={text("phone")} />
              </Field>
            </div>
            <Field label="Residential address">
              <input className="input" placeholder="Indiranagar, Bengaluru, Karnataka 560038" value={f.address} onChange={text("address")} />
            </Field>
          </section>
        </div>

        <div className="add-col">
          <section className="form-card">
            <h2 className="card-title">Employee Documents</h2>
            <DropZone
              accept=".pdf,.jpg,.jpeg,.png"
              text="Drop files here or browse"
              hint="PDF, JPG or PNG · Maximum 10 MB per file"
              onFile={onDoc}
            />
            {docError && <span className="field-error">{docError}</span>}
            {doc && (
              <div className="attached">
                <span className="attached-label">Attached file</span>
                <strong>
                  {doc.name} · {fileSize(doc.size)}
                </strong>
              </div>
            )}
          </section>

          <section className="form-card">
            <h2 className="card-title">Record Setup</h2>
            <Field label="Payroll cycle">
              <SelectBox value={f.payroll} onChange={set("payroll")} options={PAYROLL} placeholder="Select cycle" />
            </Field>
            <Field label="Onboarding template">
              <SelectBox value={f.template} onChange={set("template")} options={TEMPLATES} placeholder="Select template" />
            </Field>
            <p className="note">An invitation will be sent after this record is saved.</p>
          </section>

          <section className="form-card">
            <h2 className="card-title small">Add Multiple Employees from Excel</h2>
            <DropZone
              accept=".xlsx,.xls"
              text="Drop Excel sheet here or browse"
              hint="XLSX, XLS"
              onFile={setSheet}
            />
            {sheet && (
              <div className="attached">
                <span className="attached-label">Selected sheet</span>
                <strong>
                  {sheet.name} · {fileSize(sheet.size)}
                </strong>
              </div>
            )}
            <p className="note">Upload multiple employees in one sheet</p>
            <button type="button" className="text-link" onClick={downloadTemplate}>
              Download Excel template
            </button>
          </section>
        </div>
      </div>

      <div className="form-footer">
        <span className="note">* Required fields · Employee information is confidential.</span>
        <div className="footer-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save Employee
          </button>
        </div>
      </div>
    </form>
  );
}

/* Styles for this page (colour variables come from .app in Dashboard.jsx) */
const css = `
/* Add Employee page */
.add-page { padding: 20px 48px 32px 28px; }
.crumbs { display: flex; align-items: center; gap: 10px; font-size: 16px; color: #3a3f58; }
.crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: 16px; }
.crumb-back { display: grid; place-items: center; }
.crumb-link:hover { text-decoration: underline; }
.add-title { margin: 22px 0 6px; font-size: 30px; font-weight: 600; line-height: 1.2; }
.add-sub { margin: 0 0 18px; font-size: 16px; color: var(--muted); }
.add-grid { display: grid; grid-template-columns: minmax(0, 1.58fr) minmax(0, 1fr); gap: 20px; align-items: start; }
.add-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.form-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px 24px 22px; }
.card-title { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
.card-title.small { font-size: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; min-width: 0; }
.field-label { font-size: 16px; font-weight: 500; color: #1a2038; }
.input {
  width: 100%; height: 40px; padding: 0 12px; background: #fff;
  border: 1px solid #dfe2ec; border-radius: 6px; font-size: 14px; font-weight: 400; color: var(--ink);
}
.input::placeholder { color: #8a90a6; }
.input:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(74, 63, 219, .12); }
.input.err { border-color: var(--red); }
.select {
  appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234d5370' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
}
.field-error { font-size: 12px; color: var(--red); }
.dropzone {
  display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center;
  padding: 18px 12px; background: #f7f8fd; border: 1px dashed #c9cde0; border-radius: 8px; cursor: pointer;
}
.dropzone:hover { border-color: var(--brand); }
.dz-icon { color: var(--brand); display: grid; }
.dz-text { font-size: 15px; font-weight: 500; color: var(--brand); }
.dz-hint { font-size: 12px; color: var(--muted); }
.attached { display: flex; flex-direction: column; gap: 4px; margin-top: 14px; font-size: 15px; color: var(--ink); word-break: break-all; }
.attached-label { font-size: 13px; color: var(--muted); }
.note { margin: 6px 0 0; font-size: 14px; color: var(--muted); }
.text-link { border: 0; background: transparent; padding: 0; margin-top: 6px; font-size: 15px; font-weight: 500; color: var(--brand); text-align: left; }
.text-link:hover { text-decoration: underline; }
.form-footer {
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  margin-top: 16px; padding: 14px 24px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
}
.form-footer .note { margin: 0; }
.footer-actions { display: flex; gap: 12px; }
.secondary-btn {
  height: 44px; padding: 0 32px; background: #fff; color: var(--brand);
  border: 1px solid var(--line); border-radius: 6px; font-size: 16px; font-weight: 600;
}
.secondary-btn:hover { background: #f3f4fa; }
.notice {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 12px 16px; background: var(--green-bg); color: var(--green);
  border-radius: 8px; font-size: 15px; font-weight: 500;
}
.notice button { border: 0; background: transparent; color: inherit; font-size: 20px; line-height: 1; }
@media (max-width: 900px) {
  .add-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .add-page { padding-left: 16px; padding-right: 16px; }
}
`;