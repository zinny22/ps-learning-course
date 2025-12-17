import type { SolutionTemplate } from "./types";

export const week9Templates: Record<string, SolutionTemplate> = {
  "boj-2961": {
    summary:
      "재료들의 (신맛 곱, 쓴맛 합) 차이가 최소가 되도록 일부 재료를 선택한다(공집합 불가).",
    approach:
      "부분집합 완전탐색(2^N). 선택된 재료들의 신맛은 곱, 쓴맛은 합으로 누적하고 |S-B| 최소를 갱신.",
    keyPoints: "- 공집합 제외\n- N<=10 정도면 2^N 가능",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const s = [];
const b = [];
for (let i = 0; i < n; i += 1) {
  s.push(Number(data[idx++]));
  b.push(Number(data[idx++]));
}

let ans = 1e18;

for (let mask = 1; mask < (1 << n); mask += 1) {
  let prod = 1;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    if (mask & (1 << i)) {
      prod *= s[i];
      sum += b[i];
    }
  }
  const diff = prod - sum;
  const abs = diff < 0 ? -diff : diff;
  if (abs < ans) ans = abs;
}

process.stdout.write(String(ans));
`,
    retrospective: "부분집합 문제는 mask 루프가 제일 빠른 구현.",
    retryCriteria: "공집합(mask=0)을 포함해버렸을 때",
  },

  "boj-1713": {
    summary:
      "사진틀 N개에 학생 추천을 순서대로 처리한다. 추천 규칙에 따라 최종 사진틀 학생 번호를 출력한다.",
    approach:
      "현재 게시 여부/추천수/게시 시각을 관리. 새 학생인데 틀이 꽉 찼으면 추천수 최소, 동률이면 오래된 학생 제거.",
    keyPoints:
      "- 제거 기준: (추천수 오름차순, 게시 시각 오름차순)\n- 추천 받은 학생은 count++",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(input[idx++]);
const total = Number(input[idx++]);
const rec = [];
for (let i = 0; i < total; i += 1) rec.push(Number(input[idx++]));

const inFrame = new Map(); // id -> {cnt, time}
let time = 0;

for (const student of rec) {
  time += 1;
  if (inFrame.has(student)) {
    inFrame.get(student).cnt += 1;
    continue;
  }

  if (inFrame.size < n) {
    inFrame.set(student, { cnt: 1, time });
    continue;
  }

  // remove one
  let target = null;
  for (const [id, info] of inFrame.entries()) {
    if (target === null) target = [id, info];
    else {
      const tInfo = target[1];
      if (info.cnt < tInfo.cnt || (info.cnt === tInfo.cnt && info.time < tInfo.time)) {
        target = [id, info];
      }
    }
  }
  inFrame.delete(target[0]);
  inFrame.set(student, { cnt: 1, time });
}

const ans = Array.from(inFrame.keys()).sort((a, b) => a - b);
process.stdout.write(ans.join(" "));
`,
    retrospective: "시뮬레이션은 상태를 명확히(추천수/시각) 잡는 게 90%.",
    retryCriteria: "추천수 동률 시 '오래된 것 제거'를 반대로 처리했을 때",
  },

  "boj-15683": {
    summary: "CCTV 방향을 정해 사각지대(0) 최소 개수를 구한다.",
    approach:
      "CCTV 목록을 뽑아 백트래킹. 각 CCTV 타입별 가능한 방향 세트를 적용하며 감시 영역을 마킹하고 최소 사각지대 갱신.",
    keyPoints:
      "- 방향 경우의 수 백트래킹\n- 감시는 벽(6)까지 직선\n- 복구를 위해 보드 복사 또는 변경 기록",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const board0 = [];
const cams = [];
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].trim().split(/\s+/).map(Number);
  board0.push(row);
  for (let j = 0; j < m; j += 1) {
    const v = row[j];
    if (v >= 1 && v <= 5) cams.push([i, j, v]);
  }
}

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const patterns = {
  1: [[0], [1], [2], [3]],
  2: [[0, 2], [1, 3]],
  3: [[3, 0], [0, 1], [1, 2], [2, 3]],
  4: [[2, 3, 0], [3, 0, 1], [0, 1, 2], [1, 2, 3]],
  5: [[0, 1, 2, 3]],
};

