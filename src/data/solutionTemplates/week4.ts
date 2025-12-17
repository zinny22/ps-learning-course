import type { SolutionTemplate } from "./types";

export const week4Templates: Record<string, SolutionTemplate> = {
  "boj-1463": {
    summary: "정수 N을 1로 만들기 위한 최소 연산 횟수를 구한다. (÷3, ÷2, -1)",
    approach:
      "DP로 dp[i] = i를 1로 만드는 최소 횟수. dp[i] = dp[i-1]+1, (i%2==0) dp[i/2]+1, (i%3==0) dp[i/3]+1 중 최소.",
    keyPoints: "- bottom-up DP\n- 점화식 후보 3개 비교",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);
const dp = Array(n + 1).fill(0);

for (let i = 2; i <= n; i += 1) {
  let best = dp[i - 1] + 1;
  if (i % 2 === 0) best = Math.min(best, dp[i / 2] + 1);
  if (i % 3 === 0) best = Math.min(best, dp[i / 3] + 1);
  dp[i] = best;
}

process.stdout.write(String(dp[n]));
`,
    retrospective:
      "dp[i]를 만들 때 가능한 이전 상태를 전부 후보로 두는 게 핵심.",
    retryCriteria: "나누기 연산 조건(i%2, i%3) 빼먹었을 때",
  },

  "boj-9095": {
    summary: "정수 n을 1,2,3의 합으로 나타내는 방법의 수를 구한다.",
    approach:
      "dp[i] = dp[i-1] + dp[i-2] + dp[i-3]. 여러 테스트케이스이므로 최대 n까지 미리 계산한다.",
    keyPoints:
      "- base: dp[1]=1, dp[2]=2, dp[3]=4\n- 여러 테스트: maxN까지 precompute",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(input[idx++] || 0);
const ns = [];
let maxN = 0;
for (let i = 0; i < t; i += 1) {
  const n = Number(input[idx++]);
  ns.push(n);
  if (n > maxN) maxN = n;
}

const dp = Array(Math.max(4, maxN + 1)).fill(0);
dp[1] = 1;
dp[2] = 2;
dp[3] = 4;
for (let i = 4; i <= maxN; i += 1) {
  dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
}

process.stdout.write(ns.map((n) => String(dp[n])).join("\n"));
`,
    retrospective: "여러 TC면 precompute로 반복을 줄이자.",
    retryCriteria: "dp 초기값(1,2,3)을 헷갈렸을 때",
  },

  "boj-11726": {
    summary:
      "2×n 직사각형을 1×2, 2×1 타일로 채우는 방법 수를 구한다. (mod 10007)",
    approach: "dp[n] = dp[n-1] + dp[n-2] (마지막 타일 기준).",
    keyPoints: "- mod 10007\n- base: dp[1]=1, dp[2]=2",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);
const MOD = 10007;
const dp = Array(n + 2).fill(0);
dp[1] = 1;
dp[2] = 2;
for (let i = 3; i <= n; i += 1) {
  dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;
}
process.stdout.write(String(dp[n] % MOD));
`,
    retrospective: "타일링은 대부분 dp[n-1], dp[n-2]로 귀결.",
    retryCriteria: "mod 연산을 누락해서 값이 커졌을 때",
  },

  "boj-11053": {
    summary: "수열의 LIS(가장 긴 증가하는 부분 수열) 길이를 구한다.",
    approach:
      "O(N^2) DP: dp[i]=i에서 끝나는 LIS 길이. dp[i]=max(dp[j]+1) for j<i and a[j]<a[i].",
    keyPoints: "- dp[i] 초기 1\n- 이중 루프로 비교",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

const dp = Array(n).fill(1);
let ans = 0;
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < i; j += 1) {
    if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
  }
  ans = Math.max(ans, dp[i]);
}

process.stdout.write(String(ans));
`,
    retrospective: "LIS 기본은 O(N^2) dp, 이후 NlogN으로 확장.",
    retryCriteria: "증가 조건(<) 방향을 잘못 썼을 때",
  },

  "boj-1932": {
    summary:
      "정수 삼각형에서 위에서 아래로 내려가며 얻을 수 있는 최대 합을 구한다.",
    approach:
      "dp[i][j] = i층 j번째까지의 최대 합. dp[i][j] = max(dp[i-1][j-1], dp[i-1][j]) + val.",
    keyPoints: "- 가장자리(j==0, j==i) 처리\n- 1차원 dp로도 가능",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);

