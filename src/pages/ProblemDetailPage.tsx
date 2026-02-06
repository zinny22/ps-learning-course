import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { ProblemStatusToggle } from "../features/problem/ProblemStatusToggle";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/Card";
import type { CodeLanguage, ProblemNotes } from "../types";
import { useProgressStore } from "../stores/progressStore";
import { weeks } from "../data/weeks";
import { problems } from "../data/problems";
import { solutionTemplates } from "../data/solutionTemplates";
import { useAuthStore } from "../stores/authStore";
import {
  buildProblemMarkdown,
  buildProblemMarkdownPath,
} from "../lib/problemMarkdown";
import { upsertFile } from "../lib/githubClient";
import { Github } from "lucide-react";
import { NoteCard } from "../features/problem/NoteCard";
import { CodeEditor } from "../features/problem/CodeEditor";
import { CodeBlockViewer } from "../features/problem/CodeBlockViewer";

const languageOptions: { value: CodeLanguage; label: string }[] = [
  { value: "tsx", label: "TSX" },
  { value: "ts", label: "TS" },
  { value: "jsx", label: "JSX" },
  { value: "js", label: "JS" },
  { value: "py", label: "PY" },
];

export default function ProblemDetailPage() {
  const { problemId } = useParams();
  const { getStatus, updateStatus, getNotes, updateNotes } = useProgressStore();
  const { accessToken, owner, repo, branch, basePath } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const [isSolutionKeyPointsVisible, setIsSolutionKeyPointsVisible] =
    useState(false);
  const [isSolutionCodeVisible, setIsSolutionCodeVisible] = useState(false);
  const [isPushingToGitHub, setIsPushingToGitHub] = useState(false);

  const problem = problems.find((p) => p.id === problemId);

  if (!problem) {
    return <div>Problem not found</div>;
  }

  const week = weeks.find((w) => w.weekNumber === problem.week);
  const status = getStatus(problem.id);
  const notes = getNotes(problem.id);

  const template = solutionTemplates[problem.id];
  const templateLanguage = template?.codeLanguage ?? "js";

  const handleToggleSolution = () => {
    if (!template) {
      window.alert("이 문제에 대한 정답/힌트가 아직 없습니다.");
      return;
    }

    if (!isSolutionVisible) {
      const ok = window.confirm(
        "정답/힌트를 열면 스포일러가 될 수 있어요. 정말 열까요?",
      );
      if (!ok) return;
    }

    setIsSolutionVisible((v) => {
      const next = !v;
      if (!next) {
        setIsSolutionKeyPointsVisible(false);
        setIsSolutionCodeVisible(false);
      }
      return next;
    });
  };

  const handleToggleSolutionKeyPoints = () => {
    if (!template) {
      window.alert("이 문제에 대한 정답/힌트가 아직 없습니다.");
      return;
    }

    if (!isSolutionVisible) {
      window.alert("먼저 접근 아이디어(힌트)를 열어주세요.");
      return;
    }

    if (!isSolutionKeyPointsVisible) {
      const ok = window.confirm(
        "핵심 포인트를 열면 스포일러가 더 강해질 수 있어요. 정말 볼까요?",
      );
      if (!ok) return;
    }

    setIsSolutionKeyPointsVisible((v) => !v);
  };

  const handleToggleSolutionCode = () => {
    if (!template) {
      window.alert("이 문제에 대한 정답/힌트가 아직 없습니다.");
      return;
    }

    if (!isSolutionVisible) {
      window.alert("먼저 힌트를 열어주세요.");
      return;
    }

    if (!isSolutionCodeVisible) {
      const ok = window.confirm(
        "정답 코드까지 열면 스포일러가 더 강해져요. 정말 코드까지 볼까요?",
      );
      if (!ok) return;
    }

    setIsSolutionCodeVisible((v) => !v);
  };

  const handleNoteChange = (field: keyof ProblemNotes, value: string) => {
    updateNotes(problem.id, { [field]: value });
  };

  const getPlatformUrl = () => {
    if (problem.platform === "BOJ") {
      return `https://www.acmicpc.net/problem/${problem.number}`;
    }
    return `https://school.programmers.co.kr/learn/courses/30/lessons/${problem.number}`;
  };

  const handlePushToGitHub = async () => {
    if (isPushingToGitHub) return;

    if (!accessToken || !owner || !repo) {
      window.alert("GitHub 연동 및 저장소 설정을 먼저 완료해주세요.");
      return;
    }

    const platformUrl = getPlatformUrl();
    const md = buildProblemMarkdown({
      problem,
      status,
      notes,
      platformUrl,
    });

    const path = buildProblemMarkdownPath({
      basePath: basePath || "",
      weekNumber: problem.week,
      problemTitle: problem.title,
      platform: problem.platform,
      problemNumber: problem.number,
    });

    setIsPushingToGitHub(true);
    try {
      await upsertFile({
        accessToken,
        owner,
        repo,
        branch: branch || "main",
        path,
        content: md,
        message: `Update ${problem.id}: ${problem.title}`,
      });
      window.alert(`GitHub에 업로드 완료: ${owner}/${repo}/${path}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      window.alert(`GitHub 업로드 실패: ${msg}`);
    } finally {
      setIsPushingToGitHub(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="print-only">
        <div className="text-sm text-gray-600 font-medium">
          {problem.platform}
        </div>
        <div className="text-3xl font-bold tracking-tight">{problem.title}</div>
        <div className="text-sm text-gray-500">#{problem.number}</div>
      </div>

      <div className="mb-6 no-print">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="pl-0 hover:bg-transparent hover:text-blue-600"
        >
          <Link to="/problems">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Link>
        </Button>
      </div>

      <header className="mb-6 no-print">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{problem.platform}</Badge>
            <span className="text-gray-500">#{problem.number}</span>
            {week && (
              <Link to={`/weeks/${week.id}`}>
                <Badge variant="outline" className="hover:bg-gray-100">
                  Week {week.weekNumber}
                </Badge>
              </Link>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>

          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="space-y-6">
          <Card className="no-print">
            <CardHeader>
              <CardTitle className="text-lg">정답/힌트 (스포일러)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-500">
                {template
                  ? isSolutionVisible
                    ? isSolutionCodeVisible
                      ? "접근 + 핵심 포인트 + 코드"
                      : isSolutionKeyPointsVisible
                        ? "접근 + 핵심 포인트"
                        : "접근(힌트)"
                    : "숨김"
                  : "등록된 정답/힌트 없음"}
              </div>

              {!isSolutionVisible && (
                <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  막혔을 때만 펼쳐보는 용도입니다. (스포일러 방지)
                </div>
              )}

              {isSolutionVisible && template && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        접근 아이디어
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {template.approach || ""}
                      </div>
                    </div>
                    {isSolutionKeyPointsVisible ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          핵심 포인트
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {template.keyPoints || ""}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        핵심 포인트는 아직 숨겨져 있습니다. 정말 필요할 때만
                        우측의 “핵심 포인트 보기”를 눌러주세요.
                      </div>
                    )}
                  </div>

                  {!isSolutionCodeVisible && (
                    <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      코드는 아직 숨겨져 있습니다. 정말 필요할 때만 “코드
                      보기”를 눌러주세요.
                    </div>
                  )}

                  {isSolutionCodeVisible && (
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        정답 코드
                      </div>
                      <CodeBlockViewer
                        code={template.code || ""}
                        language={templateLanguage}
                        minHeightClassName="min-h-[220px]"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <NoteCard
            title="문제 요약"
            icon={<span className="text-xl">🧠</span>}
            value={notes.summary}
            placeholder="문제의 핵심 조건과 목표를 요약해주세요."
            isEditing={isEditing}
            onChange={(value) => handleNoteChange("summary", value)}
          />

          <NoteCard
            title="접근 아이디어"
            icon={<span className="text-xl">💡</span>}
            value={notes.approach}
            placeholder="어떤 알고리즘을 사용할지, 접근 방식을 적어주세요."
            isEditing={isEditing}
            onChange={(value) => handleNoteChange("approach", value)}
            textareaClassName="focus:ring-amber-500"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <NoteCard
              title="핵심 포인트"
              icon={<span className="text-xl">🧩</span>}
              value={notes.keyPoints}
              placeholder="문제 풀이의 핵심 로직이나 주의할 점을 적어주세요."
              isEditing={isEditing}
              onChange={(value) => handleNoteChange("keyPoints", value)}
              textareaClassName="focus:ring-purple-500"
              minHeightClassName="min-h-[150px]"
            />

            <NoteCard
              title="내가 실수한 부분"
              icon={<span className="text-xl">⚠️</span>}
              value={notes.mistakes}
              placeholder="실수했거나 놓쳤던 부분, 디버깅 내용을 적어주세요."
              isEditing={isEditing}
              onChange={(value) => handleNoteChange("mistakes", value)}
              textareaClassName="focus:ring-red-500"
              minHeightClassName="min-h-[150px]"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">✅</span>
                정답 코드
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="mb-3 flex items-center justify-between gap-3 no-print">
                  <div className="text-sm text-gray-500">언어</div>
                  <select
                    className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm"
                    value={notes.codeLanguage}
                    onChange={(e) =>
                      handleNoteChange(
                        "codeLanguage",
                        e.target.value as CodeLanguage,
                      )
                    }
                    aria-label="코드 언어"
                  >
                    {languageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {isEditing ? (
                <CodeEditor
                  value={notes.code}
                  onChange={(value) => handleNoteChange("code", value)}
                  placeholder={`// 여기에 코드를 작성하세요\n// 예) BFS 템플릿...`}
                  language={notes.codeLanguage}
                  className="border-green-200"
                  minHeightClassName="min-h-[260px]"
                />
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between no-print">
                    <div className="text-sm text-gray-500">
                      {isCodeExpanded ? "코드 펼침" : "코드 접힘"}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => setIsCodeExpanded((v) => !v)}
                    >
                      {isCodeExpanded ? "접기" : "펼치기"}
                    </Button>
                  </div>

                  {!isCodeExpanded && (
                    <div className="no-print text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      코드가 접혀있습니다. 필요할 때 펼쳐서 확인하세요.
                    </div>
                  )}

                  <div className={isCodeExpanded ? "" : "code-collapsed"}>
                    <CodeBlockViewer
                      code={notes.code}
                      language={notes.codeLanguage}
                      minHeightClassName="min-h-[260px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <NoteCard
            title="한 줄 회고"
            icon={<span className="text-xl">📝</span>}
            value={notes.retrospective}
            placeholder="이번 문제를 통해 배운 점을 한 줄로 요약해주세요."
            isEditing={isEditing}
            onChange={(value) => handleNoteChange("retrospective", value)}
            minHeightClassName="min-h-[80px]"
          />

          <NoteCard
            title="다시 풀기 기준"
            icon={<span className="text-xl">🔁</span>}
            value={notes.retryCriteria}
            placeholder="이 문제를 언제 다시 풀어봐야 할지 기준을 적어주세요."
            isEditing={isEditing}
            onChange={(value) => handleNoteChange("retryCriteria", value)}
            textareaClassName="focus:ring-orange-500"
            minHeightClassName="min-h-[100px]"
          />
        </div>

        <aside className="no-print lg:sticky lg:top-6 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">작업</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub 연동
                  </div>
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                    >
                      설정
                    </Button>
                  </Link>
                </div>
                {accessToken && owner && repo ? (
                  <div className="text-xs text-gray-500 truncate">
                    연결됨:{" "}
                    <span className="font-mono text-blue-600">
                      {owner}/{repo}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                    설정에서 GitHub 연동이 필요합니다.
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={handlePushToGitHub}
                disabled={isPushingToGitHub || !accessToken}
              >
                {isPushingToGitHub ? "푸시 중..." : "GitHub로 푸시"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleToggleSolution}
              >
                {isSolutionVisible ? "힌트 숨기기" : "힌트 보기"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleToggleSolutionKeyPoints}
                disabled={!template || !isSolutionVisible}
              >
                {isSolutionKeyPointsVisible
                  ? "핵심 포인트 숨기기"
                  : "핵심 포인트 보기"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleToggleSolutionCode}
                disabled={!template || !isSolutionVisible}
              >
                {isSolutionCodeVisible ? "코드 숨기기" : "코드 보기"}
              </Button>

              <Button
                className="w-full"
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing((v) => !v)}
              >
                {isEditing ? "저장/보기" : "수정하기"}
              </Button>

              <Button
                className="w-full"
                variant="ghost"
                onClick={() => window.print()}
              >
                PDF로 저장
              </Button>

              <div className="pt-2">
                <ProblemStatusToggle
                  status={status}
                  onStatusChange={(newStatus) =>
                    updateStatus(problem.id, newStatus)
                  }
                />
              </div>

              <a
                href={getPlatformUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button size="sm" className="w-full gap-2">
                  Solve on {problem.platform}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
