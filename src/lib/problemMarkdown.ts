import type { Problem, ProblemNotes, ProblemStatus } from "../types";

function safeText(s: string) {
  return (s ?? "").trim();
}

function sanitizePathSegment(input: string) {
  return input
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

export function buildProblemMarkdown(params: {
  problem: Problem;
  status: ProblemStatus;
  notes: ProblemNotes;
  platformUrl: string;
}) {
  const { problem, status, notes, platformUrl } = params;

  const lines: string[] = [];

  lines.push(`# ${problem.title}`);
  lines.push("");
  lines.push(`- Platform: ${problem.platform}`);
  lines.push(`- Number: ${problem.number}`);
  lines.push(`- Week: ${problem.week}`);
  lines.push(`- Status: ${status}`);
  lines.push(`- Link: ${platformUrl}`);
  if (problem.tags?.length) {
    lines.push(`- Tags: ${problem.tags.map((t) => `#${t}`).join(" ")}`);
  }
  lines.push("");

  const section = (title: string, body: string) => {
    lines.push(`## ${title}`);
    lines.push("");
    lines.push(body.trim().length ? body.trim() : "(empty)");
    lines.push("");
  };

  section("문제 요약", safeText(notes.summary));
  section("접근 아이디어", safeText(notes.approach));
  section("핵심 포인트", safeText(notes.keyPoints));
  section("내가 실수한 부분", safeText(notes.mistakes));

  lines.push("## 정답 코드");
  lines.push("");
  const code = safeText(notes.code);
  const lang = notes.codeLanguage || "txt";
  lines.push("```" + lang);
  lines.push(code.length ? code : "");
  lines.push("```");
  lines.push("");

  section("한 줄 회고", safeText(notes.retrospective));
  section("다시 풀기 기준", safeText(notes.retryCriteria));

  return lines.join("\n");
}

export function buildProblemMarkdownPath(params: {
  basePath: string;
  weekNumber: number;
  problemTitle: string;
  platform: string;
  problemNumber: number;
}) {
  const base = params.basePath.trim().replace(/^\/+|\/+$/g, "");
  const weekDir = `Week${String(params.weekNumber).padStart(2, "0")}`;
  const fileName = sanitizePathSegment(
    `${params.problemTitle} (${params.platform} ${params.problemNumber}).md`
  );

  const parts = [base, weekDir, fileName].filter(Boolean);
  return parts.join("/");
}
