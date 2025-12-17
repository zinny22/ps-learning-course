const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let out = [];
for (let i = 1; i <= n; i += 1) {
  out.push("*".repeat(i));
}

process.stdout.write(out.join("\n"));
