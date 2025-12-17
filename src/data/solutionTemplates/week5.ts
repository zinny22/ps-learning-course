import type { SolutionTemplate } from "./types";

export const week5Templates: Record<string, SolutionTemplate> = {
  "boj-1260": {
    summary:
      "그래프를 DFS와 BFS로 탐색한 결과를 출력한다. (정점 번호가 작은 것부터)",
    approach:
      "인접 리스트를 만들고 각 리스트를 오름차순 정렬한다. DFS는 재귀/스택, BFS는 큐로 구현한다.",
    keyPoints: "- 인접 리스트 정렬\n- DFS 방문 체크\n- BFS는 head 인덱스 큐",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m, v] = lines[0].trim().split(/\s+/).map(Number);

const g = Array.from({ length: n + 1 }, () => []);
for (let i = 1; i <= m; i += 1) {
  const [a, b] = lines[i].trim().split(/\s+/).map(Number);
  g[a].push(b);
  g[b].push(a);
}
for (let i = 1; i <= n; i += 1) g[i].sort((a, b) => a - b);

const dfsVisited = Array(n + 1).fill(false);
const dfsOut = [];
function dfs(x) {
  dfsVisited[x] = true;
  dfsOut.push(String(x));
  for (const nx of g[x]) {
    if (!dfsVisited[nx]) dfs(nx);
  }
}

dfs(v);

const bfsVisited = Array(n + 1).fill(false);
const q = [v];
let head = 0;
const bfsOut = [];

bfsVisited[v] = true;
while (head < q.length) {
  const x = q[head++];
  bfsOut.push(String(x));
  for (const nx of g[x]) {
    if (bfsVisited[nx]) continue;
    bfsVisited[nx] = true;
    q.push(nx);
  }
}

process.stdout.write(dfsOut.join(" ") + "\n" + bfsOut.join(" "));
`,
    retrospective:
      "정점 번호가 작은 것부터 조건이면 인접 리스트 정렬이 거의 필수.",
    retryCriteria: "DFS/BFS 출력 순서가 문제와 다르게 나올 때",
  },

  "boj-2178-w5": {
    summary: "미로에서 (1,1)에서 (N,M)까지의 최단거리(칸 수)를 구한다.",
    approach: "BFS로 최단거리 dist를 구한다. 이동은 상하좌우.",
    keyPoints: "- BFS는 최단거리\n- dist 배열 또는 visited+거리 저장",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const grid = [];
for (let i = 0; i < n; i += 1) grid.push(lines[i + 1].trim().split("").map((c) => c === "1"));

const dist = Array.from({ length: n }, () => Array(m).fill(-1));
const qx = [];
const qy = [];
let head = 0;
qx.push(0); qy.push(0);
dist[0][0] = 1;

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

while (head < qx.length) {
  const x = qx[head];
  const y = qy[head];
  head += 1;
  for (let dir = 0; dir < 4; dir += 1) {
    const nx = x + dx[dir];
    const ny = y + dy[dir];
    if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
    if (!grid[nx][ny]) continue;
    if (dist[nx][ny] !== -1) continue;
    dist[nx][ny] = dist[x][y] + 1;
    qx.push(nx); qy.push(ny);
  }
}

process.stdout.write(String(dist[n - 1][m - 1]));
`,
    retrospective: "격자 최단거리는 BFS가 거의 정석.",
    retryCriteria: "거리 초기값(1칸 포함)을 0으로 놓고 헷갈렸을 때",
  },

  "boj-2667": {
    summary: "단지(연결된 1)의 개수와 각 단지의 집 수를 오름차순 출력한다.",
    approach: "격자에서 DFS/BFS로 연결 컴포넌트를 세고 크기를 구한다.",
    keyPoints: "- 방문 체크\n- 컴포넌트 크기 누적 후 정렬",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split("").map((c) => c === "1"));

const vis = Array.from({ length: n }, () => Array(n).fill(false));
const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function bfs(sx, sy) {
  const qx = [sx];
  const qy = [sy];
  let head = 0;
  vis[sx][sy] = true;
  let cnt = 1;
  while (head < qx.length) {
    const x = qx[head];
    const y = qy[head];
    head += 1;
    for (let d = 0; d < 4; d += 1) {
      const nx = x + dx[d];
      const ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      if (vis[nx][ny] || !a[nx][ny]) continue;
      vis[nx][ny] = true;
      cnt += 1;
      qx.push(nx); qy.push(ny);
    }
  }
  return cnt;
}

