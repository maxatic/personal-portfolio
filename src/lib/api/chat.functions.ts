import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { streamText, type Message } from "ai";
import { createHash } from "crypto";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "../ai-gateway.server";

const AI_QUESTION_LIMIT = 6;

function getClientIp(req: Request): string {
  const h = req.headers;
  const candidates = [
    h.get("cf-connecting-ip"),
    h.get("x-real-ip"),
    h.get("x-forwarded-for")?.split(",")[0].trim(),
  ];
  return candidates.find((v) => !!v) || "unknown";
}

function hashIp(ip: string): string {
  // Salt with a server-side value so the stored hash is not a trivially
  // reversible IP lookup table.
  const salt = process.env.LOVABLE_API_KEY || "ai-usage-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

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
// Lovable AI Gateway.
const MessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    // Assistant messages from predefined-card flows may carry empty content
    // (the payload lives in `parts`). Only enforce min length on user input.
    content: z.string().max(4000),
    id: z.string().optional(),
    createdAt: z.union([z.string(), z.date()]).optional(),
  })
  .passthrough();

const ChatInputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
});

function safeErrorMessage(error: unknown): string {
  console.error("Chat stream error:", error);
  return "An error occurred while generating a response. Please try again.";
}

export const chatStream = createServerFn({ method: "POST" })
  .validator((data: unknown) => ChatInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      // Per-visitor AI question limit (by hashed IP). Enforced server-side
      // so it cannot be bypassed from the browser.
      const req = getRequest();
      const ip = getClientIp(req);
      const ipHash = hashIp(ip);

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: existing, error: readErr } = await supabaseAdmin
        .from("ai_usage")
        .select("count")
        .eq("ip_hash", ipHash)
        .maybeSingle();

      if (readErr) {
        console.error("ai_usage read error:", readErr);
        return new Response("Service unavailable. Please try again later.", { status: 503 });
      }

      const currentCount = existing?.count ?? 0;
      if (currentCount >= AI_QUESTION_LIMIT) {
        return new Response(
          `You've reached the limit of ${AI_QUESTION_LIMIT} AI questions. Please come back later.`,
          { status: 429 },
        );
      }

      const { error: upsertErr } = await supabaseAdmin
        .from("ai_usage")
        .upsert(
          { ip_hash: ipHash, count: currentCount + 1, updated_at: new Date().toISOString() },
          { onConflict: "ip_hash" },
        );

      if (upsertErr) {
        console.error("ai_usage upsert error:", upsertErr);
        return new Response("Service unavailable. Please try again later.", { status: 503 });
      }

      // Strip any non-user/assistant messages (e.g. role: 'system') to prevent
      // clients from overriding the server-side SYSTEM_PROMPT.
      const sanitized = data.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content })) as Message[];

      const messages: Message[] = [SYSTEM_PROMPT as unknown as Message, ...sanitized];

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
        console.error("Missing LOVABLE_API_KEY");
        return new Response("Service unavailable. Please try again later.", { status: 503 });
      }
      const gateway = createLovableAiGatewayProvider(apiKey);

      const result = streamText({
        model: gateway("google/gemini-3-flash-preview"),
        messages,
        toolCallStreaming: true,
        tools,
        maxSteps: 2,
      });

      return result.toDataStreamResponse({ getErrorMessage: safeErrorMessage });
    } catch (err) {
      console.error("Global chat error:", err);
      return new Response("An error occurred. Please try again.", { status: 500 });
    }
  });
