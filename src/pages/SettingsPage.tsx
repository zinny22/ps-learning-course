import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Settings, Github, Save, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    accessToken,
    user,
    owner,
    repo,
    branch,
    basePath,
    setAccessToken,
    setUser,
    setRepoConfig,
    logout,
  } = useAuthStore();

  // Handle OAuth callback token extraction
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);
      // Clean up URL
      navigate("/settings", { replace: true });
      // Fetch user info
      fetchUserInfo(token);
    }
  }, [searchParams, navigate, setAccessToken]);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({
          login: userData.login,
          avatar_url: userData.avatar_url,
          name: userData.name || userData.login,
        });
        // Auto-fill owner if not set
        if (!owner) setRepoConfig({ owner: userData.login, repo: repo || "" });
      }
    } catch (e) {
      console.error("Failed to fetch user info", e);
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleSave = () => {
    window.alert("저장소 설정이 브라우저에 저장되었습니다.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          설정
        </h1>
        <p className="text-gray-500 mt-2">
          애플리케이션의 전역 설정을 관리합니다.
        </p>
      </header>

      {/* GitHub Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub 인증
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accessToken && user ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">
                    @{user.login} (연결됨)
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4 text-sm">
                {" "}
                GitHub 계정을 연동하여 학습 기록을 저장소에 푸시하세요.
              </p>
              <Button
                onClick={handleLogin}
                className="gap-2 bg-gray-900 hover:bg-black text-white px-8"
              >
                <Github className="w-5 h-5" />
                GitHub로 로그인하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repository Settings */}
      {accessToken && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Save className="w-4 h-4" />
              저장소 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Owner
                </label>
                <input
                  type="text"
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={owner || ""}
                  onChange={(e) =>
                    setRepoConfig({ owner: e.target.value, repo: repo || "" })
                  }
                  placeholder="github-username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Repository
                </label>
                <input
                  type="text"
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={repo || ""}
                  onChange={(e) =>
                    setRepoConfig({ owner: owner || "", repo: e.target.value })
                  }
                  placeholder="my-ps-repo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Branch
                </label>
                <input
                  type="text"
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={branch}
                  onChange={(e) =>
                    setRepoConfig({
                      owner: owner || "",
                      repo: repo || "",
                      branch: e.target.value,
                    })
                  }
                  placeholder="main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Base Path (Optional)
                </label>
                <input
                  type="text"
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={basePath}
                  onChange={(e) =>
                    setRepoConfig({
                      owner: owner || "",
                      repo: repo || "",
                      basePath: e.target.value,
                    })
                  }
                  placeholder="problems"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} className="w-full">
                설정 저장
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">💡 도움말</h4>
        <p className="text-sm text-blue-700">
          GitHub 연동 후 저장소 정보를 입력하면, 문제 풀이 상세 페이지에서 우측
          'GitHub로 푸시' 버튼을 통해 본인의 저장소에 마크다운 형식으로 기록을
          전송할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
