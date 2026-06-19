
import { tool } from "ai";
import { z } from "zod";


export const getSports = tool({
  description:
    "This tool shows Max's hobbies outside of work — gaming (Deadlock, Dota 2, The Finals) and Formula 1. Use it when the user asks about hobbies, gaming, or what I do for fun.",
  parameters: z.object({}),
  execute: async () => {
    return "Here's what I get up to outside of work: gaming and Formula 1!";
  },
});