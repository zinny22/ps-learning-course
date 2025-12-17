const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let ans = 0n;
let i = 1;

while (i <= n) {
  const q = Math.floor(n / i);
  const j = Math.floor(n / q);

  const count = BigInt(j - i + 1);
  const sumIJ = (BigInt(i) + BigInt(j)) * count / 2n;

  ans += BigInt(q) * sumIJ;
  i = j + 1;
}

process.stdout.write(String(ans));
