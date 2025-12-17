import type { SolutionTemplate } from "./types";

export const week3Templates: Record<string, SolutionTemplate> = {
  "boj-10872": {
    summary: "N! (팩토리얼)을 계산해 출력한다.",
    approach: "1부터 N까지 곱을 누적한다. (N이 작아서 정수 범위 내)",
    keyPoints: "- 반복문으로 누적\n- N=0이면 1",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let ans = 1;
for (let i = 2; i <= n; i += 1) ans *= i;

process.stdout.write(String(ans));
`,
    retrospective: "재귀 대신 반복으로도 충분히 풀리는 기본 문제.",
    retryCriteria: "0! 처리(=1)를 놓쳤을 때",
  },

  "boj-11729": {
    summary:
      "하노이 탑: N개의 원판을 1번에서 3번으로 옮기는 과정과 최소 이동 횟수를 출력한다.",
    approach:
      "재귀 규칙을 그대로 구현한다. move(n, from, via, to) = move(n-1, from, to, via) + (from->to) + move(n-1, via, from, to)",
    keyPoints: "- 이동 횟수는 2^N - 1\n- 출력은 배열에 쌓아서 join",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

let count = (1n << BigInt(n)) - 1n;
const out = [];

function move(k, from, via, to) {
  if (k === 0) return;
  move(k - 1, from, to, via);
  out.push(from + " " + to);
  move(k - 1, via, from, to);
}

move(n, 1, 2, 3);
process.stdout.write(String(count) + "\n" + out.join("\n"));
`,
    retrospective: "재귀 패턴(쪼개기/중간기둥)을 정확히 외워두면 좋다.",
    retryCriteria: "파라미터(from/via/to) 순서를 헷갈렸을 때",
  },

  "boj-2751": {
    summary: "N개의 수를 오름차순 정렬해서 출력한다. (N이 커서 빠른 정렬 필요)",
    approach:
      "입력을 모두 읽어 숫자 배열로 만든 뒤, JS 내장 sort로 정렬하고 출력한다.",
    keyPoints: "- numeric sort: (a,b)=>a-b\n- 출력은 join",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
const n = Number(data[0] || 0);
const arr = data.slice(1, 1 + n).map(Number);

arr.sort((a, b) => a - b);
process.stdout.write(arr.join("\n"));
`,
    retrospective: "BOJ 출력형 정렬은 join이 핵심.",
    retryCriteria: "sort 비교함수 없이 문자열 정렬로 틀렸을 때",
  },

  "boj-11650": {
    summary: "좌표 (x,y) N개를 x 오름차순, x가 같으면 y 오름차순으로 정렬한다.",
    approach: "배열에 [x,y]로 저장 후 다중 기준 정렬을 적용한다.",
    keyPoints: "- (a[0]-b[0]) || (a[1]-b[1])\n- 출력 join",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
let idx = 0;
const n = Number(data[idx++] || 0);
const pts = [];
for (let i = 0; i < n; i += 1) {
  const x = Number(data[idx++]);
  const y = Number(data[idx++]);
  pts.push([x, y]);
}

pts.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
process.stdout.write(pts.map(([x, y]) => x + " " + y).join("\n"));
`,
    retrospective: "다중 정렬 기준은 || 패턴으로 많이 처리한다.",
    retryCriteria: "x 같을 때 y 정렬을 빼먹었을 때",
  },

  "boj-1181": {
    summary:
      "단어를 (길이 오름차순, 길이가 같으면 사전순)으로 정렬해 중복 제거 후 출력한다.",
    approach:
      "Set으로 중복 제거 후 배열로 변환, 길이/사전순 기준으로 정렬한다.",
    keyPoints: "- 중복 제거: new Set(words)\n- 정렬: len -> lex",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const words = [];
for (let i = 1; i <= n; i += 1) words.push(lines[i].trim());

const unique = Array.from(new Set(words));
unique.sort((a, b) => (a.length - b.length) || (a < b ? -1 : a > b ? 1 : 0));

process.stdout.write(unique.join("\n"));
`,
    retrospective: "정렬 전에 중복 제거를 먼저 하면 깔끔.",
    retryCriteria: "사전순 비교에서 localeCompare/삼항을 헷갈렸을 때",
  },

  "boj-10989": {
    summary:
      "N개의 수를 오름차순 정렬해 출력한다. (값 범위가 작아 카운팅 정렬 가능)",
    approach:
      "1~10000 범위이므로 빈도 배열(freq)을 만들고, i를 순회하며 freq만큼 출력한다.",
    keyPoints: "- freq[값]++\n- 출력 문자열을 크게 만들지 않도록 push 후 join",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
const n = Number(data[0] || 0);
const freq = Array(10001).fill(0);
for (let i = 1; i <= n; i += 1) {
  freq[Number(data[i])] += 1;
}

let out = [];
for (let v = 1; v <= 10000; v += 1) {
  const c = freq[v];
  if (c === 0) continue;
  for (let k = 0; k < c; k += 1) out.push(String(v));
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "범위가 작으면 카운팅 정렬이 정답.",
    retryCriteria: "메모리/출력 최적화 때문에 시간초과가 났을 때",
  },

  "boj-10814": {
    summary:
      "회원 정보를 나이 오름차순으로 정렬한다. (나이가 같으면 가입 순서 유지)",
    approach:
      "입력 순서 index를 같이 저장하고, (age, idx) 기준으로 정렬한다. (안정 정렬을 보장)",
    keyPoints: "- (age, idx)로 정렬\n- 출력 join",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(lines[0] || 0);
const arr = [];

for (let i = 1; i <= n; i += 1) {
  const [ageStr, name] = lines[i].trim().split(/\s+/);
  arr.push([Number(ageStr), i, name]);
}

arr.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
process.stdout.write(arr.map(([age, _i, name]) => age + " " + name).join("\n"));
`,
    retrospective: "안정 정렬이 필요하면 index를 키로 넣는 게 가장 안전.",
    retryCriteria: "나이 같은 경우 순서가 뒤바뀌어 오답이 나왔을 때",
  },

  "boj-2108": {
    summary: "산술평균/중앙값/최빈값/범위를 출력한다. (정수, -4000~4000)",
    approach:
      "빈도 배열로 카운팅하면서 합/최소/최대도 계산한다. 중앙값은 누적 빈도로 찾고, 최빈값은 두 번째로 작은 최빈값 규칙을 적용한다.",
    keyPoints:
      "- 평균: Math.round(sum/n)\n- 중앙값: 누적 >= (n+1)/2\n- 최빈값: 최빈 후보를 오름차순으로 모아 2번째(있으면)\n- 범위: max-min",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/).filter(Boolean);
const n = Number(data[0] || 0);
const freq = Array(8001).fill(0); // -4000..4000
let sum = 0;
let min = 4001;
let max = -4001;

for (let i = 1; i <= n; i += 1) {
  const x = Number(data[i]);
  sum += x;
  if (x < min) min = x;
  if (x > max) max = x;
  freq[x + 4000] += 1;
}

// 평균
const mean = Math.round(sum / n);

// 중앙값
let cnt = 0;
let median = 0;
const midPos = Math.floor((n + 1) / 2);
for (let i = 0; i < freq.length; i += 1) {
  cnt += freq[i];
  if (cnt >= midPos) {
    median = i - 4000;
    break;
  }
}

// 최빈값
let maxFreq = 0;
for (const c of freq) if (c > maxFreq) maxFreq = c;
const modes = [];
for (let i = 0; i < freq.length; i += 1) {
  if (freq[i] === maxFreq) modes.push(i - 4000);
}
const mode = modes.length >= 2 ? modes[1] : modes[0];

// 범위
const range = max - min;

process.stdout.write([mean, median, mode, range].join("\n"));
`,
    retrospective: "카운팅 + 누적합으로 중앙값/최빈값을 안정적으로 구한다.",
    retryCriteria: "최빈값 '두 번째로 작은 값' 규칙을 틀렸을 때",
  },

  "boj-1427": {
    summary: "자연수 N의 각 자리 숫자를 내림차순으로 정렬해서 출력한다.",
    approach: "문자열로 받고, 각 문자를 배열로 만든 뒤 내림차순 정렬해 join.",
    keyPoints: "- 문자열 처리\n- b.localeCompare(a) 또는 (b-a) 비교",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const s = fs.readFileSync(0, "utf8").trim();
const arr = s.split("");
arr.sort((a, b) => b.localeCompare(a));
process.stdout.write(arr.join(""));
`,
    retrospective: "자리수 정렬은 문자열로 풀면 제일 간단.",
    retryCriteria:
      "Number로 변환하다가 앞자리/자리수 처리를 복잡하게 만들었을 때",
  },

  "boj-17478": {
    summary: "재귀함수가 무엇인지 설명하는 대화문을 재귀 구조로 출력한다.",
    approach:
      "깊이 d에 따라 접두사('____' 반복)를 붙여 출력하고, d==n에서 base 문장을 출력한 뒤 되돌아오며 마무리 문장을 출력한다.",
    keyPoints:
      "- prefix = '____'.repeat(depth)\n- 내려가며 질문/설명, 올라오며 '라고 답변하였지.'",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim();
const n = input === "" ? 0 : Number(input);

const out = [];
out.push("어느 한 컴퓨터공학과 학생이 유명한 교수님을 찾아가 물었다.");

function rec(depth) {
  const pre = "____".repeat(depth);
  out.push(pre + '"재귀함수가 뭔가요?"');
  if (depth === n) {
    out.push(pre + '"재귀함수는 자기 자신을 호출하는 함수라네"');
    out.push(pre + "라고 답변하였지.");
    return;
  }
  out.push(pre + '"잘 들어보게. 옛날옛날 한 산 꼭대기에 이세상 모든 지식을 통달한 선인이 있었어.');
  out.push(pre + '마을 사람들은 모두 그 선인에게 수많은 질문을 했고, 모두 지혜롭게 대답해 주었지.');
  out.push(pre + '그의 답은 대부분 옳았다고 하네. 그런데 어느 날, 그 선인에게 한 선비가 찾아와서 물었어."');
  rec(depth + 1);
  out.push(pre + "라고 답변하였지.");
}

rec(0);
process.stdout.write(out.join("\n"));
`,
    retrospective:
      "재귀 출력은 '내려갈 때/올라올 때' 문장을 분리하면 실수 줄어듦.",
    retryCriteria: "따옴표/문장/들여쓰기 출력이 한 줄이라도 어긋났을 때",
  },

  "pg-42746": {
    summary: "정수를 이어붙여 만들 수 있는 가장 큰 수를 문자열로 반환한다.",
    approach:
      "문자열로 바꾼 뒤, 두 문자열 a,b에 대해 (b+a) vs (a+b) 비교로 내림차순 정렬한다.",
    keyPoints: "- 정렬 비교: (b+a).localeCompare(a+b)\n- 모두 0이면 '0'",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(numbers) {
  const arr = numbers.map(String);
  arr.sort((a, b) => (b + a).localeCompare(a + b));

  if (arr[0] === "0") return "0";
  return arr.join("");
}
`,
    retrospective: "문자열 결합 비교 정렬은 '가장 큰 수' 유형의 핵심 템플릿.",
    retryCriteria: '모두 0인 케이스 처리("0")를 빼먹었을 때',
  },

  "pg-42748": {
    summary: "배열의 i~j 구간을 잘라 정렬했을 때 k번째 수를 구한다.",
    approach:
      "각 command마다 slice로 부분 배열을 만들고 정렬 후 k-1 인덱스를 선택한다.",
    keyPoints: "- slice(i-1, j)\n- sort((a,b)=>a-b)\n- pick [k-1]",
    mistakes: "",
    codeLanguage: "js",
    code: `function solution(array, commands) {
  return commands.map(([i, j, k]) => {
    const tmp = array.slice(i - 1, j).sort((a, b) => a - b);
    return tmp[k - 1];
  });
}
`,
    retrospective: "문제 요구 그대로 구현하는 전형적인 정렬/슬라이싱 문제.",
    retryCriteria: "인덱스(i-1, k-1) 오프바이원 실수했을 때",
  },
};
