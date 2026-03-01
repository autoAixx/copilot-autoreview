# Calculator API

Simple FastAPI calculator with add, sub, mul, div.

## Setup

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Linux/macOS (bash/zsh)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

Works on Windows, Linux, and macOS:

```bash
uvicorn app.main:app --reload
```

## Example

### Windows (PowerShell)

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/calculate -ContentType "application/json" -Body '{"op":"add","a":2,"b":3}'
```

### Linux/macOS (curl)

```bash
curl -sS -X POST http://127.0.0.1:8000/calculate \
	-H "Content-Type: application/json" \
	-d '{"op":"add","a":2,"b":3}'
```
