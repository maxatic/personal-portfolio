
import { tool } from "ai";
import { z } from "zod";


export const getProjects = tool({
  description:
    "This tool will show a list of all projects Max has worked on",
  parameters: z.object({}),
  execute: async () => {
    return "Here are some of the projects I've worked on (above)! Don't hesitate to ask me more about any of them.";
  },
});