function cloneBoard(b) {
  return b.map((r) => r.slice());
}

function watch(board, x, y, d) {
  const dx = dirs[d][0];
  const dy = dirs[d][1];
  let nx = x + dx;
  let ny = y + dy;
  while (nx >= 0 && ny >= 0 && nx < n && ny < m) {
    if (board[nx][ny] === 6) break;
    if (board[nx][ny] === 0) board[nx][ny] = -1;
    nx += dx;
    ny += dy;
  }
}

let ans = 1e18;

function dfs(idx, board) {
  if (idx === cams.length) {
    let cnt = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < m; j += 1) if (board[i][j] === 0) cnt += 1;
    }
    if (cnt < ans) ans = cnt;
    return;
  }

  const [x, y, t] = cams[idx];
  for (const pat of patterns[t]) {
    const nb = cloneBoard(board);
    for (const d of pat) watch(nb, x, y, d);
    dfs(idx + 1, nb);
  }
}

dfs(0, board0);
process.stdout.write(String(ans));
`,
    retrospective: "백트래킹 + 상태 복사(또는 변경 기록)가 깔끔한 풀이.",
    retryCriteria: "감시 마킹 복구를 잘못해 케이스 간 상태가 섞였을 때",
  },

  "boj-17143": {
    summary:
      "낚시왕이 이동하며 상어를 잡고, 상어들이 이동/충돌하는 시뮬레이션 후 잡은 크기 합을 구한다.",
    approach:
      "열 단위로 낚시왕 이동. 각 턴: (1) 해당 열 가장 위 상어 잡기 (2) 모든 상어 이동 후 같은 칸은 크기 큰 상어만 남김.",
    keyPoints:
      "- 속도는 주기(2*(R-1),2*(C-1))로 mod\n- 충돌은 맵에 덮어쓰며 size 비교",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const R = Number(data[idx++]);
const C = Number(data[idx++]);
const M = Number(data[idx++]);

// dir: 1 up,2 down,3 right,4 left
let sharks = [];
for (let i = 0; i < M; i += 1) {
  const r = Number(data[idx++]) - 1;
  const c = Number(data[idx++]) - 1;
  const s = Number(data[idx++]);
  const d = Number(data[idx++]);
  const z = Number(data[idx++]);
  sharks.push({ r, c, s, d, z });
}

function moveOne(sh) {
  let { r, c, s, d, z } = sh;
  if (d === 1 || d === 2) {
    const cycle = (R - 1) * 2;
    let sp = cycle === 0 ? 0 : (s % cycle);
    while (sp > 0) {
      if (d === 1) {
        if (r === 0) d = 2;
        else { r -= 1; sp -= 1; }
      } else {
        if (r === R - 1) d = 1;
        else { r += 1; sp -= 1; }
      }
      if (sp > 0) {
        if (d === 1 && r > 0) {
          const step = Math.min(sp, r);
          r -= step; sp -= step;
        } else if (d === 2 && r < R - 1) {
          const step = Math.min(sp, (R - 1) - r);
          r += step; sp -= step;
        }
      }
    }
  } else {
    const cycle = (C - 1) * 2;
    let sp = cycle === 0 ? 0 : (s % cycle);
    while (sp > 0) {
      if (d === 4) {
        if (c === 0) d = 3;
        else { c -= 1; sp -= 1; }
      } else {
        if (c === C - 1) d = 4;
        else { c += 1; sp -= 1; }
      }
      if (sp > 0) {
        if (d === 4 && c > 0) {
          const step = Math.min(sp, c);
          c -= step; sp -= step;
        } else if (d === 3 && c < C - 1) {
          const step = Math.min(sp, (C - 1) - c);
          c += step; sp -= step;
        }
      }
    }
  }
  return { r, c, s, d, z };
}

let score = 0;

for (let col = 0; col < C; col += 1) {
  // map current
  const map = Array.from({ length: R }, () => Array(C).fill(null));
  for (const sh of sharks) map[sh.r][sh.c] = sh;

  // catch
  for (let row = 0; row < R; row += 1) {
    const sh = map[row][col];
    if (sh) {
      score += sh.z;
      map[row][col] = null;
      break;
    }
  }

  // rebuild sharks after catch
  const remain = [];
  for (let i = 0; i < R; i += 1) {
    for (let j = 0; j < C; j += 1) {
      if (map[i][j]) remain.push(map[i][j]);
    }
  }

  // move & collide
  const nextMap = Array.from({ length: R }, () => Array(C).fill(null));
  for (const sh of remain) {
    const moved = moveOne(sh);
    const cur = nextMap[moved.r][moved.c];
    if (!cur || cur.z < moved.z) nextMap[moved.r][moved.c] = moved;
  }

  sharks = [];
  for (let i = 0; i < R; i += 1) {
    for (let j = 0; j < C; j += 1) {
      if (nextMap[i][j]) sharks.push(nextMap[i][j]);
    }
  }
}

process.stdout.write(String(score));
`,
    retrospective: "시뮬레이션은 '한 턴에 할 일 순서'를 정확히 지키는 게 중요.",
    retryCriteria: "상어 이동 시 반사(방향 전환) 로직이 꼬였을 때",
  },

  "boj-3190": {
    summary: "뱀 게임을 시뮬레이션해 게임이 끝나는 시간을 구한다.",
    approach:
      "큐(덱)로 뱀 몸통을 관리하고, 매 초 머리 이동 후 충돌 체크. 사과가 없으면 꼬리 제거.",
    keyPoints: "- 몸통 좌표 Set/배열로 충돌 체크\n- 방향 전환 시간에 맞춰 수행",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const n = Number(lines[p++]);
const k = Number(lines[p++]);
const apple = Array.from({ length: n }, () => Array(n).fill(false));
for (let i = 0; i < k; i += 1) {
  const [r, c] = lines[p++].trim().split(/\s+/).map(Number);
  apple[r - 1][c - 1] = true;
}
const l = Number(lines[p++]);
const turns = new Map();
for (let i = 0; i < l; i += 1) {
  const [tStr, dir] = lines[p++].trim().split(/\s+/);
  turns.set(Number(tStr), dir);
}

// dir 0 right,1 down,2 left,3 up
const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];
let dir = 0;
let time = 0;
let headX = 0;
let headY = 0;

