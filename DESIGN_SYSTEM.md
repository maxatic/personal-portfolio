# Design System — ChatGPT / OpenAI language

This portfolio's UI follows the **ChatGPT / OpenAI product-design language**: neutral
grayscale, hairline borders, flat surfaces, generous radii, and monochrome primary
actions. The live reference is at **`/design`** ([design.tsx](src/routes/design.tsx)); the
tokens live in [styles.css](src/styles.css).

## Principles

1. **Monochrome first.** The interface is grayscale. Color is information, not decoration —
   the only chromatic token is `--brand` (ChatGPT green), reserved for verified / success
   accents, plus `--destructive` for errors.
2. **Flat, not glossy.** No drop shadows, gradients, or glows. Separation comes from a 1px
   hairline border and subtle background steps.
3. **Soft geometry.** Generous rounding — `--radius` is `0.75rem`. Cards are `rounded-2xl`,
   inputs/composers are pills (`rounded-full`), buttons are `rounded-lg`.
4. **Light weight, sentence case.** Inter, weight 500 for emphasis (700 for display only).
   Sentence case everywhere — never Title Case or ALL CAPS.
5. **Calm motion.** Short, eased transitions (~200–300ms). Nothing bounces for decoration.

## Tokens

All tokens are CSS variables in [styles.css](src/styles.css), exposed to Tailwind as
`bg-*`, `text-*`, `border-*` utilities. Always use the token, never a raw hex/oklch value —
that's what keeps light/dark mode correct.

| Token | Role | Light | Dark |
|---|---|---|---|
| `background` / `foreground` | page bg / primary text | white / near-black | `#1e1e1e` gray / `#ececec` |
| `card` / `card-foreground` | raised surface | white | `#2f2f2f` |
| `primary` / `primary-foreground` | **primary action** | near-black / white | white / near-black |
| `secondary`, `muted`, `accent` | quiet surfaces | `#f4f4f4`–`#f7f7f7` | `#353535`–`#4d4d4d` |
| `muted-foreground` | secondary text | `#757575` | `#b0b0b0` |
| `border` / `input` | hairlines | `#e5e5e5` | white @ 10–12% |
| `brand` / `brand-foreground` | verified / success accent | ChatGPT green | brightened green |
| `destructive` | errors / destructive actions | red | red |

Radius scale (from `--radius`): `rounded-sm` 8px · `rounded-md` 10px · `rounded-lg` 12px ·
`rounded-xl` 16px · `rounded-2xl` ~20px · `rounded-full` pill.

## Component conventions

- **Buttons** ([button.tsx](src/components/ui/button.tsx)) — `rounded-lg`, flat (no shadow).
  `default` = monochrome primary; `secondary`/`outline`/`ghost` for lower emphasis;
  `link` for inline. For a positive/brand CTA add `bg-brand text-brand-foreground`.
- **Cards** ([card.tsx](src/components/ui/card.tsx)) — `bg-card`, 1px `border`, `rounded-2xl`,
  `shadow-none`. Group content; don't nest cards inside cards.
- **Badges** ([badge.tsx](src/components/ui/badge.tsx)) — `rounded-md`. Use a soft
  `bg-brand/10 text-brand` tinted badge for "Verified"-style status.
- **List rows** (the OpenAI pattern, see [certifications.tsx](src/components/certifications.tsx)) —
  monogram tile (`bg-secondary`, `rounded-xl`) + title with a `text-brand` check + muted
  `issuer · date · id` line + trailing `Verify ↗`. Hairline border, hover lift only.
- **Inputs** — standard fields `rounded-lg` with `border-input`; the chat composer is a
  `rounded-full` pill with a circular monochrome send button.

## Do / don't

- ✅ `text-muted-foreground` for secondary text — ❌ `text-gray-500` (breaks dark mode).
- ✅ `bg-card border` for surfaces — ❌ `shadow-lg` cards.
- ✅ `--brand` for verified/success only — ❌ rainbow accent colors.
- ✅ sentence case labels — ❌ Title Case / ALL CAPS.

## Two design languages (toggle)

The site ships **two interchangeable design systems**, switched live by the palette
toggle (top-right, [design-toggle.tsx](src/components/design-toggle.tsx)) and persisted to
`localStorage("ds")`:

- **ChatGPT** (default) — cool, neutral grayscale; monochrome primary; green `--brand`.
- **Anthropic** — warm and editorial; ivory/cream surfaces, warm near-black text, the
  Anthropic **clay/rust** as both `--primary` and `--brand`, and tighter radii
  (`--radius` 0.5rem). Activated by the `.ds-anthropic` class on `<html>`.

Both are pure **token swaps** — same components, same markup. The Anthropic tokens live in
`.ds-anthropic` / `.dark.ds-anthropic` blocks in [styles.css](src/styles.css), placed after
the ChatGPT tokens so the class wins on equal specificity. Because every component reads
semantic tokens, nothing else needs to change to re-theme — which is the whole point of
keeping raw colors out of components.

## Syncing to Claude Design

This system can be pushed to **claude.ai/design** via `/design-sync` so Claude's design
agent builds with these real components. That requires an interactive `/login` with a
claude.ai account that has design access (a `CLAUDE_CODE_OAUTH_TOKEN` session cannot get
the scopes). Run `/login`, then `/design-sync`.
