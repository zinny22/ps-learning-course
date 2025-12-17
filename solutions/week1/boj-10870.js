const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let a = 0;
let b = 1;

if (n === 0) {
  process.stdout.write("0");
} else {
  for (let i = 2; i <= n; i += 1) {
    const c = a + b;
    a = b;
    b = c;
  }
  process.stdout.write(String(n === 1 ? 1 : b));
}
