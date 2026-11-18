import { useState } from "react";
import appraisalService from "../services/appraisalService";

export default function Header() {
  const [name, setName] = useState("");
  const [searching, setSearching] = useState(false);
  const [rows, setRows] = useState(null); // null = not searched yet
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const query = name.trim();
    if (!query) {
      setRows(null);
      setError("Enter an employee name or ID to search.");
      return;
    }
    setSearching(true);
    setError("");
    try {
      setRows(await appraisalService.searchAppraisals(query));
    } catch (requestError) {
      setRows(null);
      setError(
        requestError.response?.data?.message ||
          "Search failed. Check the backend connection."
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="page-header">
      <h2 className="apg-card-title">Find a previously generated letter</h2>
      <p className="page-subtitle">Search by employee name or ID to download a saved appraisal letter.</p>

      <div className="history-search-row">
        <input
          id="searchName"
          type="text"
          aria-label="Search by employee name or ID"
          placeholder="Search by employee name or ID"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
        />
        <button type="button" className="btn-primary" disabled={searching} onClick={handleSearch}>
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="search-results">
        {error && <p className="search-empty">{error}</p>}
        {rows && rows.length === 0 && (
          <p className="search-empty">No matching appraisal letters found.</p>
        )}
        {rows && rows.map((row) => (
          <div className="search-result-row" key={row.id}>
            <div>
              <strong>{row.employeeName}</strong>
              {row.employeeId ? ` (${row.employeeId})` : ""} — {row.designation} · {row.status}
            </div>
            <button type="button" className="result-download" onClick={() => appraisalService.downloadPdf(row.id)}>
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
