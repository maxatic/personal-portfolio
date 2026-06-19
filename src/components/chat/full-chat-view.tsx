"use client";

import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ChatRequestOptions } from "ai";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ChatMessageContent from "./chat-message-content";
import ToolRenderer from "./tool-renderer";

interface FullChatViewProps {
  messages: Message[];
  isLoading: boolean;
  loadingSubmit: boolean;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: "easeOut" as const,
  },
};

// Pull out only the tool invocations that have finished (state === 'result').
function getResultTools(message: Message) {
  return (
    message.parts
      ?.filter((part) => part.type === "tool-invocation" && part.toolInvocation?.state === "result")
      .map((part) => (part.type === "tool-invocation" ? part.toolInvocation : null))
      .filter(Boolean) || []
  );
}

/**
 * Renders the full conversation as a scrollable history: each user turn is a
 * sent bubble, each assistant turn renders its card (first tool result) plus
 * any text. New turns are appended, so previous questions stay visible and you
 * can scroll back through everything you've asked.
 */
export function FullChatView({
  messages,
  isLoading,
  loadingSubmit,
  reload,
  addToolResult,
}: FullChatViewProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest turn whenever a message is added or we start loading.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, loadingSubmit]);

  return (
    <div className="flex w-full flex-col gap-5 px-4 pb-4">
      {messages.map((message, index) => {
        if (message.role === "user") {
          return (
            <motion.div
              key={message.id || `user-${index}`}
              {...MOTION_CONFIG}
              className="flex w-full justify-end"
            >
              <ChatBubble variant="sent" className="mx-0 max-w-[85%]">
                <ChatBubbleMessage>
                  <ChatMessageContent
                    message={message}
                    isLast={false}
                    isLoading={false}
                    reload={() => Promise.resolve(null)}
                  />
                </ChatBubbleMessage>
              </ChatBubble>
            </motion.div>
          );
        }

        if (message.role !== "assistant") return null;

        const toolInvocations = getResultTools(message);
        const currentTool = toolInvocations.length > 0 ? [toolInvocations[0]] : [];
        const hasText = message.content.trim().length > 0;
        const isLastMessage = index === messages.length - 1;
        const toolName = currentTool[0]?.toolName;

        return (
          <motion.div
            key={message.id || `ai-${index}`}
            // Anchor so a repeat question can scroll back to this card instead
            // of regenerating it. scroll-mt offsets the fixed avatar header.
            id={toolName ? `chat-tool-${toolName}` : undefined}
            {...MOTION_CONFIG}
            className="flex w-full scroll-mt-28 flex-col"
          >
            {currentTool.length > 0 && (
              <div className="mb-2 w-full">
                <ToolRenderer
                  toolInvocations={currentTool}
                  messageId={message.id || `msg-${index}`}
                />
              </div>
            )}

            {hasText && (
              <ChatBubble variant="received" className="w-full">
                <ChatBubbleMessage className="w-full">
                  <ChatMessageContent
                    message={message}
                    isLast={isLastMessage}
                    isLoading={isLoading && isLastMessage}
                    reload={reload}
                    addToolResult={addToolResult}
                    skipToolRendering={true}
                  />
                </ChatBubbleMessage>
              </ChatBubble>
            )}
          </motion.div>
        );
      })}

      {/* "thinking" bubble shown while the next answer is on its way */}
      {loadingSubmit && (
        <motion.div {...MOTION_CONFIG} className="flex w-full">
          <ChatBubble variant="received">
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        </motion.div>
      )}

      <div ref={endRef} className="h-1 w-full" />
    </div>
  );
}
