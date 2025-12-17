import type { SolutionTemplate } from "./types";

export const week11Templates: Record<string, SolutionTemplate> = {
  "boj-1157": {
    summary:
      "단어에서 가장 많이 사용된 알파벳을 출력한다(대소문자 무시). 동률이면 ?.",
    approach:
      "대문자로 통일 후 빈도 배열(26)로 카운트하고 최댓값/동률 여부를 확인.",
    keyPoints: "- toUpperCase\n- 최대값 동률 체크",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const s = (fs.readFileSync(0, "utf8").trim() || "").toUpperCase();
const cnt = Array(26).fill(0);
for (let i = 0; i < s.length; i += 1) {
  const c = s.charCodeAt(i) - 65;
  if (c >= 0 && c < 26) cnt[c] += 1;
}

let max = -1;
let idx = -1;
let dup = false;
for (let i = 0; i < 26; i += 1) {
  if (cnt[i] > max) { max = cnt[i]; idx = i; dup = false; }
  else if (cnt[i] === max && max !== 0) dup = true;
}

process.stdout.write(dup ? "?" : String.fromCharCode(65 + idx));
`,
    retrospective: "빈도 문제는 배열 26개로 끝.",
    retryCriteria: "동률 처리(dup) 조건을 놓쳤을 때",
  },

  "boj-1316": {
    summary: "그룹 단어(각 문자가 연속해서만 등장) 개수를 구한다.",
    approach:
      "각 단어를 순회하며 이전 문자와 달라질 때 이미 등장했던 문자인지 체크.",
    keyPoints: "- seen[26]\n- 문자 전환 시만 검사",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
let ans = 0;

for (let i = 1; i <= n; i += 1) {
  const w = (lines[i] || "").trim();
  const seen = Array(26).fill(false);
  let ok = true;
  let prev = "";
  for (const ch of w) {
    if (ch !== prev) {
      const idx = ch.charCodeAt(0) - 97;
      if (seen[idx]) { ok = false; break; }
      seen[idx] = true;
      prev = ch;
    }
  }
  if (ok) ans += 1;
}

process.stdout.write(String(ans));
`,
    retrospective: "연속성 검사에서 '변할 때만' 이전 등장 여부를 보면 된다.",
    retryCriteria: "seen 체크 타이밍을 매 글자마다 해버려 오답이 났을 때",
  },

  "boj-9935": {
    summary:
      "문자열에서 폭발 문자열을 모두 제거한 결과를 출력한다. 없으면 FRULA.",
    approach:
      "스택(배열)에 문자 누적 후, 끝부분이 폭발 문자열과 같으면 그 길이만큼 pop.",
    keyPoints: "- 스택\n- suffix 비교 (길이 m만)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [s, bomb] = fs.readFileSync(0, "utf8").split(/\n/).map((x) => (x || "").trim());
const m = bomb.length;
const st = [];

for (const ch of s) {
  st.push(ch);
  if (st.length >= m) {
    let ok = true;
    for (let i = 0; i < m; i += 1) {
      if (st[st.length - m + i] !== bomb[i]) { ok = false; break; }
    }
    if (ok) st.length -= m;
  }
}

process.stdout.write(st.length ? st.join("") : "FRULA");
`,
    retrospective: "폭발/삭제는 스택 + 접미사 비교로 O(N) 처리.",
    retryCriteria: "접미사 비교 인덱스를 잘못 잡았을 때",
  },

  "boj-1541": {
    summary: "수식에서 괄호를 적절히 쳐서 최소값을 만든다.",
    approach:
      "'-' 기준으로 분리한 뒤, 첫 덩어리는 더하고 이후 덩어리들은 모두 합쳐서 뺀다.",
    keyPoints: "- '-' 이후를 통째로 빼기\n- split 활용",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const s = fs.readFileSync(0, "utf8").trim();
const parts = s.split("-");

function sumPart(p) {
  return p.split("+").reduce((acc, x) => acc + Number(x), 0);
}

let ans = sumPart(parts[0]);
for (let i = 1; i < parts.length; i += 1) ans -= sumPart(parts[i]);

process.stdout.write(String(ans));
`,
    retrospective: "최소화는 '-'를 만나면 이후를 한 괄호로 묶는 게 최적.",
    retryCriteria: "첫 덩어리까지 빼버리는 실수를 했을 때",
  },

  "boj-17609": {
    summary: "문자열이 회문(0), 유사 회문(1), 둘 다 아님(2)인지 판별한다.",
    approach:
      "투 포인터로 비교하다 불일치 시, (l+1,r) 또는 (l,r-1) 중 하나가 회문이면 유사 회문.",
    keyPoints: "- 투 포인터\n- 1번만 삭제 허용",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const t = Number(lines[0] || 0);

function isPal(s, l, r) {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l += 1;
    r -= 1;
  }
  return true;
}

const out = [];
for (let i = 1; i <= t; i += 1) {
  const s = (lines[i] || "").trim();
  let l = 0;
  let r = s.length - 1;
  let ans = 0;
  while (l < r) {
    if (s[l] === s[r]) { l += 1; r -= 1; continue; }
    if (isPal(s, l + 1, r) || isPal(s, l, r - 1)) ans = 1;
    else ans = 2;
    break;
  }
  out.push(String(ans));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "유사 회문은 '한 번만 스킵' 조건을 투포인터로 처리.",
    retryCriteria: "불일치 시 두 케이스(l+1,r / l,r-1)를 하나만 검사했을 때",
  },

  "boj-5052": {
    summary:
      "전화번호 목록이 주어질 때 한 번호가 다른 번호의 접두어인지 여부를 판별한다.",
    approach:
      "번호들을 정렬하면 접두어 관계는 인접 원소에서만 발생한다. 인접한 두 문자열만 검사.",
    keyPoints: "- sort\n- startsWith",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const t = Number(lines[p++] || 0);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const n = Number(lines[p++] || 0);
  const arr = [];
  for (let i = 0; i < n; i += 1) arr.push((lines[p++] || "").trim());
  arr.sort();

  let ok = true;
  for (let i = 0; i < n - 1; i += 1) {
    if (arr[i + 1].startsWith(arr[i])) { ok = false; break; }
  }
  out.push(ok ? "YES" : "NO");
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "접두어 문제는 정렬 후 인접만 보면 된다.",
    retryCriteria: "정렬 없이 전체 비교(O(N^2))를 하려다 시간초과가 났을 때",
  },

  "boj-5525": {
    summary: "문자열 S에서 Pn=I(OI)^n 패턴이 등장하는 횟수를 구한다.",
    approach:
      "S를 스캔하며 'IOI' 패턴 연속 개수를 센다. 연속 count가 n 이상일 때마다 답을 증가.",
    keyPoints: "- i += 2로 점프\n- 연속 IOI 카운트",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
// const m = Number(lines[1] || 0);
const s = (lines[2] || "").trim();

let ans = 0;
let cnt = 0;
for (let i = 1; i < s.length - 1; i += 1) {
  if (s[i - 1] === "I" && s[i] === "O" && s[i + 1] === "I") {
    cnt += 1;
    if (cnt >= n) ans += 1;
    i += 1;
  } else {
    cnt = 0;
  }
}

process.stdout.write(String(ans));
`,
    retrospective: "패턴 반복은 스캔하면서 연속 길이를 유지하면 된다.",
    retryCriteria: "i를 점프(i+=1)하지 않아 겹침 처리가 꼬였을 때",
  },

  "boj-5430": {
    summary: "배열에 대해 R(뒤집기), D(버리기) 연산을 수행한 결과를 출력한다.",
    approach:
      "실제로 뒤집지 말고 방향 플래그만 유지. D는 front/back 포인터를 이동. 에러면 error 출력.",
    keyPoints: "- reverse flag\n- two pointers\n- 출력은 방향에 맞춰",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
let p = 0;
const t = Number(lines[p++] || 0);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const cmd = (lines[p++] || "").trim();
  const n = Number(lines[p++] || 0);
  const arrStr = (lines[p++] || "").trim();

  let arr = [];
  if (n > 0) {
    arr = arrStr.slice(1, -1).split(",").map((x) => x);
  }

  let rev = false;
  let l = 0;
  let r = arr.length - 1;
  let ok = true;

  for (const c of cmd) {
    if (c === "R") rev = !rev;
    else {
      if (l > r) { ok = false; break; }
      if (!rev) l += 1;
      else r -= 1;
    }
  }

  if (!ok) { out.push("error"); continue; }

  const res = [];
  if (!rev) {
    for (let i = l; i <= r; i += 1) res.push(arr[i]);
  } else {
    for (let i = r; i >= l; i -= 1) res.push(arr[i]);
  }
  out.push("[" + res.join(",") + "]");
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "뒤집기 연산이 많으면 '플래그 + 포인터'가 정답.",
    retryCriteria: "매번 reverse()를 호출해 시간초과가 났을 때",
  },

  "boj-14425": {
    summary: "집합 S에 포함된 문자열 개수를 센다.",
    approach: "S를 Set으로 저장 후 쿼리 문자열을 조회한다.",
    keyPoints: "- Set 조회 O(1)",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const [n, m] = lines[0].trim().split(/\s+/).map(Number);
const set = new Set();
for (let i = 1; i <= n; i += 1) set.add(lines[i].trim());
let ans = 0;
for (let i = n + 1; i <= n + m; i += 1) if (set.has(lines[i].trim())) ans += 1;
process.stdout.write(String(ans));
`,
    retrospective: "해시(Set) 기본 문제.",
    retryCriteria: "입력 라인 인덱스를 잘못 잡았을 때",
  },

  "boj-2195": {
    summary: "문자열 S를 복사/붙여넣기로 T를 만들 때, 복사 횟수 최소를 구한다.",
    approach:
      "T를 왼쪽부터 진행하며, 현재 위치에서 S의 어떤 부분문자열이 가장 길게 매칭되는지 찾고 그 길이만큼 점프(그리디).",
    keyPoints: "- 매 위치에서 최장 매칭\n- O(|S|*|T|)도 보통 통과",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const [S, T] = fs.readFileSync(0, "utf8").trim().split(/\n/).map((x) => (x || "").trim());

let i = 0;
let cnt = 0;
while (i < T.length) {
  let best = 0;
  for (let s = 0; s < S.length; s += 1) {
    let len = 0;
    while (i + len < T.length && s + len < S.length && T[i + len] === S[s + len]) len += 1;
    if (len > best) best = len;
  }
  i += best;
  cnt += 1;
}

process.stdout.write(String(cnt));
`,
    retrospective: "그리디로 '가장 길게 복사'가 최적(다음 위치를 최대한 당김).",
    retryCriteria: "최장 매칭(best) 계산 루프 인덱스가 꼬여 0이 나왔을 때",
  },
};
