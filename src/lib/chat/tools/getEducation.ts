import { tool } from 'ai';
import { z } from 'zod';

export const getEducation = tool({
  description:
    'Use this tool when the user asks about my education, studies, university, degrees, academic background, GPA, coursework, TUM, or Astana IT University.',
  parameters: z.object({}),
  execute: async () => {
    return {
      education:
        "I'm finishing my B.Sc. in Management & Technology at TUM Campus Heilbronn (Specialization: Digital Technologies, expected September 2026), with a bachelor's thesis on AI adoption in the workplace. Before that, I completed two years of Software Engineering at Astana IT University in Kazakhstan, then deliberately transferred to TUM to study at the intersection of business and technology.",
    };
  },
});
