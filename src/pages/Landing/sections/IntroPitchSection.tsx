import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { AI_LABS, INTRO_PITCH, TOPICS } from "../content";

/**
 * The product's three slide onboarding pitch, staged as one section.
 *
 * A lead never sees the carousel at /pulse/intro, so its story lives here: what
 * Pulse is, how often it lands, what is inside. This is designed from the real
 * slides rather than from their text alone, which was the flaw in the first pass.
 *
 * What the slides actually do, and what is reproduced here:
 * - A soft blue wash behind the whole thing, not flat grey.
 * - The carousel's step labels, Release and What's inside, as eyebrows on a rule.
 *   Beat one carries none: it is the section's lead, set centred and larger, so the
 *   asymmetry is the hierarchy rather than an oversight.
 * - A pale "AI Pulse" kicker above the first title.
 * - Each beat carries a different payload: the lab logos on one, two stat cards on
 *   two, the topic chips on three. The first pass had all three as centred text and
 *   put the logos on the wrong beat.
 *
 * Two deliberate departures. The stat numbers are solid blue where the slide sets
 * them in a gradient, because gradient text is ruled out for this page. And the
 * carousel's 01/02/03 numbering is dropped, see StepMarker for why.
 */

/**
 * The carousel's step label on a rule.
 *
 * The carousel numbers these 01/02/03 because you step through it. Here the numbers
 * are dropped: the trial section further down already runs an 01/02/03 sequence for
 * its three actions, and two numbered sequences on one page read as related when
 * they are not. The trial keeps the numbers because its steps are a procedure with
 * an order; these are just labels.
 */
function StepMarker({ label }: { label: string }) {
  const rule = <Box sx={{ flex: 1, height: "1px", backgroundColor: GL.border }} />;
  return (
    <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: GL.body,
        }}
      >
        {label}
      </Typography>
      {rule}
    </Stack>
  );
}

function BeatTitle({ children, size = "beat" }: { children: ReactNode; size?: "lead" | "beat" }) {
  return (
    <Typography
      component="h2"
      sx={{
        fontSize: size === "lead" ? { xs: 26, md: 34 } : { xs: 22, md: 27 },
        fontWeight: 600,
        lineHeight: 1.28,
        letterSpacing: "-0.5px",
        color: GL.heading,
      }}
    >
      {children}
    </Typography>
  );
}

function BeatBody({ children, max = 560 }: { children: ReactNode; max?: number }) {
  return (
    <Typography sx={{ mt: 1.75, fontSize: 16, lineHeight: 1.6, color: GL.body, maxWidth: max }}>
      {children}
    </Typography>
  );
}

/** The slide's stat card: caption above, number and unit on one baseline. */
function StatCard({ caption, number, unit }: { caption: string; number: string; unit: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "#ffffff",
        border: `1px solid ${GL.border}`,
        borderRadius: "16px",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px rgba(16, 24, 40, 0.07)",
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: GL.body,
        }}
      >
        {caption}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 1.5 }}>
        <Typography
          sx={{
            fontSize: { xs: 44, md: 54 },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2px",
            // Solid blue. The slide uses a gradient fill, which this page rules out.
            color: GL.blue,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number}
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 600, color: GL.heading }}>
          {unit}
        </Typography>
      </Stack>
    </Box>
  );
}

export function IntroPitchSection() {
  const { welcome, release, inside } = INTRO_PITCH;

  return (
    <Box
      component="section"
      sx={{
        // The carousel's own wash, not flat grey. A background gradient, which the
        // product banner already establishes as product canon on this page.
        background: "linear-gradient(180deg, #F7F9FD 0%, #EEF2FA 52%, #F5F7FB 100%)",
        py: { xs: 7, md: 11 },
      }}
    >
      <ContentColumn>
        {/* BEAT ONE. What Pulse is, and the labs it covers. Centred, because this is
            the section's opening statement. */}
        <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 600,
              letterSpacing: "-0.5px",
              color: "#A8C4EE",
              lineHeight: 1.2,
            }}
          >
            {welcome.kicker}
          </Typography>
          <Typography
            component="h2"
            sx={{
              mt: 0.5,
              fontSize: { xs: 28, md: 38 },
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.7px",
              color: GL.heading,
            }}
          >
            {welcome.title}
          </Typography>
          <Typography sx={{ mt: 2, fontSize: 17, lineHeight: 1.6, color: GL.body }}>
            {welcome.body}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(10, 1fr)" },
            gap: { xs: 3, md: 2 },
            alignItems: "center",
            justifyItems: "center",
            maxWidth: 880,
            mx: "auto",
          }}
        >
          {AI_LABS.map((lab) => (
            <Box
              key={lab.slug}
              component="img"
              src={`/brand-logos/${lab.slug}.png`}
              alt={lab.label}
              loading="lazy"
              sx={{ width: 38, height: 38, objectFit: "contain", display: "block" }}
            />
          ))}
        </Box>

        {/* BEAT TWO. The cadence, with the slide's own two stat cards beside it. */}
        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "center",
          }}
        >
          <Box>
            <StepMarker label={release.label} />
            <BeatTitle>{release.title}</BeatTitle>
            <BeatBody>{release.body}</BeatBody>
          </Box>
          <Stack direction="row" gap={{ xs: 2, md: 2.5 }}>
            {release.stats.map((s) => (
              <StatCard key={s.caption} {...s} />
            ))}
          </Stack>
        </Box>

        {/* BEAT THREE. What is inside, with the topic chips the slide scrolls. These
            moved here from the modules section, where they were a second home for the
            same list.

            The payload sits on the LEFT here, mirroring beat two. Two splits in a row
            with the text always left would read as one repeated template; alternating
            is the editorial move and makes the pair feel composed. On phones the
            order swaps back so the text still introduces its own payload. */}
        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "center",
          }}
        >
          <Box sx={{ order: { xs: 2, md: 1 }, display: "flex", flexWrap: "wrap", gap: 1.25 }}>
            {TOPICS.map((topic) => (
              <Box
                key={topic}
                component="span"
                sx={{
                  backgroundColor: "#ffffff",
                  border: `1px solid ${GL.border}`,
                  borderRadius: "999px",
                  px: 1.75,
                  py: 0.75,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: GL.heading,
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                }}
              >
                {topic}
              </Box>
            ))}
          </Box>
          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <StepMarker label={inside.label} />
            <BeatTitle>{inside.title}</BeatTitle>
            <BeatBody>{inside.body}</BeatBody>
          </Box>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default IntroPitchSection;
