import type { SolutionTemplate } from "./types";

export const week12Templates: Record<string, SolutionTemplate> = {
  "boj-2470-w12": {
    summary: "두 용액에서 합이 0에 가장 가까운 두 값을 찾는다.",
    approach: "정렬 후 투 포인터로 합을 0에 가깝게 조정한다.",
    keyPoints: "- 정렬\n- l/r 이동 규칙(sum<0 -> l++, sum>0 -> r--)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));
a.sort((x, y) => x - y);

let l = 0;
let r = n - 1;
let best = 1e18;
let ansL = a[l];
let ansR = a[r];

while (l < r) {
  const sum = a[l] + a[r];
  const abs = sum < 0 ? -sum : sum;
  if (abs < best) {
    best = abs;
    ansL = a[l];
    ansR = a[r];
    if (best === 0) break;
  }
  if (sum < 0) l += 1;
  else r -= 1;
}

process.stdout.write(String(ansL) + " " + String(ansR));
`,
    retrospective: "투 포인터는 '정렬 + 단조성'이 보이면 바로 떠올리자.",
    retryCriteria: "포인터 이동 조건을 반대로 해서 더 멀어졌을 때",
  },

  "boj-1806": {
    summary: "연속 부분합이 S 이상인 가장 짧은 길이를 구한다.",
    approach:
      "투 포인터/슬라이딩 윈도우. right를 늘리며 sum을 키우고, sum>=S이면 left를 줄이며 최소 길이를 갱신.",
    keyPoints: "- 양수 배열이라 윈도우 단조\n- ans가 없으면 0",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const s = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

let l = 0;
let sum = 0;
let ans = Infinity;

for (let r = 0; r < n; r += 1) {
  sum += a[r];
  while (sum >= s) {
    const len = r - l + 1;
    if (len < ans) ans = len;
    sum -= a[l];
    l += 1;
  }
}

process.stdout.write(ans === Infinity ? "0" : String(ans));
`,
    retrospective: "양수 배열에서 최소 길이/최대 길이는 투포인터가 매우 강력.",
    retryCriteria: "sum>=S일 때 left를 줄이는 while을 빠뜨렸을 때",
  },

  "boj-2003": {
    summary: "연속 부분 수열의 합이 M이 되는 경우의 수를 구한다.",
    approach:
      "양수 배열 -> 투 포인터로 윈도우 합을 유지하며 sum==M이면 카운트.",
    keyPoints: "- sum<M이면 r++\n- sum>=M이면 l++",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

let l = 0;
let r = 0;
let sum = 0;
let cnt = 0;

while (true) {
  if (sum >= m) {
    if (sum === m) cnt += 1;
    sum -= a[l++];
  } else {
    if (r === n) break;
    sum += a[r++];
  }
}

process.stdout.write(String(cnt));
`,
    retrospective: "M과 정확히 같은 합 count는 투포인터로 O(N) 처리.",
    retryCriteria: "루프 종료 조건(r==n) 위치를 잘못 둬 무한루프가 났을 때",
  },

  "boj-2559": {
    summary: "길이 K의 연속 부분합 중 최대값을 구한다.",
    approach: "슬라이딩 윈도우로 K개 합을 유지하며 한 칸씩 밀면서 최대를 갱신.",
    keyPoints: "- 초기 K합\n- sum += a[i] - a[i-K]",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const k = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

let sum = 0;
for (let i = 0; i < k; i += 1) sum += a[i];
let best = sum;
for (let i = k; i < n; i += 1) {
  sum += a[i] - a[i - k];
  if (sum > best) best = sum;
}

process.stdout.write(String(best));
`,
    retrospective: "고정 길이 윈도우는 슬라이딩이 정석.",
    retryCriteria: "초기 K합을 잘못 잡았을 때",
  },

  "boj-1644": {
    summary: "N을 연속된 소수의 합으로 표현하는 경우의 수를 구한다.",
    approach:
      "에라토스테네스로 소수 리스트 생성 후, 투 포인터로 연속 합을 유지하며 sum==N 카운트.",
    keyPoints: "- primes 생성\n- two pointers on primes",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);
if (n < 2) {
  process.stdout.write("0");
  process.exit(0);
}

const isPrime = Array(n + 1).fill(true);
isPrime[0] = false;
isPrime[1] = false;
for (let i = 2; i * i <= n; i += 1) {
  if (!isPrime[i]) continue;
  for (let j = i * i; j <= n; j += i) isPrime[j] = false;
}

const primes = [];
for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);

let l = 0;
let r = 0;
let sum = 0;
let cnt = 0;

