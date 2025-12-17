import type { SolutionTemplate } from "./types";

export const week6Templates: Record<string, SolutionTemplate> = {
  "boj-7576": {
    summary: "2차원 토마토 상자에서 모든 토마토가 익는 최소 날짜를 구한다.",
    approach:
      "멀티소스 BFS. 처음부터 익은 토마토(1)를 전부 큐에 넣고 0을 1씩 전파한다.",
    keyPoints:
      "- 시작점 여러 개 -> 큐에 전부 push\n- grid 값을 day로 갱신\n- 0이 남으면 -1",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const m = Number(data[idx++]);
const n = Number(data[idx++]);

const box = Array.from({ length: n }, () => Array(m).fill(0));
const qx = [];
const qy = [];
let head = 0;

for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < m; j += 1) {
    const v = Number(data[idx++]);
    box[i][j] = v;
    if (v === 1) {
      qx.push(i);
      qy.push(j);
    }
  }
}

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

while (head < qx.length) {
  const x = qx[head];
  const y = qy[head];
  head += 1;
  for (let d = 0; d < 4; d += 1) {
    const nx = x + dx[d];
    const ny = y + dy[d];
    if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
    if (box[nx][ny] !== 0) continue;
    box[nx][ny] = box[x][y] + 1;
    qx.push(nx);
    qy.push(ny);
  }
}

let best = 0;
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < m; j += 1) {
    if (box[i][j] === 0) {
      process.stdout.write("-1");
      process.exit(0);
    }
    if (box[i][j] > best) best = box[i][j];
  }
}

process.stdout.write(String(best - 1));
`,
    retrospective: "토마토는 멀티소스 BFS 전형.",
    retryCriteria: "마지막에 -1(첫날 보정)을 빼먹었을 때",
  },

  "boj-2178-w6": {
    summary: "미로에서 최단거리(칸 수)를 구한다.",
    approach: "BFS로 거리 배열(dist)을 구한다.",
    keyPoints: "- BFS 최단거리\n- dist=-1 초기화",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const nm = lines[0].trim().split(/\s+/).map(Number);
const n = nm[0];
const m = nm[1];

const grid = [];
for (let i = 0; i < n; i += 1) grid.push(lines[i + 1].trim().split("").map((c) => c === "1"));

const dist = Array.from({ length: n }, () => Array(m).fill(-1));
const qx = [0];
const qy = [0];
let head = 0;
dist[0][0] = 1;

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

while (head < qx.length) {
  const x = qx[head];
  const y = qy[head];
  head += 1;
  for (let d = 0; d < 4; d += 1) {
    const nx = x + dx[d];
    const ny = y + dy[d];
    if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
    if (!grid[nx][ny]) continue;
    if (dist[nx][ny] !== -1) continue;
    dist[nx][ny] = dist[x][y] + 1;
    qx.push(nx);
    qy.push(ny);
  }
}

process.stdout.write(String(dist[n - 1][m - 1]));
`,
    retrospective: "Week5의 2178과 동일 아이디어(최단거리 BFS).",
    retryCriteria: "좌표(x,y)와 배열 인덱스가 꼬였을 때",
  },

  "boj-10026": {
    summary: "적록색약/비색약 각각에 대해 구역(연결 컴포넌트) 개수를 구한다.",
    approach:
      "BFS/DFS로 영역 개수를 세고, 적록색약은 R/G를 같은 색으로 취급하여 두 번째로 센다.",
    keyPoints: "- 2번 탐색(원본/변환)\n- 방문 배열 재사용",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const grid = [];
for (let i = 0; i < n; i += 1) grid.push(lines[i + 1].trim().split(""));

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function countAreas(getColor) {
  const vis = Array.from({ length: n }, () => Array(n).fill(false));
  let cnt = 0;

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (vis[i][j]) continue;
      cnt += 1;
      const base = getColor(grid[i][j]);
      const qx = [i];
      const qy = [j];
      let head = 0;
      vis[i][j] = true;
      while (head < qx.length) {
        const x = qx[head];
        const y = qy[head];
        head += 1;
        for (let d = 0; d < 4; d += 1) {
          const nx = x + dx[d];
          const ny = y + dy[d];
          if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
          if (vis[nx][ny]) continue;
          if (getColor(grid[nx][ny]) !== base) continue;
          vis[nx][ny] = true;
          qx.push(nx);
          qy.push(ny);
        }
      }
    }
  }
  return cnt;
}

