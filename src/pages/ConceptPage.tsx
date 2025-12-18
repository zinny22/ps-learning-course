import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { concepts } from "../data/concepts";
import { weeks } from "../data/weeks";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { ArrowLeft, BookOpen, Copy, Check, Search } from "lucide-react";
import { cn } from "../lib/utils";

export default function ConceptPage() {
  const { weekId } = useParams();
  const week = weeks.find((w) => w.id === weekId);
  const concept = concepts.find((c) => c.weekId === weekId);

  if (!week) {
    return <div>Week not found</div>;
  }

  if (!concept) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 pl-0">
          <Link to={`/weeks/${weekId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Week {week.weekNumber}
          </Link>
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">준비 중입니다</h2>
          <p className="text-gray-500">
            이 주차의 개념 설명 콘텐츠가 아직 준비되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
        >
          <Link to={`/weeks/${weekId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Week {week.weekNumber}
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            {concept.title}
          </h1>
          <div className="text-lg text-gray-600 leading-relaxed prose prose-blue max-w-none">
            <ReactMarkdown>{concept.description}</ReactMarkdown>
          </div>
        </div>

        <div className="space-y-8">
          {concept.sections.map((section, index) => (
            <Card key={index} className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>

                {section.keywords && section.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-blue-700 font-medium text-sm mr-2">
                      <Search className="w-4 h-4" />
                      검색 키워드:
                    </div>
                    {section.keywords.map((keyword: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white text-blue-600 text-xs font-medium rounded border border-blue-100 shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {section.codeExamples && (
                  <CodeBlock
                    py={section.codeExamples.py}
                    js={section.codeExamples.js}
                    description={section.codeExamples.description}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({
  py,
  js,
  description,
}: {
  py: string;
  js: string;
  description?: string;
}) {
  const [lang, setLang] = useState<"py" | "js">("py");
  const [copied, setCopied] = useState(false);

  const code = lang === "py" ? py : js;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
      <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex gap-1 bg-slate-900 p-1 rounded-md">
          <button
            onClick={() => setLang("py")}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              lang === "py"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Python
          </button>
          <button
            onClick={() => setLang("js")}
            className={cn(
              "px-3 py-1 rounded text-xs font-medium transition-colors",
              lang === "js"
                ? "bg-yellow-500 text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            JavaScript
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto relative group">
        <pre className="text-sm font-mono text-slate-50 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
      {description && (
        <div className="bg-slate-800/50 px-4 py-3 border-t border-slate-700">
          <p className="text-sm text-slate-300 flex items-start gap-2">
            <span className="mt-0.5">💡</span>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
