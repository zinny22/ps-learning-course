import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { accessToken, owner, repo, branch, path, content, message } = req.body;

  if (!accessToken || !owner || !repo || !path || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const encodedPath = path
      .split("/")
      .map((seg: string) => encodeURIComponent(seg))
      .join("/");
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

    // 1. Get file SHA (if exists)
    const getRes = await fetch(`${baseUrl}?ref=${branch}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. Create or Update file
    const pushRes = await fetch(baseUrl, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        sha,
      }),
    });

    if (!pushRes.ok) {
      const errorText = await pushRes.text();
      throw new Error(`GitHub API error: ${pushRes.status} ${errorText}`);
    }

    const result = await pushRes.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Push Error:", error);
    return res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
  }
}
