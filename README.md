# Calculator API

Simple FastAPI calculator with add, sub, mul, div.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
uvicorn app.main:app --reload
```

## Example

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/calculate -ContentType "application/json" -Body '{"op":"add","a":2,"b":3}'
```
