import { createServerFn } from "@tanstack/react-start";
import { streamText, type Message } from "ai";
import { createLovableAiGatewayProvider } from "../ai-gateway.server";

import { SYSTEM_PROMPT } from "../chat/prompt";
import { getCertifications } from "../chat/tools/getCertifications";
import { getContact } from "../chat/tools/getContact";
import { getCrazy } from "../chat/tools/getCrazy";
import { getEducation } from "../chat/tools/getEducation";
import { getExperience } from "../chat/tools/getExperience";
import { getInternship } from "../chat/tools/getIntership";
import { getPresentation } from "../chat/tools/getPresentation";
import { getProjects } from "../chat/tools/getProjects";
import { getResume } from "../chat/tools/getResume";
import { getSkills } from "../chat/tools/getSkills";
import { getSports } from "../chat/tools/getSport";

// This handler powers free-form typed questions only. The quick-question
// subcategory buttons render their predefined cards client-side without calling
// this at all, so the AI is reserved for open-ended questions.
//
// LOVABLE SETUP: add the `LOVABLE_API_KEY` secret in your Lovable project
// (Settings -> Secrets). It is read per-request below and used to call the
// Lovable AI Gateway. Without it, typed questions return a 500; the buttons
// still work. The model and the assistant's behaviour/guardrails come from
// `SYSTEM_PROMPT` (src/lib/chat/prompt.ts) — edit that to change the persona.
//
// Ported from the Next.js POST /api/chat route. Returns the AI SDK data-stream
// Response directly; TanStack Start passes raw Response results through to the
// client (x-tss-raw), so `useChat`'s custom fetch streams it as usual.
function errorHandler(error: unknown) {
  if (error == null) return "Unknown error";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

export const chatStream = createServerFn({ method: "POST" })
  .validator((data: { messages: Message[] }) => data)
  .handler(async ({ data }) => {
    try {
      const messages = [...data.messages];
      messages.unshift(SYSTEM_PROMPT as unknown as Message);

      const tools = {
        getProjects,
        getPresentation,
        getResume,
        getContact,
        getSkills,
        getSports,
        getCrazy,
        getInternship,
        getEducation,
        getExperience,
        getCertifications,
      };

      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) {
        return new Response("Missing LOVABLE_API_KEY", { status: 500 });
      }
      const gateway = createLovableAiGatewayProvider(apiKey);

      const result = streamText({
        model: gateway("google/gemini-3-flash-preview"),
        messages,
        toolCallStreaming: true,
        tools,
        maxSteps: 2,
      });

      return result.toDataStreamResponse({ getErrorMessage: errorHandler });
    } catch (err) {
      console.error("Global error:", err);
      return new Response(errorHandler(err), { status: 500 });
    }
  });
