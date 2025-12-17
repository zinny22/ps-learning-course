import type { SolutionTemplate } from "./types";

export const week7Templates: Record<string, SolutionTemplate> = {
  "boj-2630": {
    summary:
      "NxN 색종이를 같은 색(0/1)으로만 이루어진 종이로 분할했을 때, 흰/파란 색종이 개수를 구한다.",
    approach:
      "분할정복: (x,y,size) 영역이 모두 같은 색이면 카운트, 아니면 size/2로 4분할 재귀.",
    keyPoints: "- 영역이 단색인지 검사\n- 아니면 4등분 재귀",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split(/\s+/).map(Number));

let white = 0;
let blue = 0;

function solve(x, y, size) {
  const first = a[x][y];
  let same = true;
  for (let i = x; i < x + size && same; i += 1) {
    for (let j = y; j < y + size; j += 1) {
      if (a[i][j] !== first) { same = false; break; }
    }
  }
  if (same) {
    if (first === 0) white += 1;
    else blue += 1;
    return;
  }
  const half = size >> 1;
  solve(x, y, half);
  solve(x, y + half, half);
  solve(x + half, y, half);
  solve(x + half, y + half, half);
}

solve(0, 0, n);
process.stdout.write(String(white) + "\n" + String(blue));
`,
    retrospective: "단색 판정 후 분할하는 전형적인 분할정복.",
    retryCriteria: "4분할 좌표/범위를 잘못 잡았을 때",
  },

  "boj-2448": {
    summary: "N(=3*2^k) 높이의 별 삼각형 패턴을 출력한다.",
    approach:
      "분할정복: base(N=3) 패턴을 만들고, N을 절반으로 줄이며 위/아래(좌/우)로 복사해 확장한다.",
    keyPoints: "- N은 3*2^k\n- 문자열 배열로 구성",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);

let arr = ["  *  ", " * * ", "*****"]; // N=3
let h = 3;

while (h < n) {
  const next = [];
  const pad = " ".repeat(h);
  for (const s of arr) next.push(pad + s + pad);
  for (const s of arr) next.push(s + " " + s);
  arr = next;
  h *= 2;
}

process.stdout.write(arr.join("\n"));
`,
    retrospective: "패턴 출력은 배열로 만들고 점진적으로 확장하면 구현이 단순.",
    retryCriteria: "공백 패딩 길이를 잘못 계산해 모양이 깨졌을 때",
  },

  "boj-1780": {
    summary:
      "NxN 종이를 -1/0/1로 채운 뒤, 같은 수로만 이루어진 종이 개수를 구한다.",
    approach:
      "분할정복: 단색이면 카운트, 아니면 3등분(size/3)하여 9개 영역으로 재귀.",
    keyPoints: "- 9분할 재귀\n- 단색 판정",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split(/\s+/).map(Number));

let c1 = 0;
let c0 = 0;
let cP = 0;

function add(v) {
  if (v === -1) c1 += 1;
  else if (v === 0) c0 += 1;
  else cP += 1;
}

function solve(x, y, size) {
  const first = a[x][y];
  let same = true;
  for (let i = x; i < x + size && same; i += 1) {
    for (let j = y; j < y + size; j += 1) {
      if (a[i][j] !== first) { same = false; break; }
    }
  }
  if (same) { add(first); return; }
  const third = size / 3;
  for (let dx = 0; dx < 3; dx += 1) {
    for (let dy = 0; dy < 3; dy += 1) {
      solve(x + dx * third, y + dy * third, third);
    }
  }
}

