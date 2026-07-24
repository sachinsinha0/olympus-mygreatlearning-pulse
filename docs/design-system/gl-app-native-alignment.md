# Design-System Alignment — matching `gl-app-native` (production)

**Date:** 2026-07-24
**Purpose:** Bring this prototype's visual language as close as possible to the production app (`gl-app-native`) **without changing our tech stack** (we stay on Vite + React + MUI; prod is React Native + Tamagui via `@gl/elements`). This doc is the reference for every design decision in the prototype.

## Source of truth

Production design system lives in `packages/elements/src/theme/` of `gl-app-native`:

| Prod file | What it defines |
|-----------|-----------------|
| `colors/blue-theme.ts` | Default (brand) Material 3 color roles — `light` + `dark` |
| `colors/custom-colors.ts` | Extended tones (teal, indigo, deepOrange, …) shared across themes |
| `theme/fonts.ts` | Inter type scale (mobile + desktop) |
| `theme/tokens.ts` | Spacing (`$1`=8px…), radius (`4`/`8`) |
| `components/{button,container,chip}.tsx` | Component variant semantics |
| `.claude/rules/design-system-rules.md` | Curated component/token usage guide |

**Key fact:** our [`src/theme/tokens.ts`](../../src/theme/tokens.ts) was already seeded from the same `magna-theme.json` (Material 3). Brand color, containers, extended tones, and the Inter desktop scale already match prod. This doc captures the *system* and the handful of corrections that close the remaining gaps.

## Color roles (Material 3) — light / dark

Brand is **blue** (`primary #0054d6`). Prod uses the standard M3 role names; we expose them through the MUI palette.

| M3 role | Light | Dark | MUI mapping (ours) |
|---------|-------|------|--------------------|
| `primary` | `#0054d6` | `#b3c5ff` | `palette.primary.main` |
| `onPrimary` | `#ffffff` | `#002b75` | `palette.primary.contrastText` |
| `primaryContainer` | `#dae1ff` | `#003fa4` | `palette.primary.light` |
| `onPrimaryContainer` | `#001849` | `#dae1ff` | `palette.primary.dark` |
| `secondary` | `#3a3bff` | `#c0c1ff` | `palette.secondary.*` |
| `error` | `#ba1a17` | `#ffb4aa` | `palette.error.*` |
| `background` (page) | `#fdfbff` | `#1a1b1e` | — |
| `background2` (backdrop behind cards) | `#f2f4f7` | `#1a1b1e` | `palette.background.default` |
| `surface` | `#faf9fd` | `#121316` | `palette.surface.main` |
| `onSurface` (primary text) | `#1a1b1e` | `#e3e2e6` | `palette.text.primary` |
| `onSurfaceVariant` (secondary text) | `#45464f` | `#c5c6d0` | `palette.text.secondary` |
| `outline` | `#757680` | `#8f909a` | — |
| `outlineVariant` (borders/dividers) | `#ebebef` | `#2f3033` | `palette.outlineVariant.main`, `divider` |
| `surfaceContainerLowest` (**card bg**) | `#ffffff` | `#0d0e11` | `palette.surfaceContainer.lowest`, `background.paper` |
| `surfaceContainerLow` | `#f4f3f7` | `#1a1b1e` | `palette.surfaceContainer.low` |
| `surfaceContainer` | `#efedf1` | `#1e1f23` | `palette.surfaceContainer.main` |
| `surfaceContainerHigh` | `#e9e7ec` | `#292a2d` | `palette.surfaceContainer.high` |
| `surfaceContainerHighest` | `#e3e2e6` | `#343538` | `palette.surfaceContainer.highest` |

> **Scale direction:** `Lowest = #ffffff` … `Highest = #e3e2e6` (light). Cards use **Lowest** (white). Our light scale had been inverted and is corrected as part of this alignment.

State-layer opacities exist for every role as `…Opacity8P/12P/16P` (e.g. `primaryOpacity16P = #0054d629`) — used for hover/press tints.

### Extended tones (shared across themes)

Each tone has `color` / `onColor` / `colorContainer` / `onColorContainer`. Exposed as `palette.extended.<tone>` (`.color`, `.colorContainer`, …). Used for colored icon tiles, stats, and accents.

`teal · cyan · lightBlue · indigo · deepPurple · purple · pink · rose · warning · success · yellow · amber · orange · deepOrange · lime · lightGreen · green`

e.g. `deepOrange`: color `#b02f00`, container `#ffdbd1` (the "hands-on" accent used in Learning Journey stats).

## Typography — Inter

Prod defines a **mobile** and **desktop** scale ([`fonts.ts`](../../../gl-app-native/packages/elements/src/theme/fonts.ts)). On web we use the **desktop** scale. All variants are Inter.

