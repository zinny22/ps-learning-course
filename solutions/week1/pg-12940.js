function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function solution(n, m) {
  const g = gcd(n, m);
  const l = (n / g) * m;
  return [g, l];
}

module.exports = { solution };
