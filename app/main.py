from __future__ import annotations

from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Calculator API", version="1.0.0")


class CalcRequest(BaseModel):
    op: Literal["add", "sub", "mul", "div"] = Field(
        ..., description="Operation: add, sub, mul, div"
    )
    a: float = Field(..., description="Left operand")
    b: float = Field(..., description="Right operand")


class CalcResponse(BaseModel):
    op: str
    a: float
    b: float
    result: float


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/calculate", response_model=CalcResponse)
def calculate(payload: CalcRequest) -> CalcResponse:
    if payload.op == "add":
        result = payload.a + payload.b
    elif payload.op == "sub":
        result = payload.a - payload.b
    elif payload.op == "mul":
        result = payload.a * payload.b
    else:
        if payload.b == 0:
            raise HTTPException(status_code=400, detail="Division by zero")
        result = payload.a / payload.b

    return CalcResponse(op=payload.op, a=payload.a, b=payload.b, result=result)
