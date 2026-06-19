
import { tool } from "ai";
import { z } from "zod";


export const getCrazy = tool({
  description:
    "This tool returns the boldest/craziest thing Max has ever done. Use it when the user asks something like: 'What's the craziest thing you've ever done?'",
  parameters: z.object({}),
  execute: async () => {
    return "The boldest thing I've done? I dropped a Software Engineering degree halfway through in Astana and started over from scratch in Germany. New country, new language, a totally different field (Management & Technology at TUM). No safety net, just a bet on myself, and three years in it's paying off.";
  },
});