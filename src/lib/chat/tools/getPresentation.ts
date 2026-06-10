import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction of Maxat (Max) Issaliyev. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "I'm Max Issaliyev, a Product & Program Manager at Amazon focused on AI tooling and data-driven operations. I'm based near Munich, finishing my B.Sc. in Management & Technology at TUM, and I'm passionate about product, AI, data, and entrepreneurship.",
    };
  },
});