let dp = [];
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].trim().split(/\s+/).map(Number);
  const next = Array(i + 1).fill(0);
  for (let j = 0; j <= i; j += 1) {
    const left = j - 1 >= 0 ? dp[j - 1] : -Infinity;
    const right = j < dp.length ? dp[j] : -Infinity;
    const bestPrev = i === 0 ? 0 : Math.max(left, right);
    next[j] = bestPrev + row[j];
  }
  dp = next;
}

let ans = 0;
for (const v of dp) if (v > ans) ans = v;
process.stdout.write(String(ans));
`,
    retrospective: "행 단위로 dp를 갱신하면 메모리를 줄일 수 있다.",
    retryCriteria: "양 끝 경계 처리에서 undefined가 나왔을 때",
  },

  "boj-12865": {
    summary: "배낭 문제: 무게 K 이하로 담을 수 있는 최대 가치 합을 구한다.",
    approach:
      "0/1 knapsack: dp[w] = 무게 w에서 최대 가치. 각 물건에 대해 w를 K..weight 역순으로 갱신.",
    keyPoints: "- dp 1차원\n- w를 역순으로(중복 사용 방지)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++] || 0);
const k = Number(data[idx++] || 0);

const dp = Array(k + 1).fill(0);
for (let i = 0; i < n; i += 1) {
  const w = Number(data[idx++]);
  const v = Number(data[idx++]);
  for (let cap = k; cap >= w; cap -= 1) {
    dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
  }
}

process.stdout.write(String(dp[k]));
`,
    retrospective: "0/1 배낭은 반드시 용량 역순 갱신을 기억.",
    retryCriteria: "정방향으로 갱신해서 같은 물건을 여러 번 쓰게 됐을 때",
  },

  "boj-9461": {
    summary:
      "파도반 수열 P(n)을 구한다. (P(1)=P(2)=P(3)=1, P(n)=P(n-2)+P(n-3))",
    approach:
      "여러 테스트케이스가 있으므로 최대 n까지 DP로 미리 계산한다. 점화식 P[n]=P[n-2]+P[n-3].",
    keyPoints:
      "- base: P1=P2=P3=1, P4=P5=2\n- 점화: P[n]=P[n-2]+P[n-3]\n- 여러 TC: maxN까지 precompute",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(input[idx++] || 0);
const ns = [];
let maxN = 0;
for (let i = 0; i < t; i += 1) {
  const n = Number(input[idx++]);
  ns.push(n);
  if (n > maxN) maxN = n;
}

const dp = Array(Math.max(6, maxN + 1)).fill(0);
dp[1] = 1;
dp[2] = 1;
dp[3] = 1;
dp[4] = 2;
dp[5] = 2;
for (let i = 6; i <= maxN; i += 1) {
  dp[i] = dp[i - 2] + dp[i - 3];
}

process.stdout.write(ns.map((n) => String(dp[n])).join("\n"));
`,
    retrospective: "여러 테스트가 있으면 항상 maxN까지 한 번만 DP를 만들기.",
    retryCriteria: "점화식 인덱스(n-2, n-3)나 초기값을 틀렸을 때",
  },

  "boj-1149": {
    summary:
      "N개의 집을 RGB로 칠할 때 인접한 집은 같은 색을 못 쓰는 조건에서 최소 비용을 구한다.",
    approach:
      "dp[i][c]=i번째 집을 색 c로 칠했을 때 최소 비용. dp[i][c]=cost[i][c]+min(dp[i-1][c'], c'!=c).",
    keyPoints: "- i번째는 이전 집의 다른 색 중 최소\n- 3색이라 점화식이 단순",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);

let prev = [0, 0, 0];
for (let i = 1; i <= n; i += 1) {
  const [r, g, b] = lines[i].trim().split(/\s+/).map(Number);
  const cur = [0, 0, 0];
  cur[0] = r + Math.min(prev[1], prev[2]);
  cur[1] = g + Math.min(prev[0], prev[2]);
  cur[2] = b + Math.min(prev[0], prev[1]);
  prev = cur;
}

process.stdout.write(String(Math.min(prev[0], prev[1], prev[2])));
`,
    retrospective: "색이 3개면 이전 행만 들고 가는 1차원 DP로 끝난다.",
    retryCriteria: "인접 색 제한을 빼먹고 같은 색도 허용해버렸을 때",
  },

  "boj-1904": {
    summary:
      "길이 N의 01 타일(00, 1)로 만들 수 있는 경우의 수를 15746으로 나눈 값을 구한다.",
    approach: "dp[n]=dp[n-1]+dp[n-2] (끝이 1인 경우 / 끝이 00인 경우).",
    keyPoints: "- 피보나치 형태\n- mod 15746",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);