const body = [[0, 0]]; // queue
let bodyHead = 0;
const occ = new Set(["0,0"]);

while (true) {
  time += 1;
  const nx = headX + dx[dir];
  const ny = headY + dy[dir];

  if (nx < 0 || ny < 0 || nx >= n || ny >= n) break;
  const key = nx + "," + ny;
  if (occ.has(key)) break;

  body.push([nx, ny]);
  occ.add(key);
  headX = nx;
  headY = ny;

  if (apple[nx][ny]) {
    apple[nx][ny] = false;
  } else {
    const tail = body[bodyHead++];
    occ.delete(tail[0] + "," + tail[1]);
  }

  if (turns.has(time)) {
    const t = turns.get(time);
    if (t === "L") dir = (dir + 3) % 4;
    else dir = (dir + 1) % 4;
  }
}

process.stdout.write(String(time));
`,
    retrospective: "덱 + 점유 Set으로 O(1) 충돌 체크.",
    retryCriteria: "좌표를 (행,열)로 읽고 (x,y)로 뒤집어 사용했을 때",
  },

  "pg-42839": {
    summary: "주어진 숫자 문자열로 만들 수 있는 소수의 개수를 구한다.",
    approach:
      "모든 길이의 순열을 생성해 수로 만들고 Set에 저장. 에라토스테네스 또는 소수 판별로 카운트.",
    keyPoints: "- 중복 방지(Set)\n- 순열 백트래킹",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(numbers) {
  const chars = numbers.split("");
  const used = Array(chars.length).fill(false);
  const set = new Set();

  function isPrime(x) {
    if (x < 2) return false;
    if (x === 2) return true;
    if (x % 2 === 0) return false;
    for (let i = 3; i * i <= x; i += 2) {
      if (x % i === 0) return false;
    }
    return true;
  }

  function dfs(cur) {
    if (cur.length) set.add(Number(cur.join("")));
    if (cur.length === chars.length) return;
    for (let i = 0; i < chars.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(chars[i]);
      dfs(cur);
      cur.pop();
      used[i] = false;
    }
  }

  dfs([]);

  let cnt = 0;
  for (const x of set) if (isPrime(x)) cnt += 1;
  return cnt;
}
`,
    retrospective: "순열 생성 + Set 중복 제거 패턴을 익히면 편하다.",
    retryCriteria:
      "leading zero가 포함된 수(예: 011 -> 11) 중복 처리를 놓쳤을 때",
  },

  "boj-14502": {
    summary:
      "연구소에서 벽 3개를 세워 바이러스 확산 후 안전영역(0) 최대를 구한다.",
    approach:
      "빈 칸 중 3개를 조합으로 선택(완전탐색)하고, 그때마다 BFS로 바이러스를 퍼뜨린 뒤 남은 0 개수 최댓값.",
    keyPoints: "- 벽 3개 조합\n- 바이러스 멀티소스 BFS\n- 보드 복사",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const base = [];
const empties = [];
const virus = [];
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].trim().split(/\s+/).map(Number);
  base.push(row);
  for (let j = 0; j < m; j += 1) {
    if (row[j] === 0) empties.push([i, j]);
    else if (row[j] === 2) virus.push([i, j]);
  }
}

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function clone(b) { return b.map((r) => r.slice()); }

