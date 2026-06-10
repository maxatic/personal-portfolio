import { createServerFn } from "@tanstack/react-start";

// Ported from the Next.js GET /api/github-stars route.
export const getGithubStars = createServerFn({ method: "GET" }).handler(
  async () => {
    // TODO: update to your own portfolio repo once published
    const res = await fetch("https://api.github.com/repos/maxissaliyev/portfolio", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
      },
    });

    if (!res.ok) {
      return { stars: 0 };
    }

    const data = await res.json();
    return { stars: data.stargazers_count as number };
  },
);
