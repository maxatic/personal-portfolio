"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink, Eye, FileText, Loader2 } from "lucide-react";
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const PdfThumbnail = lazy(() =>
  import("./pdf-document").then((m) => ({ default: m.PdfThumbnail })),
);
const PdfViewer = lazy(() => import("./pdf-document").then((m) => ({ default: m.PdfViewer })));

type ResumeVersion = {
  id: "german" | "us";
  label: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  lastUpdated: string;
  url: string;
  available: boolean;
};

const resumeVersions: ResumeVersion[] = [
  {
    id: "german",
    label: "German",
    title: "German CV",
    description: "German-market version for applications in Germany.",
    fileName: "Maxat CV German Version.pdf",
    fileSize: "254 KB",
    lastUpdated: "June 2026",
    url: "/Resumes/Maxat%20CV%20German%20Version.pdf",
    available: true,
  },
  {
    id: "us",
    label: "US",
    title: "US Resume",
    description: "US-market one-page version, coming soon.",
    fileName: "Maxat CV US Version.pdf",
    fileSize: "Pending",
    lastUpdated: "Coming soon",
    url: "/Resumes/Maxat%20CV%20US%20Version.pdf",
    available: false,
  },
];

const THUMB_WIDTH = 112;

export function Resume() {
  const [selectedId, setSelectedId] = useState<ResumeVersion["id"]>("german");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // pdf.js is client-only, so don't render it until after mount (avoids SSR).
  useEffect(() => setMounted(true), []);

  const selectedResume =
    resumeVersions.find((resume) => resume.id === selectedId) ?? resumeVersions[0];

  return (
    <div className="mx-auto w-full max-w-3xl py-6 font-sans">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
            <FileText className="text-foreground h-5 w-5" />
          </div>
          <div>
            <h2 className="text-foreground text-xl font-semibold md:text-2xl">Resume</h2>
            <p className="text-muted-foreground text-sm">
              Choose the CV version that fits your market
            </p>
          </div>
        </div>

        <div className="bg-accent grid grid-cols-2 rounded-full p-1">
          {resumeVersions.map((resume) => (
            <button
              key={resume.id}
              type="button"
              onClick={() => setSelectedId(resume.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedResume.id === resume.id
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {resume.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact card: clean page teaser + actions. The full CV opens in a modal. */}
      <motion.div
        key={selectedResume.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-accent overflow-hidden rounded-2xl"
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          {/* Document-style teaser, click to open */}
          <button
            type="button"
            onClick={() => selectedResume.available && setOpen(true)}
            disabled={!selectedResume.available}
            aria-label={`Preview ${selectedResume.title}`}
            className="group relative aspect-[1/1.414] w-28 flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] ring-1 ring-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60 dark:ring-white/10"
          >
            {selectedResume.available ? (
              <>
                <div className="pointer-events-none h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full">
                  {mounted ? (
                    <Suspense
                      fallback={
                        <div className="flex h-full w-full items-center justify-center">
                          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                        </div>
                      }
                    >
                      <PdfThumbnail url={selectedResume.url} width={THUMB_WIDTH} />
                    </Suspense>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileText className="text-muted-foreground h-7 w-7" />
                    </div>
                  )}
                </div>
                {/* gradient + label on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-1 items-center justify-center pb-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="bg-background/95 text-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm">
                    <Eye className="h-3 w-3" />
                    View
                  </span>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <FileText className="h-7 w-7" />
              </div>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground text-lg font-semibold">{selectedResume.title}</h3>
            <p className="text-muted-foreground text-sm">{selectedResume.description}</p>
            <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-2 text-xs">
              <span>PDF</span>
              <span aria-hidden>·</span>
              <span>Updated {selectedResume.lastUpdated}</span>
              <span aria-hidden>·</span>
              <span>{selectedResume.fileSize}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={!selectedResume.available}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                  selectedResume.available
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-muted-foreground pointer-events-none opacity-60"
                }`}
              >
                <Eye className="h-4 w-4" />
                View CV
              </button>
              <a
                href={selectedResume.available ? selectedResume.url : undefined}
                download={selectedResume.available ? selectedResume.fileName : undefined}
                aria-disabled={!selectedResume.available}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                  selectedResume.available
                    ? "border-border bg-background text-foreground hover:bg-secondary"
                    : "border-border text-muted-foreground pointer-events-none opacity-60"
                }`}
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Popup: full CV floating over the chat */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[92vh] w-[94vw] max-w-[1200px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1200px]">
          <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="min-w-0">
              <DialogTitle className="truncate text-base">{selectedResume.title}</DialogTitle>
              <p className="text-muted-foreground truncate text-xs">{selectedResume.fileName}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={selectedResume.url}
                target="_blank"
                rel="noreferrer"
                className="border-border bg-background text-foreground hover:bg-secondary inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Open in tab</span>
              </a>
              <a
                href={selectedResume.url}
                download={selectedResume.fileName}
                className="bg-primary text-primary-foreground inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close preview"
                className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          </div>

          {/* Scrollable page stack */}
          {open && <PdfModalBody url={selectedResume.url} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Measures its own width so the rendered pages fill the modal nicely. */
function PdfModalBody({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cap the page width so it stays comfortable to read on very wide screens.
  const pageWidth = Math.min(Math.max(width - 48, 280), 1000);

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto bg-neutral-100 px-4 py-6 dark:bg-neutral-900"
    >
      {width > 0 && (
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          }
        >
          <PdfViewer url={url} width={pageWidth} />
        </Suspense>
      )}
    </div>
  );
}

export default Resume;
