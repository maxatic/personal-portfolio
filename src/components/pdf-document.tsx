"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Bundle the pdf.js worker through Vite. This module is only ever imported on
// the client (lazy-loaded after mount), so pdf.js never executes during SSR.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Defined once so the Document doesn't reload on every render.
const PDF_VERSION = pdfjs.version;
const options = {
  cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_VERSION}/cmaps/`,
  standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_VERSION}/standard_fonts/`,
};

function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
    </div>
  );
}

/** Renders only the first page, sized to `width`, for use as a clean thumbnail. */
export function PdfThumbnail({ url, width }: { url: string; width: number }) {
  return (
    <Document
      file={url}
      options={options}
      loading={<Spinner className="h-full w-full" />}
      error={<Spinner className="h-full w-full" />}
      className="h-full w-full"
    >
      <Page
        pageNumber={1}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </Document>
  );
}

/**
 * Renders every page in a vertical stack, each sized to `width`.
 * Pass `maxPages` to cap how many pages render (e.g. when a file bundles
 * several documents and only the first page is relevant).
 */
export function PdfViewer({
  url,
  width,
  maxPages,
}: {
  url: string;
  width: number;
  maxPages?: number;
}) {
  const [numPages, setNumPages] = useState(0);
  const pagesToRender = maxPages ? Math.min(numPages, maxPages) : numPages;

  return (
    <Document
      file={url}
      options={options}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      loading={<Spinner className="py-20" />}
      error={
        <p className="text-muted-foreground py-20 text-center text-sm">
          Couldn't load the PDF. Try the download button instead.
        </p>
      }
      className="flex flex-col items-center gap-5"
    >
      {Array.from({ length: pagesToRender }, (_, i) => (
        <Page
          key={i}
          pageNumber={i + 1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="overflow-hidden rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.16)] ring-1 ring-black/10"
        />
      ))}
    </Document>
  );
}
