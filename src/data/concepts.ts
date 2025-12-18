import type { Concept } from "../types";

export const concepts: Concept[] = [
  {
    weekId: "week-1",
    title: "수학 기초",
    description:
      "알고리즘 문제 해결(PS)에서 수학은 복잡한 공식을 증명하는 것이 아니라, 문제를 효율적으로 풀기 위한 '도구'로 사용됩니다. 특히 정수론(소수, 약수)과 기초적인 수열 개념은 매우 자주 등장하므로 반드시 익혀두어야 합니다.",
    sections: [
      {
        title: "약수 구하기 (Divisors)",
        content:
          "어떤 수 N의 약수를 구할 때, 1부터 N까지 모든 수를 나누어보는 방법은 N이 10억이라면 10억 번 계산해야 하므로 너무 느립니다.\n\n중요한 사실은 **약수는 항상 짝이 있다**는 것입니다. 예를 들어 12의 약수는 (1, 12), (2, 6), (3, 4)로 짝을 이룹니다. 따라서 $\\sqrt{N}$까지만 검사하면 나머지 약수도 짝을 통해 바로 알 수 있습니다. 이렇게 하면 계산 횟수가 획기적으로 줄어듭니다.",
        keywords: ["약수", "시간복잡도", "제곱근"],
        codeExamples: {
          py: `def get_divisors(n):
    divisors = []
    # 1부터 N의 제곱근까지만 반복
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            # i가 제곱근이 아니라면, 짝궁 약수도 추가
            if i != n // i:
                divisors.append(n // i)
    return sorted(divisors)`,
          js: `function getDivisors(n) {
  const divisors = [];
  // 1부터 N의 제곱근까지만 반복
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.push(i);
      // i가 제곱근이 아니라면, 짝궁 약수도 추가
      if (i !== n / i) {
        divisors.push(n / i);
      }
    }
  }
  // 오름차순 정렬
  return divisors.sort((a, b) => a - b);
}`,
          description:
            "N의 제곱근까지만 반복문을 돌면 O(√N)의 시간복잡도로 훨씬 빠르게 약수를 구할 수 있습니다.",
        },
      },
      {
        title: "최대공약수와 최소공배수 (GCD / LCM)",
        content:
          "두 수의 공통된 약수 중 가장 큰 수를 **최대공약수(GCD)**, 공통된 배수 중 가장 작은 수를 **최소공배수(LCM)**라고 합니다.\n\n최대공약수를 구하는 가장 효율적인 방법은 **유클리드 호제법**입니다. `GCD(A, B) = GCD(B, A % B)`라는 성질을 이용해 나머지가 0이 될 때까지 반복하는 방식입니다. 최소공배수는 `(A * B) / GCD(A, B)` 공식으로 쉽게 구할 수 있습니다.",
        keywords: ["유클리드 호제법", "GCD", "LCM"],
        codeExamples: {
          py: `import math

# 파이썬 내장 함수 사용 (추천)
print(math.gcd(12, 18)) # 6
print(math.lcm(12, 18)) # 36

# 직접 구현 (유클리드 호제법 원리)
def gcd(a, b):
    while b > 0:
        a, b = b, a % b
    return a`,
          js: `// 직접 구현 (유클리드 호제법)
function gcd(a, b) {
  while (b > 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

console.log(gcd(12, 18)); // 6
console.log(lcm(12, 18)); // 36`,
          description:
            "유클리드 호제법은 매우 큰 수에 대해서도 빠르게 최대공약수를 구해줍니다.",
        },
      },
      {
        title: "소수 판별: 에라토스테네스의 체",
        content:
          "소수(Prime Number)는 1과 자기 자신만으로 나누어떨어지는 수입니다.\n\n한 개의 숫자가 소수인지 판별할 때는 $\\sqrt{N}$까지 나누어보면 되지만, **특정 범위(예: 1부터 100만까지)의 소수를 모두 구해야 할 때**는 **에라토스테네스의 체**가 필수적입니다.\n\n마치 체로 거르듯이, 2의 배수를 지우고, 3의 배수를 지우고... 를 반복하면 결국 소수만 남게 됩니다.",
        keywords: ["소수", "에라토스테네스의 체", "범위 내 소수"],
        codeExamples: {
          py: `def sieve_of_eratosthenes(limit):
    # 처음엔 모든 수가 소수(True)라고 가정
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False # 0과 1은 소수가 아님
    
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            # i의 배수들을 모두 소수가 아님(False)으로 표시
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
                
    # True인 인덱스(소수)만 모아서 반환
    return [i for i, p in enumerate(is_prime) if p]`,
          js: `function sieveOfEratosthenes(limit) {
  const isPrime = Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes = [];
  isPrime.forEach((v, i) => {
    if (v) primes.push(i);
  });
  return primes;
}`,
          description:
            "대량의 소수를 판별해야 할 때 가장 빠르고 효율적인 알고리즘입니다.",
        },
      },
    ],
  },
  {
    weekId: "week-2",
    title: "자료구조 기초",
    description:
      "자료구조는 데이터를 저장하고 관리하는 방식입니다. 상황에 맞는 적절한 자료구조를 선택하면, 복잡해 보이는 문제도 아주 쉽게 풀릴 수 있습니다. 가장 기본이 되는 스택, 큐, 해시를 먼저 완벽하게 이해해야 합니다.",
    sections: [
      {
        title: "스택 (Stack)",
        content:
          "스택은 **'쌓아 올린 접시'**와 같습니다. 가장 나중에 올린 접시를 가장 먼저 꺼내게 되죠. 이를 **LIFO(Last-In-First-Out, 후입선출)**라고 합니다.\n\n웹 브라우저의 '뒤로 가기' 버튼이나, 실행 취소(Ctrl+Z), 그리고 괄호 쌍 맞추기 문제 등에서 주로 사용됩니다.",
        keywords: ["스택", "LIFO", "후입선출", "DFS"],
        codeExamples: {
          py: `stack = []

# 삽입 (Push)
stack.append(1)
stack.append(2)

# 삭제 (Pop) - 가장 나중에 넣은 2가 나옴
top = stack.pop() 
print(top) # 2

# 최상단 확인 (Peek)
print(stack[-1]) # 1`,
          js: `const stack = [];

// 삽입 (Push)
stack.push(1);
stack.push(2);

// 삭제 (Pop)
const top = stack.pop();
console.log(top); // 2

// 최상단 확인 (Peek)
console.log(stack[stack.length - 1]); // 1`,
        },
      },
      {
        title: "큐 (Queue)",
        content:
          "큐는 **'놀이공원 줄서기'**와 같습니다. 가장 먼저 줄을 선 사람이 가장 먼저 놀이기구를 타게 되죠. 이를 **FIFO(First-In-First-Out, 선입선출)**라고 합니다.\n\n순서대로 처리해야 하는 작업, 너비 우선 탐색(BFS) 등에서 필수적으로 사용됩니다.",
        keywords: ["큐", "FIFO", "선입선출", "BFS"],
        codeExamples: {
          py: `from collections import deque

# 파이썬에서 큐는 deque를 써야 빠릅니다!
queue = deque()

# 삽입 (Enqueue)
queue.append(1)
queue.append(2)

# 삭제 (Dequeue) - 가장 먼저 넣은 1이 나옴
front = queue.popleft()
print(front) # 1`,
          js: `// 자바스크립트는 배열을 큐처럼 쓸 수 있지만, 
// shift()는 느릴 수 있어 실제론 직접 구현하거나 Linked List를 씁니다.
const queue = [];

// 삽입 (Enqueue)
queue.push(1);
queue.push(2);

// 삭제 (Dequeue) - O(N)이라 느림, PS에서는 주의
const front = queue.shift();
console.log(front); // 1`,
          description:
            "파이썬에서는 반드시 deque를 사용하세요. 리스트의 pop(0)은 O(N)이라 매우 느립니다.",
        },
      },
      {
        title: "해시 (Hash Map / Set)",
        content:
          "해시는 **'Key-Value'** 쌍으로 데이터를 저장하는 구조입니다. 도서관에서 청구 기호로 책을 바로 찾는 것처럼, 검색 속도가 엄청나게 빠릅니다(평균 O(1)).\n\n특정 데이터가 존재하는지 확인하거나, 중복을 제거할 때 가장 강력한 도구입니다.",
        keywords: ["해시", "딕셔너리", "검색속도", "중복제거"],
        codeExamples: {
          py: `# 딕셔너리 (Key-Value)
scores = {"Alice": 90, "Bob": 85}
print(scores["Alice"]) # 90

# 집합 (Set) - 중복 제거
nums = [1, 2, 2, 3, 3, 3]
unique_nums = set(nums)
print(unique_nums) # {1, 2, 3}`,
          js: `// Map (Key-Value)
const scores = new Map();
scores.set("Alice", 90);
console.log(scores.get("Alice")); // 90

// Set - 중복 제거
const nums = [1, 2, 2, 3, 3, 3];
const uniqueNums = new Set(nums);
console.log([...uniqueNums]); // [1, 2, 3]`,
        },
      },
    ],
  },
  {
    weekId: "week-3",
    title: "재귀와 정렬",
    description:
      "재귀는 '자기 자신을 호출하는 함수'입니다. 처음엔 낯설고 어렵게 느껴질 수 있지만, 복잡한 문제를 단순하게 쪼개는 마법 같은 도구입니다. 정렬은 데이터를 순서대로 나열하는 것으로, 효율적인 탐색(이분 탐색 등)의 기초가 됩니다.",
    sections: [
      {
        title: "재귀 함수 (Recursion)",
        content:
          "재귀 함수를 만들 때는 딱 두 가지만 기억하세요.\n1. **종료 조건(Base Case):** 언제 멈출 것인가?\n2. **재귀 단계(Recursive Step):** 어떻게 문제를 더 작게 만들 것인가?\n\n이 두 가지가 없으면 함수가 영원히 멈추지 않는 '무한 루프'에 빠지게 됩니다.",
        keywords: ["재귀", "종료조건", "점화식"],
        codeExamples: {
          py: `def factorial(n):
    # 1. 종료 조건: n이 1 이하이면 멈춤
    if n <= 1:
        return 1
    # 2. 재귀 단계: n * (n-1)!
    return n * factorial(n - 1)

print(factorial(5)) # 120`,
          js: `function factorial(n) {
  // 1. 종료 조건
  if (n <= 1) return 1;
  // 2. 재귀 단계
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120`,
        },
      },
      {
        title: "정렬 (Sorting)",
        content:
          "데이터를 오름차순이나 내림차순으로 정렬하면 데이터를 찾거나 분석하기 훨씬 쉬워집니다. 특히 **'사용자 지정 기준'**으로 정렬하는 방법을 꼭 익혀야 합니다. 예를 들어, '길이가 짧은 순으로, 길이가 같다면 사전 순으로' 정렬하는 식입니다.",
        keywords: ["정렬", "오름차순", "내림차순", "커스텀정렬"],
        codeExamples: {
          py: `words = ["apple", "b", "car", "banana"]

# 1. 길이 순, 2. 사전 순 정렬
# 튜플 (len(x), x)를 반환하면 앞에서부터 우선순위 적용
words.sort(key=lambda x: (len(x), x))

print(words) # ['b', 'car', 'apple', 'banana']`,
          js: `const words = ["apple", "b", "car", "banana"];

// 1. 길이 순, 2. 사전 순 정렬
words.sort((a, b) => {
  if (a.length !== b.length) {
    return a.length - b.length; // 길이 오름차순
  }
  return a.localeCompare(b); // 사전 오름차순
});

console.log(words); // ['b', 'car', 'apple', 'banana']`,
          description:
            "파이썬의 lambda나 JS의 비교 함수를 잘 다루면 복잡한 정렬 조건도 쉽게 처리할 수 있습니다.",
        },
      },
    ],
  },
  {
    weekId: "week-4",
    title: "다이나믹 프로그래밍 (DP)",
    description:
      "이름이 거창하지만, 핵심은 **'기억하기'**입니다. 한 번 계산한 결과를 메모장(배열)에 적어두고, 나중에 똑같은 계산이 필요할 때 다시 계산하지 않고 적어둔 값을 쓰는 것입니다. 이것만으로도 풀 수 없던 문제를 순식간에 풀 수 있게 됩니다.",
    sections: [
      {
        title: "메모이제이션 (Memoization)",
        content:
          "피보나치 수열을 재귀로 그냥 구현하면 $O(2^N)$의 시간이 걸려 N이 50만 되어도 계산이 안 끝납니다. 하지만 계산 결과를 배열에 저장해두면(캐싱), $O(N)$으로 줄어듭니다. 이를 **Top-down** 방식이라고도 합니다.",
        keywords: ["DP", "메모이제이션", "기억하기", "피보나치"],
        codeExamples: {
          py: `# 한 번 계산한 값을 저장할 딕셔너리
memo = {}

def fib(n):
    if n <= 2: return 1
    # 이미 계산한 적 있다면 저장된 값 반환
    if n in memo: return memo[n]
    
    # 계산 후 저장
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]`,
          js: `const memo = {};

function fib(n) {
  if (n <= 2) return 1;
  // 이미 계산한 적 있다면 저장된 값 반환
  if (n in memo) return memo[n];
  
  // 계산 후 저장
  memo[n] = fib(n - 1) + fib(n - 2);
  return memo[n];
}`,
        },
      },
      {
        title: "바텀업 (Bottom-up)",
        content:
          "작은 문제부터 차근차근 답을 쌓아올리는 방식입니다. 반복문을 사용하여 `dp[1]`, `dp[2]`, `dp[3]`... 순서대로 채워 나갑니다. 재귀 호출의 오버헤드가 없어 일반적으로 더 빠르고 효율적입니다.",
        keywords: ["바텀업", "점화식", "반복문"],
        codeExamples: {
          py: `def fib_bottom_up(n):
    dp = [0] * (n + 1)
    dp[1] = dp[2] = 1
    
    for i in range(3, n + 1):
        # 점화식: 바로 앞 두 항의 합
        dp[i] = dp[i-1] + dp[i-2]
        
    return dp[n]`,
          js: `function fibBottomUp(n) {
  const dp = Array(n + 1).fill(0);
  dp[1] = dp[2] = 1;

  for (let i = 3; i <= n; i++) {
    // 점화식
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`,
        },
      },
    ],
  },
  {
    weekId: "week-5",
    title: "DFS와 BFS",
    description:
      "그래프(미로, 지도, 네트워크)를 탐색하는 두 가지 핵심 방법입니다. '끝까지 가보는' DFS와 '주변부터 훑는' BFS의 차이를 이해하고, 상황에 맞게 골라 쓰는 능력이 중요합니다.",
    sections: [
      {
        title: "DFS (깊이 우선 탐색)",
        content:
          "미로 찾기를 할 때, 갈림길이 나오면 한쪽으로 **끝까지** 가보고 막히면 되돌아오는 방식을 생각해보세요. 이것이 DFS입니다.\n\n주로 **재귀 함수**나 **스택**을 사용해 구현하며, '모든 경우의 수'를 따져야 할 때 유용합니다.",
        keywords: ["DFS", "깊이우선", "재귀", "백트래킹기초"],
        codeExamples: {
          py: `def dfs(graph, v, visited):
    # 현재 노드 방문 처리
    visited[v] = True
    print(v, end=' ')
    
    # 연결된 노드들 중 방문하지 않은 곳으로 깊이 들어감
    for i in graph[v]:
        if not visited[i]:
            dfs(graph, i, visited)`,
          js: `function dfs(graph, v, visited) {
  // 현재 노드 방문 처리
  visited[v] = true;
  console.log(v);

  // 연결된 노드들 중 방문하지 않은 곳으로 깊이 들어감
  for (const i of graph[v]) {
    if (!visited[i]) {
      dfs(graph, i, visited);
    }
  }
}`,
        },
      },
      {
        title: "BFS (너비 우선 탐색)",
        content:
          "호수에 돌을 던지면 물결이 동그랗게 퍼져나가는 모습을 상상해보세요. 시작점에서 가까운 곳부터 차례대로 탐색하는 방식이 BFS입니다.\n\n**큐(Queue)**를 사용하며, 가중치가 없는 그래프에서 **최단 거리**를 찾을 때 가장 강력합니다.",
        keywords: ["BFS", "너비우선", "큐", "최단거리"],
        codeExamples: {
          py: `from collections import deque

def bfs(graph, start, visited):
    queue = deque([start])
    visited[start] = True
    
    while queue:
        # 큐에서 하나 꺼냄
        v = queue.popleft()
        print(v, end=' ')
        
        # 인접한 노드들을 모두 큐에 넣음
        for i in graph[v]:
            if not visited[i]:
                queue.append(i)
                visited[i] = True`,
          js: `function bfs(graph, start, visited) {
  const queue = [start]; // 실제론 Queue 구현체 권장
  visited[start] = true;

  while (queue.length > 0) {
    const v = queue.shift();
    console.log(v);

    for (const i of graph[v]) {
      if (!visited[i]) {
        queue.push(i);
        visited[i] = true;
      }
    }
  }
}`,
        },
      },
    ],
  },
  {
    weekId: "week-6",
    title: "최단 경로 알고리즘",
    description:
      "지도 앱에서 '최단 시간 경로'를 찾는 원리입니다. 단순히 간선 개수(BFS)가 아니라, 도로마다 걸리는 시간(가중치)이 다를 때 가장 빠른 길을 찾아내는 알고리즘들을 배웁니다.",
    sections: [
      {
        title: "다익스트라 (Dijkstra)",
        content:
          "가장 유명한 최단 경로 알고리즘입니다. **'현재 갈 수 있는 곳 중 가장 가까운 곳'**을 먼저 방문하면서 거리를 갱신해 나가는 그리디한 방식을 사용합니다.\n\n효율적인 구현을 위해 **우선순위 큐(Heap)**가 필수적으로 사용됩니다.",
        keywords: ["다익스트라", "우선순위큐", "가중치그래프"],
        codeExamples: {
          py: `import heapq

def dijkstra(start):
    q = []
    # (거리, 노드) 순서로 힙에 넣음
    heapq.heappush(q, (0, start))
    distance[start] = 0
    
    while q:
        dist, now = heapq.heappop(q)
        
        # 이미 처리된 적 있는 노드라면 패스
        if distance[now] < dist:
            continue
            
        for i in graph[now]:
            cost = dist + i[1]
            # 현재 노드를 거쳐가는게 더 빠르다면 갱신
            if cost < distance[i[0]]:
                distance[i[0]] = cost
                heapq.heappush(q, (cost, i[0]))`,
          js: `// JS에는 내장 Heap이 없어 직접 구현하거나 라이브러리가 필요합니다.
// 여기서는 개념만 설명하는 의사 코드입니다.

function dijkstra(start) {
  const pq = new PriorityQueue();
  pq.enqueue(start, 0);
  distance[start] = 0;

  while (!pq.isEmpty()) {
    const { node: now, priority: dist } = pq.dequeue();

    if (distance[now] < dist) continue;

    for (const edge of graph[now]) {
      const cost = dist + edge.cost;
      if (cost < distance[edge.to]) {
        distance[edge.to] = cost;
        pq.enqueue(edge.to, cost);
      }
    }
  }
}`,
        },
      },
    ],
  },
  {
    weekId: "week-7",
    title: "이분 탐색 (Binary Search)",
    description:
      "업다운(Up-Down) 게임을 생각해보세요. 1부터 100 사이의 숫자 중 하나를 맞출 때, 50을 부르고 'Up'이면 51~100 사이, 'Down'이면 1~49 사이를 탐색하죠? 이처럼 탐색 범위를 절반씩 뚝뚝 잘라내며 찾는 아주 빠른 방법입니다.",
    sections: [
      {
        title: "이분 탐색의 원리",
        content:
          "이분 탐색은 반드시 **데이터가 정렬되어 있어야** 사용할 수 있습니다. 범위를 절반씩 좁히기 때문에 40억 개의 데이터도 단 32번 만에 찾을 수 있을 정도로 빠릅니다 ($O(\\log N)$).",
        keywords: ["이분탐색", "정렬필수", "LogN"],
        codeExamples: {
          py: `from bisect import bisect_left, bisect_right

a = [1, 2, 4, 4, 8]
x = 4

# 직접 구현
def binary_search(array, target, start, end):
    while start <= end:
        mid = (start + end) // 2
        if array[mid] == target:
            return mid
        elif array[mid] > target:
            end = mid - 1
        else:
            start = mid + 1
    return None

# 라이브러리 사용 (추천)
# 4가 처음 나오는 위치와 마지막 위치 다음을 찾아 개수 세기
count = bisect_right(a, x) - bisect_left(a, x)
print(count) # 2`,
          js: `function binarySearch(arr, target) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    
    if (arr[mid] === target) return mid;
    else if (arr[mid] > target) end = mid - 1;
    else start = mid + 1;
  }
  return -1;
}`,
        },
      },
    ],
  },
  {
    weekId: "week-8",
    title: "그리디 알고리즘",
    description:
      "미래를 생각하지 않고, **'지금 당장 가장 좋은 것'**만 고르는 전략입니다. 단순하고 무식해 보이지만, 거스름돈 문제처럼 특정 상황에서는 이것이 최적의 해답을 보장합니다.",
    sections: [
      {
        title: "그리디의 핵심",
        content:
          "모든 문제에 그리디를 쓸 수 있는 건 아닙니다. '지금의 선택이 나중에 영향을 주지 않음'과 '부분의 최적이 전체의 최적임'이 보장되어야 합니다.\n\n예를 들어 거스름돈을 줄 때, 무조건 **가장 큰 화폐 단위**부터 거슬러 주는 것이 동전 개수를 최소로 만드는 방법입니다.",
        keywords: ["그리디", "탐욕법", "현재최적", "반례주의"],
        codeExamples: {
          py: `n = 1260
count = 0

# 큰 단위의 화폐부터 차례대로 확인
coin_types = [500, 100, 50, 10]

for coin in coin_types:
    count += n // coin # 해당 화폐로 거슬러 줄 수 있는 동전 개수 세기
    n %= coin

print(count)`,
          js: `let n = 1260;
let count = 0;

const coinTypes = [500, 100, 50, 10];

for (const coin of coinTypes) {
  count += Math.floor(n / coin);
  n %= coin;
}

console.log(count);`,
        },
      },
    ],
  },
  {
    weekId: "week-9",
    title: "완전탐색과 시뮬레이션",
    description:
      "특별한 알고리즘 공식보다는, 문제에서 시키는 대로 꼼꼼하게 구현하는 능력입니다. '모든 경우를 다 해보기(Brute Force)'와 '상황을 그대로 재현하기(Simulation)'가 핵심입니다.",
    sections: [
      {
        title: "순열과 조합",
        content:
          "카드 뽑기나 팀 나누기처럼, 순서를 고려해서 나열하거나(순열), 순서 상관없이 그룹을 짓는(조합) 경우의 수를 구할 때 사용됩니다.",
        keywords: ["순열", "조합", "경우의수", "itertools"],
        codeExamples: {
          py: `from itertools import permutations, combinations

data = [1, 2, 3]

# 순열: 순서 고려 O (1, 2) != (2, 1)
print(list(permutations(data, 2)))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# 조합: 순서 고려 X (1, 2) == (2, 1)
print(list(combinations(data, 2)))
# [(1, 2), (1, 3), (2, 3)]`,
          js: `// JS는 순열/조합 내장 함수가 없어 직접 구현해야 합니다. (재귀 사용)
// 코테에서는 보통 간단한 3중 반복문 등으로 처리 가능한 범위가 나옵니다.`,
        },
      },
      {
        title: "방향 벡터 (dx, dy)",
        content:
          "2차원 격자판(지도) 위에서 캐릭터를 상하좌우로 이동시켜야 할 때, if문을 4번 쓰는 대신 **방향 벡터** 배열을 사용하면 코드가 훨씬 깔끔해집니다.",
        keywords: ["방향벡터", "좌표이동", "2차원배열"],
        codeExamples: {
          py: `# 상, 하, 좌, 우
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]

x, y = 2, 2 # 현재 위치

# 4방향 이동해보기
for i in range(4):
    nx = x + dx[i]
    ny = y + dy[i]
    print(nx, ny)`,
          js: `// 상, 하, 좌, 우
const dx = [-1, 1, 0, 0];
const dy = [0, 0, -1, 1];

let x = 2, y = 2;

for (let i = 0; i < 4; i++) {
  const nx = x + dx[i];
  const ny = y + dy[i];
  console.log(nx, ny);
}`,
        },
      },
    ],
  },
  {
    weekId: "week-10",
    title: "구현 집중",
    description:
      "알고리즘은 단순하지만 조건이 매우 복잡하여 코드가 길어지는 문제들입니다. 이런 문제는 **'문제를 쪼개는 능력'**이 가장 중요합니다. 함수를 적극적으로 활용하여 기능을 분리하세요.",
    sections: [
      {
        title: "구현 팁",
        content:
          "1. **함수 분리**: '상어 이동', '냄새 감소', '상어 쫓아내기' 등 기능을 함수로 나누세요.\n2. **변수명**: `a`, `b`, `c` 같은 변수명 대신 `shark_pos`, `time_left` 같이 의미를 담으세요.\n3. **주석**: 복잡한 로직 위에는 한글로 주석을 달아두면 실수를 줄일 수 있습니다.",
        keywords: ["구현", "함수분리", "클린코드"],
      },
    ],
  },
  {
    weekId: "week-11",
    title: "문자열 처리",
    description:
      "프로그래밍에서 숫자인큼이나 자주 다루는 것이 문자열입니다. 특정 문자를 찾거나, 자르거나, 합치는 등 자유자재로 다룰 수 있어야 합니다. 파이썬은 문자열 처리에 매우 강력합니다.",
    sections: [
      {
        title: "자주 쓰는 메서드",
        content:
          "문자열을 다룰 때 가장 많이 쓰이는 필수 기능들입니다. 특히 `split`과 `join`은 입출력 처리에서도 밥 먹듯이 사용됩니다.",
        keywords: ["문자열", "split", "join", "replace"],
        codeExamples: {
          py: `s = "Hello World Python"

# 자르기 (List로 변환)
arr = s.split(' ') # ['Hello', 'World', 'Python']

# 합치기 (String으로 변환)
new_s = '-'.join(arr) # "Hello-World-Python"

# 교체하기
print(s.replace('Python', 'Java'))`,
          js: `const s = "Hello World JS";

// 자르기
const arr = s.split(' '); // ['Hello', 'World', 'JS']

// 합치기
const newS = arr.join('-'); // "Hello-World-JS"

// 교체하기
console.log(s.replace('JS', 'TS'));`,
        },
      },
      {
        title: "슬라이싱 (Slicing)",
        content:
          "문자열의 일부분을 잘라내는 기술입니다. `[시작:끝]`만 기억하면 됩니다. 파이썬의 슬라이싱은 매우 직관적이고 강력합니다.",
        keywords: ["슬라이싱", "부분문자열", "문자열뒤집기"],
        codeExamples: {
          py: `s = "ABCDEFG"

print(s[2:5]) # CDE (인덱스 2부터 5직전까지)
print(s[:3])  # ABC (처음부터 3직전까지)
print(s[3:])  # DEFG (3부터 끝까지)
print(s[::-1]) # GFEDCBA (뒤집기)`,
          js: `const s = "ABCDEFG";

console.log(s.slice(2, 5)); // CDE
console.log(s.slice(0, 3)); // ABC
console.log(s.slice(3));    // DEFG
console.log(s.split('').reverse().join('')); // 뒤집기`,
        },
      },
    ],
  },
  {
    weekId: "week-12",
    title: "투 포인터와 슬라이딩 윈도우",
    description:
      "배열을 두 번 반복하면 $O(N^2)$이라 느릴 때, 두 개의 점(포인터)을 조작하여 한 번만 훑고 지나가게($O(N)$) 만드는 최적화 기법입니다. '연속된 구간의 합' 등을 구할 때 유용합니다.",
    sections: [
      {
        title: "투 포인터 (Two Pointers)",
        content:
          "주로 정렬된 배열에서 두 수의 합을 찾거나, 특정한 조건을 만족하는 구간을 찾을 때 시작점(Start)과 끝점(End)을 움직이며 답을 찾습니다.",
        keywords: ["투포인터", "최적화", "구간탐색"],
        codeExamples: {
          py: `n = 5 # 데이터의 개수
m = 5 # 찾고자 하는 부분합
data = [1, 2, 3, 2, 5]

count = 0
interval_sum = 0
end = 0

# start를 차례대로 증가시키며 반복
for start in range(n):
    # end를 가능한 만큼 이동시키기
    while interval_sum < m and end < n:
        interval_sum += data[end]
        end += 1
    # 부분합이 m일 때 카운트 증가
    if interval_sum == m:
        count += 1
    interval_sum -= data[start]`,
          js: `let n = 5, m = 5;
let data = [1, 2, 3, 2, 5];

let count = 0;
let intervalSum = 0;
let end = 0;

for (let start = 0; start < n; start++) {
  while (intervalSum < m && end < n) {
    intervalSum += data[end];
    end++;
  }
  if (intervalSum === m) count++;
  intervalSum -= data[start];
}`,
        },
      },
    ],
  },
  {
    weekId: "week-13",
    title: "백트래킹 (Backtracking)",
    description:
      "해를 찾는 도중, '이 길은 아닌 것 같다' 싶으면 더 이상 가지 않고 되돌아오는 기법입니다. 이를 **가지치기(Pruning)**라고 합니다. DFS와 비슷하지만, 불필요한 경로를 과감히 포기한다는 점에서 훨씬 효율적입니다.",
    sections: [
      {
        title: "N-Queen 문제의 핵심",
        content:
          "체스판 위에 퀸 N개를 서로 공격하지 않게 놓는 문제입니다. 첫 번째 줄에 퀸을 놓고, 두 번째 줄에 놓을 수 있는 곳을 찾습니다. 만약 놓을 곳이 없다면? 첫 번째 줄의 퀸 위치를 바꾸러 되돌아갑니다(Backtrack).",
        keywords: ["백트래킹", "가지치기", "N-Queen", "완전탐색최적화"],
        codeExamples: {
          py: `def solve_n_queens(row):
    # 모든 행에 퀸을 다 놓았다면 성공!
    if row == n:
        return 1
        
    count = 0
    for col in range(n):
        # (row, col)에 퀸을 놓을 수 있다면
        if is_safe(row, col):
            board[row] = col # 퀸 배치
            count += solve_n_queens(row + 1) # 다음 행으로
            # 여기서 되돌아옴 (백트래킹)
            
    return count`,
          js: `function solveNQueens(row) {
  if (row === n) return 1;

  let count = 0;
  for (let col = 0; col < n; col++) {
    if (isSafe(row, col)) {
      board[row] = col;
      count += solveNQueens(row + 1);
      // 백트래킹은 함수가 리턴되면 자동으로 수행됨
    }
  }
  return count;
}`,
        },
      },
    ],
  },
];
