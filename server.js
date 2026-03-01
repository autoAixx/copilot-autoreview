const express = require("express");

const app = express();
app.use(express.json({ limit: "64kb" }));

const OP_MAP = {
  add: (a, b) => a + b,
  sum: (a, b) => a + b,
  sub: (a, b) => a - b,
  subtract: (a, b) => a - b,
  mul: (a, b) => a * b,
  multiply: (a, b) => a * b,
  div: (a, b) => a / b,
  divide: (a, b) => a / b
};

function parseNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/calculate", (req, res) => {
  const { op, a, b } = req.body || {};
  const operator = typeof op === "string" ? op.toLowerCase() : "";
  const fn = OP_MAP[operator];

  if (!fn) {
    return res.status(400).json({
      error: "Invalid op. Use add|sub|mul|div (or sum|subtract|multiply|divide)."
    });
  }

  const left = parseNumber(a);
  const right = parseNumber(b);

  if (left === null || right === null) {
    return res.status(400).json({
      error: "Invalid operands. Provide numeric 'a' and 'b'."
    });
  }

  if ((operator === "div" || operator === "divide") && right === 0) {
    return res.status(400).json({ error: "Division by zero." });
  }

  const result = fn(left, right);
  return res.json({ result });
});

app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  return res.status(500).json({ error: "Internal server error." });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Calculator API running on http://localhost:${port}`);
});
