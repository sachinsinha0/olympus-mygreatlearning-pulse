import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CalendarClock, Minus, Plus } from "lucide-react";
import { GL } from "../landingTheme";
import { CheckList, Section, SectionHeading } from "../parts";
import { TrialRailCard } from "./TrialRailCard";
import { RAIL_GUTTER } from "./TrialRailRegion";
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
      {/* From lg up the trial card floats over the right of this section, so the
          heading and the accordion centre inside what is left rather than under it. */}
      <Box sx={{ pr: { lg: `${RAIL_GUTTER}px` } }}>
      <SectionHeading align="center">{MODULES_HEADING}</SectionHeading>

      <Stack gap={1.25} sx={{ mt: { xs: 4, md: 5 }, maxWidth: 900, mx: "auto" }}>
        {modules.map((issue) => {
          const open = expanded === issue.id;
          const panelId = `module-panel-${issue.id}`;
          const minutes = issue.handsOnMinutes
            ? `${issue.learningMinutes} min learning · ${issue.handsOnMinutes} min hands-on`
            : `${issue.learningMinutes} min learning`;

          return (
            <Box
              key={issue.id}
              sx={{
                border: `1px solid ${GL.border}`,
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
                overflow: "hidden",
              }}
            >
              <Box
                component="button"
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setExpanded(open ? null : issue.id)}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  padding: "20px 22px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <Typography component="span" sx={{ fontSize: 16, fontWeight: 600, color: GL.heading }}>
                  {`${unit.numbered(issue.issueNumber)}: ${issue.title}`}
                </Typography>
                <Box
                  aria-hidden
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "999px",
                    backgroundColor: "#F2F4F7",
                    color: GL.heading,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {open ? <Minus size={16} /> : <Plus size={16} />}
                </Box>
              </Box>

              {/* Rendered whether open or not, and hidden with the attribute. A button
                  whose aria-controls points at an id that is not in the document reads
                  as a broken reference to some assistive tech. */}
              <Box id={panelId} hidden={!open} sx={{ padding: "0 22px 22px" }}>
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
              </Box>
            </Box>
          );
        })}

        {/* The list closes on what has not landed yet. Dashed and with no control on
            it, because there is nothing here to open, and the icon sits left where
            every other row has its control on the right, so it is not mistaken for
            a ninth module. */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: "1px dashed #D0D5DD",
            borderRadius: "8px",
            padding: "20px 22px",
          }}
        >
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "999px",
              border: "1px dashed #D0D5DD",
              color: GL.body,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarClock size={16} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: GL.heading }}>
              {MODULES_NEXT.title}
            </Typography>
            <Typography sx={{ fontSize: 14, color: GL.body, mt: 0.25 }}>
              {MODULES_NEXT.body}
            </Typography>
          </Box>
        </Box>
      </Stack>

      </Box>

      {/* The card once for phones and tablets. From lg up TrialRailRegion's sticky
          copy is the one that shows, so it never appears twice. */}
      <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center", mt: 6 }}>
        <TrialRailCard />
      </Box>
    </Section>
  );
}

export default ModulesSection;
