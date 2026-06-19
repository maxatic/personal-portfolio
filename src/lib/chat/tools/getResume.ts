import { tool } from "ai";
import { z } from "zod";

export const getResume = tool({
  description: "Show my resume section with German and US CV versions.",
  parameters: z.object({}),
  execute: async () => {
    return "Use the resume card to preview or download the available CV version.";
  },
});
