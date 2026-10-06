import { tool } from "ai";
import { z } from "zod";

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction of Maxat (Max) Issaliyev. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "I'm Max Issaliyev, a product person now working as an AI Data Analyst Working Student at Red Hat. I'm based near Munich, studying an M.Sc. in Management & Technology at TUM after completing my bachelor's, and I'm passionate about product, AI, data, and entrepreneurship.",
    };
  },
});