const sizes = [];
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < n; j += 1) {
    if (!a[i][j] || vis[i][j]) continue;
    sizes.push(bfs(i, j));
  }
}

sizes.sort((x, y) => x - y);
process.stdout.write(String(sizes.length) + "\n" + sizes.join("\n"));
`,
    retrospective: "컴포넌트 문제는 '방문 체크 + 크기 누적'을 템플릿처럼 쓰자.",
    retryCriteria: "상하좌우 인접만인데 대각선을 포함해버렸을 때",
  },

  "boj-1012": {
    summary: "배추밭에서 필요한 배추흰지렁이 수(연결 컴포넌트 수)를 구한다.",
    approach: "좌표로 배추 위치를 표시한 뒤 DFS/BFS로 컴포넌트 개수를 센다.",
    keyPoints: "- 테스트케이스 반복\n- 격자 범위 주의(M,N)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(data[idx++] || 0);
const out = [];

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

for (let tc = 0; tc < t; tc += 1) {
  const m = Number(data[idx++]);
  const n = Number(data[idx++]);
  const k = Number(data[idx++]);

  const grid = Array.from({ length: n }, () => Array(m).fill(false));
  for (let i = 0; i < k; i += 1) {
    const x = Number(data[idx++]);
    const y = Number(data[idx++]);
    grid[y][x] = true;
  }

  const vis = Array.from({ length: n }, () => Array(m).fill(false));

  function bfs(sy, sx) {
    const qx = [sx];
    const qy = [sy];
    let head = 0;
    vis[sy][sx] = true;
    while (head < qx.length) {
      const x = qx[head];
      const y = qy[head];
      head += 1;
      for (let d = 0; d < 4; d += 1) {
        const nx = x + dx[d];
        const ny = y + dy[d];
        if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue;
        if (vis[ny][nx] || !grid[ny][nx]) continue;
        vis[ny][nx] = true;
        qx.push(nx); qy.push(ny);
      }
    }
  }

  let cnt = 0;
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < m; x += 1) {
      if (!grid[y][x] || vis[y][x]) continue;
      cnt += 1;
      bfs(y, x);
    }
  }
  out.push(String(cnt));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "입력이 (x,y)인데 배열은 [y][x]인 점을 항상 의식.",
    retryCriteria: "행/열(M,N) 의미를 뒤집어서 범위 에러가 날 때",
  },

  "boj-2606": {
    summary: "1번 컴퓨터에서 시작해 감염되는 컴퓨터 수를 구한다.",
    approach: "그래프 DFS/BFS로 1번에서 도달 가능한 정점 수(1 제외).",
    keyPoints: "- 방문 배열\n- 결과는 방문한 수 - 1",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const m = Number(lines[1] || 0);
const g = Array.from({ length: n + 1 }, () => []);

for (let i = 0; i < m; i += 1) {
  const [a, b] = lines[i + 2].trim().split(/\s+/).map(Number);
  g[a].push(b);
  g[b].push(a);
}

const vis = Array(n + 1).fill(false);
const q = [1];
let head = 0;
vis[1] = true;
while (head < q.length) {
  const x = q[head++];
  for (const nx of g[x]) {
    if (vis[nx]) continue;
    vis[nx] = true;
    q.push(nx);
  }
}

let cnt = 0;
for (let i = 2; i <= n; i += 1) if (vis[i]) cnt += 1;
process.stdout.write(String(cnt));
`,
    retrospective: "도달 가능한 정점 수는 BFS/DFS 어디든 동일.",
    retryCriteria: "자기 자신(1번)을 포함해서 세버렸을 때",
  },

  "boj-11724": {
    summary: "무방향 그래프의 연결 요소(connected components) 개수를 구한다.",
    approach:
      "모든 정점에 대해 방문하지 않았으면 BFS/DFS를 시작하고 카운트를 증가.",
    keyPoints: "- 1..N 전체 순회\n- 컴포넌트 시작마다 +1",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++] || 0);
const m = Number(data[idx++] || 0);

const g = Array.from({ length: n + 1 }, () => []);
for (let i = 0; i < m; i += 1) {
  const a = Number(data[idx++]);
  const b = Number(data[idx++]);
  g[a].push(b);
  g[b].push(a);
}

const vis = Array(n + 1).fill(false);
let comps = 0;

for (let s = 1; s <= n; s += 1) {
  if (vis[s]) continue;
  comps += 1;
  const q = [s];
  let head = 0;
  vis[s] = true;
  while (head < q.length) {
    const x = q[head++];
    for (const nx of g[x]) {
      if (vis[nx]) continue;
      vis[nx] = true;
      q.push(nx);
    }
  }
}