const normal = countAreas((c) => c);
const blind = countAreas((c) => (c === "G" ? "R" : c));

process.stdout.write(String(normal) + " " + String(blind));
`,
    retrospective: "색 처리만 바꾸면 동일한 컴포넌트 카운팅 문제.",
    retryCriteria: "색약 변환(R/G 동일) 적용 범위를 헷갈렸을 때",
  },

  "boj-5014": {
    summary:
      "엘리베이터로 S에서 G로 가는 최소 버튼 횟수를 구한다. (U만큼 위, D만큼 아래)",
    approach: "1차원 BFS로 최단 횟수를 구한다.",
    keyPoints: "- 범위 1..F\n- 도달 불가면 'use the stairs'",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [F, S, G, U, D] = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);

const dist = Array(F + 1).fill(-1);
const q = [S];
let head = 0;
dist[S] = 0;

while (head < q.length) {
  const x = q[head++];
  if (x === G) break;
  const up = x + U;
  const down = x - D;
  if (U > 0 && up <= F && dist[up] === -1) {
    dist[up] = dist[x] + 1;
    q.push(up);
  }
  if (D > 0 && down >= 1 && dist[down] === -1) {
    dist[down] = dist[x] + 1;
    q.push(down);
  }
}

if (dist[G] === -1) process.stdout.write("use the stairs");
else process.stdout.write(String(dist[G]));
`,
    retrospective: "상태가 숫자 하나면 BFS가 구현이 매우 단순.",
    retryCriteria: "도달 불가 문구('use the stairs')를 잘못 출력했을 때",
  },

  "boj-1916": {
    summary:
      "버스 비용 그래프에서 시작 도시에서 도착 도시까지 최소 비용을 구한다.",
    approach:
      "다익스트라. 우선순위 큐(최소 힙)를 직접 구현해 (dist,node)를 관리한다.",
    keyPoints: "- dist 배열\n- (cost>dist[node])면 skip\n- 최소 힙 구현",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(input[idx++]);
const m = Number(input[idx++]);

const g = Array.from({ length: n + 1 }, () => []);
for (let i = 0; i < m; i += 1) {
  const a = Number(input[idx++]);
  const b = Number(input[idx++]);
  const c = Number(input[idx++]);
  g[a].push([b, c]);
}
const start = Number(input[idx++]);
const end = Number(input[idx++]);

class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t;
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (a.length === 0) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        let l = i * 2 + 1;
        let r = l + 1;
        let b = i;
        if (l < a.length && a[l][0] < a[b][0]) b = l;
        if (r < a.length && a[r][0] < a[b][0]) b = r;
        if (b === i) break;
        const t = a[i]; a[i] = a[b]; a[b] = t;
        i = b;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

const INF = 1e18;
const dist = Array(n + 1).fill(INF);
dist[start] = 0;
const pq = new MinHeap();
pq.push([0, start]);

while (pq.size) {
  const cur = pq.pop();
  const cost = cur[0];
  const u = cur[1];
  if (cost !== dist[u]) continue;
  if (u === end) break;
  for (const e of g[u]) {
    const v = e[0];
    const w = e[1];
    const nc = cost + w;
    if (nc < dist[v]) {
      dist[v] = nc;
      pq.push([nc, v]);
    }
  }
}

process.stdout.write(String(dist[end]));
`,
    retrospective: "다익스트라는 '현재 최단거리 확정' 구조를 지키는 게 핵심.",
    retryCriteria:
      "우선순위 큐에서 오래된 상태를 skip 안 해서 시간 초과가 날 때",
  },

  "boj-4485": {
    summary:
      "각 칸의 비용이 있는 격자에서 (0,0)->(n-1,n-1) 최소 비용을 구한다.",
    approach: "다익스트라(격자 그래프). dist[x][y]를 최소 비용으로 갱신.",
    keyPoints: "- 노드는 칸, 간선은 상하좌우\n- 우선순위 큐 사용",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const tokens = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
let tc = 1;

class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t;
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        let l = i * 2 + 1;
        let r = l + 1;
        let b = i;
        if (l < a.length && a[l][0] < a[b][0]) b = l;
        if (r < a.length && a[r][0] < a[b][0]) b = r;
        if (b === i) break;
        const t = a[i]; a[i] = a[b]; a[b] = t;
        i = b;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

const out = [];
const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

while (idx < tokens.length) {
  const n = Number(tokens[idx++]);
  if (n === 0) break;

  const a = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) a[i][j] = Number(tokens[idx++]);
  }

  const INF = 1e18;
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  dist[0][0] = a[0][0];
  const pq = new MinHeap();
  pq.push([dist[0][0], 0, 0]);

  while (pq.size) {
    const cur = pq.pop();
    const cost = cur[0];
    const x = cur[1];
    const y = cur[2];
    if (cost !== dist[x][y]) continue;
    if (x === n - 1 && y === n - 1) break;
    for (let d = 0; d < 4; d += 1) {
      const nx = x + dx[d];
      const ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      const nc = cost + a[nx][ny];
      if (nc < dist[nx][ny]) {
        dist[nx][ny] = nc;
        pq.push([nc, nx, ny]);
      }
    }
  }

  out.push("Problem " + tc + ": " + String(dist[n - 1][n - 1]));
  tc += 1;
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "가중치 있는 격자 최단거리 = 다익스트라.",
    retryCriteria: "'Problem i: ' 출력 형식을 틀렸을 때",
  },

  "boj-1753": {
    summary: "시작 정점에서 모든 정점까지 최단거리를 구한다. (가중치 양수)",
    approach: "다익스트라(우선순위 큐).",
    keyPoints: "- dist 초기 INF\n- 오래된 상태 skip\n- INF는 'INF' 출력",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const V = Number(data[idx++]);
const E = Number(data[idx++]);
const K = Number(data[idx++]);

const g = Array.from({ length: V + 1 }, () => []);
for (let i = 0; i < E; i += 1) {
  const u = Number(data[idx++]);
  const v = Number(data[idx++]);
  const w = Number(data[idx++]);
  g[u].push([v, w]);
}

class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t;
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        let l = i * 2 + 1;
        let r = l + 1;
        let b = i;
        if (l < a.length && a[l][0] < a[b][0]) b = l;
        if (r < a.length && a[r][0] < a[b][0]) b = r;
        if (b === i) break;
        const t = a[i]; a[i] = a[b]; a[b] = t;
        i = b;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

const INF = 1e18;
const dist = Array(V + 1).fill(INF);
dist[K] = 0;
const pq = new MinHeap();
pq.push([0, K]);

while (pq.size) {
  const cur = pq.pop();
  const cost = cur[0];
  const u = cur[1];
  if (cost !== dist[u]) continue;
  for (const e of g[u]) {
    const v = e[0];
    const w = e[1];
    const nc = cost + w;
    if (nc < dist[v]) {
      dist[v] = nc;
      pq.push([nc, v]);
    }
  }
}

const out = [];
for (let i = 1; i <= V; i += 1) {
  out.push(dist[i] === INF ? "INF" : String(dist[i]));
}
process.stdout.write(out.join("\n"));
`,
    retrospective:
      "최단거리 기본 문제: 다익스트라 템플릿을 통째로 외우면 좋다.",
    retryCriteria: "INF 출력 조건(dist==INF) 처리를 놓쳤을 때",
  },

  "boj-11404": {
    summary: "모든 도시 쌍 (i,j)의 최소 비용을 구한다. (플로이드 워셜)",
    approach: "dist[i][j]를 초기화 후 k를 경유지로 3중 루프 수행.",
    keyPoints: "- dist[i][i]=0\n- 중복 간선은 min\n- 도달 불가=0 출력",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);

