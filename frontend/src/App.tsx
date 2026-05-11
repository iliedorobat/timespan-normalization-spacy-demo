import { useState } from "react";
import type { NormalizeResponse } from "./types";
import TemporalNormalizer from "./components/TemporalNormalizer";

const PLACEHOLDER =
  "Sec al II-lea a.ch. a fost o perioadă de mari schimbări. În secolul XX, tehnologia a avansat semnificativ.";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<NormalizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/normalize?text=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "An unexpected error occurred.");
      } else {
        setResult(data as NormalizeResponse);
      }
    } catch {
      setError("Failed to connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>TeNs</h1>
        <p>Temporal Expression Normalization for Romanian text</p>
      </header>

      <main className="main">
        <section className="input-section">
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="text-input" className="label">
              Input text
            </label>
            <textarea
              id="text-input"
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={6}
            />
            <button
              type="submit"
              className="button"
              disabled={loading || !text.trim()}
            >
              {loading ? "Processing…" : "Normalize"}
            </button>
          </form>
        </section>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        {result && <TemporalNormalizer result={result} />}
      </main>
    </div>
  );
}
