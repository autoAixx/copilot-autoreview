const express = require("express");

const app = express();
app.use(express.json({ limit: "64kb" }));

const OP_DEFS = [
  { names: ["add", "sum"], fn: (a, b) => a + b },
  { names: ["sub", "subtract"], fn: (a, b) => a - b },
  { names: ["mul", "multiply"], fn: (a, b) => a * b },
  { names: ["div", "divide"], fn: (a, b) => a / b, isDivision: true }
];

const OP_MAP = OP_DEFS.reduce((map, def) => {
  def.names.forEach((name) => {
    map[name] = def.fn;
  });
  return map;
}, Object.create(null));

const DIV_OPS = new Set(
  OP_DEFS.filter((def) => def.isDivision)
    .flatMap((def) => def.names)
);
const ALLOWED_OPS = Object.keys(OP_MAP);

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
  const hasOp = Object.hasOwn(OP_MAP, operator);
  const fn = hasOp ? OP_MAP[operator] : null;

  if (!hasOp || typeof fn !== "function") {
    return res.status(400).json({
      error: `Invalid op. Use one of: ${ALLOWED_OPS.join("|")}`
    });
  }

  const left = parseNumber(a);
  const right = parseNumber(b);

  if (left === null || right === null) {
    return res.status(400).json({
      error: "Invalid operands. Provide numeric 'a' and 'b'."
    });
  }

  if (DIV_OPS.has(operator) && right === 0) {
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

const envPort = process.env.PORT;
let port = 3000;
if (envPort !== undefined && envPort !== "") {
  const parsedPort = Number(envPort);
  if (Number.isFinite(parsedPort)) {
    port = parsedPort;
  }
}
app.listen(port, () => {
  console.log(`Calculator API running on http://localhost:${port}`);
});
