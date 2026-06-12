'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { chatStream } from '@/lib/api/chat.functions';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import { cn } from '@/lib/utils';
import { FlaskConical, Info } from 'lucide-react';
import HelperBoost from './HelperBoost';

/**
 * Demo mode: when there's no Lovable API key wired up yet, this maps a question
 * to the tool/card it would have triggered, so the portfolio cards can be
 * previewed without the AI backend. Keyword order matters — most specific first.
 */
function pickDemoTool(query: string): string {
  const s = query.toLowerCase();
  if (/intern/.test(s)) return 'getInternship';
  if (/education|study|studied|studies|university|degree|college|academic|tum|astana|gpa|major|coursework/.test(s))
    return 'getEducation';
  if (/experience|work history|worked|career|working now|amazon|veon|beeline|invisid|campus founders|astana hub|gdg/.test(s))
    return 'getExperience';
  if (/resume|cv|hire|valuable|team member/.test(s))
    return 'getResume';
  if (/contact|reach|email|role.*looking|looking.*role|located|where are you/.test(s))
    return 'getContact';
  if (/skill/.test(s)) return 'getSkills';
  if (/formula|f1|sport|fitness|gym|football/.test(s)) return 'getSports';
  if (/project|proud|building|work on/.test(s)) return 'getProjects';
  if (/fun|craziest|crazy|gaming|hobby|hobbies|certain about/.test(s)) return 'getCrazy';
  return 'getPresentation';
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
      className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
    >
      <div
        className="relative cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        <img
          src="/avatar-landing.png"
          alt="Max avatar"
          className="h-full w-full object-contain"
        />
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
    ease: 'easeOut' as const,
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const hasReachedLimit = false;

  // Demo mode — preview the portfolio cards without the AI backend.
  // Lazy-init from localStorage so the value is correct before the
  // auto-submit effect runs on mount.
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem('portfolio-demo-mode') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('portfolio-demo-mode', demoMode ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [demoMode]);

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
      const body = init?.body
        ? JSON.parse(init.body as string)
        : { messages: [] };
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
      console.error('Chat error:', error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  // Injects a fake user + assistant turn so the matching card renders through
  // the normal pipeline, no API call involved.
  const submitDemoQuery = (query: string) => {
    const toolName = pickDemoTool(query);
    const stamp = Date.now();
    const userMsg = {
      id: `demo-user-${stamp}`,
      role: 'user',
      content: query,
      parts: [{ type: 'text', text: query }],
    };
    const assistantMsg = {
      id: `demo-ai-${stamp}`,
      role: 'assistant',
      content: '',
      parts: [
        {
          type: 'tool-invocation',
          toolInvocation: {
            state: 'result',
            step: 0,
            toolCallId: `demo-call-${stamp}`,
            toolName,
            args: {},
            result: { demo: true },
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

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;
    if (demoMode) {
      submitDemoQuery(query);
      return;
    }
    setLoadingSubmit(true);
    append({
      role: 'user',
      content: query,
    });
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <button
          type="button"
          onClick={() => {
            const next = !demoMode;
            setDemoMode(next);
            toast[next ? 'success' : 'info'](
              next
                ? 'Demo mode on — showing sample cards (no AI needed)'
                : 'Demo mode off — using the live AI backend'
            );
          }}
          title="Preview the portfolio cards without the AI backend"
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-medium transition-colors',
            demoMode
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'hover:bg-accent text-muted-foreground'
          )}
        >
          <FlaskConical className="h-4 w-4" />
          <span className="hidden sm:inline">
            {demoMode ? 'Demo on' : 'Demo'}
          </span>
        </button>
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent"
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar hasActiveTool={hasActiveTool} />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} hasReachedLimit={hasReachedLimit} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-background px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={submitQuery} setInput={setInput} hasReachedLimit={hasReachedLimit} />
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
