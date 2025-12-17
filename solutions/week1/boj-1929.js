const fs = require("fs");

const [mStr, nStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const m = Number(mStr);
const n = Number(nStr);

const isPrime = Array(n + 1).fill(true);
isPrime[0] = false;
if (n >= 1) isPrime[1] = false;

for (let p = 2; p * p <= n; p += 1) {
  if (!isPrime[p]) continue;
  for (let x = p * p; x <= n; x += p) {
    isPrime[x] = false;
  }
}

let out = [];
for (let x = Math.max(2, m); x <= n; x += 1) {
  if (isPrime[x]) out.push(String(x));
}

process.stdout.write(out.join("\n"));
