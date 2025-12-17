const fs = require("fs");

const [nStr, kStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const k = Number(kStr);

const r = Math.min(k, n - k);
let numer = 1;
let denom = 1;

for (let i = 1; i <= r; i += 1) {
  numer *= (n - r + i);
  denom *= i;
}

process.stdout.write(String(Math.round(numer / denom)));