const MOD = 15746;

if (n === 1) {
  process.stdout.write("1");
} else {
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i += 1) {
    const c = (a + b) % MOD;
    a = b;
    b = c;
  }
  process.stdout.write(String(b % MOD));
}
`,
    retrospective: "큰 n에서는 배열보다 변수 2개로 굴리는 게 더 깔끔.",
    retryCriteria: "n=1,2 초기값을 틀렸을 때",
  },

  "boj-9251": {
    summary: "두 문자열의 LCS(최장 공통 부분 수열) 길이를 구한다.",
    approach:
      "dp[i][j]=A[0..i-1],B[0..j-1]의 LCS 길이. 같으면 dp[i-1][j-1]+1, 다르면 max(dp[i-1][j], dp[i][j-1]).",
    keyPoints: "- 2차원 DP\n- 메모리 줄이려면 1차원 롤링 가능",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [a, b] = fs.readFileSync(0, "utf8").trim().split(/\n/);
const A = (a || "").trim();
const B = (b || "").trim();

const n = A.length;
const m = B.length;
let prev = Array(m + 1).fill(0);

for (let i = 1; i <= n; i += 1) {
  const cur = Array(m + 1).fill(0);
  for (let j = 1; j <= m; j += 1) {
    if (A[i - 1] === B[j - 1]) cur[j] = prev[j - 1] + 1;
    else cur[j] = Math.max(prev[j], cur[j - 1]);
  }
  prev = cur;
}

process.stdout.write(String(prev[m]));
`,
    retrospective:
      "문자열 DP는 인덱스(1-based)로 테이블을 잡으면 실수가 줄어든다.",
    retryCriteria: "dp 인덱스와 문자 인덱스를 혼동했을 때",
  },

  "pg-42895": {
    summary:
      "숫자 N을 최대 8번 사용해 number를 만드는 최소 사용 횟수를 구한다.",
    approach:
      "dp[i]=i번 사용해서 만들 수 있는 수의 집합(Set). dp[i]는 dp[j]와 dp[i-j]의 사칙연산 조합으로 만든다.",
    keyPoints:
      "- 이어붙인 수(예: N, NN, NNN)도 포함\n- Set으로 중복 제거\n- i는 1..8",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(N, number) {
  const dp = Array.from({ length: 9 }, () => new Set());

  for (let i = 1; i <= 8; i += 1) {
    const repeated = Number(String(N).repeat(i));
    dp[i].add(repeated);

    for (let j = 1; j < i; j += 1) {
      for (const a of dp[j]) {
        for (const b of dp[i - j]) {
          dp[i].add(a + b);
          dp[i].add(a - b);
          dp[i].add(a * b);
          if (b !== 0) dp[i].add(Math.trunc(a / b));
        }
      }
    }

    if (dp[i].has(number)) return i;
  }
  return -1;
}
`,
    retrospective:
      "DP가 '최소 횟수'이지만 상태는 Set(가능한 값들)로 푸는 전형 유형.",
    retryCriteria:
      "나눗셈(정수 나눗셈) 처리나 반복수(NN...) 추가를 빼먹었을 때",
  },

  "pg-12900": {
    summary:
      "2×n 직사각형을 타일로 채우는 방법 수를 1,000,000,007로 나눈 값을 구한다.",
    approach: "dp[n]=dp[n-1]+dp[n-2] (피보나치 형태).",
    keyPoints: "- mod 1e9+7\n- n이 커서 모듈러 필수",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n) {
  const MOD = 1000000007;
  if (n === 1) return 1;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i += 1) {
    const c = (a + b) % MOD;
    a = b;
    b = c;
  }
  return b % MOD;
}
`,
    retrospective: "BOJ 타일링(11726)과 같은 점화식인데 모듈러만 다르다.",
    retryCriteria: "MOD가 다른 문제에서 그대로 10007을 써버렸을 때",
  },
};
