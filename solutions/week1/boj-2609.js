const fs = require("fs");

const [aStr, bStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const a = Number(aStr);
const b = Number(bStr);

function gcd(x, y) {
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

const g = gcd(a, b);
const l = (a / g) * b;

process.stdout.write(`${g}\n${l}`);
