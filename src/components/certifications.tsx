"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Certificate PDFs hosted on Lovable Assets CDN (filenames with spaces 404 in production)
import agenticAiPdf from "@/assets/certificates/Agentic-AI-Essential-Concepts-for-builders.pdf.asset.json";
import campusFoundersPdf from "@/assets/certificates/Campus-Founders.pdf.asset.json";
import ciscoPdf from "@/assets/certificates/Cisco-IT-Essentials.pdf.asset.json";
import googlePdf from "@/assets/certificates/Google.pdf.asset.json";
import harvardPdf from "@/assets/certificates/Harvard-CS50X.pdf.asset.json";
import mckinseyPdf from "@/assets/certificates/McKinsey-Forward-Certificate.pdf.asset.json";
import metaPdf from "@/assets/certificates/Meta.pdf.asset.json";
import pmePdf from "@/assets/certificates/Product-Management-Essentials.pdf.asset.json";
import upennPdf from "@/assets/certificates/Upenn.pdf.asset.json";

// Issuer logos hosted on CDN (root-level filenames with spaces 404 in production)
import googleLogo from "@/assets/logos/Google-Logo.png.asset.json";
import harvardLogo from "@/assets/logos/Harvard-Logo.png.asset.json";
import mckinseyLogo from "@/assets/logos/Mckinsey-logo.webp.asset.json";
import whartonLogo from "@/assets/logos/Wharton-Logo.png.asset.json";

const PdfViewer = lazy(() => import("./pdf-document").then((m) => ({ default: m.PdfViewer })));

interface Certification {
  title: string;
  issuer: string;
  monogram: string; // 1–3 letters shown if no logo is set (or the logo fails to load)
  logo?: string; // path under /public to the issuer's logo
  logoFit?: "cover" | "contain"; // "cover" for full-bleed brand tiles, "contain" (default) for icon glyphs needing padding
  issued: string; // e.g. "Issued 2022"
  fileName: string; // PDF in /public/Certificates/
  verifyUrl?: string; // public verification link, shown inside the preview
  previewPages?: number; // cap pages rendered (for files that bundle extra pages)
}

/* ----------------------------------------------------------------------------
 * Real certificates. Each PDF lives in public/Certificates/ and opens in a
 * preview modal when "Verify" is clicked. `verifyUrl` adds an external
 * "Verify online" link inside the modal where a public one exists.
 * -------------------------------------------------------------------------- */
const certifications: Certification[] = [
  {
    title: "CS50x: Introduction to Computer Science",
    issuer: "Harvard University",
    monogram: "H",
    logo: "/Harvard Logo.png",
    logoFit: "cover",
    issued: "Issued 2020",
    fileName: "Harvard CS50X.pdf",
    verifyUrl: "https://cs50.harvard.edu/certificates/9f494512-2109-462d-8712-a539e9aa9e49",
  },
  {
    title: "Agentic AI: Essential Concepts for Builders",
    issuer: "Amazon · Machine Learning University",
    monogram: "AWS",
    logo: "/Logos/amazon.png",
    logoFit: "cover",
    issued: "Issued 2025",
    fileName: "Agentic AI   Essential Concepts for builders.pdf",
  },
  {
    title: "Product Management Essentials",
    issuer: "Amazon",
    monogram: "A",
    logo: "/Logos/amazon.png",
    logoFit: "cover",
    issued: "Issued 2025",
    fileName: "Product Management Essentials.pdf",
  },
  {
    title: "McKinsey.org Forward Program",
    issuer: "McKinsey.org",
    monogram: "McK",
    logo: "/Mckinsey logo.webp",
    logoFit: "cover",
    issued: "Issued 2025",
    fileName: "McKinsey Forward Certificate.pdf",
  },
  {
    title: "Foundations of Project Management",
    issuer: "Google · Coursera",
    monogram: "G",
    logo: "/Google Logo.png",
    logoFit: "cover",
    issued: "Issued 2022",
    fileName: "Google.pdf",
    verifyUrl: "https://coursera.org/verify/3XRK8UWBQZCD",
  },
  {
    title: "Introduction to Marketing",
    issuer: "Wharton · UPenn · Coursera",
    monogram: "W",
    logo: "/Wharton Logo.png",
    logoFit: "cover",
    issued: "Issued 2023",
    fileName: "Upenn.pdf",
    verifyUrl: "https://coursera.org/verify/DALA9UPPCVVL",
  },
  {
    title: "Introduction to Social Media Marketing",
    issuer: "Meta · Coursera",
    monogram: "M",
    logo: "/Logos/meta.svg",
    issued: "Issued 2023",
    fileName: "Meta.pdf",
    verifyUrl: "https://coursera.org/verify/H7RPX34LHWPV",
  },
  {
    title: "IT Essentials",
    issuer: "Cisco Networking Academy",
    monogram: "C",
    logo: "/Logos/cisco.svg",
    issued: "Issued 2023",
    fileName: "Cisco IT Essentials.pdf",
  },
  {
    title: "Corporate Campus Challenge",
    issuer: "Campus Founders",
    monogram: "CF",
    logo: "/Logos/campusfounders.png",
    logoFit: "cover",
    issued: "Issued 2024",
    fileName: "Campus Founders.pdf",
    previewPages: 1, // file bundles several certs; page 1 is the relevant one
  },
];