process.stdout.write(String(comps));
`,
    retrospective: "연결 요소 = '방문 안 한 정점에서 탐색 시작' 횟수.",
    retryCriteria: "그래프가 1개도 간선이 없을 때 처리(정점 수만큼) 실수",
  },

  "boj-1697": {
    summary: "수빈이(N)가 동생(K)에게 가는 최소 시간(±1, ×2)을 구한다.",
    approach: "1차원 BFS. 방문/거리 배열을 두고 최단거리 탐색.",
    keyPoints: "- BFS로 최소 시간\n- 범위(0..100000) 관리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [nStr, kStr] = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(nStr);
const k = Number(kStr);

const MAX = 100000;
const dist = Array(MAX + 1).fill(-1);
const q = [n];
let head = 0;
dist[n] = 0;

while (head < q.length) {
  const x = q[head++];
  if (x === k) break;
  const nexts = [x - 1, x + 1, x * 2];
  for (const nx of nexts) {
    if (nx < 0 || nx > MAX) continue;
    if (dist[nx] !== -1) continue;
    dist[nx] = dist[x] + 1;
    q.push(nx);
  }
}

process.stdout.write(String(dist[k]));
`,
    retrospective: "'최단 시간/최단 횟수' + 간선 가중치 동일이면 BFS.",
    retryCriteria: "범위 체크를 빼먹어 배열 범위 밖 접근했을 때",
  },

  "boj-7562": {
    summary: "체스판에서 나이트가 목표 지점까지 가는 최소 이동 횟수를 구한다.",
    approach: "BFS. 나이트의 8방향 이동을 큐로 탐색.",
    keyPoints: "- 여러 테스트케이스\n- dist 배열로 방문+거리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const t = Number(data[idx++] || 0);

const dx = [1, 2, 2, 1, -1, -2, -2, -1];
const dy = [2, 1, -1, -2, -2, -1, 1, 2];

const out = [];
for (let tc = 0; tc < t; tc += 1) {
  const l = Number(data[idx++]);
  const sx = Number(data[idx++]);
  const sy = Number(data[idx++]);
  const tx = Number(data[idx++]);
  const ty = Number(data[idx++]);

  const dist = Array.from({ length: l }, () => Array(l).fill(-1));
  const qx = [sx];
  const qy = [sy];
  let head = 0;
  dist[sx][sy] = 0;

  while (head < qx.length) {
    const x = qx[head];
    const y = qy[head];
    head += 1;
    if (x === tx && y === ty) break;
    for (let d = 0; d < 8; d += 1) {
      const nx = x + dx[d];
      const ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= l || ny >= l) continue;
      if (dist[nx][ny] !== -1) continue;
      dist[nx][ny] = dist[x][y] + 1;
      qx.push(nx); qy.push(ny);
    }
  }

  out.push(String(dist[tx][ty]));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "격자 BFS는 dist=-1로 방문처리를 같이 하는 게 편하다.",
    retryCriteria: "(x,y)와 배열 인덱스 순서를 뒤집었을 때",
  },

  "boj-7569": {
    summary: "3차원 토마토에서 모든 토마토가 익는 최소 날짜를 구한다.",
    approach: "멀티소스 BFS. 처음 익은 토마토들을 전부 큐에 넣고 확장한다.",
    keyPoints: "- 3차원 BFS\n- day는 dist(또는 grid 값 갱신)로 관리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const m = Number(lines[idx++]);
const n = Number(lines[idx++]);
const h = Number(lines[idx++]);

const box = Array.from({ length: h }, () => Array.from({ length: n }, () => Array(m).fill(0)));
const qx = [];
const qy = [];
const qz = [];
let head = 0;

for (let z = 0; z < h; z += 1) {
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < m; x += 1) {
      const v = Number(lines[idx++]);
      box[z][y][x] = v;
      if (v === 1) {
        qx.push(x); qy.push(y); qz.push(z);
      }
    }
  }
}

const dx = [1, -1, 0, 0, 0, 0];
const dy = [0, 0, 1, -1, 0, 0];
const dz = [0, 0, 0, 0, 1, -1];

