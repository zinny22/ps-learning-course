const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
const n = input.length > 0 ? Number(input[0]) : 0;
const nums = input.slice(1, 1 + n).map(Number);

function isPrime(x) {
  if (x < 2) return false;
  if (x === 2) return true;
  if (x % 2 === 0) return false;
  for (let d = 3; d * d <= x; d += 2) {
    if (x % d === 0) return false;
  }
  return true;
}

let count = 0;
for (const v of nums) {
  if (isPrime(v)) count += 1;
}

process.stdout.write(String(count));
