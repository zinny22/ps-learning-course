import type { SolutionTemplate } from "./types";

export const week2Templates: Record<string, SolutionTemplate> = {
  "boj-10828": {
    summary: "스택 명령(push/pop/size/empty/top)을 처리한다.",
    approach:
      "배열을 스택으로 사용하고, 명령어를 파싱해 결과를 모아서 출력한다.",
    keyPoints:
      "- push: arr.push(x)\n- pop/top: arr[arr.length-1]\n- 출력은 배열에 모아 join",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\n/);\nconst n = Number(input[0] || 0);\nconst stack = [];\nconst out = [];\n\nfor (let i = 1; i <= n; i += 1) {\n  const [cmd, arg] = input[i].trim().split(/\\s+/);\n  if (cmd === "push") {\n    stack.push(Number(arg));\n  } else if (cmd === "pop") {\n    out.push(stack.length ? String(stack.pop()) : "-1");\n  } else if (cmd === "size") {\n    out.push(String(stack.length));\n  } else if (cmd === "empty") {\n    out.push(stack.length ? "0" : "1");\n  } else if (cmd === "top") {\n    out.push(stack.length ? String(stack[stack.length - 1]) : "-1");\n  }\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "입출력/명령형 문제는 출력 모아서 한 번에 내는 습관이 중요.",
    retryCriteria: "pop/top에서 빈 스택 처리 실수했을 때",
  },

  "boj-10845": {
    summary: "큐 명령(push/pop/size/empty/front/back)을 처리한다.",
    approach:
      "배열 + head 인덱스로 큐를 구현한다(shift 사용 금지). 명령을 파싱해 처리.",
    keyPoints:
      "- push: q.push(x)\n- pop: head++\n- front/back 접근\n- shift()는 느리므로 피하기",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\n/);\nconst n = Number(input[0] || 0);\nconst q = [];\nlet head = 0;\nconst out = [];\n\nfor (let i = 1; i <= n; i += 1) {\n  const [cmd, arg] = input[i].trim().split(/\\s+/);\n  if (cmd === "push") {\n    q.push(Number(arg));\n  } else if (cmd === "pop") {\n    out.push(head < q.length ? String(q[head++]) : "-1");\n  } else if (cmd === "size") {\n    out.push(String(q.length - head));\n  } else if (cmd === "empty") {\n    out.push(q.length - head > 0 ? "0" : "1");\n  } else if (cmd === "front") {\n    out.push(head < q.length ? String(q[head]) : "-1");\n  } else if (cmd === "back") {\n    out.push(head < q.length ? String(q[q.length - 1]) : "-1");\n  }\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "큐는 head 인덱스로 구현하면 성능 문제를 피할 수 있다.",
    retryCriteria: "size 계산(q.length-head)에서 실수했을 때",
  },

  "boj-10866": {
    summary:
      "덱 명령(push_front/push_back/pop_front/pop_back/size/empty/front/back)을 처리한다.",
    approach:
      "head/tail 인덱스를 가진 배열 덱을 구현한다. (간단하게는 배열+head로도 가능)",
    keyPoints:
      "- JS에서 unshift/shift는 느릴 수 있어 head 인덱스 방식 추천\n- head/tail 범위 관리",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\n/);
const n = Number(input[0] || 0);

// 간단한 head 기반 덱 구현: 앞쪽은 head를 줄일 수 있도록 큰 배열을 사용
const size = 200000 + n * 2;
const deque = new Array(size);
let head = Math.floor(size / 2);
let tail = head; // [head, tail)

const out = [];

for (let i = 1; i <= n; i += 1) {
  const [cmd, arg] = input[i].trim().split(/\s+/);
  if (cmd === "push_front") {
    head -= 1;
    deque[head] = Number(arg);
  } else if (cmd === "push_back") {
    deque[tail] = Number(arg);
    tail += 1;
  } else if (cmd === "pop_front") {
    if (head === tail) out.push("-1");
    else {
      out.push(String(deque[head]));
      head += 1;
    }
  } else if (cmd === "pop_back") {
    if (head === tail) out.push("-1");
    else {
      tail -= 1;
      out.push(String(deque[tail]));
    }
  } else if (cmd === "size") {
    out.push(String(tail - head));
  } else if (cmd === "empty") {
    out.push(head === tail ? "1" : "0");
  } else if (cmd === "front") {
    out.push(head === tail ? "-1" : String(deque[head]));
  } else if (cmd === "back") {
    out.push(head === tail ? "-1" : String(deque[tail - 1]));
  }
}

process.stdout.write(out.join("\n"));
`,
    retrospective:
      "덱도 결국 인덱스 관리 문제. shift/unshift 대신 인덱스 덱이 안정적.",
    retryCriteria: "pop_back에서 tail 감소 순서 실수했을 때",
  },

  "boj-1764": {
    summary: "듣도 못한 사람과 보도 못한 사람의 교집합을 사전순으로 출력한다.",
    approach:
      "한 쪽을 Set에 저장하고 다른 쪽을 순회하며 포함되면 결과에 넣는다. 결과 정렬 후 출력.",
    keyPoints: "- Set으로 membership O(1)\n- 결과 배열 sort()",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst lines = fs.readFileSync(0, "utf8").trim().split(/\\n/);\nconst [n, m] = lines[0].trim().split(/\\s+/).map(Number);\n\nconst setA = new Set();\nfor (let i = 1; i <= n; i += 1) setA.add(lines[i].trim());\n\nconst res = [];\nfor (let i = n + 1; i <= n + m; i += 1) {\n  const name = lines[i].trim();\n  if (setA.has(name)) res.push(name);\n}\n\nres.sort();\nlet out = [];\nout.push(String(res.length));\nout.push(...res);\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "교집합/중복 제거는 Set으로 빠르게 해결.",
    retryCriteria: "입력 라인 인덱스 계산을 헷갈렸을 때",
  },

  "boj-11286": {
    summary:
      "절댓값이 작은 수를 우선, 절댓값이 같으면 실제 값이 작은 수를 우선하는 힙을 구현한다.",
    approach:
      "커스텀 비교 함수를 가진 최소 힙을 직접 구현해 push/pop을 처리한다.",
    keyPoints:
      "- 비교: |a|<|b| 또는 |a|==|b|면 a<b\n- JS는 기본 힙이 없으므로 구현 필요",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).filter(Boolean);\nconst n = Number(input[0] || 0);\nconst ops = input.slice(1).map(Number);\n\nclass AbsHeap {\n  constructor() {\n    this.a = [];\n  }\n  cmp(x, y) {\n    const ax = Math.abs(x);\n    const ay = Math.abs(y);\n    if (ax !== ay) return ax - ay;\n    return x - y;\n  }\n  push(x) {\n    const a = this.a;\n    a.push(x);\n    let i = a.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (this.cmp(a[p], a[i]) <= 0) break;\n      [a[p], a[i]] = [a[i], a[p]];\n      i = p;\n    }\n  }\n  pop() {\n    const a = this.a;\n    if (a.length === 0) return null;\n    const top = a[0];\n    const last = a.pop();\n    if (a.length > 0) {\n      a[0] = last;\n      let i = 0;\n      while (true) {\n        let l = i * 2 + 1;\n        let r = l + 1;\n        let best = i;\n        if (l < a.length && this.cmp(a[l], a[best]) < 0) best = l;\n        if (r < a.length && this.cmp(a[r], a[best]) < 0) best = r;\n        if (best === i) break;\n        [a[i], a[best]] = [a[best], a[i]];\n        i = best;\n      }\n    }\n    return top;\n  }\n}\n\nconst heap = new AbsHeap();\nconst out = [];\nfor (let i = 0; i < n; i += 1) {\n  const x = ops[i];\n  if (x === 0) {\n    const v = heap.pop();\n    out.push(v === null ? "0" : String(v));\n  } else {\n    heap.push(x);\n  }\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "커스텀 힙 비교 로직을 정확히 정의하는 게 핵심.",
    retryCriteria: "절댓값 동일 시 tie-break 조건을 헷갈렸을 때",
  },

  "boj-10773": {
    summary:
      "0이 나오면 직전 수를 제거하고, 아니면 스택에 쌓아 최종 합을 구한다.",
    approach: "스택으로 push/pop 후 남은 값들의 합을 계산한다.",
    keyPoints: "- 0이면 pop\n- 합은 마지막에 reduce",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconst k = input[0] || 0;\nconst stack = [];\n\nfor (let i = 1; i <= k; i += 1) {\n  const x = input[i];\n  if (x === 0) stack.pop();\n  else stack.push(x);\n}\n\nlet sum = 0;\nfor (const v of stack) sum += v;\nprocess.stdout.write(String(sum));\n',
    retrospective: "스택 기본기 + 마지막 합 계산.",
    retryCriteria: "입력 파싱과 인덱스 처리 실수했을 때",
  },

  "boj-1966": {
    summary: "프린터 큐에서 특정 문서가 몇 번째로 출력되는지 구한다.",
    approach:
      "큐에 (priority, isTarget)을 넣고, 현재 최대 우선순위를 유지하면서 pop/push를 반복한다.",
    keyPoints:
      "- 매 단계 max 확인(빈도 배열로 최적화 가능)\n- target이 출력되는 순간 count 출력",
    mistakes: "",
    codeLanguage: "js",
    code: `const fs = require("fs");

const data = fs.readFileSync(0, "utf8").trim().split(/\s+/);
let idx = 0;
const t = Number(data[idx++]);
const out = [];

for (let tc = 0; tc < t; tc += 1) {
  const n = Number(data[idx++]);
  const m = Number(data[idx++]);
  const q = [];
  let freq = Array(10).fill(0);
  for (let i = 0; i < n; i += 1) {
    const p = Number(data[idx++]);
    q.push([p, i === m]);
    freq[p] += 1;
  }

  let curMax = 9;
  while (curMax > 0 && freq[curMax] === 0) curMax -= 1;

  let printed = 0;
  let head = 0;

  // queue with head index
  while (head < q.length) {
    const [p, isTarget] = q[head++];
    if (p === curMax) {
      printed += 1;
      freq[p] -= 1;
      if (isTarget) {
        out.push(String(printed));
        break;
      }
      while (curMax > 0 && freq[curMax] === 0) curMax -= 1;
    } else {
      q.push([p, isTarget]);
    }
  }
}

process.stdout.write(out.join("\n"));
`,
    retrospective: "우선순위 최대값을 빈도 배열로 관리하면 깔끔.",
    retryCriteria: "max 갱신 로직이 꼬였을 때",
  },

  "boj-1927": {
    summary: "최소 힙 연산: x가 0이면 최소값 출력/제거, 아니면 삽입.",
    approach: "배열 기반 최소 힙을 직접 구현한다.",
    keyPoints: "- push bubble-up\n- pop bubble-down",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).filter(Boolean);\nconst n = Number(input[0] || 0);\nconst ops = input.slice(1).map(Number);\n\nclass MinHeap {\n  constructor() {\n    this.a = [];\n  }\n  push(x) {\n    const a = this.a;\n    a.push(x);\n    let i = a.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (a[p] <= a[i]) break;\n      [a[p], a[i]] = [a[i], a[p]];\n      i = p;\n    }\n  }\n  pop() {\n    const a = this.a;\n    if (a.length === 0) return null;\n    const top = a[0];\n    const last = a.pop();\n    if (a.length > 0) {\n      a[0] = last;\n      let i = 0;\n      while (true) {\n        let l = i * 2 + 1;\n        let r = l + 1;\n        let best = i;\n        if (l < a.length && a[l] < a[best]) best = l;\n        if (r < a.length && a[r] < a[best]) best = r;\n        if (best === i) break;\n        [a[i], a[best]] = [a[best], a[i]];\n        i = best;\n      }\n    }\n    return top;\n  }\n}\n\nconst heap = new MinHeap();\nconst out = [];\nfor (let i = 0; i < n; i += 1) {\n  const x = ops[i];\n  if (x === 0) {\n    const v = heap.pop();\n    out.push(v === null ? "0" : String(v));\n  } else heap.push(x);\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "힙 기본 템플릿은 최소/최대 둘 다 익혀두기.",
    retryCriteria: "bubble-down에서 자식 선택 로직이 헷갈릴 때",
  },

  "boj-11279": {
    summary: "최대 힙 연산: x가 0이면 최대값 출력/제거, 아니면 삽입.",
    approach: "배열 기반 최대 힙을 직접 구현한다.",
    keyPoints: "- 비교 방향만 최소 힙과 반대\n- push/pop 템플릿 재사용",
    mistakes: "",
    codeLanguage: "js",
    code: 'const fs = require("fs");\n\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).filter(Boolean);\nconst n = Number(input[0] || 0);\nconst ops = input.slice(1).map(Number);\n\nclass MaxHeap {\n  constructor() {\n    this.a = [];\n  }\n  push(x) {\n    const a = this.a;\n    a.push(x);\n    let i = a.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (a[p] >= a[i]) break;\n      [a[p], a[i]] = [a[i], a[p]];\n      i = p;\n    }\n  }\n  pop() {\n    const a = this.a;\n    if (a.length === 0) return null;\n    const top = a[0];\n    const last = a.pop();\n    if (a.length > 0) {\n      a[0] = last;\n      let i = 0;\n      while (true) {\n        let l = i * 2 + 1;\n        let r = l + 1;\n        let best = i;\n        if (l < a.length && a[l] > a[best]) best = l;\n        if (r < a.length && a[r] > a[best]) best = r;\n        if (best === i) break;\n        [a[i], a[best]] = [a[best], a[i]];\n        i = best;\n      }\n    }\n    return top;\n  }\n}\n\nconst heap = new MaxHeap();\nconst out = [];\nfor (let i = 0; i < n; i += 1) {\n  const x = ops[i];\n  if (x === 0) {\n    const v = heap.pop();\n    out.push(v === null ? "0" : String(v));\n  } else heap.push(x);\n}\n\nprocess.stdout.write(out.join("\\n"));\n',
    retrospective: "최소/최대 힙은 비교만 바뀌고 구조는 동일.",
    retryCriteria: "자식 선택(best) 조건을 반대로 해야 하는 걸 놓쳤을 때",
  },

  "pg-42576": {
    summary: "참가자 목록에서 완주하지 못한 1명을 찾는다.",
    approach:
      "해시맵(카운팅)으로 participant를 +1, completion을 -1 해서 남는 키를 찾는다.",
    keyPoints: "- Map으로 빈도 관리\n- 동명이인 처리 위해 count 사용",
    mistakes: "",
    codeLanguage: "js",
    code: 'function solution(participant, completion) {\n  const map = new Map();\n  for (const p of participant) {\n    map.set(p, (map.get(p) || 0) + 1);\n  }\n  for (const c of completion) {\n    map.set(c, map.get(c) - 1);\n  }\n  for (const [name, cnt] of map.entries()) {\n    if (cnt !== 0) return name;\n  }\n  return "";\n}\n',
    retrospective: "동명이인이 있으면 정렬보다 카운팅이 안전.",
    retryCriteria: "정렬로 풀다가 edge case가 걱정될 때",
  },

  "pg-42578": {
    summary: "의상 종류별로 선택 가능한 조합 수를 구한다. (하나는 반드시 착용)",
    approach:
      "종류별 개수를 세고, (각 종류에서 0~개수 선택) 곱한 뒤 아무것도 안 입는 경우 1을 뺀다.",
    keyPoints: "- 종류별 count\n- answer = Π(count+1) - 1",
    mistakes: "",
    codeLanguage: "js",
    code: "function solution(clothes) {\n  const map = new Map();\n  for (const [name, type] of clothes) {\n    map.set(type, (map.get(type) || 0) + 1);\n  }\n  let ans = 1;\n  for (const cnt of map.values()) ans *= (cnt + 1);\n  return ans - 1;\n}\n",
    retrospective: "조합은 직접 나열 말고 경우의 수 곱셈으로.",
    retryCriteria: "아무것도 안 입는 경우(-1) 빼는 걸 잊었을 때",
  },

  "pg-42626": {
    summary:
      "모든 음식의 스코빌 지수를 K 이상으로 만들기 위해 가장 적은 섞기 횟수를 구한다.",
    approach:
      "최소 힙으로 가장 작은 두 값을 꺼내 new = a + 2*b를 넣는 과정을 반복한다.",
    keyPoints: "- 최소 힙\n- 최소값 >= K면 종료\n- 힙 크기 1인데 K 미만이면 -1",
    mistakes: "",
    codeLanguage: "js",
    code: "function solution(scoville, K) {\n  class MinHeap {\n    constructor() {\n      this.a = [];\n    }\n    push(x) {\n      const a = this.a;\n      a.push(x);\n      let i = a.length - 1;\n      while (i > 0) {\n        const p = Math.floor((i - 1) / 2);\n        if (a[p] <= a[i]) break;\n        [a[p], a[i]] = [a[i], a[p]];\n        i = p;\n      }\n    }\n    pop() {\n      const a = this.a;\n      if (a.length === 0) return null;\n      const top = a[0];\n      const last = a.pop();\n      if (a.length > 0) {\n        a[0] = last;\n        let i = 0;\n        while (true) {\n          let l = i * 2 + 1;\n          let r = l + 1;\n          let best = i;\n          if (l < a.length && a[l] < a[best]) best = l;\n          if (r < a.length && a[r] < a[best]) best = r;\n          if (best === i) break;\n          [a[i], a[best]] = [a[best], a[i]];\n          i = best;\n        }\n      }\n      return top;\n    }\n    peek() {\n      return this.a.length ? this.a[0] : null;\n    }\n    get size() {\n      return this.a.length;\n    }\n  }\n\n  const heap = new MinHeap();\n  for (const v of scoville) heap.push(v);\n\n  let cnt = 0;\n  while (heap.size > 0 && heap.peek() < K) {\n    if (heap.size < 2) return -1;\n    const a = heap.pop();\n    const b = heap.pop();\n    heap.push(a + 2 * b);\n    cnt += 1;\n  }\n  return cnt;\n}\n",
    retrospective: "'항상 가장 작은 것부터'는 힙이 정답.",
    retryCriteria: "힙 size<2 예외를 놓쳐서 런타임 에러/오답이 났을 때",
  },
};
