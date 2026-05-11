import type { NormalizeResponse, TimeSeries, TimePoint } from "../types";

interface Props {
  result: NormalizeResponse;
}

function TimePointRow({ label, point }: { label: string; point?: TimePoint }) {
  if (!point) return null;
  return (
    <div className="time-point">
      <span className="time-point-label">{label}</span>
      <dl className="time-point-fields">
        <div className="field">
          <dt>Matched value</dt>
          <dd>{point.matched_value || "—"}</dd>
        </div>
        <div className="field">
          <dt>Type</dt>
          <dd>{point.matched_type || "—"}</dd>
        </div>
        <div className="field">
          <dt>Normalized label</dt>
          <dd>{point.label || "—"}</dd>
        </div>
        <div className="field">
          <dt>DBpedia URI</dt>
          <dd>
            {point.uri ? (
              <a
                href={point.uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                {point.uri}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function TimeSeriesCard({ ts, index }: { ts: TimeSeries; index: number }) {
  return (
    <div className="time-series-card">
      <p className="time-series-title">Time series {index + 1}</p>
      <TimePointRow label="Start" point={ts.start} />
      <TimePointRow label="End" point={ts.end} />
      {ts.periods && ts.periods.length > 0 && (
        <>
          <p className="periods-title">Periods</p>
          {ts.periods.map((p, i) => (
            <TimePointRow key={i} label={`Period ${i + 1}`} point={p} />
          ))}
        </>
      )}
    </div>
  );
}

export default function TemporalNormalizer({ result }: Props) {
  if (result.entities.length === 0) {
    return (
      <section className="results">
        <p className="no-results">
          No temporal expressions found in the provided text.
        </p>
      </section>
    );
  }

  return (
    <section className="results">
      <h2 className="results-title">
        {result.entities.length} temporal{" "}
        {result.entities.length === 1 ? "expression" : "expressions"} found
      </h2>
      {result.entities.map((entity, i) => (
        <div key={i} className="entity-card">
          <div className="entity-header">
            <span className="entity-text">{entity.text}</span>
            <span className="entity-label">{entity.label}</span>
          </div>
          {entity.time_series.map((ts, j) => (
            <TimeSeriesCard key={j} ts={ts} index={j} />
          ))}
        </div>
      ))}
    </section>
  );
}
