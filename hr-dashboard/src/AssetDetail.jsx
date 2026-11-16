import { useState } from "react";
import AssetPicture from "./AssetPicture.jsx";
import AssetReturn from "./AssetReturn.jsx";

/* Sample details. Only IT-024 has full details for now. Other assets show "—" until you add theirs here. */
const DETAILS = {
  "IT-024": {
    office: "Bengaluru office",
    model: "MacBook Pro 14-inch (2023)",
    serial: "C02IT024BLR",
    processor: "Apple M2 Pro · 16 GB",
    storage: "512 GB SSD · macOS",
    purchase: "01 Jun 2023 · ₹1,99,900",
    condition: "Good · Coverage ended 01 Jun 2026",
    history: [
      { event: "Added to inventory", owner: "IT Team", date: "01 Jun 2023", notes: "Purchase recorded" },
      { event: "Assigned", owner: "Haripriya", date: "12 Jun 2023", notes: "Acknowledged receipt", highlight: true },
      { event: "Asset verification", owner: "IT Team", date: "28 Sep 2026", notes: "Ownership confirmed" },
    ],
    lastService: "15 Sep 2026 · Health check",
    nextService: "15 Dec 2026 · Routine inspection",
    maintenanceNote: "Battery health 92% · No open issues · Serviced by IT Team.",
    employee: { role: "Product Designer · Design", empId: "UXII0021 · Hybrid" },
  },
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

function Spec({ label, value }) {
  return (
    <div className="ad-spec">
      <strong>{label}</strong>
      <span>{value || "—"}</span>
    </div>
  );
}

export default function AssetDetail({ asset, mode = "view", onBack, onDashboard }) {
  const [returning, setReturning] = useState(false);
  const d = DETAILS[asset.id] || {};
  const assigned = asset.status === "Assigned";
  const history = d.history || (asset.date ? [{ event: asset.status === "Assigned" ? "Assigned" : "Updated", owner: asset.assignee, date: asset.date, notes: "—", highlight: assigned }] : []);
  const subtitle = [asset.id, "Company-owned equipment", d.office].filter(Boolean).join(" · ") + ".";

  if (returning) {
    return (
      <AssetReturn
        asset={asset}
        mode={mode}
        employee={d.employee}
        onBack={() => setReturning(false)}
        onAssets={onBack}
        onDashboard={onDashboard}
      />
    );
  }

  return (
    <main className="ad-page">
      <style>{css}</style>

      <div className="ad-crumbs">
        <button type="button" className="ad-back" onClick={onBack} aria-label="Back to assets">
          <ArrowLeft />
        </button>
        <button type="button" className="ad-link" onClick={onDashboard}>Dashboard</button>
        <span>/</span>
        <span>
          <button type="button" className="ad-link" onClick={onBack}>Assets</button>
          /{mode === "add" ? "Add asset" : asset.id}
        </span>
      </div>

      <section className="ad-hero">
        <div>
          <h1>{asset.name}</h1>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="ad-primary">Edit Asset</button>
      </section>

      <div className="ad-grid">
        <div className="ad-col">
          <section className="ad-card">
            <h2>Specifications</h2>
            <div className="ad-specs">
              <Spec label="Model" value={d.model || asset.name} />
              <Spec label="Serial number" value={d.serial} />
              <Spec label="Processor / Memory" value={d.processor} />
              <Spec label="Storage / OS" value={d.storage} />
              <Spec label="Purchase date / Cost" value={d.purchase} />
              <Spec label="Condition / Warranty" value={d.condition} />
            </div>
          </section>

          <section className="ad-card">
            <h2 className="ad-h-sm">Assignment History</h2>
            <div className="table-scroll">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Employee / Owner</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty">No assignment history yet.</td>
                    </tr>
                  )}
                  {history.map((h) => (
                    <tr key={h.event + h.date}>
                      <td className={h.highlight ? "ad-green" : ""}>{h.event}</td>
                      <td>{h.owner}</td>
                      <td>{h.date}</td>
                      <td>{h.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="ad-card">
            <div className="ad-card-head">
              <h2 className="ad-h-sm">Maintenance</h2>
              <button type="button" className="ad-text-link">Schedule service</button>
            </div>
            <div className="ad-specs">
              <Spec label="Last service" value={d.lastService} />
              <Spec label="Next maintenance" value={d.nextService} />
            </div>
            {d.maintenanceNote && <p className="ad-maint">{d.maintenanceNote}</p>}
          </section>
        </div>

        <aside className="ad-col">
          <section className="ad-card ad-side">
            <h2 className="ad-h-sm">Asset Overview</h2>
            <div className="ad-photo"><AssetPicture category={asset.category} /></div>
            <span className={`ad-pill ${asset.status.toLowerCase()}`}>{asset.status}</span>
            <strong className="ad-label">Asset ID</strong>
            <span className="ad-small">{asset.id} · {asset.category}</span>
          </section>

          <section className="ad-card ad-side">
            <h2 className="ad-h-sm">Assigned Employee</h2>
            {assigned ? (
              <>
                <div className="ad-person">
                  <span className="ad-avatar">{asset.assignee.charAt(0)}</span>
                  <div>
                    <strong>{asset.assignee}</strong>
                    <span>{d.employee?.role || "—"}</span>
                  </div>
                </div>
                <strong className="ad-label">Employee ID / Arrangement</strong>
                <span className="ad-tiny">{d.employee?.empId || "—"}</span>
                <strong className="ad-label">Assigned on</strong>
                <span className="ad-tiny">{asset.date || "—"}</span>
              </>
            ) : (
              <p className="ad-none">
                {asset.status === "Maintenance" ? `With ${asset.assignee} for service.` : "Not assigned to an employee."}
              </p>
            )}
          </section>

          {assigned && (
            <>
              <button type="button" className="ad-primary ad-return" onClick={() => setReturning(true)}>
                Initiate asset Return
              </button>
              <p className="ad-return-note">Return requires employee acknowledgement and an IT condition check.</p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

/* Page styles. Colour variables and base table styles come from Dashboard.jsx. */
const css = `
.ad-page { padding: 20px 48px 28px 18px; display: flex; flex-direction: column; gap: 14px; }
.ad-crumbs { display: flex; align-items: center; gap: 10px; padding-left: 10px; font-size: 20px; font-weight: 500; color: #3a3f58; }
.ad-crumbs button { border: 0; background: transparent; padding: 0; color: inherit; font-size: inherit; font-weight: inherit; }
.ad-back { display: grid; place-items: center; }
.ad-link:hover { text-decoration: underline; }

.ad-hero {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;
  padding: 18px 26px 18px 20px; background: #ece8fb; border-radius: 12px;
}
.ad-hero h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 1.2; }
.ad-hero p { margin: 14px 0 0; font-size: 17px; color: #4d5370; }
.ad-primary {
  height: 44px; padding: 0 28px; border: 0; border-radius: 6px;
  background: #6847d6; color: #fff; font-size: 16px; font-weight: 600;
}
.ad-primary:hover { background: #5a3bc4; }

.ad-grid { display: grid; grid-template-columns: minmax(0, 1fr) 248px; gap: 12px; align-items: start; }
.ad-col { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.ad-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px 16px; }
.ad-card h2 { margin: 0 0 6px; font-size: 20px; font-weight: 600; }
.ad-card h2.ad-h-sm { font-size: 17px; margin-bottom: 8px; }
.ad-card-head { display: flex; justify-content: space-between; align-items: center; }
.ad-text-link { border: 0; background: transparent; padding: 0; color: #4f46e5; font-size: 14px; font-weight: 600; }
.ad-text-link:hover { text-decoration: underline; }

.ad-specs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; }
.ad-spec strong { display: block; font-size: 20px; font-weight: 500; }
.ad-spec span { display: block; margin-top: 4px; font-size: 17px; color: #6b7280; }

.ad-table { min-width: 560px; }
.ad-table thead th { font-size: 16px; height: 44px; padding: 0 12px; }
.ad-table tbody td { height: 60px; padding: 0 12px; font-size: 17px; font-weight: 400; }
.ad-green { color: var(--green); }
.ad-maint { margin: 10px 0 0; font-size: 17px; color: #6b7280; }

.ad-side { display: flex; flex-direction: column; align-items: flex-start; }
.ad-photo { width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 12px; line-height: 0; }
.ad-pill { padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 500; background: var(--green-bg); color: var(--green); }
.ad-pill.maintenance { background: #fdf0d5; color: #9a6200; }
.ad-label { display: block; margin-top: 10px; font-size: 16px; font-weight: 500; }
.ad-small { font-size: 15px; margin-top: 2px; }
.ad-tiny { font-size: 13px; margin-top: 2px; color: #3a3f58; }
.ad-person { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.ad-avatar { width: 56px; height: 56px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: #ddd6fe; color: #2c3150; font-size: 22px; font-weight: 600; }
.ad-person strong { display: block; font-size: 20px; font-weight: 500; }
.ad-person span { display: block; font-size: 14px; color: var(--muted); line-height: 1.3; }
.ad-none { margin: 0; font-size: 15px; color: var(--muted); }

.ad-return { width: 100%; padding: 0; }
.ad-return-note { margin: 0; font-size: 15px; line-height: 1.5; color: var(--muted); }

@media (max-width: 960px) {
  .ad-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .ad-page { padding-left: 16px; padding-right: 16px; }
  .ad-specs { grid-template-columns: 1fr; }
}
`;