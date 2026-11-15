import { useMemo, useState } from "react";

/* Add the live link of each generator in `url` and its Open button will work. */
const DOCS = [
  { title: "Offer Letter", text: "Create offer letters with the salary breakup for new hires.", url: "" },
  { title: "Relieving Letter", text: "Issue a relieving letter when an employee leaves.", url: "" },
  { title: "Experience Letter", text: "Confirm an employee's role and years of service.", url: "" },
  { title: "Payslip", text: "Generate monthly payslips for employees.", url: "" },
  { title: "Appraisal Letter", text: "Share revised pay and role after a performance review.", url: "" },
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
const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
const InfoIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);

export default function Documents({ onBack }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const openDoc = (d) => {
    if (d.url) {
      setMessage("");
      window.open(d.url, "_blank", "noopener");
    } else {
      setMessage(`The ${d.title} link isn't added yet. Paste its address in the url field of Documents.jsx.`);
    }
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCS.filter((d) => !q || d.title.toLowerCase().includes(q) || d.text.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="dc-page">
      <style>{css}</style>

      <div className="dc-crumbs">
        <button type="button" className="dc-back" onClick={onBack} aria-label="Back to dashboard">
          <ArrowLeft />
        </button>
        <button type="button" className="dc-link" onClick={onBack}>
          Dashboard
        </button>
        <span>/</span>
        <span>Documents</span>
      </div>

      <section className="dc-hero">
        <h1>Documents</h1>
        <p>Create and issue offer, relieving, experience and appraisal letters, and payslips.</p>
      </section>

      <section className="dc-card">
        <h2 className="dc-card-title">Document Types</h2>

        <label className="dc-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="table-scroll">
          <table className="dc-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Document</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty">No documents match your search.</td>
                </tr>
              )}
              {rows.map((d, i) => (
                <tr key={d.title}>
                  <td>{i + 1}</td>
                  <td>{d.title}</td>
                  <td className="dc-desc">{d.text}</td>
                  <td>
                    <button
                      type="button"
                      className="dc-open"
                      onClick={() => openDoc(d)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="dc-showing">
          {rows.length === 0 ? "Showing 0 documents" : `Showing 1–${rows.length} of ${DOCS.length} documents`}
        </p>
      </section>

      {message && (
        <p className="dc-note" role="status">
          <InfoIcon />
          {message}
        </p>
      )}
    </main>
  );
}

/* Page styles. Colour variables and base table styles come from Dashboard.jsx. */
const css = `
.dc-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.dc-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; }
.dc-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.dc-back { display: grid; place-items: center; }
.dc-link:hover { text-decoration: underline; }

.dc-hero { padding: 16px 24px; background: #ece8fb; border-radius: 12px; }
.dc-hero h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.2; }
.dc-hero p { margin: 6px 0 0; font-size: 17px; color: #4d5370; }

.dc-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 20px 18px; }
.dc-card-title { margin: 0 0 12px; font-size: 20px; font-weight: 600; }
.dc-search {
  display: flex; align-items: center; gap: 12px; height: 44px; max-width: 420px; margin-bottom: 14px;
  padding: 0 16px; background: #f6f7fc; border: 1px solid var(--line); border-radius: 8px; color: #555b78;
}
.dc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 15px; color: var(--ink); }
.dc-search input::placeholder { color: #6f7590; }

.dc-table { min-width: 720px; }
.dc-table thead th { font-size: 16px; height: 40px; padding: 0 12px; }
.dc-table tbody td { height: 52px; padding: 0 12px; font-size: 16px; font-weight: 400; }
.dc-table thead th:nth-child(1) { width: 9%; }
.dc-table thead th:nth-child(2) { width: 24%; }
.dc-table thead th:nth-child(3) { width: 47%; }
.dc-table thead th:nth-child(4) { width: 20%; }
.dc-table tbody td:nth-child(2) { font-weight: 500; }
.dc-desc { color: var(--muted); }
.dc-open {
  width: 122px; height: 34px; background: #6847d6; color: #fff;
  border: 0; border-radius: 4px; font-size: 14px; font-weight: 500;
}
.dc-open:hover { background: #5a3bc4; }
.dc-showing { margin: 10px 0 0; font-size: 16px; color: var(--muted); }

.dc-note {
  display: flex; align-items: center; gap: 10px; margin: 0; padding: 12px 16px;
  background: #ece8fb; border-radius: 8px; color: #4a3fdb; font-size: 15px; font-weight: 500;
}
@media (max-width: 720px) {
  .dc-page { padding-left: 16px; padding-right: 16px; }
}
`;