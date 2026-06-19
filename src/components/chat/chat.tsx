"use client";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { chatStream } from "@/lib/api/chat.functions";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Component imports
import ChatBottombar from "@/components/chat/chat-bottombar";
import ChatLanding from "@/components/chat/chat-landing";
import { FullChatView } from "@/components/chat/full-chat-view";
import WelcomeModal from "@/components/welcome-modal";
import { Info } from "lucide-react";
import HelperBoost from "./HelperBoost";

/**
 * Maps a quick-question to the card it should render. The "subcategory" buttons
 * always show their predefined card instantly instead of calling the AI, so this
 * picks the right tool/card for a given button question. Keyword order matters:
 * most specific first.
 */
function pickDemoTool(query: string): string {
  const s = query.toLowerCase();
  if (/certificat|certified|credential/.test(s)) return "getCertifications";
  if (/intern/.test(s)) return "getInternship";
  if (
    /education|study|studied|studies|university|degree|college|academic|tum|astana|gpa|major|coursework/.test(
      s,
    )
  )
    return "getEducation";
  if (
    /experience|work history|worked|career|working now|amazon|veon|beeline|invisid|campus founders|astana hub|gdg/.test(
      s,
    )
  )
    return "getExperience";
  if (/resume|cv|hire|valuable|team member/.test(s)) return "getResume";
  if (/contact|reach|email|role.*looking|looking.*role|located|where are you/.test(s))
    return "getContact";
  if (/skill/.test(s)) return "getSkills";
  if (/formula|f1|sport|fitness|gym|football/.test(s)) return "getSports";
  if (/project|proud|building|work on/.test(s)) return "getProjects";
  if (/fun|craziest|crazy|gaming|hobby|hobbies|certain about/.test(s)) return "getCrazy";
  return "getPresentation";
}

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

interface AvatarProps {
  hasActiveTool: boolean;
}

const Avatar = ({ hasActiveTool }: AvatarProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? "h-20 w-20" : "h-28 w-28"}`}
    >
      <div className="relative cursor-pointer" onClick={() => (window.location.href = "/")}>
        <img src="/avatar-landing.png" alt="Max avatar" className="h-full w-full object-contain" />
      </div>
    </div>
  );
};

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: "easeOut" as const,
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");
  // Quick-question buttons link here with a `tool`, so we render that predefined
  // card instead of calling the AI.
  const initialTool = searchParams.get("tool");
  // Ref guard (not state) so React StrictMode's double-invoked effect can't
  // fire the initial query twice and duplicate the first card.
  const autoSubmittedRef = useRef(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const hasReachedLimit = false;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    fetch: (async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(init.body as string) : { messages: [] };
      return await chatStream({
        data: { messages: body.messages },
        signal: init?.signal ?? undefined,
      });
    }) as typeof fetch,
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.error("Chat error:", error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log("Tool call:", toolName);
    },
  });

  // Once the conversation has started we shrink the avatar header to give the
  // scrolling history more room.
  const conversationStarted = messages.length > 0 || loadingSubmit;

  const isToolInProgress = messages.some(
    (m) =>
      m.role === "assistant" &&
      m.parts?.some(
        (part) => part.type === "tool-invocation" && part.toolInvocation?.state !== "result",
      ),
  );

  // Subcategory buttons always render their predefined card. This injects a
  // user + assistant turn so the matching card renders through the normal
  // pipeline, with no API call involved. `toolName` comes from the button; when
  // it's missing we infer the card from the question text.
  const submitPredefined = (query: string, toolName?: string) => {
    if (!query.trim() || isToolInProgress || loadingSubmit) return;
    const tool = toolName ?? pickDemoTool(query);
    // Reuse an existing card rather than rendering a duplicate.
    if (scrollToExistingAnswer(query, tool)) return;
    const stamp = Date.now();
    const userMsg = {
      id: `card-user-${stamp}`,
      role: "user",
      content: query,
      parts: [{ type: "text", text: query }],
    };
    const assistantMsg = {
      id: `card-ai-${stamp}`,
      role: "assistant",
      content: "",
      parts: [
        {
          type: "tool-invocation",
          toolInvocation: {
            state: "result",
            step: 0,
            toolCallId: `card-call-${stamp}`,
            toolName: tool,
            args: {},
            result: { predefined: true },
          },
        },
      ],
    };

    setLoadingSubmit(true);
    //@ts-ignore — message shape matches what the renderers consume
    setMessages((prev) => [...prev, userMsg]);
    // brief delay to mimic the "thinking" bubble
    setTimeout(() => {
      //@ts-ignore
      setMessages((prev) => [...prev, assistantMsg]);
      setLoadingSubmit(false);
    }, 550);
  };

  // If the card a query would produce is already in the history, scroll to it
  // instead of generating it again. Returns true when it handled the query.
  const scrollToExistingAnswer = (query: string, toolName?: string) => {
    const targetTool = toolName ?? pickDemoTool(query);
    const alreadyAnswered = messages.some(
      (m) =>
        m.role === "assistant" &&
        m.parts?.some(
          (part) =>
            part.type === "tool-invocation" &&
            part.toolInvocation?.state === "result" &&
            part.toolInvocation?.toolName === targetTool,
        ),
    );
    if (!alreadyAnswered) return false;
    requestAnimationFrame(() => {
      document
        .getElementById(`chat-tool-${targetTool}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return true;
  };

  // Free-form typed questions always go to the live Lovable AI. We intentionally
  // do NOT call scrollToExistingAnswer here: even if a previous answer used the
  // same tool category, a typed follow-up is a new question and must append a
  // new turn instead of scrolling back to an older card.
  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress || loadingSubmit) return;
    setLoadingSubmit(true);
    append({
      role: "user",
      content: query,
    });
  };

  useEffect(() => {
    if (initialQuery && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      setInput("");
      if (initialTool) {
        submitPredefined(initialQuery, initialTool);
      } else {
        submitQuery(initialQuery);
      }
    }
  }, [initialQuery, initialTool]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput("");
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  const isEmptyState = messages.length === 0 && !loadingSubmit;

  const headerHeight = conversationStarted ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div
          className={`transition-all duration-300 ease-in-out ${conversationStarted ? "pt-6 pb-0" : "py-6"}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={conversationStarted} />
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div className="flex-1 overflow-y-auto px-2" style={{ paddingTop: `${headerHeight}px` }}>
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} hasReachedLimit={hasReachedLimit} />
              </motion.div>
            ) : (
              <div className="pb-4">
                <FullChatView
                  messages={messages}
                  isLoading={isLoading}
                  loadingSubmit={loadingSubmit}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-background px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost
              submitQuery={submitQuery}
              submitPredefined={submitPredefined}
              setInput={setInput}
              hasReachedLimit={hasReachedLimit}
            />
            <ChatBottombar
              input={hasReachedLimit ? "You've reached your message limit." : input}
              handleInputChange={hasReachedLimit ? () => {} : handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress || hasReachedLimit}
              disabled={hasReachedLimit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
