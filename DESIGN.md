---
name: DOFI Agencia Creativa
description: Agencia creativa + CRM/IA (FENIAX) — dos superficies conviven a proposito, un lienzo oscuro de base y un lienzo claro para el frente de casa (Navbar, Hero, Banda de capacidades).
colors:
  brand: "#4B2A93"
  brand-lift: "#6D4BC9"
  accent: "#F47B20"
  accent-lift: "#FF9440"
  fg-on-accent: "#1A0F3D"
  canvas: "#FDFBF7"
  canvas-raised: "#F6F1EA"
  ink: "#1A0F3D"
  ink-muted: "#57516B"
  ink-subtle: "#6C6480"
  abyss: "#120A26"
  deep: "#1A0F3D"
  surface: "#241553"
  surface-2: "#2E1B68"
  foam: "#F4F0FE"
  mist: "#B3A5D4"
  mist-dim: "#948AB8"
  fog: "#cbd5e1"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 2rem + 3.05vw, 4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  pill: "9999px"
  card: "20px"
  field: "12px"
  media: "24px"
spacing:
  container-page: "1320px"
  container-copy: "560px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.fg-on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-lift}"
  button-ghost-on-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  nav-pill-active:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand}"
    rounded: "{rounded.pill}"
---

# Design System: DOFI Agencia Creativa

## Overview

**Creative North Star: "Un Mar de Ideas, en dos mareas."**

