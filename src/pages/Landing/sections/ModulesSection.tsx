import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CalendarClock } from "lucide-react";
import { GL } from "../landingTheme";
import { AccordionRow, CheckList, Section, SectionHeading } from "../parts";
import { MODULES_HEADING, MODULES_NEXT } from "../content";
import { selectLandingModules } from "../../../lib/pulse/landingModules";
import { useUnitLabel } from "../../../lib/pulse/terminology";
import type { PulseIssue } from "../../../lib/pulse/types";
import issuesData from "../../../mocks/pulse-issues.json";

/**
 * The module accordion, built from the same mock file /pulse reads.
 *
 * Row titles use the product's own numbering, so a row here matches what the lead
 * sees once they log in.
 *
 * The list runs in chronological order and shows the first eight. It reads as a
 * curriculum, which is why it counts upward rather than newest first like /pulse does,
 * and why it starts at Module 01 rather than at whatever the eight most recent happen
 * to begin with.
 *
 * No trial card in a rail beside it any more, so the heading and the list share one
 * centred block. Flush left would leave a void where the card used to be, and the
 * heading centres over the block the way the FAQ's does.
 *
 * No count above the list. It used to read "11 modules are live right now, here are
 * the first 8", which spent the reader's attention on arithmetic about a list they
 * can see. What they cannot see is that it keeps growing, so that goes at the end
 * instead, as the row the list closes on.
 */
export function ModulesSection() {
  const unit = useUnitLabel();
  const { modules } = useMemo(
    () => selectLandingModules(issuesData as PulseIssue[]),
    [],
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Section py={{ xs: 6, md: 9 }}>
      {/* Heading and list in one 900px block, centred on the grid. The cap is there
          because a row is a title and a plus, and stretched to the full 1280 the plus
          ends up a long way from the words it belongs to. */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <SectionHeading align="center">{MODULES_HEADING}</SectionHeading>

      <Stack gap={1.25} sx={{ mt: { xs: 4, md: 5 } }}>
        {modules.map((issue) => {
          const open = expanded === issue.id;
          const panelId = `module-panel-${issue.id}`;
          const minutes = issue.handsOnMinutes
            ? `${issue.learningMinutes} min learning · ${issue.handsOnMinutes} min hands-on`
            : `${issue.learningMinutes} min learning`;

          return (
            <AccordionRow
              key={issue.id}
              title={`${unit.numbered(issue.issueNumber)}: ${issue.title}`}
              open={open}
              onToggle={() => setExpanded(open ? null : issue.id)}
              panelId={panelId}
            >
              <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: GL.body }}>
                {issue.description}
              </Typography>

              <Box sx={{ mt: 2.5 }}>
                <CheckList items={issue.outcomes} dense />
              </Box>

              <Typography sx={{ fontSize: 14, color: GL.body, mt: 2.5 }}>{minutes}</Typography>

              {issue.toolName && (
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: GL.body,
                    }}
                  >
                    Tool
                  </Typography>
                  {issue.toolLogo && (
                    <Box
                      component="img"
                      src={issue.toolLogo}
                      alt=""
                      sx={{ height: 22, width: 22, objectFit: "contain" }}
                    />
                  )}
                  <Typography
                    component="span"
                    sx={{ fontSize: 14, fontWeight: 500, color: GL.heading }}
                  >
                    {issue.toolName}
                  </Typography>
                </Box>
              )}
            </AccordionRow>
          );
        })}

        {/* The list closes on what has not landed yet. Dashed and grey read as an
            unfinished card sitting after eight finished ones, so it is a solid tinted
            one instead, in the blue the highlighted stat card already uses.

            Both lines sit on one row from sm up, which keeps it shorter than the rows
            above it. It is a note on the list rather than another entry in it, so it
            should not take more room than the entries do. On phones only the text
            wraps; the icon stays beside it, because dropping it onto its own line
            costs a whole row of height to say nothing. */}
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            mt: 1,
            backgroundColor: "#F1F6FE",
            border: "1px solid rgba(25, 106, 229, 0.22)",
            borderRadius: "8px",
            padding: "16px 22px",
          }}
        >
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "999px",
              backgroundColor: GL.blue,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarClock size={17} />
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "baseline" }}
            gap={{ xs: 0.25, sm: 1.5 }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: GL.heading }}>
              {MODULES_NEXT.title}
            </Typography>
            <Typography sx={{ fontSize: 14, color: GL.body }}>{MODULES_NEXT.body}</Typography>
          </Stack>
        </Stack>
      </Stack>

      </Box>
    </Section>
  );
}

export default ModulesSection;
