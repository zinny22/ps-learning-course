import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res
      .status(500)
      .json({ error: "GitHub OAuth credentials are not configured" });
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const accessToken = tokenData.access_token;

    // 2. Redirect back to app with token in query param (temporary for easy extraction)
    // Or simpler: redirect to a callback page that handles the token storage
    const targetUrl = `https://${req.headers.host}/settings?token=${accessToken}`;
    res.redirect(targetUrl);
  } catch (error) {
    console.error("GitHub Auth Callback Error:", error);
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
  }
}
