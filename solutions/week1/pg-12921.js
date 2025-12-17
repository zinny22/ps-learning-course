function solution(n) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = false;
  if (n >= 1) isPrime[1] = false;

  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let x = p * p; x <= n; x += p) {
      isPrime[x] = false;
    }
  }

  let count = 0;
  for (let x = 2; x <= n; x += 1) {
    if (isPrime[x]) count += 1;
  }
  return count;
}

module.exports = { solution };