solve(0, 0, n);
process.stdout.write(String(c1) + "\n" + String(c0) + "\n" + String(cP));
`,
    retrospective: "2분할/3분할만 바뀌는 분할정복 변형.",
    retryCriteria: "third 계산/9분할 좌표가 틀렸을 때",
  },

  "boj-1992": {
    summary: "0/1 영상의 쿼드트리 압축 결과를 출력한다.",
    approach:
      "분할정복: 단색이면 그 값 출력, 아니면 ( + 4분할 결과 + ) 형태로 출력.",
    keyPoints: "- 출력 문자열을 재귀로 구성\n- 단색 판정",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split("").map((c) => c));

function solve(x, y, size) {
  const first = a[x][y];
  let same = true;
  for (let i = x; i < x + size && same; i += 1) {
    for (let j = y; j < y + size; j += 1) {
      if (a[i][j] !== first) { same = false; break; }
    }
  }
  if (same) return first;
  const half = size >> 1;
  return "(" +
    solve(x, y, half) +
    solve(x, y + half, half) +
    solve(x + half, y, half) +
    solve(x + half, y + half, half) +
    ")";
}

process.stdout.write(solve(0, 0, n));
`,
    retrospective: "재귀 반환값을 문자열로 두면 출력 누적이 편하다.",
    retryCriteria: "괄호 출력 순서를 틀렸을 때",
  },

  "boj-2512": {
    summary:
      "요청 예산 배열에서 상한액 cap을 정해 총합이 M 이하가 되게 할 때, 가능한 최대 cap을 구한다.",
    approach:
      "cap을 이분탐색. sum(min(req,cap)) <= M 조건을 만족하는 최대 cap.",
    keyPoints: "- 결정 문제로 바꿔 이분탐색\n- upper bound",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const arr = [];
let mx = 0;
for (let i = 0; i < n; i += 1) {
  const v = Number(data[idx++]);
  arr.push(v);
  if (v > mx) mx = v;
}
const m = Number(data[idx++]);

let lo = 0;
let hi = mx;
let ans = 0;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  let sum = 0;
  for (const v of arr) sum += v < mid ? v : mid;
  if (sum <= m) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "'최대 cap' 류는 upper bound 이분탐색 템플릿.",
    retryCriteria: "조건(sum<=M)에서 경계(lo/hi) 이동을 반대로 했을 때",
  },

  "boj-2110": {
    summary:
      "집 좌표에 C개의 공유기를 설치할 때, 인접 공유기 간 최소 거리를 최대화한다.",
    approach:
      "거리 d를 이분탐색. 그리디로 d 이상 간격으로 설치 가능한 공유기 수를 세어 C 이상이면 가능.",
    keyPoints: "- 결정 문제(d 가능?)\n- 정렬 + 그리디 설치",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const c = Number(data[idx++]);
const x = [];
for (let i = 0; i < n; i += 1) x.push(Number(data[idx++]));
x.sort((a, b) => a - b);

function can(d) {
  let cnt = 1;
  let last = x[0];
  for (let i = 1; i < n; i += 1) {
    if (x[i] - last >= d) {
      cnt += 1;
      last = x[i];
    }
  }
  return cnt >= c;
}

let lo = 1;
let hi = x[n - 1] - x[0];
let ans = 0;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (can(mid)) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "좌표+최소거리 최대화는 '이분탐색 + 그리디'가 정석.",
    retryCriteria: "can(mid)에서 설치 카운트 로직이 틀렸을 때",
  },

  "boj-2470-w7": {
    summary: "두 용액의 합이 0에 가장 가까운 두 값을 찾는다.",
    approach: "정렬 후 투 포인터로 합을 0에 가깝게 조정한다.",
    keyPoints: "- 정렬\n- l/r 포인터 이동 규칙(sum<0면 l++, sum>0면 r--)",
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
    retrospective: "정렬 + 투포인터는 이분탐색 섹션에서도 자주 같이 등장.",
    retryCriteria: "절댓값 비교/포인터 이동 조건을 반대로 했을 때",
  },

  "boj-2805": {
    summary:
      "나무 높이 배열에서 절단기 높이 H를 정해 얻는 나무 길이가 M 이상이 되게 할 때 최대 H를 구한다.",
    approach: "H를 이분탐색. sum(max(0, h-H)) >= M 조건을 만족하는 최대 H.",
    keyPoints: "- upper bound 이분탐색\n- sum은 long 범위",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const a = [];
let mx = 0;
for (let i = 0; i < n; i += 1) {
  const v = Number(data[idx++]);
  a.push(v);
  if (v > mx) mx = v;
}

let lo = 0;
let hi = mx;
let ans = 0;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  let sum = 0;
  for (const v of a) if (v > mid) sum += (v - mid);
  if (sum >= m) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "나무 자르기/예산/공유기 설치는 이분탐색 3대장.",
    retryCriteria: "sum>=M 조건에서 lo/hi 이동을 틀렸을 때",
  },

  "boj-1300": {
    summary: "N×N 곱셈표에서 K번째 수를 구한다.",
    approach:
      "값 x를 이분탐색. 곱셈표에서 x 이하 원소 개수는 sum(min(N, floor(x/i)))로 계산.",
    keyPoints: "- 값 범위 이분탐색(1..K 또는 1..N^2)\n- count(x) 계산",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, kStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const k = Number(kStr);

function countLE(x) {
  let cnt = 0;
  for (let i = 1; i <= n; i += 1) {
    const add = Math.floor(x / i);
    cnt += add < n ? add : n;
  }
  return cnt;
}

let lo = 1;
let hi = k;
let ans = k;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (countLE(mid) >= k) { ans = mid; hi = mid - 1; }
  else lo = mid + 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "K번째 수는 'count(x)로 lower bound'가 핵심.",
    retryCriteria: "hi를 N^2로 잡아도 되지만, k로 잡는 최적화를 놓쳤을 때",
  },

  "boj-1654": {
    summary: "K개의 랜선을 잘라 N개 이상 만들 때, 가능한 최대 길이를 구한다.",
    approach:
      "길이 L을 이분탐색. sum(floor(len/L)) >= N 이면 가능, 최대 L을 찾는다.",
    keyPoints: "- upper bound\n- lo=1부터",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const k = Number(data[idx++]);
const n = Number(data[idx++]);
const a = [];
let mx = 0;
for (let i = 0; i < k; i += 1) {
  const v = Number(data[idx++]);
  a.push(v);
  if (v > mx) mx = v;
}

let lo = 1;
let hi = mx;
let ans = 0;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  let cnt = 0;
  for (const v of a) cnt += Math.floor(v / mid);
  if (cnt >= n) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "'최대 길이'는 upper bound 패턴으로 익숙해지자.",
    retryCriteria: "lo=0으로 두고 0으로 나누는 케이스가 생겼을 때",
  },

  "boj-2343": {
    summary:
      "N개의 강의(길이)가 있을 때 M개의 블루레이로 순서대로 담아 최소 용량을 구한다.",
    approach:
      "용량 cap을 이분탐색. 그리디로 순서대로 담으며 필요한 디스크 수를 세어 <=M이면 가능.",
    keyPoints: "- lo는 max(lecture)\n- can(cap)에서 디스크 카운트",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const a = [];
let lo = 0;
let sum = 0;
for (let i = 0; i < n; i += 1) {
  const v = Number(data[idx++]);
  a.push(v);
  if (v > lo) lo = v;
  sum += v;
}

function can(cap) {
  let cnt = 1;
  let cur = 0;
  for (const v of a) {
    if (cur + v <= cap) cur += v;
    else { cnt += 1; cur = v; }
  }
  return cnt <= m;
}

let hi = sum;
let ans = hi;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (can(mid)) { ans = mid; hi = mid - 1; }
  else lo = mid + 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "이분탐색은 '결정 문제 만들기'가 80%.",
    retryCriteria: "lo를 max가 아니라 0으로 두어 can이 깨졌을 때",
  },

  "pg-43238": {
    summary: "입국심사에서 n명을 심사하는 최소 시간을 구한다.",
    approach:
      "시간 t를 이분탐색. t 동안 처리 가능한 인원 sum(floor(t/time)) >= n이면 가능.",
    keyPoints: "- time 범위는 매우 큼(64-bit)\n- lower bound",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n, times) {
  let lo = 0;
  let hi = Math.max(...times) * n;
  let ans = hi;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let cnt = 0;
    for (const t of times) {
      cnt += Math.floor(mid / t);
      if (cnt >= n) break;
    }
    if (cnt >= n) { ans = mid; hi = mid - 1; }
    else lo = mid + 1;
  }

  return ans;
}
`,
    retrospective: "프로그래머스 이분탐색 대표 문제.",
    retryCriteria: "hi 상한을 너무 작게 잡아 답을 놓쳤을 때",
  },

  "pg-43236": {
    summary: "바위 제거 후 남는 바위 간 최소거리의 최댓값을 구한다.",
    approach:
      "거리 d를 이분탐색. 그리디로 d 미만 간격이 나오면 바위를 제거(카운트)하고, 제거 수<=n이면 가능.",
    keyPoints: "- 결정 문제(d 가능?)\n- rocks 정렬 + 마지막 distance 포함",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(distance, rocks, n) {
  rocks.sort((a, b) => a - b);
  rocks.push(distance);

  function can(d) {
    let removed = 0;
    let prev = 0;
    for (const r of rocks) {
      if (r - prev < d) removed += 1;
      else prev = r;
    }
    return removed <= n;
  }

  let lo = 1;
  let hi = distance;
  let ans = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (can(mid)) { ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}
`,
    retrospective: "'최소거리 최대화'는 공유기 설치와 동일한 패턴.",
    retryCriteria:
      "마지막 지점(distance)을 rocks에 추가하지 않아 계산이 틀렸을 때",
  },
};
