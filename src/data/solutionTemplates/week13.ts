import type { SolutionTemplate } from "./types";

export const week13Templates: Record<string, SolutionTemplate> = {
  "boj-15649": {
    summary: "1부터 N까지 중 중복 없이 M개를 고른 수열을 모두 출력한다.",
    approach: "백트래킹(DFS)으로 방문 체크하며 길이 M이 되면 출력.",
    keyPoints: "- visited 배열\n- 출력은 문자열로 누적",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, mStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const m = Number(mStr);

const vis = Array(n + 1).fill(false);
const pick = [];
const out = [];

function dfs() {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = 1; i <= n; i += 1) {
    if (vis[i]) continue;
    vis[i] = true;
    pick.push(i);
    dfs();
    pick.pop();
    vis[i] = false;
  }
}

dfs();
process.stdout.write(out.join("\n"));
`,
    retrospective: "N과 M 시리즈는 visited/dfs 템플릿으로 통일.",
    retryCriteria: "출력을 매번 console.log로 해 시간초과가 났을 때",
  },

  "boj-15650": {
    summary:
      "1부터 N까지 중 중복 없이 M개를 고르는 조합(오름차순)을 모두 출력한다.",
    approach: "백트래킹에서 start 인덱스를 두고 i를 증가시키며 선택.",
    keyPoints: "- start 파라미터\n- 오름차순 유지",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, mStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const m = Number(mStr);

const pick = [];
const out = [];

function dfs(start) {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = start; i <= n; i += 1) {
    pick.push(i);
    dfs(i + 1);
    pick.pop();
  }
}

dfs(1);
process.stdout.write(out.join("\n"));
`,
    retrospective: "조합은 start만 추가하면 순열에서 바로 변형 가능.",
    retryCriteria: "start 갱신을 i+1이 아니라 i로 해서 중복이 생겼을 때",
  },

  "boj-15651": {
    summary: "1부터 N까지 중 중복을 허용해 M개를 고른 수열을 모두 출력한다.",
    approach: "백트래킹. visited 없이 1..N을 매 깊이마다 선택.",
    keyPoints: "- 중복 허용\n- 출력 누적",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, mStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const m = Number(mStr);

const pick = [];
const out = [];

function dfs() {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = 1; i <= n; i += 1) {
    pick.push(i);
    dfs();
    pick.pop();
  }
}

