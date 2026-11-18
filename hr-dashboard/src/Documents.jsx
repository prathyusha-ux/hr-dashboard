import { useMemo, useState } from "react";

/* `view` opens a page inside this app (Appraisal Letter). For the others, add the live link of each generator in `url` and its Open button will work. */
const DOCS = [
  { title: "Offer Letter", text: "Create offer letters with the salary breakup for new hires.", url: "", icon: "offer" },
  { title: "Relieving Letter", text: "Issue a relieving letter when an employee leaves.", url: "", icon: "relieving" },
  { title: "Experience Letter", text: "Confirm an employee's role and years of service.", url: "", icon: "experience" },
  { title: "Payslip", text: "Generate monthly payslips for employees.", url: "", icon: "payslip" },
  { title: "Appraisal Letter", text: "Share revised pay and role after a performance review.", url: "", icon: "appraisal", view: "appraisal" },
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
  <Icon size={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);

const DOC_ICONS = {
  offer: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  relieving: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M15 8l4 4-4 4M19 12H9" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  payslip: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  appraisal: (
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
};

export default function Documents({ onBack, onOpenDoc }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const openDoc = (d) => {
    if (d.view && onOpenDoc) {
      setMessage("");
      onOpenDoc(d.view);
    } else if (d.url) {
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
        <div className="dc-card-head">
          <h2>Document Types</h2>
          <span className="dc-count">{DOCS.length} templates</span>
        </div>

        <label className="dc-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search documents"
            aria-label="Search documents"
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
                  <td className="dc-sno">{i + 1}</td>
                  <td>
                    <span className="dc-name">
                      <span className="dc-icon"><Icon size={18}>{DOC_ICONS[d.icon]}</Icon></span>
                      {d.title}
                    </span>
                  </td>
                  <td className="dc-desc">{d.text}</td>
                  <td>
                    <button type="button" className="dc-open" onClick={() => openDoc(d)} aria-label={`Open ${d.title}`}>
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

/* Page styles. Colour variables and base table styles come from Dashboard.jsx.
   Font: Inter. Sizes, weights and colours follow the other pages of the design. */
const css = `
.dc-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 16px; }
.dc-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 19px; font-weight: 500; color: #626979; }
.dc-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.dc-back { display: grid; place-items: center; }
.dc-link:hover { text-decoration: underline; }

.dc-hero { display: flex; flex-direction: column; justify-content: center; min-height: 88px; padding: 0 24px; background: #f0ebfc; border-radius: 12px; }
.dc-hero h1 { margin: 0; font-size: 28px; font-weight: 600; line-height: 1.2; color: #202432; }
.dc-hero p { margin: 4px 0 0; font-size: 16px; font-weight: 500; color: #626979; }

.dc-card { background: var(--surface); border: 1px solid #e4e7ef; border-radius: 12px; padding: 16px 20px 18px; }
.dc-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.dc-card-head h2 { margin: 0; font-size: 18px; font-weight: 600; line-height: 24px; color: #202432; }
.dc-count { padding: 3px 10px; border-radius: 999px; background: #f0ebfc; color: #5834bc; font-size: 13px; font-weight: 500; }

.dc-search {
  display: flex; align-items: center; gap: 12px; height: 42px; max-width: 420px; margin-bottom: 14px;
  padding: 0 14px; background: #f7f8fc; border: 1px solid #e4e7ef; border-radius: 8px; color: #626979;
}
.dc-search:focus-within { border-color: #6847d6; box-shadow: 0 0 0 3px rgba(104, 71, 214, .12); }
.dc-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; color: #202432; }
.dc-search input::placeholder { color: #626979; opacity: 1; }

.dc-table { min-width: 720px; table-layout: fixed; }
.dc-table thead th { height: 38px; padding: 0 12px; background: #f7f8fc; color: #626979; font-size: 15.5px; font-weight: 600; }
.dc-table tbody td { height: 52px; padding: 0 12px; font-size: 16px; font-weight: 500; color: #202432; border-bottom: 1px solid #e4e7ef; }
.dc-table tbody tr:last-child td { border-bottom: 1px solid #e4e7ef; }
.dc-table tbody tr:hover td { background: #fbfbfe; }
.dc-table thead th:nth-child(1) { width: 8%; }
.dc-table thead th:nth-child(2) { width: 26%; }
.dc-table thead th:nth-child(3) { width: 46%; }
.dc-table thead th:nth-child(4) { width: 20%; }
.dc-sno { color: #626979 !important; }
.dc-name { display: inline-flex; align-items: center; gap: 12px; }
.dc-icon { width: 32px; height: 32px; flex-shrink: 0; display: grid; place-items: center; border-radius: 8px; background: #f0ebfc; color: #5834bc; }
.dc-desc { color: #626979 !important; font-weight: 400 !important; font-size: 15.5px !important; }
.dc-open {
  width: 122px; height: 34px; background: #6847d6; color: #fff;
  border: 0; border-radius: 6px; font-size: 14px; font-weight: 600;
}
.dc-open:hover { background: #5a3bc4; }
.dc-open:focus-visible { outline: 2px solid #6847d6; outline-offset: 2px; }
.dc-showing { margin: 12px 0 0; font-size: 15.5px; font-weight: 400; color: #626979; }

.dc-note {
  display: flex; align-items: center; gap: 14px; margin: 0; min-height: 45px; padding: 0 15px;
  background: #f0ebfc; border-radius: 8px; color: #5834bc; font-size: 14px; font-weight: 500;
}
@media (max-width: 720px) {
  .dc-page { padding-left: 16px; padding-right: 16px; }
}
`;
