import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import Chat from "@/components/chat/chat";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat />
    </Suspense>
  );
}