while (true) {
  if (sum >= n) {
    if (sum === n) cnt += 1;
    sum -= primes[l++];
  } else {
    if (r === primes.length) break;
    sum += primes[r++];
  }
}

process.stdout.write(String(cnt));
`,
    retrospective: "소수 생성 + 투포인터 조합은 자주 출제된다.",
    retryCriteria: "에라토스테네스 범위를 잘못 잡아 소수가 누락됐을 때",
  },

  "boj-20922": {
    summary:
      "같은 수가 K번 이하로만 등장하는 가장 긴 연속 부분 수열 길이를 구한다.",
    approach:
      "슬라이딩 윈도우 + 빈도 맵. right 확장 후 어떤 값의 빈도가 K 초과면 left를 줄여 조건을 만족.",
    keyPoints: "- freq map\n- while(freq[val] > K) shrink",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const k = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

const freq = new Map();
let l = 0;
let ans = 0;

for (let r = 0; r < n; r += 1) {
  const v = a[r];
  freq.set(v, (freq.get(v) || 0) + 1);

  while ((freq.get(v) || 0) > k) {
    const lv = a[l++];
    freq.set(lv, freq.get(lv) - 1);
  }

  const len = r - l + 1;
  if (len > ans) ans = len;
}

process.stdout.write(String(ans));
`,
    retrospective: "조건형(중복 제한) 윈도우는 빈도 맵으로 해결.",
    retryCriteria: "while 조건을 if로 둬서 한 번만 줄여 오답이 났을 때",
  },

  "boj-2467": {
    summary: "용액(두 용액) 문제: 합이 0에 가장 가까운 두 값을 찾는다.",
    approach: "정렬 + 투 포인터.",
    keyPoints: "- 2470과 동일 패턴",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));
a.sort((x, y) => x - y);

let l = 0;
let r = n - 1;
let best = 1e18;
let ansL = a[l];
let ansR = a[r];

while (l < r) {
  const sum = a[l] + a[r];
  const abs = sum < 0 ? -sum : sum;
  if (abs < best) {
    best = abs;
    ansL = a[l];
    ansR = a[r];
  }
  if (sum < 0) l += 1;
  else r -= 1;
}

