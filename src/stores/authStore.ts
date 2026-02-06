import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  user: GitHubUser | null;
  repo: string | null;
  owner: string | null;
  branch: string;
  basePath: string;
  setAccessToken: (token: string | null) => void;
  setUser: (user: GitHubUser | null) => void;
  setRepoConfig: (config: {
    owner: string;
    repo: string;
    branch?: string;
    basePath?: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      repo: null,
      owner: null,
      branch: "main",
      basePath: "",
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      setRepoConfig: (config) =>
        set((state) => ({
          ...state,
          ...config,
        })),
      logout: () =>
        set({ accessToken: null, user: null, repo: null, owner: null }),
    }),
    {
      name: "ps-learning-auth",
    },
  ),
);
