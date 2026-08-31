import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Minus, Plus } from "lucide-react";
import { GL } from "../landingTheme";
import { CheckList, Lede, Section, SectionHeading } from "../parts";
import { TrialRailCard } from "./TrialRailCard";
import { RAIL_GUTTER } from "./TrialRailRegion";
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
 * The list runs in chronological order and shows every released module. It reads as a
 * curriculum, which is why it counts upward rather than newest first like /pulse does.
 * Nothing is held back behind a "view all", because the newest module is the strongest
 * thing on the page and a chronological list would have buried it at the bottom of the
 * hidden half.
 */
export function ModulesSection() {
  const unit = useUnitLabel();
  const { modules, total } = useMemo(
    () => selectLandingModules(issuesData as PulseIssue[]),
    [],
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Section py={{ xs: 6, md: 9 }}>
      {/* From lg up the trial card floats over the right of this section, so the
          heading and the accordion centre inside what is left rather than under it. */}
      <Box sx={{ pr: { lg: `${RAIL_GUTTER}px` } }}>
      <SectionHeading align="center">What is inside AI Pulse?</SectionHeading>

      <Box sx={{ mt: 2 }}>
        <Lede align="center">
          {`${total} modules are live right now. A new one lands every two weeks.`}
        </Lede>
      </Box>

      <Stack gap={1.25} sx={{ mt: 4, maxWidth: 900, mx: "auto" }}>
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
