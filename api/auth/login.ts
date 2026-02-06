import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

  if (!GITHUB_CLIENT_ID) {
    return res
      .status(500)
      .json({
        error: "GITHUB_CLIENT_ID is not configured in environment variables",
      });
  }

  // scope: repo -> full control of private repositories
  // scope: public_repo -> access to public repositories only
  const scope = "repo";
  const redirectUri = `https://${req.headers.host}/api/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.redirect(githubAuthUrl);
}
