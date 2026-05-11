# TeNs Demo

## Setup & running

### Backend (requires JRE 11+ installed):
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m spacy download ro_core_news_sm
python app.py          # starts on :5000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev            # starts on :3030
```

### Both at once (from repo root):
```bash
npm install            # installs concurrently
npm start
```

## API

GET /api/normalize?text=<romanian_text>

Returns JSON with the original text and a list of detected entities, each containing its time_series array with start/end time points (matched value, type, normalized label, DBpedia URI) and optional periods.

The Vite dev server proxies /api to the Flask backend, so the frontend fetch calls /api/normalize without any hardcoded host.