import type { SolutionTemplate } from "./types";

export const week8Templates: Record<string, SolutionTemplate> = {
  "boj-1783": {
    summary:
      "병든 나이트가 규칙에 따라 이동할 때 방문할 수 있는 최대 칸 수를 구한다.",
    approach:
      "케이스 분기(그리디/수학). 높이 N이 1/2인 경우와, N>=3에서 폭 M에 따라 공식 적용.",
    keyPoints:
      "- N==1 -> 1\n- N==2 -> min(4, floor((M+1)/2))\n- N>=3: M<7이면 min(4,M), 아니면 M-2",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, mStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const m = Number(mStr);

let ans = 0;
if (n === 1) ans = 1;
else if (n === 2) ans = Math.min(4, Math.floor((m + 1) / 2));
else {
  if (m < 7) ans = Math.min(4, m);
  else ans = m - 2;
}

process.stdout.write(String(ans));
`,
    retrospective: "이 문제는 탐색이 아니라 케이스 분기 공식이 핵심.",
    retryCriteria: "N==2 케이스에서 (M+1)/2 계산을 헷갈렸을 때",
  },

  "boj-11501": {
    summary: "주식 가격이 주어질 때 최대 이익을 구한다(무제한 매수/매도).",
    approach:
      "오른쪽에서 왼쪽으로 보면서 현재까지의 최대 가격(max)을 유지. max보다 낮으면 매수(이익+=max-price), 높으면 max 갱신.",
    keyPoints: "- 뒤에서부터 max 유지\n- long 범위(이익 누적)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(input[idx++] || 0);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const n = Number(input[idx++]);
  const a = [];
  for (let i = 0; i < n; i += 1) a.push(Number(input[idx++]));

  let max = 0;
  let profit = 0;
  for (let i = n - 1; i >= 0; i -= 1) {
    if (a[i] > max) max = a[i];
    else profit += (max - a[i]);
  }
  out.push(String(profit));
}

process.stdout.write(out.join("\n"));
`,
    retrospective:
      "그리디는 '미래의 최적 선택'을 한 방향 스캔으로 구현하는 경우가 많다.",
    retryCriteria: "앞에서 스캔하며 지역 최적을 잡아 오답이 났을 때",
  },

  "boj-1946": {
    summary: "서류/면접 순위가 주어질 때 선발 가능한 최대 인원을 구한다.",
    approach:
      "서류 순위 오름차순 정렬 후, 지금까지의 면접 최고(최소 rank)를 갱신하며 더 좋은 면접 순위면 선발.",
    keyPoints: "- 한 기준 정렬 후 다른 기준 최소 유지\n- O(N log N)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(input[idx++] || 0);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const n = Number(input[idx++]);
  const arr = [];
  for (let i = 0; i < n; i += 1) {
    const a = Number(input[idx++]);
    const b = Number(input[idx++]);
    arr.push([a, b]);
  }
  arr.sort((x, y) => x[0] - y[0]);

  let best = Infinity;
  let cnt = 0;
  for (const [, interview] of arr) {
    if (interview < best) {
      best = interview;
      cnt += 1;
    }
  }
  out.push(String(cnt));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "2차원 순위는 한 축 정렬 + 다른 축 최소 유지로 자주 풀린다.",
    retryCriteria: "정렬 기준을 잘못 잡아 best 갱신이 꼬였을 때",
  },

  "boj-11497": {
    summary:
      "통나무를 원형으로 배치했을 때 인접 차이의 최댓값(난이도)을 최소로 만든다.",
    approach:
      "정렬 후 '펜듈럼 배치'를 하면 최댓값은 정렬된 배열에서 2칸 차이의 최대(max(|a[i]-a[i-2]|)).",
    keyPoints: "- 정렬\n- 답은 max(a[i]-a[i-2])",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(input[idx++] || 0);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const n = Number(input[idx++]);
  const a = [];
  for (let i = 0; i < n; i += 1) a.push(Number(input[idx++]));
  a.sort((x, y) => x - y);

  let ans = 0;
  for (let i = 2; i < n; i += 1) {
    const diff = a[i] - a[i - 2];
    if (diff > ans) ans = diff;
  }
  out.push(String(ans));
}

process.stdout.write(out.join("\n"));
`,
    retrospective:
      "배치는 복잡해 보여도, 정렬 후 패턴이 답(2칸 차)으로 떨어지는 문제.",
    retryCriteria: "인접 차이를 직접 시뮬레이션하려다 꼬였을 때",
  },

  "pg-42883": {
    summary: "숫자 문자열에서 k개를 제거해 가장 큰 수를 만든다.",
    approach:
      "스택 그리디. 현재 자리 숫자가 더 크면 스택 top을 pop하면서 k를 소진. 남은 k는 뒤에서 제거.",
    keyPoints: "- 단조 감소 스택\n- 남은 k는 suffix 삭제",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(number, k) {
  const st = [];
  let rem = k;
  for (const ch of number) {
    while (rem > 0 && st.length && st[st.length - 1] < ch) {
      st.pop();
      rem -= 1;
    }
    st.push(ch);
  }
  if (rem > 0) st.splice(st.length - rem, rem);
  return st.join("");
}
`,
    retrospective:
      "'앞자리부터 최대'는 스택으로 이전 선택을 되돌리는 그리디가 자주 등장.",
    retryCriteria: "남은 k를 처리하지 않아 길이가 맞지 않을 때",
  },

  "pg-42862": {
    summary: "체육복 도난/여분 학생이 있을 때 최대 수업 참여 학생 수를 구한다.",
    approach:
      "도난/여분을 정리(교집합 제거) 후, 여분 학생이 앞/뒤 학생에게 빌려주는 그리디.",
    keyPoints: "- lost/reserve 교집합 제거\n- 정렬 후 앞->뒤로 대여",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n, lost, reserve) {
  const lostSet = new Set(lost);
  const reserveSet = new Set(reserve);

  for (const x of reserve) {
    if (lostSet.has(x)) {
      lostSet.delete(x);
      reserveSet.delete(x);
    }
  }

  const lostArr = Array.from(lostSet).sort((a, b) => a - b);
  const reserveArr = Array.from(reserveSet).sort((a, b) => a - b);

  for (const r of reserveArr) {
    if (lostSet.has(r - 1)) lostSet.delete(r - 1);
    else if (lostSet.has(r + 1)) lostSet.delete(r + 1);
  }

  return n - lostSet.size;
}
`,
    retrospective: "교집합 제거를 먼저 하면 구현이 훨씬 쉬워진다.",
    retryCriteria: "교집합을 제거하지 않아 double-count가 생겼을 때",
  },

  "boj-11047": {
    summary:
      "동전 가치가 주어질 때, K원을 만들기 위한 최소 동전 개수를 구한다.",
    approach:
      "가치가 배수 구조(문제 보장)라 큰 동전부터 최대한 사용하는 그리디.",
    keyPoints: "- 큰 값부터\n- cnt += floor(K/coin)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(input[idx++]);
let k = Number(input[idx++]);
const coins = [];
for (let i = 0; i < n; i += 1) coins.push(Number(input[idx++]));

let cnt = 0;
for (let i = n - 1; i >= 0; i -= 1) {
  const c = coins[i];
  if (c <= k) {
    const use = Math.floor(k / c);
    cnt += use;
    k -= use * c;
  }
}

process.stdout.write(String(cnt));
`,
    retrospective: "그리디는 '문제 조건이 정당화'되는지(배수 구조)를 확인.",
    retryCriteria: "정렬/큰 동전부터 처리를 빠뜨렸을 때",
  },

  "boj-1931": {
    summary: "회의 시작/끝 시간이 주어질 때 최대한 많은 회의를 선택한다.",
    approach:
      "끝나는 시간 오름차순(동률이면 시작 오름차순)으로 정렬 후, 가능한 회의를 순서대로 선택.",
    keyPoints: "- 종료 시간 기준 정렬\n- lastEnd 갱신",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(input[idx++]);
const arr = [];
for (let i = 0; i < n; i += 1) {
  const s = Number(input[idx++]);
  const e = Number(input[idx++]);
  arr.push([s, e]);
}

arr.sort((a, b) => (a[1] - b[1]) || (a[0] - b[0]));

let cnt = 0;
let last = 0;
for (const [s, e] of arr) {
  if (s >= last) {
    cnt += 1;
    last = e;
  }
}

process.stdout.write(String(cnt));
`,
    retrospective: "가장 빨리 끝나는 것을 먼저 선택하는 전형적인 구간 그리디.",
    retryCriteria: "정렬을 시작 시간으로 해버려 오답이 났을 때",
  },

  "boj-13305": {
    summary: "도로 거리와 주유소 가격이 있을 때 최소 비용으로 이동한다.",
    approach:
      "왼쪽부터 진행하며 지금까지의 최소 가격(minPrice)을 유지. 다음 거리만큼 minPrice로 구매한다고 생각.",
    keyPoints: "- minPrice 유지\n- 비용은 long",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const dist = [];
for (let i = 0; i < n - 1; i += 1) dist.push(BigInt(data[idx++]));
const price = [];
for (let i = 0; i < n; i += 1) price.push(BigInt(data[idx++]));

let minP = price[0];
let cost = 0n;
for (let i = 0; i < n - 1; i += 1) {
  if (price[i] < minP) minP = price[i];
  cost += minP * dist[i];
}

process.stdout.write(String(cost));
`,
    retrospective:
      "'앞에서부터 최소 가격 유지'는 주유소/환전류 그리디에 자주 등장.",
    retryCriteria: "Number로 처리해 오버플로가 났을 때",
  },

  "boj-4796": {
    summary:
      "캠핑장에서 L일 사용 가능, P일 주기. 휴가 V일 동안 최대 사용일 수를 구한다.",
    approach: "V를 P로 나눈 몫*L + min(L, V%P) 공식.",
    keyPoints: "- 케이스 번호 출력\n- 0 0 0 종료",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
let tc = 1;
const out = [];

while (idx < data.length) {
  const L = Number(data[idx++]);
  const P = Number(data[idx++]);
  const V = Number(data[idx++]);
  if (L === 0 && P === 0 && V === 0) break;
  const ans = Math.floor(V / P) * L + Math.min(L, V % P);
  out.push("Case " + tc + ": " + String(ans));
  tc += 1;
}

process.stdout.write(out.join("\n"));
`,
    retrospective:
      "공식형 그리디는 문제를 '주기 + 나머지'로 분해하면 바로 보인다.",
    retryCriteria: "출력 포맷(Case i: )을 틀렸을 때",
  },

  "pg-42861": {
    summary: "모든 섬을 연결하는 최소 비용을 구한다(MST).",
    approach:
      "크루스칼: 간선을 비용 오름차순 정렬 후, 유니온 파인드로 사이클 없이 선택.",
    keyPoints: "- Union-Find\n- 간선 정렬\n- MST 간선 수 N-1",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n, costs) {
  costs.sort((a, b) => a[2] - b[2]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(a, b) {
    a = find(a);
    b = find(b);
    if (a === b) return false;
    if (rank[a] < rank[b]) {
      parent[a] = b;
    } else if (rank[a] > rank[b]) {
      parent[b] = a;
    } else {
      parent[b] = a;
      rank[a] += 1;
    }
    return true;
  }

  let ans = 0;
  let used = 0;
  for (const [a, b, c] of costs) {
    if (union(a, b)) {
      ans += c;
      used += 1;
      if (used === n - 1) break;
    }
  }
  return ans;
}
`,
    retrospective: "MST는 크루스칼/프림 중 하나를 템플릿으로 익혀두면 좋다.",
    retryCriteria: "Union-Find find 압축을 빼먹어 효율이 떨어졌을 때",
  },

  "pg-42860": {
    summary: "조이스틱으로 이름을 만들 때 최소 조작 횟수를 구한다.",
    approach:
      "각 문자 변경(상하) 비용 합 + 커서 이동(좌우) 최솟값. 연속된 'A' 구간을 활용해 되돌아가는 이동을 최소화한다.",
    keyPoints:
      "- 상하: min(ch-'A', 'Z'-ch+1)\n- 좌우: 기본 n-1, A연속 구간으로 min 갱신",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(name) {
  const n = name.length;
  let upDown = 0;
  for (let i = 0; i < n; i += 1) {
    const code = name.charCodeAt(i);
    const a = code - 65;
    const z = 91 - code; // 'Z' - ch + 1
    upDown += Math.min(a, z);
  }

  let move = n - 1;
  for (let i = 0; i < n; i += 1) {
    let j = i + 1;
    while (j < n && name[j] === "A") j += 1;

    const go = i;
    const back = n - j;

    // i까지 갔다가 돌아와서 끝으로
    move = Math.min(move, go * 2 + back);
    // 반대로 끝에서부터 와서 i로
    move = Math.min(move, go + back * 2);
  }

  return upDown + move;
}
`,
    retrospective:
      "'연속 A'를 어디서 끊고 방향 전환할지가 핵심인 그리디/최적화 문제.",
    retryCriteria: "좌우 이동 최솟값 갱신(2가지 케이스)을 하나만 고려했을 때",
  },
};
