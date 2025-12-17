import type { SolutionTemplate } from "./types";

export const week1Templates: Record<string, SolutionTemplate> = {
  "boj-2438": {
    summary: "N을 입력받아 1번째 줄부터 N번째 줄까지 별(*)을 1개~N개 출력한다.",
    approach:
      "반복문으로 i=1..N까지 순회하며 '*'을 i번 반복한 문자열을 출력한다.",
    keyPoints:
      "- 문자열 반복: '*'.repeat(i)\n- 줄바꿈은 join('\\n')로 한 번에 출력",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = input === "" ? 0 : Number(input);\n\nlet out = [];\nfor (let i = 1; i <= n; i += 1) {\n  out.push("*".repeat(i));\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "repeat/join 조합으로 출력 성능까지 깔끔하게 처리.",
    retryCriteria: "입출력/반복문 템플릿을 잊었을 때",
  },

  "boj-1978": {
    summary: "N개의 수 중 소수의 개수를 센다.",
    approach: "각 수마다 2~sqrt(x)까지 나눠보며 소수 판별 후 개수 누적.",
    keyPoints: "- x<2는 소수 아님\n- sqrt(x)까지만 검사\n- 짝수 최적화 가능",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).filter(Boolean);\nconst n = input.length > 0 ? Number(input[0]) : 0;\nconst nums = input.slice(1, 1 + n).map(Number);\n\nfunction isPrime(x) {\n  if (x < 2) return false;\n  if (x === 2) return true;\n  if (x % 2 === 0) return false;\n  for (let d = 3; d * d <= x; d += 2) {\n    if (x % d === 0) return false;\n  }\n  return true;\n}\n\nlet count = 0;\nfor (const v of nums) {\n  if (isPrime(v)) count += 1;\n}\n\nprocess.stdout.write(String(count));\n',
    retrospective:
      "sqrt까지 검사하는 소수 판별은 거의 모든 수학/구현 문제의 기본.",
    retryCriteria: "소수 판별 조건(x<2) 실수했을 때",
  },

  "boj-2609": {
    summary: "두 수의 최대공약수(GCD)와 최소공배수(LCM)를 출력한다.",
    approach: "유클리드 호제법으로 GCD를 구하고, LCM = (a/g)*b로 계산한다.",
    keyPoints: "- GCD: while(b!=0) { [a,b]=[b,a%b] }\n- LCM은 overflow 주의",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst [aStr, bStr] = fs.readFileSync(0, "utf8").trim().split(/\\s+/);\nconst a = Number(aStr);\nconst b = Number(bStr);\n\nfunction gcd(x, y) {\n  while (y !== 0) {\n    const t = x % y;\n    x = y;\n    y = t;\n  }\n  return x;\n}\n\nconst g = gcd(a, b);\nconst l = (a / g) * b;\n\nprocess.stdout.write(`${g}\\n${l}`);\n',
    retrospective: "GCD/LCM 템플릿은 바로 외워두면 이후 속도가 빨라짐.",
    retryCriteria: "LCM 계산에서 (a*b)/g 순서로 해서 오버플로 걱정될 때",
  },

  "boj-2748": {
    summary: "n번째 피보나치 수를 출력한다. (n이 커서 큰 정수가 필요)",
    approach: "DP(반복)로 누적하며 BigInt로 계산한다. a,b를 굴리며 갱신.",
    keyPoints: "- BOJ는 큰 수 가능 -> BigInt 사용\n- 출력 시 String(BigInt)",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = input === "" ? 0 : Number(input);\n\nlet a = 0n;\nlet b = 1n;\n\nif (n === 0) {\n  process.stdout.write("0");\n} else {\n  for (let i = 2; i <= n; i += 1) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  process.stdout.write(String(n === 1 ? 1n : b));\n}\n',
    retrospective: "BigInt는 연산 시 모두 BigInt로 맞춰야 한다.",
    retryCriteria: "Number로 풀다가 오버플로/틀림이 났을 때",
  },

  "boj-10870": {
    summary: "n번째 피보나치 수를 출력한다. (범위가 작음)",
    approach: "반복문으로 a,b를 갱신하며 피보나치 계산.",
    keyPoints: "- n=0,1 예외 처리\n- 반복으로 안전하게",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = input === "" ? 0 : Number(input);\n\nlet a = 0;\nlet b = 1;\n\nif (n === 0) {\n  process.stdout.write("0");\n} else {\n  for (let i = 2; i <= n; i += 1) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  process.stdout.write(String(n === 1 ? 1 : b));\n}\n',
    retrospective: "작은 피보나치는 BigInt 없이도 반복으로 OK.",
    retryCriteria: "재귀로 풀었다가 느려졌을 때",
  },

  "boj-17427": {
    summary: "1부터 N까지의 약수의 합을 빠르게 구한다. (Σ_{i=1..N} σ(i))",
    approach:
      "값이 같은 몫 q = floor(N/i) 구간을 묶어서, i..j의 합을 등차수열로 계산한다.",
    keyPoints:
      "- i를 증가시키며 q가 동일한 마지막 j를 찾음\n- Σ i..j = (i+j)*(j-i+1)/2\n- BigInt로 안전하게",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = input === "" ? 0 : Number(input);\n\nlet ans = 0n;\nlet i = 1;\n\nwhile (i <= n) {\n  const q = Math.floor(n / i);\n  const j = Math.floor(n / q);\n\n  const count = BigInt(j - i + 1);\n  const sumIJ = (BigInt(i) + BigInt(j)) * count / 2n;\n\n  ans += BigInt(q) * sumIJ;\n  i = j + 1;\n}\n\nprocess.stdout.write(String(ans));\n',
    retrospective:
      "floor(n/i) 구간 묶기(분할 합)는 수학 최적화에서 자주 나온다.",
    retryCriteria: "O(N)로 풀었다가 시간초과 날 때",
  },

  "boj-1929": {
    summary: "M 이상 N 이하의 모든 소수를 출력한다.",
    approach:
      "에라토스테네스의 체로 2..N까지 소수 여부를 구한 뒤 M..N 범위만 출력.",
    keyPoints: "- 체: p^2부터 배수 지우기\n- 출력은 배열에 모아 join",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst [mStr, nStr] = fs.readFileSync(0, "utf8").trim().split(/\\s+/);\nconst m = Number(mStr);\nconst n = Number(nStr);\n\nconst isPrime = Array(n + 1).fill(true);\nisPrime[0] = false;\nif (n >= 1) isPrime[1] = false;\n\nfor (let p = 2; p * p <= n; p += 1) {\n  if (!isPrime[p]) continue;\n  for (let x = p * p; x <= n; x += p) {\n    isPrime[x] = false;\n  }\n}\n\nlet out = [];\nfor (let x = Math.max(2, m); x <= n; x += 1) {\n  if (isPrime[x]) out.push(String(x));\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "소수 출력형 문제는 체를 먼저 떠올리면 대부분 해결.",
    retryCriteria: "sqrt 판별로 풀다가 느리거나, 출력 최적화가 필요할 때",
  },

  "boj-1676": {
    summary: "N!의 뒤에서부터 0의 개수를 구한다.",
    approach:
      "0은 2*5로 생기며 2는 충분히 많으므로 5의 개수만 세면 된다. n/5 + n/25 + ...",
    keyPoints: "- 5의 거듭제곱으로 나누어 누적\n- 반복적으로 p*=5",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = input === "" ? 0 : Number(input);\n\nlet count = 0;\nfor (let p = 5; p <= n; p *= 5) {\n  count += Math.floor(n / p);\n}\n\nprocess.stdout.write(String(count));\n',
    retrospective: "팩토리얼 문제는 실제 계산하지 말고 소인수 개수로 접근.",
    retryCriteria: "N! 직접 계산하려고 했던 습관이 나왔을 때",
  },

  "boj-2869": {
    summary:
      "달팽이가 낮에 A만큼 올라가고 밤에 B만큼 미끄러질 때 V 높이에 도달하는 최소 일수.",
    approach:
      "마지막 날에는 미끄러지지 않으므로 (V-A)를 (A-B)로 나눠 올림한 뒤 +1.",
    keyPoints: "- 마지막 날 처리\n- ceil((V-A)/(A-B))+1",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst [aStr, bStr, vStr] = fs.readFileSync(0, "utf8").trim().split(/\\s+/);\nconst A = Number(aStr);\nconst B = Number(bStr);\nconst V = Number(vStr);\n\nif (A >= V) {\n  process.stdout.write("1");\n} else {\n  const remain = V - A;\n  const dayMove = A - B;\n  const days = Math.ceil(remain / dayMove) + 1;\n  process.stdout.write(String(days));\n}\n',
    retrospective: "시뮬레이션 대신 수식으로 바꾸는 전형 문제.",
    retryCriteria: "루프 시뮬레이션으로 시간초과/틀림이 났을 때",
  },

  "boj-11050": {
    summary: "이항계수 C(n,k)를 계산한다.",
    approach: "k와 n-k 중 작은 r을 사용해 분자/분모를 곱해 조합을 계산한다.",
    keyPoints: "- r=min(k,n-k)로 곱셈 횟수 줄이기\n- 작은 범위라 정수 연산 OK",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst [nStr, kStr] = fs.readFileSync(0, "utf8").trim().split(/\\s+/);\nconst n = Number(nStr);\nconst k = Number(kStr);\n\nconst r = Math.min(k, n - k);\nlet numer = 1;\nlet denom = 1;\n\nfor (let i = 1; i <= r; i += 1) {\n  numer *= (n - r + i);\n  denom *= i;\n}\n\nprocess.stdout.write(String(Math.round(numer / denom)));\n',
    retrospective: "조합은 곱셈으로 풀되, r=min(k,n-k)를 습관화.",
    retryCriteria: "팩토리얼로 풀었다가 범위 커질 때 대비가 필요할 때",
  },

  "pg-12921": {
    summary: "1~n 사이의 소수 개수를 반환한다.",
    approach: "에라토스테네스의 체로 소수 여부를 만든 뒤 개수 count.",
    keyPoints: "- p^2부터 지우기\n- 배열로 처리",
    mistakes: "",
    codeLanguage: "js",
    code: "function solution(n) {\n  const isPrime = Array(n + 1).fill(true);\n  isPrime[0] = false;\n  if (n >= 1) isPrime[1] = false;\n\n  for (let p = 2; p * p <= n; p += 1) {\n    if (!isPrime[p]) continue;\n    for (let x = p * p; x <= n; x += p) {\n      isPrime[x] = false;\n    }\n  }\n\n  let count = 0;\n  for (let x = 2; x <= n; x += 1) {\n    if (isPrime[x]) count += 1;\n  }\n  return count;\n}\n",
    retrospective: "프로그래머스에서도 체는 거의 정석.",
    retryCriteria: "sqrt 판별로 풀었다가 효율이 애매할 때",
  },

  "pg-12940": {
    summary: "두 수 n,m의 최대공약수와 최소공배수를 배열로 반환한다.",
    approach: "유클리드 호제법으로 gcd를 구한 후 lcm을 계산.",
    keyPoints: "- gcd 템플릿\n- lcm=(n/g)*m",
    mistakes: "",
    codeLanguage: "js",
    code: "function gcd(a, b) {\n  while (b !== 0) {\n    const t = a % b;\n    a = b;\n    b = t;\n  }\n  return a;\n}\n\nfunction solution(n, m) {\n  const g = gcd(n, m);\n  const l = (n / g) * m;\n  return [g, l];\n}\n",
    retrospective: "gcd/lcm은 JS로도 간단하게 구현 가능.",
    retryCriteria: "gcd 구현을 헷갈렸을 때",
  },
};
