import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Test" },
      { name: "description", content: "Blank test page." },
    ],
  }),
  component: Index,
});

function Index() {
  return <div>test</div>;
}