while (head < qx.length) {
  const x = qx[head];
  const y = qy[head];
  const z = qz[head];
  head += 1;
  for (let d = 0; d < 6; d += 1) {
    const nx = x + dx[d];
    const ny = y + dy[d];
    const nz = z + dz[d];
    if (nx < 0 || ny < 0 || nz < 0 || nx >= m || ny >= n || nz >= h) continue;
    if (box[nz][ny][nx] !== 0) continue;
    box[nz][ny][nx] = box[z][y][x] + 1;
    qx.push(nx); qy.push(ny); qz.push(nz);
  }
}

let ans = 0;
for (let z = 0; z < h; z += 1) {
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < m; x += 1) {
      const v = box[z][y][x];
      if (v === 0) {
        process.stdout.write("-1");
        process.exit(0);
      }
      if (v > ans) ans = v;
    }
  }
}

process.stdout.write(String(ans - 1));
`,
    retrospective: "멀티소스 BFS는 시작점을 전부 큐에 넣는 게 포인트.",
    retryCriteria: "마지막에 -1(첫날)을 빼는 규칙을 잊었을 때",
  },

  "boj-1389": {
    summary:
      "케빈 베이컨 수(각 정점에서 다른 정점까지 최단거리 합)가 최소인 사람을 찾는다.",
    approach:
      "N이 크지 않으면 각 정점에서 BFS로 최단거리 합을 구해 최소를 찾는다.",
    keyPoints:
      "- 무가중치 최단거리 = BFS\n- 합이 최소인 정점(동점이면 번호 작은 것)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++] || 0);
const m = Number(data[idx++] || 0);

const g = Array.from({ length: n + 1 }, () => []);
for (let i = 0; i < m; i += 1) {
  const a = Number(data[idx++]);
  const b = Number(data[idx++]);
  g[a].push(b);
  g[b].push(a);
}

function bfs(start) {
  const dist = Array(n + 1).fill(-1);
  const q = [start];
  let head = 0;
  dist[start] = 0;
  while (head < q.length) {
    const x = q[head++];
    for (const nx of g[x]) {
      if (dist[nx] !== -1) continue;
      dist[nx] = dist[x] + 1;
      q.push(nx);
    }
  }
  let sum = 0;
  for (let i = 1; i <= n; i += 1) sum += dist[i];
  return sum;
}

let best = Infinity;
let ans = 1;
for (let i = 1; i <= n; i += 1) {
  const s = bfs(i);
  if (s < best) {
    best = s;
    ans = i;
  }
}

process.stdout.write(String(ans));
`,
    retrospective: "플로이드도 되지만, BFS N번으로도 충분한 범위가 많다.",
    retryCriteria:
      "거리 합 계산에서 dist가 -1인 케이스를 가정(그래프 연결) 못 했을 때",
  },

  "pg-1844": {
    summary: "게임 맵에서 (0,0) -> (n-1,m-1) 최단거리를 구하고, 불가능하면 -1.",
    approach: "BFS로 최단거리.",
    keyPoints: "- maps 값 1만 이동\n- BFS dist",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(maps) {
  const n = maps.length;
  const m = maps[0].length;

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
      if (maps[nx][ny] === 0) continue;
      if (dist[nx][ny] !== -1) continue;
      dist[nx][ny] = dist[x][y] + 1;
      qx.push(nx); qy.push(ny);
    }
  }

  return dist[n - 1][m - 1];
}
`,
    retrospective: "프로그래머스 BFS는 큐 구현(배열+head)로 성능 안정화.",
    retryCriteria: "행/열 인덱스를 뒤집어 좌표가 꼬였을 때",
  },

  "pg-43162": {
    summary: "컴퓨터 네트워크(인접행렬)에서 네트워크 개수를 구한다.",
    approach:
      "방문하지 않은 노드에서 DFS/BFS로 연결된 노드를 모두 방문 처리한다.",
    keyPoints: "- 인접행렬 순회\n- 컴포넌트 수 카운트",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(n, computers) {
  const vis = Array(n).fill(false);
  let cnt = 0;

  for (let i = 0; i < n; i += 1) {
    if (vis[i]) continue;
    cnt += 1;
    const q = [i];
    let head = 0;
    vis[i] = true;
    while (head < q.length) {
      const x = q[head++];
      for (let j = 0; j < n; j += 1) {
        if (computers[x][j] === 0 || vis[j]) continue;
        vis[j] = true;
        q.push(j);
      }
    }
  }

  return cnt;
}
`,
    retrospective: "인접행렬이면 BFS에서 이웃 탐색이 O(N)이라도 N이 작으면 OK.",
    retryCriteria: "자기 자신(i==j) 처리에 혼동이 생겼을 때",
  },
};