const INF = 1e15;
const dist = Array.from({ length: n }, () => Array(n).fill(INF));
for (let i = 0; i < n; i += 1) dist[i][i] = 0;

for (let i = 0; i < m; i += 1) {
  const a = Number(data[idx++]) - 1;
  const b = Number(data[idx++]) - 1;
  const c = Number(data[idx++]);
  if (c < dist[a][b]) dist[a][b] = c;
}

for (let k = 0; k < n; k += 1) {
  for (let i = 0; i < n; i += 1) {
    const ik = dist[i][k];
    if (ik === INF) continue;
    for (let j = 0; j < n; j += 1) {
      const nc = ik + dist[k][j];
      if (nc < dist[i][j]) dist[i][j] = nc;
    }
  }
}

const out = [];
for (let i = 0; i < n; i += 1) {
  const row = [];
  for (let j = 0; j < n; j += 1) {
    row.push(dist[i][j] === INF ? "0" : String(dist[i][j]));
  }
  out.push(row.join(" "));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "플로이드는 N이 작을 때(<=400 정도) 모든쌍 최단거리에 깔끔.",
    retryCriteria: "중복 간선 처리(min) 또는 도달 불가 출력(0)을 놓쳤을 때",
  },

  "boj-1238": {
    summary: "각 학생이 X 파티에 갔다가 돌아오는 최단 시간 중 최대를 구한다.",
    approach:
      "다익스트라를 2번: 원래 그래프에서 X->모든, 역그래프에서 X->모든(=모든->X). 합의 최대.",
    keyPoints: "- 역그래프 사용\n- 다익스트라 2회로 최적화",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const x = Number(data[idx++]);

const g = Array.from({ length: n + 1 }, () => []);
const rg = Array.from({ length: n + 1 }, () => []);
for (let i = 0; i < m; i += 1) {
  const a = Number(data[idx++]);
  const b = Number(data[idx++]);
  const c = Number(data[idx++]);
  g[a].push([b, c]);
  rg[b].push([a, c]);
}

class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t;
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        let l = i * 2 + 1;
        let r = l + 1;
        let b = i;
        if (l < a.length && a[l][0] < a[b][0]) b = l;
        if (r < a.length && a[r][0] < a[b][0]) b = r;
        if (b === i) break;
        const t = a[i]; a[i] = a[b]; a[b] = t;
        i = b;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function dijkstra(graph, start) {
  const INF = 1e18;
  const dist = Array(n + 1).fill(INF);
  dist[start] = 0;
  const pq = new MinHeap();
  pq.push([0, start]);
  while (pq.size) {
    const cur = pq.pop();
    const cost = cur[0];
    const u = cur[1];
    if (cost !== dist[u]) continue;
    for (const e of graph[u]) {
      const v = e[0];
      const w = e[1];
      const nc = cost + w;
      if (nc < dist[v]) {
        dist[v] = nc;
        pq.push([nc, v]);
      }
    }
  }
  return dist;
}

const fromX = dijkstra(g, x);
const toX = dijkstra(rg, x);

let ans = 0;
for (let i = 1; i <= n; i += 1) {
  const total = fromX[i] + toX[i];
  if (total > ans) ans = total;
}

process.stdout.write(String(ans));
`,
    retrospective: "단일 목적지 왕복 최단거리는 역그래프가 거의 정석 테크닉.",
    retryCriteria: "역그래프를 안 써서 다익스트라를 N번 돌리려 했을 때",
  },

  "boj-1504": {
    summary: "1->N 최단경로 중 반드시 v1,v2를 거치는 경로의 최단거리를 구한다.",
    approach:
      "다익스트라를 1, v1, v2에서 각각 한 번씩 수행해 dist를 조합한다. 후보: 1-v1-v2-N vs 1-v2-v1-N.",
    keyPoints: "- 다익스트라 3회\n- 경로 2가지 케이스 min\n- INF면 -1",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const e = Number(data[idx++]);

const g = Array.from({ length: n + 1 }, () => []);
for (let i = 0; i < e; i += 1) {
  const a = Number(data[idx++]);
  const b = Number(data[idx++]);
  const c = Number(data[idx++]);
  g[a].push([b, c]);
  g[b].push([a, c]);
}
const v1 = Number(data[idx++]);
const v2 = Number(data[idx++]);

class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t;
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        let l = i * 2 + 1;
        let r = l + 1;
        let b = i;
        if (l < a.length && a[l][0] < a[b][0]) b = l;
        if (r < a.length && a[r][0] < a[b][0]) b = r;
        if (b === i) break;
        const t = a[i]; a[i] = a[b]; a[b] = t;
        i = b;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function dijkstra(start) {
  const INF = 1e18;
  const dist = Array(n + 1).fill(INF);
  dist[start] = 0;
  const pq = new MinHeap();
  pq.push([0, start]);
  while (pq.size) {
    const cur = pq.pop();
    const cost = cur[0];
    const u = cur[1];
    if (cost !== dist[u]) continue;
    for (const e of g[u]) {
      const v = e[0];
      const w = e[1];
      const nc = cost + w;
      if (nc < dist[v]) {
        dist[v] = nc;
        pq.push([nc, v]);
      }
    }
  }
  return dist;
}

const d1 = dijkstra(1);
const dv1 = dijkstra(v1);
const dv2 = dijkstra(v2);

const INF = 1e18;
const path1 = d1[v1] + dv1[v2] + dv2[n];
const path2 = d1[v2] + dv2[v1] + dv1[n];
const ans = Math.min(path1, path2);

process.stdout.write(ans >= INF ? "-1" : String(ans));
`,
    retrospective:
      "필수 경유지가 있으면 '다익스트라 여러 번 + 경로 조합'이 정석.",
    retryCriteria: "INF 케이스를 처리하지 않아 오버플로/이상값이 나왔을 때",
  },

  "pg-49189": {
    summary: "1번 노드에서 가장 멀리 떨어진 노드의 개수를 구한다.",
    approach:
      "무가중치 그래프 최단거리 -> BFS로 dist를 구하고 maxDist 개수를 센다.",
    keyPoints: "- BFS\n- dist 배열로 최단거리",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n, edge) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of edge) {
    g[a].push(b);
    g[b].push(a);
  }

  const dist = Array(n + 1).fill(-1);
  const q = [1];
  let head = 0;
  dist[1] = 0;

  while (head < q.length) {
    const x = q[head++];
    for (const nx of g[x]) {
      if (dist[nx] !== -1) continue;
      dist[nx] = dist[x] + 1;
      q.push(nx);
    }
  }

  let maxD = 0;
  for (let i = 1; i <= n; i += 1) if (dist[i] > maxD) maxD = dist[i];

  let cnt = 0;
  for (let i = 1; i <= n; i += 1) if (dist[i] === maxD) cnt += 1;
  return cnt;
}
`,
    retrospective: "가중치 없으면 다익스트라 대신 BFS로 끝.",
    retryCriteria: "dist 초기값(-1) 처리나 max 계산을 잘못했을 때",
  },

  "pg-12978": {
    summary:
      "1번 마을에서 K시간 이하로 배달 가능한 마을 수를 구한다. (가중치 그래프)",
    approach:
      "다익스트라로 1번에서의 최단거리 dist를 구한 뒤 dist<=K 개수를 센다.",
    keyPoints: "- 다익스트라\n- 양방향 도로\n- dist<=K count",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(N, road, K) {
  const g = Array.from({ length: N + 1 }, () => []);
  for (const [a, b, c] of road) {
    g[a].push([b, c]);
    g[b].push([a, c]);
  }

  class MinHeap {
    constructor() { this.a = []; }
    push(v) {
      const a = this.a;
      a.push(v);
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (a[p][0] <= a[i][0]) break;
        const t = a[p]; a[p] = a[i]; a[i] = t;
        i = p;
      }
    }
    pop() {
      const a = this.a;
      if (!a.length) return null;
      const top = a[0];
      const last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        while (true) {
          let l = i * 2 + 1;
          let r = l + 1;
          let b = i;
          if (l < a.length && a[l][0] < a[b][0]) b = l;
          if (r < a.length && a[r][0] < a[b][0]) b = r;
          if (b === i) break;
          const t = a[i]; a[i] = a[b]; a[b] = t;
          i = b;
        }
      }
      return top;
    }
    get size() { return this.a.length; }
  }

  const INF = 1e18;
  const dist = Array(N + 1).fill(INF);
  dist[1] = 0;
  const pq = new MinHeap();
  pq.push([0, 1]);

  while (pq.size) {
    const cur = pq.pop();
    const cost = cur[0];
    const u = cur[1];
    if (cost !== dist[u]) continue;
    for (const e of g[u]) {
      const v = e[0];
      const w = e[1];
      const nc = cost + w;
      if (nc < dist[v]) {
        dist[v] = nc;
        pq.push([nc, v]);
      }
    }
  }

  let cnt = 0;
  for (let i = 1; i <= N; i += 1) if (dist[i] <= K) cnt += 1;
  return cnt;
}
`,
    retrospective: "다익스트라 결과를 그대로 조건(dist<=K)에 쓰는 전형 문제.",
    retryCriteria: "중복 도로가 있을 때(더 짧은 간선) 처리를 놓쳤을 때",
  },
};
