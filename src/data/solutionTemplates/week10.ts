import type { SolutionTemplate } from "./types";

export const week10Templates: Record<string, SolutionTemplate> = {
  "boj-14503": {
    summary: "로봇 청소기의 이동 규칙을 시뮬레이션하여 청소한 칸 수를 구한다.",
    approach:
      "현재 방향 기준으로 왼쪽부터 4방향 탐색. 청소 가능한 칸(0)이 있으면 회전 후 전진, 없으면 후진(벽이면 종료).",
    keyPoints: "- 방향 회전(왼쪽)\n- 4방 탐색 후 후진\n- 청소 처리(2로 마킹)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const [n, m] = lines[p++].trim().split(/\s+/).map(Number);
let [r, c, d] = lines[p++].trim().split(/\s+/).map(Number);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[p++].trim().split(/\s+/).map(Number));

// 0 north,1 east,2 south,3 west
const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

let cleaned = 0;

while (true) {
  if (a[r][c] === 0) {
    a[r][c] = 2;
    cleaned += 1;
  }

  let moved = false;
  for (let i = 0; i < 4; i += 1) {
    d = (d + 3) % 4; // turn left
    const nr = r + dr[d];
    const nc = c + dc[d];
    if (a[nr][nc] === 0) {
      r = nr;
      c = nc;
      moved = true;
      break;
    }
  }

  if (moved) continue;

  // back
  const backDir = (d + 2) % 4;
  const br = r + dr[backDir];
  const bc = c + dc[backDir];
  if (a[br][bc] === 1) break;
  r = br;
  c = bc;
}

process.stdout.write(String(cleaned));
`,
    retrospective:
      "구현은 규칙을 그대로 코드로 옮기되, 방향/좌표를 확실히 고정하자.",
    retryCriteria: "회전/후진 방향 계산을 틀렸을 때",
  },

  "boj-16236": {
    summary:
      "아기 상어가 먹을 수 있는 물고기를 먹으며 이동할 때 걸리는 총 시간을 구한다.",
    approach:
      "반복: 현재 위치에서 BFS로 먹을 수 있는 물고기 후보(최단거리)를 찾고, 거리/행/열 우선순위로 선택 후 이동/성장.",
    keyPoints:
      "- BFS로 최단거리\n- tie-break: 거리 -> 행 -> 열\n- 먹은 수 == 크기면 성장",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
let sx = 0;
let sy = 0;
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].trim().split(/\s+/).map(Number);
  for (let j = 0; j < n; j += 1) {
    if (row[j] === 9) {
      sx = i;
      sy = j;
      row[j] = 0;
    }
  }
  a.push(row);
}

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function bfs(x, y, size) {
  const dist = Array.from({ length: n }, () => Array(n).fill(-1));
  const qx = [x];
  const qy = [y];
  let head = 0;
  dist[x][y] = 0;

  const cand = [];

  while (head < qx.length) {
    const cx = qx[head];
    const cy = qy[head];
    head += 1;
    for (let d = 0; d < 4; d += 1) {
      const nx = cx + dx[d];
      const ny = cy + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      if (dist[nx][ny] !== -1) continue;
      if (a[nx][ny] > size) continue;
      dist[nx][ny] = dist[cx][cy] + 1;
      qx.push(nx);
      qy.push(ny);
      if (a[nx][ny] !== 0 && a[nx][ny] < size) {
        cand.push([dist[nx][ny], nx, ny]);
      }
    }
  }

  if (!cand.length) return null;
  cand.sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]) || (p[2] - q[2]));
  return cand[0];
}

let size = 2;
let eat = 0;
let time = 0;

while (true) {
  const res = bfs(sx, sy, size);
  if (!res) break;
  const dist = res[0];
  const nx = res[1];
  const ny = res[2];

  time += dist;
  sx = nx;
  sy = ny;
  a[nx][ny] = 0;
  eat += 1;
  if (eat === size) {
    size += 1;
    eat = 0;
  }
}

process.stdout.write(String(time));
`,
    retrospective:
      "BFS를 매번 돌리는 문제는 tie-break 정렬 기준을 정확히 잡는 게 중요.",
    retryCriteria: "동거리 후보에서 (행/열) 우선순위를 잘못 적용했을 때",
  },

  "boj-14891": {
    summary:
      "4개의 톱니바퀴를 회전시키는 명령을 시뮬레이션하고 최종 점수를 구한다.",
    approach:
      "회전 전 각 인접 톱니의 맞닿는 톱니(2번/6번) 비교로 연쇄 회전 여부를 결정하고, 결정된 회전 방향대로 동시에 회전.",
    keyPoints:
      "- 연쇄 회전은 회전 전 상태 기준\n- 각 기어를 배열로 두고 회전 함수 구현",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const gears = [];
for (let i = 0; i < 4; i += 1) gears.push(lines[p++].trim().split("").map(Number));
const k = Number(lines[p++] || 0);

function rotate(arr, dir) {
  if (dir === 1) {
    arr.unshift(arr.pop());
  } else {
    arr.push(arr.shift());
  }
}

for (let i = 0; i < k; i += 1) {
  const [gStr, dStr] = lines[p++].trim().split(/\s+/);
  const g = Number(gStr) - 1;
  const dir = Number(dStr);

  const rot = [0, 0, 0, 0];
  rot[g] = dir;

  // left
  for (let j = g - 1; j >= 0; j -= 1) {
    if (gears[j][2] === gears[j + 1][6]) break;
    rot[j] = -rot[j + 1];
  }
  // right
  for (let j = g + 1; j < 4; j += 1) {
    if (gears[j - 1][2] === gears[j][6]) break;
    rot[j] = -rot[j - 1];
  }

  for (let j = 0; j < 4; j += 1) if (rot[j] !== 0) rotate(gears[j], rot[j]);
}

let score = 0;
for (let i = 0; i < 4; i += 1) {
  if (gears[i][0] === 1) score += (1 << i);
}
process.stdout.write(String(score));
`,
    retrospective:
      "연쇄 회전은 '동시' 처리라서 회전 전 상태로 전파를 계산해야 한다.",
    retryCriteria: "회전하면서 바로 다음 기어 비교해 연쇄가 꼬였을 때",
  },

  "boj-13460": {
    summary:
      "빨간/파란 구슬을 기울여 10번 이내에 빨간 구슬만 구멍에 넣을 수 있는지(최소 횟수) 구한다.",
    approach:
      "BFS로 상태(rx,ry,bx,by)를 탐색. 한 방향으로 기울일 때 두 구슬을 끝까지 굴리고, 겹치면 이동거리 비교로 한 칸 되돌림.",
    keyPoints: "- 최대 10회\n- 파란 구슬이 빠지면 실패\n- 방문 상태 Set",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const board = [];
let rx = 0, ry = 0, bx = 0, by = 0;
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].split("");
  for (let j = 0; j < m; j += 1) {
    if (row[j] === "R") { rx = i; ry = j; row[j] = "."; }
    if (row[j] === "B") { bx = i; by = j; row[j] = "."; }
  }
  board.push(row);
}

const dx = [-1, 1, 0, 0];
const dy = [0, 0, -1, 1];

function roll(x, y, dir) {
  let cnt = 0;
  while (true) {
    const nx = x + dx[dir];
    const ny = y + dy[dir];
    const cell = board[nx][ny];
    if (cell === "#") break;
    x = nx;
    y = ny;
    cnt += 1;
    if (cell === "O") break;
  }
  return [x, y, cnt];
}

function key(a, b, c, d) { return a + "," + b + "," + c + "," + d; }

const q = [[rx, ry, bx, by, 0]];
let head = 0;
const vis = new Set([key(rx, ry, bx, by)]);

let ans = -1;

while (head < q.length) {
  const [crx, cry, cbx, cby, depth] = q[head++];
  if (depth >= 10) continue;

  for (let dir = 0; dir < 4; dir += 1) {
    const [nrx0, nry0, rc] = roll(crx, cry, dir);
    const [nbx0, nby0, bc] = roll(cbx, cby, dir);

    // blue in hole -> fail
    if (board[nbx0][nby0] === "O") continue;

    // red in hole -> success
    if (board[nrx0][nry0] === "O") {
      ans = depth + 1;
      head = q.length;
      break;
    }

    let nrx = nrx0;
    let nry = nry0;
    let nbx = nbx0;
    let nby = nby0;

    // overlap
    if (nrx === nbx && nry === nby) {
      if (rc > bc) {
        nrx -= dx[dir];
        nry -= dy[dir];
      } else {
        nbx -= dx[dir];
        nby -= dy[dir];
      }
    }

    const kkey = key(nrx, nry, nbx, nby);
    if (vis.has(kkey)) continue;
    vis.add(kkey);
    q.push([nrx, nry, nbx, nby, depth + 1]);
  }
}

process.stdout.write(String(ans));
`,
    retrospective: "구슬 굴리기는 '굴린 뒤 겹침 처리'가 핵심 디테일.",
    retryCriteria: "겹침 처리에서 이동거리 비교(rc/bc)를 반대로 했을 때",
  },

  "boj-15685": {
    summary:
      "드래곤 커브를 그린 뒤 1×1 정사각형 네 꼭짓점이 모두 채워진 개수를 구한다.",
    approach:
      "각 커브의 방향 시퀀스를 생성: 이전 시퀀스를 역순으로 보고 (d+1)%4를 붙인다. 시퀀스대로 점을 찍는다.",
    keyPoints: "- 방향 시퀀스 생성 규칙\n- 격자 표시 후 1x1 체크",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(input[idx++] || 0);

const grid = Array.from({ length: 101 }, () => Array(101).fill(false));

const dx = [1, 0, -1, 0];
const dy = [0, -1, 0, 1];

for (let i = 0; i < n; i += 1) {
  let x = Number(input[idx++]);
  let y = Number(input[idx++]);
  const d = Number(input[idx++]);
  const g = Number(input[idx++]);

  const seq = [d];
  for (let gen = 0; gen < g; gen += 1) {
    for (let j = seq.length - 1; j >= 0; j -= 1) seq.push((seq[j] + 1) % 4);
  }

  grid[y][x] = true;
  for (const dir of seq) {
    x += dx[dir];
    y += dy[dir];
    if (x >= 0 && y >= 0 && x <= 100 && y <= 100) grid[y][x] = true;
  }
}

let ans = 0;
for (let y = 0; y < 100; y += 1) {
  for (let x = 0; x < 100; x += 1) {
    if (grid[y][x] && grid[y][x + 1] && grid[y + 1][x] && grid[y + 1][x + 1]) ans += 1;
  }
}

process.stdout.write(String(ans));
`,
    retrospective: "방향 시퀀스 생성 규칙만 알면 구현은 straightforward.",
    retryCriteria: "좌표계(grid[y][x])를 뒤집어 찍었을 때",
  },

  "boj-14499": {
    summary:
      "주사위를 지도에서 굴리며 규칙대로 지도/주사위 숫자를 갱신하고, 매 이동마다 윗면을 출력.",
    approach:
      "주사위 6면을 배열로 들고, 동/서/북/남 굴림에 따라 면 값을 재배치한다. 이동 불가면 무시.",
    keyPoints: "- 주사위 면 재배치\n- 지도 값 0/비0에 따라 복사",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const [n, m, x0, y0, k] = lines[p++].trim().split(/\s+/).map(Number);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[p++].trim().split(/\s+/).map(Number));
const cmds = lines[p++].trim().split(/\s+/).map(Number);

let x = x0;
let y = y0;

// dice: [top,bottom,north,south,west,east]
let d = [0, 0, 0, 0, 0, 0];

const dx = [0, 0, 0, -1, 1];
const dy = [0, 1, -1, 0, 0];

function roll(dir) {
  const [top, bottom, north, south, west, east] = d;
  if (dir === 1) d = [west, east, north, south, bottom, top];
  else if (dir === 2) d = [east, west, north, south, top, bottom];
  else if (dir === 3) d = [south, north, top, bottom, west, east];
  else d = [north, south, bottom, top, west, east];
}

const out = [];
for (const cmd of cmds) {
  const nx = x + dx[cmd];
  const ny = y + dy[cmd];
  if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
  x = nx;
  y = ny;
  roll(cmd);

  if (a[x][y] === 0) a[x][y] = d[1];
  else {
    d[1] = a[x][y];
    a[x][y] = 0;
  }
  out.push(String(d[0]));
}

process.stdout.write(out.join("\n"));
`,
    retrospective:
      "주사위 문제는 면 인덱스를 고정하고 굴림 변환만 정확히 하면 된다.",
    retryCriteria: "동/서 굴림에서 top/bottom/east/west 재배치가 틀렸을 때",
  },

  "boj-17144": {
    summary:
      "미세먼지 확산과 공기청정기 작동을 T초 시뮬레이션 후 남은 미세먼지 합을 구한다.",
    approach:
      "각 초마다 (1) 확산: 임시 배열에 누적 (2) 공기청정기 순환: 위쪽은 반시계, 아래쪽은 시계 방향으로 한 칸씩 이동.",
    keyPoints:
      "- 확산은 동시에 일어남 -> tmp 누적\n- 청정기 위치 찾기\n- 순환 경로 구현",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const [r, c, t] = lines[p++].trim().split(/\s+/).map(Number);
const a = [];
const cleaners = [];
for (let i = 0; i < r; i += 1) {
  const row = lines[p++].trim().split(/\s+/).map(Number);
  for (let j = 0; j < c; j += 1) if (row[j] === -1) cleaners.push([i, j]);
  a.push(row);
}

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function spread() {
  const tmp = Array.from({ length: r }, () => Array(c).fill(0));
  for (let i = 0; i < r; i += 1) {
    for (let j = 0; j < c; j += 1) {
      if (a[i][j] <= 0) continue;
      const val = a[i][j];
      const add = Math.floor(val / 5);
      if (add === 0) { tmp[i][j] += val; continue; }
      let cnt = 0;
      for (let d = 0; d < 4; d += 1) {
        const ni = i + dx[d];
        const nj = j + dy[d];
        if (ni < 0 || nj < 0 || ni >= r || nj >= c) continue;
        if (a[ni][nj] === -1) continue;
        tmp[ni][nj] += add;
        cnt += 1;
      }
      tmp[i][j] += val - add * cnt;
    }
  }
  for (const [x, y] of cleaners) tmp[x][y] = -1;
  for (let i = 0; i < r; i += 1) for (let j = 0; j < c; j += 1) a[i][j] = tmp[i][j];
}

function rotate() {
  const upper = cleaners[0][0];
  const lower = cleaners[1][0];

  // upper: counter-clockwise
  for (let i = upper - 1; i > 0; i -= 1) a[i][0] = a[i - 1][0];
  for (let j = 0; j < c - 1; j += 1) a[0][j] = a[0][j + 1];
  for (let i = 0; i < upper; i += 1) a[i][c - 1] = a[i + 1][c - 1];
  for (let j = c - 1; j > 1; j -= 1) a[upper][j] = a[upper][j - 1];
  a[upper][1] = 0;

  // lower: clockwise
  for (let i = lower + 1; i < r - 1; i += 1) a[i][0] = a[i + 1][0];
  for (let j = 0; j < c - 1; j += 1) a[r - 1][j] = a[r - 1][j + 1];
  for (let i = r - 1; i > lower; i -= 1) a[i][c - 1] = a[i - 1][c - 1];
  for (let j = c - 1; j > 1; j -= 1) a[lower][j] = a[lower][j - 1];
  a[lower][1] = 0;

  a[upper][0] = -1;
  a[lower][0] = -1;
}

for (let step = 0; step < t; step += 1) {
  spread();
  rotate();
}

let ans = 0;
for (let i = 0; i < r; i += 1) {
  for (let j = 0; j < c; j += 1) if (a[i][j] > 0) ans += a[i][j];
}

process.stdout.write(String(ans));
`,
    retrospective:
      "확산/순환을 분리하고, 순환은 경로를 직접 밀어넣는 방식이 안전.",
    retryCriteria: "순환 경로 한 칸씩 밀 때 인덱스가 꼬여 값이 날아갔을 때",
  },

  "boj-14890": {
    summary: "경사로 설치 규칙에 따라 지나갈 수 있는 길(행/열) 개수를 구한다.",
    approach:
      "각 라인(길이 N)에 대해 높이 차이가 1을 넘으면 불가. 차이가 ±1이면 길이 L의 경사로를 설치 가능한지 방문 체크로 확인.",
    keyPoints: "- 방문 배열로 경사로 중복 설치 방지\n- 높이 차이 ±1만 허용",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const [n, l] = lines[p++].trim().split(/\s+/).map(Number);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[p++].trim().split(/\s+/).map(Number));

function can(line) {
  const used = Array(n).fill(false);
  for (let i = 0; i < n - 1; i += 1) {
    const diff = line[i + 1] - line[i];
    if (diff === 0) continue;
    if (diff === 1) {
      for (let j = i; j > i - l; j -= 1) {
        if (j < 0 || used[j] || line[j] !== line[i]) return false;
        used[j] = true;
      }
    } else if (diff === -1) {
      for (let j = i + 1; j <= i + l; j += 1) {
        if (j >= n || used[j] || line[j] !== line[i + 1]) return false;
        used[j] = true;
      }
    } else return false;
  }
  return true;
}

let ans = 0;
for (let i = 0; i < n; i += 1) {
  if (can(a[i])) ans += 1;
}
for (let j = 0; j < n; j += 1) {
  const col = [];
  for (let i = 0; i < n; i += 1) col.push(a[i][j]);
  if (can(col)) ans += 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "경사로는 '설치 구간 방문 체크'를 놓치면 대부분 오답.",
    retryCriteria: "오르막/내리막 설치 구간 인덱스를 1칸씩 잘못 잡았을 때",
  },

  "boj-20056": {
    summary:
      "파이어볼이 이동/합쳐짐/분해되는 시뮬레이션을 K번 수행 후 남은 질량 합을 구한다.",
    approach:
      "각 칸에 파이어볼 목록을 모아두고, 한 턴: (1) 이동 후 칸에 모으기 (2) 칸별로 2개 이상이면 규칙대로 합쳐 분해.",
    keyPoints:
      "- 좌표는 모듈러(N)\n- 같은 칸 모였다가 분해\n- 방향 parity(홀짝) 체크",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const k = Number(data[idx++]);

let balls = [];
for (let i = 0; i < m; i += 1) {
  const r = Number(data[idx++]) - 1;
  const c = Number(data[idx++]) - 1;
  const mass = Number(data[idx++]);
  const speed = Number(data[idx++]);
  const dir = Number(data[idx++]);
  balls.push([r, c, mass, speed, dir]);
}

const dr = [-1, -1, 0, 1, 1, 1, 0, -1];
const dc = [0, 1, 1, 1, 0, -1, -1, -1];

for (let step = 0; step < k; step += 1) {
  const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => []));

  for (const [r, c, mass, speed, dir] of balls) {
    const nr = (r + dr[dir] * (speed % n) + n * 1000) % n;
    const nc = (c + dc[dir] * (speed % n) + n * 1000) % n;
    grid[nr][nc].push([mass, speed, dir]);
  }

  const next = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const cell = grid[i][j];
      if (!cell.length) continue;
      if (cell.length === 1) {
        const [mass, speed, dir] = cell[0];
        next.push([i, j, mass, speed, dir]);
        continue;
      }

      let sumM = 0;
      let sumS = 0;
      let allEven = true;
      let allOdd = true;
      for (const [mass, speed, dir] of cell) {
        sumM += mass;
        sumS += speed;
        if (dir % 2 === 0) allOdd = false;
        else allEven = false;
      }

      const nm = Math.floor(sumM / 5);
      if (nm === 0) continue;
      const ns = Math.floor(sumS / cell.length);
      const startDir = (allEven || allOdd) ? 0 : 1;
      for (let t = 0; t < 4; t += 1) {
        next.push([i, j, nm, ns, startDir + 2 * t]);
      }
    }
  }

  balls = next;
}

let ans = 0;
for (const b of balls) ans += b[2];
process.stdout.write(String(ans));
`,
    retrospective: "K번 시뮬레이션은 턴 단위로 '이동->병합' 순서를 확실히.",
    retryCriteria: "속도 mod N을 적용하지 않아 불필요하게 큰 반복을 했을 때",
  },

  "boj-20057": {
    summary:
      "토네이도가 이동하며 모래를 흩뿌리는 규칙대로 시뮬레이션 후 밖으로 나간 모래 양을 구한다.",
    approach:
      "토네이도 경로(달팽이)로 한 칸씩 이동하며 현재 칸 모래를 방향별 비율에 따라 분배. 격자 밖이면 ans에 누적.",
    keyPoints:
      "- 달팽이 이동 경로\n- 방향별 분배 패턴 회전\n- 남은 모래(alpha) 처리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const a = [];
for (let i = 0; i < n; i += 1) a.push(lines[i + 1].trim().split(/\s+/).map(Number));

// directions: left, down, right, up
const dx = [0, 1, 0, -1];
const dy = [-1, 0, 1, 0];

// distribution for left
const pattern = [
  [-1, 1, 0.01],
  [1, 1, 0.01],
  [-1, 0, 0.07],
  [1, 0, 0.07],
  [-2, 0, 0.02],
  [2, 0, 0.02],
  [-1, -1, 0.1],
  [1, -1, 0.1],
  [0, -2, 0.05],
];

function rotate(x, y, dir) {
  // rotate coords from left to dir
  // dir: 0 left (x,y), 1 down, 2 right, 3 up
  if (dir === 0) return [x, y];
  if (dir === 1) return [-y, x];
  if (dir === 2) return [-x, -y];
  return [y, -x];
}

let x = Math.floor(n / 2);
let y = Math.floor(n / 2);
let dir = 0;
let stepLen = 1;
let ans = 0;

function addSand(nx, ny, v) {
  if (nx < 0 || ny < 0 || nx >= n || ny >= n) ans += v;
  else a[nx][ny] += v;
}

while (!(x === 0 && y === 0)) {
  for (let rep = 0; rep < 2; rep += 1) {
    for (let s = 0; s < stepLen; s += 1) {
      const nx = x + dx[dir];
      const ny = y + dy[dir];

      const sand = a[nx][ny];
      a[nx][ny] = 0;

      let spread = 0;
      for (const [px, py, ratio] of pattern) {
        const [rx, ry] = rotate(px, py, dir);
        const val = Math.floor(sand * ratio);
        spread += val;
        addSand(nx + rx, ny + ry, val);
      }
      // alpha
      addSand(nx + dx[dir], ny + dy[dir], sand - spread);

      x = nx;
      y = ny;
      if (x === 0 && y === 0) break;
    }
    dir = (dir + 1) % 4;
    if (x === 0 && y === 0) break;
  }
  stepLen += 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "방향별 패턴 회전(좌표 변환)로 구현을 단순화할 수 있다.",
    retryCriteria: "패턴 회전/alpha 위치가 틀려 모래 합이 보존되지 않을 때",
  },

  "pg-17680": {
    summary:
      "LRU 캐시 시뮬레이션. cacheSize와 도시 방문 기록이 주어질 때 실행 시간 합을 구한다.",
    approach:
      "캐시를 배열(큐)로 유지하며 hit이면 1, miss이면 5. hit/miss마다 해당 도시를 끝으로 이동.",
    keyPoints: "- 대소문자 무시\n- cacheSize=0 특수케이스",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(cacheSize, cities) {
  if (cacheSize === 0) return cities.length * 5;

  const cache = [];
  let time = 0;

  for (let city of cities) {
    city = city.toLowerCase();
    const idx = cache.indexOf(city);
    if (idx !== -1) {
      cache.splice(idx, 1);
      cache.push(city);
      time += 1;
    } else {
      if (cache.length === cacheSize) cache.shift();
      cache.push(city);
      time += 5;
    }
  }

  return time;
}
`,
    retrospective: "LRU는 '최근 사용'을 끝으로 보내는 시뮬레이션.",
    retryCriteria: "cacheSize=0을 빼먹어 런타임 에러가 났을 때",
  },

  "pg-67256": {
    summary: "키패드 누르기 규칙에 따라 왼손/오른손 사용 문자열을 반환한다.",
    approach:
      "각 손의 위치를 좌표로 두고, 가운데 열(2,5,8,0)은 맨해튼 거리 비교. tie면 hand 선호.",
    keyPoints: "- 좌표 매핑\n- 거리 계산\n- tie-break(hand)",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(numbers, hand) {
  const pos = {
    1: [0, 0], 2: [0, 1], 3: [0, 2],
    4: [1, 0], 5: [1, 1], 6: [1, 2],
    7: [2, 0], 8: [2, 1], 9: [2, 2],
    0: [3, 1],
    "*": [3, 0],
    "#": [3, 2],
  };

  let L = pos["*"];
  let R = pos["#"];

  function dist(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  let ans = "";
  for (const num of numbers) {
    if (num === 1 || num === 4 || num === 7) {
      ans += "L";
      L = pos[num];
    } else if (num === 3 || num === 6 || num === 9) {
      ans += "R";
      R = pos[num];
    } else {
      const target = pos[num];
      const dl = dist(L, target);
      const dr = dist(R, target);
      if (dl < dr) {
        ans += "L";
        L = target;
      } else if (dr < dl) {
        ans += "R";
        R = target;
      } else {
        if (hand === "left") {
          ans += "L";
          L = target;
        } else {
          ans += "R";
          R = target;
        }
      }
    }
  }

  return ans;
}
`,
    retrospective: "좌표 매핑 + 거리 비교로 구현이 깔끔해진다.",
    retryCriteria: "0의 위치를 (3,1)로 두는 매핑을 틀렸을 때",
  },
};