dfs();
process.stdout.write(out.join("\n"));
`,
    retrospective: "중복 허용이면 visited를 제거하면 된다.",
    retryCriteria: "출력 버퍼링을 안 해 시간초과가 났을 때",
  },

  "boj-9663": {
    summary:
      "N-Queen: NxN 체스판에 N개의 퀸을 서로 공격하지 않게 놓는 경우의 수를 구한다.",
    approach:
      "행(row)마다 한 개씩 놓는 백트래킹. 열/대각선(,/) 점유 여부를 배열로 체크.",
    keyPoints: "- col, diag1(row+col), diag2(row-col+n-1)\n- 가지치기",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const n = Number(fs.readFileSync(0, "utf8").trim() || 0);

const col = Array(n).fill(false);
const diag1 = Array(2 * n - 1).fill(false);
const diag2 = Array(2 * n - 1).fill(false);

let cnt = 0;

function dfs(r) {
  if (r === n) {
    cnt += 1;
    return;
  }
  for (let c = 0; c < n; c += 1) {
    const d1 = r + c;
    const d2 = r - c + (n - 1);
    if (col[c] || diag1[d1] || diag2[d2]) continue;
    col[c] = true;
    diag1[d1] = true;
    diag2[d2] = true;
    dfs(r + 1);
    col[c] = false;
    diag1[d1] = false;
    diag2[d2] = false;
  }
}

dfs(0);
process.stdout.write(String(cnt));
`,
    retrospective: "N-Queen은 대각선 인덱스 매핑을 외우면 구현이 쉬워진다.",
    retryCriteria: "diag2 인덱스(row-col+n-1) 보정을 빼먹었을 때",
  },

  "boj-1182": {
    summary:
      "수열에서 부분수열의 합이 S가 되는 경우의 수를 구한다(공집합 제외).",
    approach:
      "백트래킹으로 각 원소를 포함/미포함하며 합을 누적. 마지막에 sum==S이면 카운트.",
    keyPoints: "- 2^N 백트래킹\n- 공집합 제외 처리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const s = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));

let cnt = 0;

function dfs(pos, sum) {
  if (pos === n) {
    if (sum === s) cnt += 1;
    return;
  }
  dfs(pos + 1, sum + a[pos]);
  dfs(pos + 1, sum);
}

dfs(0, 0);
if (s === 0) cnt -= 1; // exclude empty set
process.stdout.write(String(cnt));
`,
    retrospective: "부분수열 합은 include/exclude DFS가 가장 직관적.",
    retryCriteria: "S=0에서 공집합을 빼는 처리를 놓쳤을 때",
  },

  "boj-2580": {
    summary: "스도쿠를 완성한다.",
    approach:
      "빈 칸 목록을 만든 뒤 백트래킹. 행/열/박스 사용 여부를 체크해서 가능한 수만 시도한다.",
    keyPoints: "- row/col/box 체크\n- 빈칸 리스트로 DFS\n- 첫 해답에서 종료",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const a = [];
for (let i = 0; i < 9; i += 1) a.push(lines[i].trim().split(/\s+/).map(Number));

const row = Array.from({ length: 9 }, () => Array(10).fill(false));
const col = Array.from({ length: 9 }, () => Array(10).fill(false));
const box = Array.from({ length: 9 }, () => Array(10).fill(false));

const empty = [];

function bidx(x, y) {
  return Math.floor(x / 3) * 3 + Math.floor(y / 3);
}

for (let i = 0; i < 9; i += 1) {
  for (let j = 0; j < 9; j += 1) {
    const v = a[i][j];
    if (v === 0) empty.push([i, j]);
    else {
      row[i][v] = true;
      col[j][v] = true;
      box[bidx(i, j)][v] = true;
    }
  }
}

function dfs(pos) {
  if (pos === empty.length) return true;
  const [x, y] = empty[pos];
  const b = bidx(x, y);
  for (let v = 1; v <= 9; v += 1) {
    if (row[x][v] || col[y][v] || box[b][v]) continue;
    a[x][y] = v;
    row[x][v] = true;
    col[y][v] = true;
    box[b][v] = true;
    if (dfs(pos + 1)) return true;
    a[x][y] = 0;
    row[x][v] = false;
    col[y][v] = false;
    box[b][v] = false;
  }
  return false;
}

dfs(0);
process.stdout.write(a.map((r) => r.join(" ")).join("\n"));
`,
    retrospective: "스도쿠는 제약 체크 배열로 가지치기를 강하게 걸 수 있다.",
    retryCriteria: "box 인덱스(bidx) 계산을 틀렸을 때",
  },

  "boj-15652": {
    summary:
      "1부터 N까지 중 M개를 고르는 중복 조합(비내림차순)을 모두 출력한다.",
    approach:
      "백트래킹에서 start를 유지하고 다음 호출도 i(start 그대로)부터 가능하게 한다.",
    keyPoints: "- start 유지(중복 허용)\n- 비내림차순",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, mStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const m = Number(mStr);

const pick = [];
const out = [];

function dfs(start) {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = start; i <= n; i += 1) {
    pick.push(i);
    dfs(i);
    pick.pop();
  }
}

dfs(1);
process.stdout.write(out.join("\n"));
`,
    retrospective: "중복 조합은 dfs(i)로 start를 유지하면 된다.",
    retryCriteria: "dfs(i+1)로 호출해 중복이 사라졌을 때",
  },

  "boj-15654": {
    summary: "주어진 N개의 수에서 중복 없이 M개를 고른 순열을 모두 출력한다.",
    approach: "배열을 정렬한 뒤, visited로 중복 없이 백트래킹.",
    keyPoints: "- 입력 배열 정렬\n- visited",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const arr = [];
for (let i = 0; i < n; i += 1) arr.push(Number(data[idx++]));
arr.sort((a, b) => a - b);

const vis = Array(n).fill(false);
const pick = [];
const out = [];

function dfs() {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = 0; i < n; i += 1) {
    if (vis[i]) continue;
    vis[i] = true;
    pick.push(arr[i]);
    dfs();
    pick.pop();
    vis[i] = false;
  }
}

dfs();
process.stdout.write(out.join("\n"));
`,
    retrospective: "입력 수열 기반 N과 M은 정렬 + visited 템플릿.",
    retryCriteria: "정렬을 안 해서 출력 순서가 문제와 달라졌을 때",
  },

  "boj-15655": {
    summary: "주어진 N개의 수에서 중복 없이 M개를 고르는 조합을 모두 출력한다.",
    approach: "정렬 후 start 인덱스로 조합 백트래킹.",
    keyPoints: "- 정렬\n- dfs(i+1)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const arr = [];
for (let i = 0; i < n; i += 1) arr.push(Number(data[idx++]));
arr.sort((a, b) => a - b);

const pick = [];
const out = [];

function dfs(start) {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = start; i < n; i += 1) {
    pick.push(arr[i]);
    dfs(i + 1);
    pick.pop();
  }
}

