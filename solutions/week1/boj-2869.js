const fs = require("fs");

const [aStr, bStr, vStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const A = Number(aStr);
const B = Number(bStr);
const V = Number(vStr);

if (A >= V) {
  process.stdout.write("1");
} else {
  const remain = V - A;
  const dayMove = A - B;
  const days = Math.ceil(remain / dayMove) + 1;
  process.stdout.write(String(days));
}
