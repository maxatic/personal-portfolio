import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/design")({
  component: DesignSystem,
});

/* ----------------------------------------------------------------------------
 * Living design-system reference for the portfolio, styled in the ChatGPT /
 * OpenAI product language: neutral grayscale, hairline borders, flat surfaces,
 * generous radii, monochrome primary actions, the ChatGPT-green --brand accent
 * used sparingly. Open at /design. See DESIGN_SYSTEM.md for the written spec.
 * -------------------------------------------------------------------------- */

const colorTokens = [
  { name: "background", varName: "--background" },
  { name: "foreground", varName: "--foreground" },
  { name: "card", varName: "--card" },
  { name: "primary", varName: "--primary" },
  { name: "secondary", varName: "--secondary" },
  { name: "muted", varName: "--muted" },
  { name: "accent", varName: "--accent" },
  { name: "brand", varName: "--brand" },
  { name: "destructive", varName: "--destructive" },
  { name: "border", varName: "--border" },
];

const radii = [
  { name: "sm", cls: "rounded-sm" },
  { name: "md", cls: "rounded-md" },
  { name: "lg", cls: "rounded-lg" },
  { name: "xl", cls: "rounded-xl" },
  { name: "2xl", cls: "rounded-2xl" },
  { name: "full", cls: "rounded-full" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border border-t py-10">
      <div className="mb-6">
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function DesignSystem() {
  return (
    <div className="bg-background min-h-screen w-full">
      <div className="mx-auto w-full max-w-4xl px-5 py-14 font-sans md:px-8">
        {/* Header */}
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <h1 className="text-foreground text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-base">
          The component &amp; token system for this portfolio. It ships in two design
          languages — <span className="text-foreground font-medium">ChatGPT</span> (cool
          monochrome) and <span className="text-foreground font-medium">Anthropic</span> (warm
          editorial). Flip between them with the palette toggle, top-right; everything below
          re-themes live.
        </p>

        {/* Colors */}
        <Section
          title="Color tokens"
          description="Fully neutral grayscale. The only chromatic token is --brand (ChatGPT green), reserved for verified / success accents."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {colorTokens.map((t) => (
              <div key={t.name}>
                <div
                  className="border-border h-16 w-full rounded-lg border"
                  style={{ background: `var(${t.varName})` }}
                />
                <p className="text-foreground mt-2 text-xs font-medium">{t.name}</p>
                <p className="text-muted-foreground font-mono text-[11px]">{t.varName}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          description="Inter. Weights stay light — 500 for emphasis, 700 for display only. Sentence case throughout."
        >
          <div className="space-y-3">
            <p className="text-foreground text-4xl font-bold tracking-tight">
              Display — 36px / bold
            </p>
            <p className="text-foreground text-2xl font-semibold">Heading — 24px / semibold</p>
            <p className="text-foreground text-lg font-semibold">Subheading — 18px / semibold</p>
            <p className="text-foreground text-base">
              Body — 16px / regular. The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-muted-foreground text-sm">
              Muted — 14px. Secondary text and metadata.
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              Mono — 12px. Credential IDs, code, tokens.
            </p>
          </div>
        </Section>

        {/* Radii */}
        <Section
          title="Radius scale"
          description="Generous rounding. --radius is 0.75rem; cards use 2xl, pills use full."
        >
          <div className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <div key={r.name} className="text-center">
                <div className={`bg-secondary border-border h-16 w-16 border ${r.cls}`} />
                <p className="text-muted-foreground mt-2 text-xs">{r.name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section
          title="Buttons"
          description="Flat, no drop shadows. Primary is monochrome — near-black on light, white on dark."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button className="bg-brand text-brand-foreground hover:opacity-90" size="default">
              <BadgeCheck className="h-4 w-4" />
              Brand action
            </Button>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-brand/10 text-brand border-transparent">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          </div>
        </Section>

        {/* Form controls */}
        <Section
          title="Inputs"
          description="The composer is a pill; standard fields use the lg radius."
        >
          <div className="max-w-md space-y-3">
            <input
              type="text"
              placeholder="Standard input"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring/50 h-10 w-full rounded-lg border px-4 text-sm outline-none focus-visible:ring-[3px]"
            />
            <div className="border-input bg-background flex items-center gap-2 rounded-full border py-2 pr-2 pl-5">
              <input
                type="text"
                placeholder="Message…"
                className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                aria-label="Send"
                className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-90"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section
          title="Cards"
          description="Flat surfaces with a hairline border — no drop shadows."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>A bounded surface for grouped content.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Uses the card token, a 1px border, and the 2xl radius.
                </p>
              </CardContent>
            </Card>

            {/* Credential row — the OpenAI-style list item used by Certifications */}
            <div className="group border-border bg-card flex items-center gap-4 rounded-2xl border px-4 py-3.5">
              <div className="bg-secondary text-muted-foreground flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-semibold">
                PS
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground truncate text-sm font-semibold">
                    Professional Scrum Master™ I
                  </span>
                  <BadgeCheck className="text-brand h-4 w-4 flex-shrink-0" />
                </div>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  Scrum.org · Issued 2025
                </p>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground ml-1 flex flex-shrink-0 items-center gap-1 text-xs font-medium transition-colors">
                Verify
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