function simulate(w1, w2, w3) {
  const b = clone(base);
  b[w1[0]][w1[1]] = 1;
  b[w2[0]][w2[1]] = 1;
  b[w3[0]][w3[1]] = 1;

  const qx = [];
  const qy = [];
  let head = 0;
  for (const [x, y] of virus) { qx.push(x); qy.push(y); }

  while (head < qx.length) {
    const x = qx[head];
    const y = qy[head];
    head += 1;
    for (let d = 0; d < 4; d += 1) {
      const nx = x + dx[d];
      const ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (b[nx][ny] !== 0) continue;
      b[nx][ny] = 2;
      qx.push(nx);
      qy.push(ny);
    }
  }

  let safe = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) if (b[i][j] === 0) safe += 1;
  }
  return safe;
}

let ans = 0;
const L = empties.length;
for (let i = 0; i < L; i += 1) {
  for (let j = i + 1; j < L; j += 1) {
    for (let k = j + 1; k < L; k += 1) {
      const v = simulate(empties[i], empties[j], empties[k]);
      if (v > ans) ans = v;
    }
  }
}

process.stdout.write(String(ans));
`,
    retrospective: "조합 완전탐색 + BFS 시뮬레이션의 전형.",
    retryCriteria: "벽 설치 후 보드 복구를 빼먹었을 때",
  },

  "boj-14888": {
    summary:
      "수열에 연산자(+,-,*,/)를 끼워 넣어 만들 수 있는 최댓값/최솟값을 구한다.",
    approach:
      "백트래킹으로 연산자 카운트를 소진하며 순서대로 계산. 나눗셈은 문제 규칙(정수, 0쪽으로 버림) 적용.",
    keyPoints: "- 연산자 카운트 기반 DFS\n- JS는 Math.trunc(a/b)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const a = [];
for (let i = 0; i < n; i += 1) a.push(Number(data[idx++]));
const ops = [Number(data[idx++]), Number(data[idx++]), Number(data[idx++]), Number(data[idx++])];

let maxV = -1e18;
let minV = 1e18;

function dfs(pos, cur) {
  if (pos === n) {
    if (cur > maxV) maxV = cur;
    if (cur < minV) minV = cur;
    return;
  }

  for (let t = 0; t < 4; t += 1) {
    if (ops[t] === 0) continue;
    ops[t] -= 1;
    let nxt = cur;
    const v = a[pos];
    if (t === 0) nxt = cur + v;
    else if (t === 1) nxt = cur - v;
    else if (t === 2) nxt = cur * v;
    else nxt = Math.trunc(cur / v);
    dfs(pos + 1, nxt);
    ops[t] += 1;
  }
}

dfs(1, a[0]);
process.stdout.write(String(maxV) + "\n" + String(minV));
`,
    retrospective: "연산자 끼워넣기는 카운트 DFS가 가장 직관적.",
    retryCriteria: "나눗셈의 음수 처리(Math.trunc) 규칙을 놓쳤을 때",
  },

  "boj-15686": {
    summary: "치킨집 중 M개를 골라 도시의 치킨거리 합을 최소로 한다.",
    approach:
      "치킨집 인덱스를 조합으로 선택하고, 각 집에서 선택된 치킨집까지 최소 거리를 합산해 최소값 갱신.",
    keyPoints: "- 조합\n- 거리 계산은 Manhattan",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const houses = [];
const chickens = [];
for (let i = 0; i < n; i += 1) {
  const row = lines[i + 1].trim().split(/\s+/).map(Number);
  for (let j = 0; j < n; j += 1) {
    if (row[j] === 1) houses.push([i, j]);
    else if (row[j] === 2) chickens.push([i, j]);
  }
}

let ans = 1e18;
const pick = [];

function dfs(idx, start) {
  if (idx === m) {
    let total = 0;
    for (const [hx, hy] of houses) {
      let best = 1e18;
      for (const ci of pick) {
        const [cx, cy] = chickens[ci];
        const d = Math.abs(hx - cx) + Math.abs(hy - cy);
        if (d < best) best = d;
      }
      total += best;
      if (total >= ans) break;
    }
    if (total < ans) ans = total;
    return;
  }

  for (let i = start; i < chickens.length; i += 1) {
    pick.push(i);
    dfs(idx + 1, i + 1);
    pick.pop();
  }
}

dfs(0, 0);
process.stdout.write(String(ans));
`,
    retrospective:
      "조합 + 비용 계산 문제는 중간 가지치기(total>=ans)가 효과적.",
    retryCriteria: "조합 인덱스 범위를 잘못 잡아 중복 선택이 생겼을 때",
  },

  "boj-17406": {
    summary:
      "배열 회전 연산 K개 순서를 바꿔 적용했을 때, 배열 각 행 합의 최소값을 구한다.",
    approach:
      "연산 순열을 완전탐색(K! <= 6! 정도). 각 순열마다 배열을 복사하고 회전 연산을 적용 후 행 합 최소를 계산.",
    keyPoints: "- K가 작을 때 순열\n- 회전은 layer별로 테두리 이동",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++]);
const m = Number(data[idx++]);
const k = Number(data[idx++]);

const base = Array.from({ length: n }, () => Array(m).fill(0));
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < m; j += 1) base[i][j] = Number(data[idx++]);
}

const ops = [];
for (let i = 0; i < k; i += 1) {
  const r = Number(data[idx++]) - 1;
  const c = Number(data[idx++]) - 1;
  const s = Number(data[idx++]);
  ops.push([r, c, s]);
}

function clone(a) { return a.map((r) => r.slice()); }

function rotate(a, r, c, s) {
  for (let layer = 1; layer <= s; layer += 1) {
    const top = r - layer;
    const left = c - layer;
    const bottom = r + layer;
    const right = c + layer;

    const temp = a[top][left];

    for (let i = top; i < bottom; i += 1) a[i][left] = a[i + 1][left];
    for (let j = left; j < right; j += 1) a[bottom][j] = a[bottom][j + 1];
    for (let i = bottom; i > top; i -= 1) a[i][right] = a[i - 1][right];
    for (let j = right; j > left + 1; j -= 1) a[top][j] = a[top][j - 1];

    a[top][left + 1] = temp;
  }
}

const used = Array(k).fill(false);
const order = [];
let ans = 1e18;

function calc(a) {
  for (let i = 0; i < n; i += 1) {
    let sum = 0;
    for (let j = 0; j < m; j += 1) sum += a[i][j];
    if (sum < ans) ans = sum;
  }
}

function dfs() {
  if (order.length === k) {
    const a = clone(base);
    for (const oi of order) {
      const [r, c, s] = ops[oi];
      rotate(a, r, c, s);
    }
    calc(a);
    return;
  }

  for (let i = 0; i < k; i += 1) {
    if (used[i]) continue;
    used[i] = true;
    order.push(i);
    dfs();
    order.pop();
    used[i] = false;
  }
}

dfs();
process.stdout.write(String(ans));
`,
    retrospective: "K가 작으면 순열 완탐이 정석. 회전 구현만 정확히 하면 된다.",
    retryCriteria: "회전 layer 이동 순서를 잘못해 값이 덮어씌워졌을 때",
  },

  "pg-87946": {
    summary: "피로도 k로 던전을 최대 몇 개 탐험할 수 있는지 구한다.",
    approach:
      "던전 순서를 순열 완전탐색(최대 8). 각 순열에 대해 가능한 만큼 진행하며 최대 카운트 갱신.",
    keyPoints: "- N<=8\n- 순열/백트래킹",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(k, dungeons) {
  const n = dungeons.length;
  const used = Array(n).fill(false);
  let ans = 0;

  function dfs(curK, cnt) {
    if (cnt > ans) ans = cnt;
    for (let i = 0; i < n; i += 1) {
      if (used[i]) continue;
      const need = dungeons[i][0];
      const cost = dungeons[i][1];
      if (curK < need) continue;
      used[i] = true;
      dfs(curK - cost, cnt + 1);
      used[i] = false;
    }
  }

  dfs(k, 0);
  return ans;
}
`,
    retrospective: "N이 작으면 DP보다 백트래킹이 더 단순하고 충분히 빠르다.",
    retryCriteria: "used 처리를 빼먹어 중복 방문이 생겼을 때",
  },

  "pg-42840": {
    summary: "수포자 3명의 찍기 패턴으로 가장 많이 맞힌 사람을 구한다.",
    approach:
      "각 패턴을 배열로 두고 answers를 순회하며 일치 횟수를 센 뒤 최대값인 사람 번호를 반환.",
    keyPoints: "- 패턴 모듈로 인덱싱\n- 동점 다수 반환",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(answers) {
  const p1 = [1, 2, 3, 4, 5];
  const p2 = [2, 1, 2, 3, 2, 4, 2, 5];
  const p3 = [3, 3, 1, 1, 2, 2, 4, 4, 5, 5];

  const score = [0, 0, 0];
  for (let i = 0; i < answers.length; i += 1) {
    if (answers[i] === p1[i % p1.length]) score[0] += 1;
    if (answers[i] === p2[i % p2.length]) score[1] += 1;
    if (answers[i] === p3[i % p3.length]) score[2] += 1;
  }

  const max = Math.max(score[0], score[1], score[2]);
  const ans = [];
  for (let i = 0; i < 3; i += 1) if (score[i] === max) ans.push(i + 1);
  return ans;
}
`,
    retrospective: "시뮬레이션은 규칙을 코드로 그대로 옮기면 끝.",
    retryCriteria: "패턴 길이 모듈로 계산을 잘못했을 때",
  },
};
