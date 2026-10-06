import { tool } from "ai";
import { z } from "zod";

export const getEducation = tool({
  description:
    "Use this tool when the user asks about my education, studies, university, degrees, academic background, GPA, coursework, TUM, or Astana IT University.",
  parameters: z.object({}),
  execute: async () => {
    return {
      education:
        "I'm studying an M.Sc. in Management & Technology at TUM, which I started in October 2026. I completed my bachelor's in September 2026, with a thesis on AI adoption and firm productivity graded 1.3 (1.0 = best). Before that, I completed two years of Software Engineering at Astana IT University in Kazakhstan, then deliberately transferred to TUM to study at the intersection of business and technology.",
    };
  },
});
