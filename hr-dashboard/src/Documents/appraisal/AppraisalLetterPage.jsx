import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import AppraisalForm from "./components/AppraisalForm";
import "./AppraisalLetter.css";
import "./appraisal.css";

/* Appraisal Letter Generator, shown inside the dashboard.
   onBack: back to the Documents page. onDashboard: back to the dashboard. */
export default function AppraisalLetterPage({ onBack, onDashboard }) {
  return (
    <main className="apg">
      <div className="apg-crumbs">
        <button type="button" className="apg-back" onClick={onBack} aria-label="Back to Documents">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <button type="button" className="apg-link" onClick={onDashboard}>Dashboard</button>
        <span>/</span>
        <button type="button" className="apg-link" onClick={onBack}>Documents</button>
        <span>/</span>
        <span>Appraisal Letter</span>
      </div>

      <section className="apg-hero">
        <h1>Appraisal Letter</h1>
        <p>Generate, store and send employee appraisal letters.</p>
      </section>

      <ErrorBoundary>
        <Header />
        <AppraisalForm />
      </ErrorBoundary>
    </main>
  );
}
