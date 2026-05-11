import subprocess
import spacy
import temporal_normalization  # noqa: F401 — registers the @Language.factory
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL = "ro_core_news_sm"


def load_nlp():
    try:
        nlp = spacy.load(MODEL)
    except OSError:
        subprocess.run(["python3", "-m", "spacy", "download", MODEL], check=True)
        nlp = spacy.load(MODEL)
    nlp.add_pipe("temporal_normalization", last=True)
    return nlp


nlp = load_nlp()


def parse_edge(edge):
    if edge is None:
        return None
    try:
        serialized = edge.serialize("\t")
        keys = ["matched_value", "matched_type", "normalized_label", "dbpedia_uri"]
        parts = serialized.split("\t")

        return {
            "label": edge.label,
            "matched_type": edge.matched_type.value,
            "matched_value": edge.matched_value,
            "uri": edge.uri,
        }

        # return dict(zip(keys, parts + [""] * (4 - len(parts))))
    except Exception:
        return {"raw": str(edge)}


def parse_time_series(ts):
    result = {}
    if hasattr(ts, "edges") and ts.edges:
        result["start"] = parse_edge(ts.edges.start)
        result["end"] = parse_edge(ts.edges.end)
    if hasattr(ts, "periods") and ts.periods:
        result["periods"] = [parse_edge(p) for p in ts.periods]
    return result


@app.route("/api/normalize", methods=["GET"])
def normalize():
    text = request.args.get("text", "").strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        doc = nlp(text)
        entities = []
        for entity in doc.ents:
            time_series_data = entity._.time_series
            ts_list = []
            if isinstance(time_series_data, list):
                for ts in time_series_data:
                    ts_list.append(parse_time_series(ts))

            if len(ts_list) > 0:
                entities.append({
                    "text": entity.text,
                    "label": entity.label_,
                    "time_series": ts_list,
                })
        return jsonify({"text": text, "entities": entities})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
