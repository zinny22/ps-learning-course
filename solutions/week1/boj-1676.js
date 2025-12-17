const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let count = 0;
for (let p = 5; p <= n; p *= 5) {
  count += Math.floor(n / p);
}

process.stdout.write(String(count));