const certUrl = (fileName: string) => `/Certificates/${encodeURIComponent(fileName)}`;

function CertificationRow({ cert, onVerify }: { cert: Certification; onVerify: () => void }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = cert.logo && !logoFailed;

  return (
    <button
      type="button"
      onClick={onVerify}
      aria-label={`Preview ${cert.title}`}
      className="group flex w-full items-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-4 py-3.5 text-left transition-all duration-200 hover:border-black/15 hover:shadow-[0_2px_14px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.06]"
    >
      {/* Issuer tile — real logo when available, monogram fallback otherwise */}
      {showLogo ? (
        <div
          className={`h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-black/[0.06] dark:ring-white/15 ${
            cert.logoFit === "cover" ? "" : "flex items-center justify-center bg-white p-1.5"
          }`}
        >
          <img
            src={cert.logo}
            alt={cert.issuer}
            className={
              cert.logoFit === "cover"
                ? "h-full w-full object-cover"
                : "h-full w-full object-contain"
            }
            onError={() => setLogoFailed(true)}
          />
        </div>
      ) : (
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-[13px] font-semibold tracking-tight text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
          {cert.monogram}
        </div>
      )}

      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {cert.title}
          </span>
          <BadgeCheck className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-500" />
        </div>
        <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="truncate">{cert.issuer}</span>
          <span className="opacity-40">·</span>
          <span className="whitespace-nowrap">{cert.issued}</span>
        </div>
      </div>

      {/* Trailing affordance */}
      <span className="ml-1 flex flex-shrink-0 items-center gap-1 text-xs font-medium text-neutral-400 transition-colors group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-100">
        <Eye className="h-3.5 w-3.5" />
        Verify
      </span>
    </button>
  );
}

export function Certifications() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // pdf.js is client-only, so don't render it until after mount (avoids SSR).
  useEffect(() => setMounted(true), []);

  const selected = selectedIndex !== null ? certifications[selectedIndex] : null;
  const hasPrev = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < certifications.length - 1;
  const goPrev = () => hasPrev && setSelectedIndex((i) => (i as number) - 1);
  const goNext = () => hasNext && setSelectedIndex((i) => (i as number) + 1);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((i) => (i !== null && i < certifications.length - 1 ? i + 1 : i));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
          <ShieldCheck className="text-foreground h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-foreground text-xl font-semibold md:text-2xl">Certifications</h2>
          <p className="text-muted-foreground text-sm">
            Click any credential to preview the certificate
          </p>
        </div>
        <span className="text-muted-foreground hidden flex-shrink-0 items-center gap-1.5 rounded-full border border-black/[0.08] px-3 py-1 text-xs font-medium sm:flex dark:border-white/10">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
          {certifications.length} verified
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
          >
            <CertificationRow cert={cert} onVerify={() => setSelectedIndex(i)} />
          </motion.div>
        ))}
      </div>

      {/* Preview modal: full certificate floating over the chat */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="flex h-[92vh] w-[94vw] max-w-[1200px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1200px]">
          {selected && (
            <>
              <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                  <DialogTitle className="truncate text-base">{selected.title}</DialogTitle>
                  <p className="text-muted-foreground truncate text-xs">{selected.issuer}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.verifyUrl && (
                    <a
                      href={selected.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="border-border bg-background text-foreground hover:bg-secondary inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Verify online</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(null)}
                    aria-label="Close preview"
                    className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>
              </div>

              {/* Scrollable page stack */}
              {mounted && (
                <PdfModalBody url={certUrl(selected.fileName)} maxPages={selected.previewPages} />
              )}

              {/* Floating prev/next — switch certificates without closing the modal */}
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasPrev}
                aria-label="Previous certificate"
                className="bg-background/90 text-foreground hover:bg-secondary absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.08] shadow-md backdrop-blur-sm transition-colors disabled:pointer-events-none disabled:opacity-30 dark:border-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext}
                aria-label="Next certificate"
                className="bg-background/90 text-foreground hover:bg-secondary absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.08] shadow-md backdrop-blur-sm transition-colors disabled:pointer-events-none disabled:opacity-30 dark:border-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Measures its own width so the rendered pages fill the modal nicely. */
function PdfModalBody({ url, maxPages }: { url: string; maxPages?: number }) {
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
    <div ref={ref} className="flex-1 overflow-y-auto bg-neutral-100 px-4 py-6 dark:bg-neutral-900">
      {width > 0 && (
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          }
        >
          <PdfViewer url={url} width={pageWidth} maxPages={maxPages} />
        </Suspense>
      )}
    </div>
  );
}

export default Certifications;