process.stdout.write(String(ansL) + " " + String(ansR));
`,
    retrospective: "두 용액류는 투포인터 템플릿으로 빠르게.",
    retryCriteria: "정렬을 빼먹었을 때",
  },

  "boj-13144": {
    summary: "중복 없는 연속 부분 수열의 개수를 구한다.",
    approach:
      "투 포인터로 윈도우에 중복이 없게 유지. 각 left에 대해 가능한 길이(len)만큼 답에 더한다(ans += len).",
    keyPoints: "- freq/visited로 중복 제거\n- ans += (r-l) 누적",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const a = [];
let maxV = 0;
for (let i = 0; i < n; i += 1) {
  const v = Number(data[idx++]);
  a.push(v);
  if (v > maxV) maxV = v;
}

// values up to 100000 in BOJ
const vis = Array(maxV + 1).fill(false);
let r = 0;
let ans = 0n;

for (let l = 0; l < n; l += 1) {
  while (r < n && !vis[a[r]]) {
    vis[a[r]] = true;
    r += 1;
  }
  ans += BigInt(r - l);
  vis[a[l]] = false;
}

process.stdout.write(String(ans));
`,
    retrospective: "중복 없는 구간 수는 '길이만큼 더하기'가 포인트.",
    retryCriteria: "ans를 Number로 두어 오버플로가 났을 때",
  },

  "boj-2531": {
    summary:
      "회전 초밥에서 연속 K개를 먹을 때 종류 수 최대(쿠폰 포함)를 구한다.",
    approach:
      "원형을 처리하기 위해 배열을 2배로 보거나 인덱스 mod 사용. 슬라이딩 윈도우로 빈도 관리, 쿠폰 초밥 포함 여부로 +1.",
    keyPoints: "- freq 배열\n- distinct count 유지\n- 쿠폰(c) 처리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const d = Number(data[idx++]);
const k = Number(data[idx++]);
const c = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

const freq = Array(d + 1).fill(0);
let distinct = 0;

for (let i = 0; i < k; i += 1) {
  const v = a[i % n];
  if (freq[v] === 0) distinct += 1;
  freq[v] += 1;
}

let ans = distinct + (freq[c] === 0 ? 1 : 0);

for (let i = 1; i < n; i += 1) {
  const out = a[(i - 1) % n];
  freq[out] -= 1;
  if (freq[out] === 0) distinct -= 1;

  const inn = a[(i + k - 1) % n];
  if (freq[inn] === 0) distinct += 1;
  freq[inn] += 1;

  const cur = distinct + (freq[c] === 0 ? 1 : 0);
  if (cur > ans) ans = cur;
}

process.stdout.write(String(ans));
`,
    retrospective: "원형 슬라이딩 윈도우는 mod 인덱스로 깔끔히 처리 가능.",
    retryCriteria: "쿠폰 초밥을 이미 포함했는데도 +1 해버렸을 때",
  },

  "boj-12891": {
    summary:
      "DNA 문자열에서 길이 P의 부분 문자열이 최소 조건(A,C,G,T)을 만족하는 개수를 구한다.",
    approach:
      "슬라이딩 윈도우로 각 문자의 개수를 유지하며 조건을 만족하면 카운트.",
    keyPoints: "- 윈도우 갱신 O(1)\n- 조건 체크",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [sStr, pStr] = lines[0].trim().split(/\s+/);
const s = Number(sStr);
const p = Number(pStr);
const dna = (lines[1] || "").trim();
const need = lines[2].trim().split(/\s+/).map(Number); // A C G T

const idxMap = { A: 0, C: 1, G: 2, T: 3 };
const cnt = [0, 0, 0, 0];

for (let i = 0; i < p; i += 1) cnt[idxMap[dna[i]]] += 1;

function ok() {
  for (let i = 0; i < 4; i += 1) if (cnt[i] < need[i]) return false;
  return true;
}

let ans = ok() ? 1 : 0;
for (let i = p; i < s; i += 1) {
  cnt[idxMap[dna[i - p]]] -= 1;
  cnt[idxMap[dna[i]]] += 1;
  if (ok()) ans += 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "문자 카운트 조건은 윈도우로 유지하면 된다.",
    retryCriteria: "초기 윈도우(p개) 세팅을 빼먹었을 때",
  },

  "pg-67258": {
    summary: "모든 종류의 보석을 포함하는 가장 짧은 구간을 찾는다.",
    approach:
      "투 포인터 + 빈도 맵. right를 늘려 모든 종류를 포함하면 left를 줄여 최소 구간 갱신.",
    keyPoints: "- Map freq\n- coverCount==types 일 때 shrink",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(gems) {
  const types = new Set(gems).size;
  const freq = new Map();

  let l = 0;
  let bestLen = Infinity;
  let best = [1, gems.length];

  for (let r = 0; r < gems.length; r += 1) {
    const g = gems[r];
    freq.set(g, (freq.get(g) || 0) + 1);

    while (freq.size === types) {
      const len = r - l + 1;
      if (len < bestLen) {
        bestLen = len;
        best = [l + 1, r + 1];
      }
      const lv = gems[l++];
      freq.set(lv, freq.get(lv) - 1);
      if (freq.get(lv) === 0) freq.delete(lv);
    }
  }

  return best;
}
`,
    retrospective: "모든 종류 포함 문제는 투 포인터로 표준화 가능.",
    retryCriteria: "동일 길이일 때 더 앞 구간 우선 조건을 놓쳤을 때",
  },

  "pg-131127": {
    summary:
      "10일 연속으로 원하는 상품을 모두 살 수 있는 시작일 개수를 구한다.",
    approach:
      "슬라이딩 윈도우(길이 10)로 품목별 개수를 유지하고, 원하는 개수와 일치하면 카운트.",
    keyPoints: "- 윈도우 길이 고정(10)\n- Map 비교",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(want, number, discount) {
  const need = new Map();
  for (let i = 0; i < want.length; i += 1) need.set(want[i], number[i]);

  const freq = new Map();
  function add(x, v) {
    freq.set(x, (freq.get(x) || 0) + v);
    if (freq.get(x) === 0) freq.delete(x);
  }

  for (let i = 0; i < 10 && i < discount.length; i += 1) add(discount[i], 1);

  function ok() {
    for (const [k, v] of need.entries()) {
      if ((freq.get(k) || 0) !== v) return false;
    }
    return true;
  }

  let ans = 0;
  if (discount.length >= 10 && ok()) ans += 1;

  for (let i = 10; i < discount.length; i += 1) {
    add(discount[i - 10], -1);
    add(discount[i], 1);
    if (ok()) ans += 1;
  }

  return ans;
}
`,
    retrospective: "윈도우가 고정이면 갱신이 단순하고 비교만 잘하면 된다.",
    retryCriteria: "discount 길이가 10 미만인 예외를 놓쳤을 때",
  },
};
