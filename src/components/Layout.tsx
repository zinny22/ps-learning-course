import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  BookOpen,
  Check,
  Library,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { weeks } from "../data/weeks";
import { problems } from "../data/problems";
import { useProgressStore } from "../stores/progressStore";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  const location = useLocation();
  const { getStatus } = useProgressStore();

  const navigation = [
    { name: "학습 코스", href: "/", icon: LayoutDashboard },
    { name: "주차별 계획", href: "/weeks", icon: Calendar },
    { name: "문제 은행", href: "/problems", icon: ListTodo },
    { name: "기본 개념", href: "/concepts", icon: Library },
    { name: "설정", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>PS Learning</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1 mb-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-600" : "text-gray-400",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Weekly Roadmap
            </h3>
          </div>

          <nav className="px-4 space-y-1">
            {weeks.map((week) => {
              const isActive = location.pathname === `/weeks/${week.id}`;
              const weekProblems = problems.filter(
                (p) => p.week === week.weekNumber,
              );
              const isCompleted =
                weekProblems.length > 0 &&
                weekProblems.every((p) => getStatus(p.id) === "DONE");

              return (
                <Link
                  key={week.id}
                  to={`/weeks/${week.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium transition-colors",
                      isCompleted
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isActive
                          ? "bg-white border-gray-200 text-blue-600"
                          : "bg-white border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-500",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      week.weekNumber
                    )}
                  </span>
                  <span className="truncate">{week.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="text-xs text-gray-400">v0.1.0 • Learning Course</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