DOFI's shipped system is deliberately two surfaces, not one. The historical base — Services, Process, Manifesto, Tools, Socio, Contact, Footer, LogoWall, Clients — is a single locked dark atmosphere (`Tema bloqueado: DARK`, per its own globals.css header): deep purple abyss, one orange accent, no exceptions. Layered on top of that base, the front-of-house triplet (Navbar, Hero, Banda de capacidades) was rebuilt onto a warm-white canvas, so the visitor's *first* impression is light while the *rest* of the site stays in its original dark register. This split is a shipped, intentional migration boundary (confirmed by the codebase's own comments), not an inconsistency to smooth over.

Both surfaces share the same two brand hues — DOFI purple and DOFI orange — so the accent vocabulary never forks: only the roles of background and text invert between them. On dark, purple is a surface tone and orange is the one accent against near-white text. On light, purple becomes the ink and a soft interactive tint; orange remains the sole call-to-action color, unchanged in hex on either surface.

Motion across both surfaces is restrained and functional: entrance-only transforms (never opacity, to protect LCP on the H1), CSS-driven infinite float on hero text/CTA, and hover treatments that change color or opacity — never scale, tilt, or rotate a card. A prior cursor-tracking spotlight technique on the capability cards was removed outright and replaced with a plain chromatic hover; that removal is now a hard rule, not a lingering technique to revive.

**Key Characteristics:**
- Two coexisting surfaces (dark base, light front-of-house) sharing one accent vocabulary, never blended into a hybrid gray-brand palette.
- Orange (`#F47B20`) is the only actionable accent on either surface; purple is structural/textual, never itself a call-to-action fill.
- Pill-shaped interactive elements, 20px-radius cards, 12px-radius fields — one radius per role, not one radius for everything.
- Hover changes surface color/opacity only; transform is reserved for scroll-entrance and ambient float.
- Content-editable regions (Hero copy/image, capability cards) degrade to hardcoded fallbacks identical to what shipped before Sanity — the design never depends on the CMS being populated to look correct.

## Colors

The palette is a single purple+orange brand pair expressed twice: once as light-on-dark (the site's original register) and once as dark-on-light (the new front-of-house register). No third hue exists anywhere in either surface.

### Primary
- **DOFI Purple** (`#4B2A93`, `--color-brand`): the marca's structural hue. On dark it is a mid-depth surface/gradient tone; on light it becomes the ink color for headlines (`--color-ink` resolves to `--color-deep`, `#1A0F3D`) and the soft active-nav-pill fill. Never used as a button fill on either surface — buttons are always orange.
- **DOFI Purple Lift** (`#6D4BC9`, `--color-brand-lift`): the lighter step of the same hue, used in the capability-card hover gradient and as a "raised" accent tone alongside brand.

### Secondary
- **DOFI Orange** (`#F47B20`, `--color-accent`) / **Orange Lift** (`#FF9440`, `--color-accent-lift` on hover): the one call-to-action color across the entire site. Every primary button, every "Empecemos" CTA, and the capability-card hover gradient's warm terminus uses this pair, unchanged in hex whether the surface is dark or light.

### Neutral — Dark surface (site base)
- **Abyss** (`#120A26`, `--color-abyss`): default page background for every non-front-of-house section.
- **Deep** (`#1A0F3D`, `--color-deep`): elevated dark surface; doubles as `--color-ink` on the light surface (same hex, different role).
- **Surface / Surface 2** (`#241553` / `#2E1B68`): card and field backgrounds on dark.
- **Foam** (`#F4F0FE`): primary text on dark, 17.08:1 measured.
- **Mist** (`#B3A5D4`) / **Mist Dim** (`#948AB8`): muted and subtle text on dark, both calibrated to pass WCAG AA.
- **Fog** (`#cbd5e1`): a lighter secondary-text variant used only where extra contrast was explicitly requested (client cards, footer, contact form, nav-adjacent dark zones) — not a general replacement for mist.

### Neutral — Light surface (Navbar / Hero / Capabilities)
- **Canvas** (`#FDFBF7`, `--color-canvas`): the warm-white base of the front-of-house. Not pure white — it carries a warm cast to avoid a clinical, systemwide-generic white.
- **Canvas Raised** (`#F6F1EA`, `--color-canvas-raised`): image-slot/placeholder background one step up from canvas.
- **Ink** (`#1A0F3D`, measured 17.2:1 on canvas) / **Ink Muted** (`#57516B`, 7.3:1) / **Ink Subtle** (`#6C6480`, 5.4:1): the light-surface text ramp, all measured (not estimated) against `--color-canvas` and all ≥4.5:1 AA.
- **fg-on-accent** (`#1A0F3D`, 6.53:1 on accent): the text color inside any orange button, used identically on both surfaces.

### Named Rules
**The One Accent Rule.** Orange (`--color-accent`) is the only fill color a button or CTA ever takes, on either surface. Purple never fills an actionable element — it is structure, text, or a soft passive tint (nav-active pill, hover gradient), never a call-to-action background.

**The Surface-Locked Ink Rule.** `--color-deep` (`#1A0F3D`) is the single hex value that plays two roles: a dark *surface* on the site's base theme and the *ink* (text) color on the light front-of-house. This is intentional reuse, not two different tokens that happen to collide — do not introduce a second "light ink" hex.

## Typography

**Display Font:** Sora (variable, weights 300–800), self-hosted as a single woff2 file (no Google Fonts network call at build time)
**Body Font:** Geist Sans (via the official `geist/font/sans` package)

**Character:** Sora carries every headline, eyebrow/label, and button — geometric, confident, slightly wide-set at heavy weight (800). Geist Sans carries body paragraphs and stays neutral and highly legible underneath it, so the pairing reads as "one bold display voice over one quiet reading voice," never two competing display faces.

### Hierarchy
- **Display / H1** (weight 800, `clamp(2.75rem, 2rem + 3.05vw, 4rem)` / 44→64px, line-height 1, tracking -0.02em): the site's base H1 token. The rebuilt light Hero uses its own inline clamp (`clamp(2.75rem, 1.6rem + 4.5vw, 5.25rem)`, 44→84px) rather than this token — a wider, larger range purpose-built for the new 55/45 split layout. Both are evidenced in the shipped code; treat the Hero's inline value as the current H1 expression for that component, not a violation of the token.
- **Display / H1 Wide** (weight 800, `clamp(4.25rem, 0.25rem + 5vw, 4.75rem)` / 68→76px): a second, larger H1 tier for standalone statement layouts elsewhere on the dark site.
- **Body Large** (400, 18px, line-height 1.6): default paragraph size on dark; the light Hero's message paragraph uses the same 18px base, scaling to 20px (`text-xl`) at `md`.
- **Label / Eyebrow** (600, 12px, tracking 0.14em, uppercase, Sora): section labels and the light Hero's "marca" line beneath the H1.
- **Button** (600, 15px, line-height 1, Sora): all pill CTAs on both surfaces.

### Named Rules
**The Transform-Not-Opacity Rule.** The Hero's H1 and CTA never animate via opacity on entrance — only `transform: translateY(...)`, because the H1 is the LCP element and cannot render invisible. The `prefers-reduced-motion` media query freezes every animation at its final transform frame site-wide; no component needs its own reduced-motion branch for this.

## Layout

The page container is capped at **1320px** (`--container-page`), with a narrower **560px** copy column (`--container-copy`) reserved for dark-surface prose blocks. The light Hero breaks from a single-column stack into a **55/45 grid** (copy / image) at `lg`, `gap-14`; below `lg` it stacks to one column. The H1's clamp step exists specifically because at `xl` the layout jumps from single-column to the 7/5 split and the copy column narrows abruptly (1183px → 671px at the 1280px breakpoint) — the two-tier clamp was measured against that exact jump, not estimated.

The Banda de capacidades (4 cards, `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4`) overlaps the Hero's bottom edge by `-mt-10`/`-mt-14`, so the band visually reads as anchored to the hero rather than a separate section beginning below it.

The floating Nav sits inset from the viewport edge (`top-2`/`top-3`, horizontal padding scaling from 20px to 56px across breakpoints) rather than flush to the top — it is a floating panel with its own radius and border, never a bar pinned to the browser edge.

## Elevation & Depth

The system is flat by default on both surfaces. Dark-surface cards use tonal layering (abyss → deep → surface → surface-2) rather than shadows to convey depth. The light surface adds exactly one soft, non-neobrutalist shadow role: capability cards carry `box-shadow: 0 1px 2px rgba(26,15,61,0.06)` at rest — a near-imperceptible contact shadow, not a directional or hard-offset one. The Nav's glass panel conveys elevation through translucency and blur (`backdrop-blur-md`/`xl` over `bg-canvas/80–96`) rather than a shadow at all.

### Shadow Vocabulary
- **Card contact shadow** (`box-shadow: 0 1px 2px rgba(26,15,61,0.06)`): capability cards at rest, light surface only.
- **CTA lift shadow** (`box-shadow: 0 8px 24px -14px rgba(244,123,32,0.5)`): the one warm, diffuse shadow under an orange CTA in an isolated dark-surface context; ambient, not structural.

### Named Rules
**The No-Hard-Shadow Rule.** No component on either surface uses a hard-offset, unblurred shadow. Depth is conveyed through tonal layering (dark) or soft, low-opacity blur (light). A hard offset shadow would belong to a neobrutalist world DOFI does not use; the system's own soft-shadow evidence and tonal layering rule it out.

## Shapes

Three radii, one per interactive role, stated in the base stylesheet's own header comment: **pill** (`9999px`, `rounded-full`) for every button, nav link, and interactive capsule; **20px** (`--radius-card`) for cards (capability cards, hero image frame at 24px as a deliberate one-off for the larger media block); **12px** (`--radius-field`) for form inputs. Borders on the light surface are low-opacity purple tints (`border-brand/10`–`/25`) rather than solid neutral grays, so every hairline border still reads as brand-derived rather than generic UI chrome.

## Components

### Buttons
- **Shape:** pill (`border-radius: 9999px`), height 44–52px depending on context.
- **Primary:** `bg-accent` fill, `text-fg-on-accent` (`#1A0F3D`), `hover:bg-accent-lift`, `active:scale-[0.98]`. Identical treatment on dark and light surfaces — this is the one component whose color assignment never changes with surface.
- **Ghost / Secondary (light surface):** transparent fill, `border-brand/25` outline, `text-ink`, `hover:border-brand/50 hover:bg-brand/5`. Used for the Hero's secondary CTA ("Conoce lo que hacemos") alongside the primary orange button — DOFI's ghost button is always purple-bordered on light, never a second orange treatment.

### Cards / Containers
- **Corner Style:** 20px (capability cards), 24px (Hero image frame).
- **Background:** `--color-canvas` at rest; a full-bleed purple→orange diagonal gradient (`135deg`, brand → brand-lift 55% → accent 100%) cross-fades in via a `::before` pseudo-element opacity transition on hover — never a background-color swap on the card element itself, so the gradient never has to animate as a flat color.
- **Shadow Strategy:** see Elevation & Depth — soft contact shadow only, at rest and on hover alike.
- **Border:** `border-brand/10`, constant across states.
- **State discipline:** hover changes background/text color only (300ms `cubic-bezier(0.16,1,0.3,1)`); the card itself never translates, scales, or rotates. This replaces a removed cursor-tracking spotlight technique outright — do not reintroduce pointer-relative glow on cards.

### Navigation
- **Style:** floating glass panel, warm-white translucent (`bg-canvas/80` idle → `/92` scrolled → `/96` open), `backdrop-blur-md`/`xl`, `border-brand/10`–`/14`. Never a heavy opaque dark block on this surface.
- **Active state:** routing-driven (`usePathname()`, not scrollspy — DOFI is multi-page). A single shared-layout pill (`layoutId`) animates between links on route change, `tween` easing, no spring/overshoot. Active text is `text-pill-active-fg` (brand purple) on a `--color-pill-active-bg` fill (10% brand tint over canvas) — a soft tint, never a solid dark capsule.
- **Hover (non-active links):** CSS-only color and a weaker `bg-brand/6` tint; hover never touches the active-pill's `layoutId` or triggers layout animation.
- **Mobile treatment:** the panel expands full-width beneath the bar as one continuous flush-radius piece (shared `overflow-hidden` container with the topbar), not a separate fullscreen dialog; background/foreground content goes `inert` while open.

### Hero (signature component)
Split 55/45 layout (copy / image) on a warm-white canvas. All copy — title, brand line, message, both CTAs, and the four capability cards — is CMS-editable via Sanity with hardcoded fallbacks that match the last-approved copy exactly, so the section never renders visibly broken or empty pre-CMS. The image uses `object-position` computed client-side from a Sanity hotspot (`{x, y}`, 0–1) rather than a server-side crop, so the subject is never force-centered and the crop adapts per breakpoint. A single animated gradient layer (`hero-media-gradient`, white → translucent purple → translucent orange, 14s linear loop via `background-position` only) sits over the photo without ever moving or transforming the photo itself.

## Do's and Don'ts

### Do:
- **Do** treat orange (`#F47B20`/`#FF9440`) as the only fill color for any actionable button or CTA, on either surface.
- **Do** keep the pill / 20px-card / 12px-field radius roles distinct — don't collapse them into one generic `rounded-lg`.
- **Do** use tonal layering or soft (`≤0 1px 2px`, low-opacity) shadows for depth; never a hard, unblurred offset shadow.
- **Do** animate card hover as a color/opacity cross-fade on a `::before` layer, never as a `transform`.
- **Do** keep light-surface borders as low-opacity brand tints (`border-brand/10`–`/25`), not neutral gray.
- **Do** ship every CMS-driven region (Hero, capability cards) with a hardcoded fallback identical to the last-approved copy.

### Don't:
- **Don't** blend the two surfaces into a single "medium" palette. Dark sections (Services, Process, Manifesto, Tools, Socio, Contact, Footer, LogoWall, Clients) stay on the locked dark tokens; only Navbar, Hero, and the capability band use the light tokens. Extending light tokens to another dark section — or vice versa — is an unreviewed scope expansion, not a system rule.
- **Don't** reintroduce cursor-tracking spotlight/glow (`--mouse-x`/`--mouse-y`, radial mask following the pointer) on cards. It was built, then removed by explicit brief instruction; the chromatic hover is its permanent replacement.
- **Don't** use purple as a button fill. It is structural and textual only.
- **Don't** let a capability or Hero card gain `transform` on hover (scale, tilt, rotate, translate). Motion on hover is reserved for icon color and text color/opacity only.
