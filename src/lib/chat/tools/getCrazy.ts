
import { tool } from "ai";
import { z } from "zod";


export const getCrazy = tool({
  description:
    "This tool returns the boldest/craziest thing Max has ever done. Use it when the user asks something like: 'What's the craziest thing you've ever done?'",
  parameters: z.object({}),
  execute: async () => {
    return "The boldest thing I've done? I left a Software Engineering degree halfway through in Astana, Kazakhstan, and restarted from scratch in Germany — new country, new language, new field (Management & Technology at TUM). No safety net, just a bet on myself. Three years in, it's paying off.";
  },
});