dfs(0);
process.stdout.write(out.join("\n"));
`,
    retrospective: "조합은 start 기반. 입력 배열이면 정렬이 우선.",
    retryCriteria:
      "dfs(start)에서 반복 시작을 start가 아니라 0으로 해 중복이 생겼을 때",
  },

  "boj-15656": {
    summary:
      "주어진 N개의 수에서 중복을 허용해 M개를 고른 수열을 모두 출력한다.",
    approach: "정렬 후, visited 없이 매 깊이마다 모든 원소를 선택.",
    keyPoints: "- 중복 허용\n- 출력 누적",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const arr = [];
for (let i = 0; i < n; i += 1) arr.push(Number(data[idx++]));
arr.sort((a, b) => a - b);

const pick = [];
const out = [];

function dfs() {
  if (pick.length === m) {
    out.push(pick.join(" "));
    return;
  }
  for (let i = 0; i < n; i += 1) {
    pick.push(arr[i]);
    dfs();
    pick.pop();
  }
}

dfs();
process.stdout.write(out.join("\n"));
`,
    retrospective: "중복 허용이면 visited가 필요 없다.",
    retryCriteria: "중복 제거를 하려다(visited) 오답이 났을 때",
  },

  "boj-14889": {
    summary: "N명을 두 팀으로 나눠 능력치 차이 최소를 구한다.",
    approach:
      "조합 백트래킹으로 한 팀을 고르고, 나머지를 다른 팀으로 두어 시너지 합을 계산해 최소 갱신.",
    keyPoints: "- 조합으로 절반 선택\n- 대칭 제거(예: 0번은 항상 첫 팀)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split(/\s+/).map(Number));

const picked = Array(n).fill(false);
let ans = 1e18;

function calc() {
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (picked[i] && picked[j]) {
        s1 += a[i][j] + a[j][i];
      } else if (!picked[i] && !picked[j]) {
        s2 += a[i][j] + a[j][i];
      }
    }
  }
  const diff = s1 - s2;
  const abs = diff < 0 ? -diff : diff;
  if (abs < ans) ans = abs;
}

function dfs(idx, cnt) {
  if (cnt === n / 2) {
    calc();
    return;
  }
  for (let i = idx; i < n; i += 1) {
    picked[i] = true;
    dfs(i + 1, cnt + 1);
    picked[i] = false;
  }
}

picked[0] = true;
dfs(1, 1);
process.stdout.write(String(ans));
`,
    retrospective: "팀 나누기는 조합 + 대칭 제거로 절반만 보면 된다.",
    retryCriteria: "대칭 제거를 안 해서 불필요하게 2배 탐색했을 때",
  },

  "pg-72411": {
    summary:
      "메뉴 리뉴얼: 주문 목록에서 코스 요리 후보(조합)를 뽑아 가장 많이 주문된 메뉴 조합을 찾는다.",
    approach:
      "각 주문을 정렬한 뒤, course 길이별로 조합을 생성해 빈도를 센다. 길이별 최대 빈도(>=2)만 결과에 포함.",
    keyPoints: "- 주문 문자열 정렬\n- 조합 생성\n- 길이별 max>=2",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(orders, course) {
  const want = new Set(course);
  const maps = new Map(); // len -> Map(combo,count)
  for (const len of course) maps.set(len, new Map());

  function comb(arr, start, len, pick, map) {
    if (pick.length === len) {
      const key = pick.join("");
      map.set(key, (map.get(key) || 0) + 1);
      return;
    }
    for (let i = start; i < arr.length; i += 1) {
      pick.push(arr[i]);
      comb(arr, i + 1, len, pick, map);
      pick.pop();
    }
  }

  for (const o of orders) {
    const arr = o.split("").sort();
    for (const len of course) {
      if (len > arr.length) continue;
      comb(arr, 0, len, [], maps.get(len));
    }
  }

  const ans = [];
  for (const len of course) {
    const map = maps.get(len);
    let best = 0;
    for (const v of map.values()) if (v > best) best = v;
    if (best < 2) continue;
    for (const [k, v] of map.entries()) if (v === best) ans.push(k);
  }

  ans.sort();
  return ans;
}
`,
    retrospective: "조합 카운팅은 길이별 Map으로 분리하면 관리가 쉽다.",
    retryCriteria: "best<2 조건을 빼먹어 1번만 나온 조합도 포함했을 때",
  },
};