| Variant | Size | Weight | Line-height (desktop) | Letter-spacing | Default color |
|---------|------|--------|-----------------------|----------------|---------------|
| `h1` | 32 | 600 | 36 | −0.4 | onSurface |
| `h2` | 28 | 600 | 32 | −0.4 | onSurface |
| `h3` | 24 | 600 | 28 | −0.4 | onSurface |
| `h4` | 20 | 600 | 24 | −0.4 | onSurface |
| `h5` | 18 | 600 | 24 | −0.4 | onSurface |
| `subtitle1` | 16 | 500 | 28 | 0 | onSurface |
| `subtitle2` | 14 | 500 | 24 | 0 | onSurface |
| `body1` | 16 | 400 | 24 | 0 | onSurfaceVariant |
| `body2` | 14 | 400 | 20 | 0 | onSurfaceVariant |
| `caption1` | 12 | 400 | 16 | −0.2 | onSurfaceVariant |
| `caption2` | 12 | 400 | 16 | −0.2 | onSurfaceVariant |
| `overline` | 10 | 600 | 16 | 1.2 · UPPERCASE | onSurface |
| `button` | 14 (md) | 500 | 20 | 0.4 | — |

(Our [`theme.ts`](../../src/theme/theme.ts) typography already mirrors this.)

## Spacing & radius

- **Spacing:** 8px grid. Tamagui `$1`=8, `$2`=16, `$3`=24, `$4`=32, `$6`=48. Use MUI `spacing`/`gap` on the 8px grid; always prefer `gap` over margins between children.
- **Radius:** prod tokens are small — `radius.true = 8`, `radius.0.5 = 4`. **Cards/containers = 8px.** Buttons = 8px. Pills/chips = fully rounded.

## Components — variant semantics

### Button (`@gl/elements`)
Radius 8, weight 500, letter-spacing 0.4, `textTransform: none`. Sizes: sm/md/lg/xl (md default; md padding ≈ 14×5px).

| Variant | Background | Border | Text | Our usage |
|---------|-----------|--------|------|-----------|
| `contained` | `primary` (solid) | none | `onPrimary` | Highest-emphasis CTA |
| `tonal` | `primaryContainer #dae1ff` | none | **`onPrimaryContainer #001849`** (navy) | Soft primary — e.g. "Start Learning" |
| `outlined` | transparent | **`outlineVariant` gray** | `primary` (blue) | Secondary — e.g. "Try the hands-on demo" |
| `text` | transparent | none | `primary` | Lowest-emphasis |

Hover/press use the role's state-layer opacities (`…Opacity8P/16P`).

> **MUI note:** MUI has no `tonal` variant. We emulate tonal inline (bg `primary.light`, text `primary.dark`). Our `outlined` override already uses the gray `outlineVariant` border — matching prod.

### Container / Card
`<Container container="lowest" outlined padding="$3">` → white bg (`surfaceContainerLowest`), 1px `outlineVariant` border, radius 8. Shadow variant available (`shadow="sm"`) but bordered-flat is the default card look. → our `MuiCard`: bg `surfaceContainer.lowest`, 1px `outlineVariant` border, radius **8**, elevation 0.

### Selector primitives (don't mix)
- **`Tabs`** — underline indicator; switch between content panels.
- **`SegmentedControl`** — pill toggle; filter the *same* content (e.g. All/Month/Week).
- **`Chip`** — filled/outlined tags; multi-select/removable filters.

### Avatars
Circular, initials fallback on `primaryContainer`. Sizes by context: 32 (replies), 36 (sidebar), 40 (cards), 44 (detail headers), 72 (profile).

## Responsive breakpoints (prod)

`sm 600 · md 768 · tablet 1024 · lg 1280 · xl 1536`; main mobile/desktop split at **lg (1280)**. Our prototype lifts `md`→1024 so tablet renders the mobile UI. Use MUI breakpoints accordingly.

## Corrections applied in this alignment pass

1. **`surfaceContainer` light scale** un-inverted (Lowest=`#ffffff` … Highest=`#e3e2e6`).
2. **Page backdrop** → `background.default = #f2f4f7` (was near-white) so white cards read as cards.
3. **`background.paper`** and **`MuiCard` bg** → `surfaceContainerLowest` (white).
4. **Card radius** 12 → **8** to match prod containers.
5. **Tonal button** text → `onPrimaryContainer` navy `#001849` (was blue).
6. **Outlined button** → gray `outlineVariant` border + blue text (prod `outlined` convention).
7. **Button** letter-spacing normalized toward prod (0.4).
