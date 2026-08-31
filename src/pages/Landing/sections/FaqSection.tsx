import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Minus, Plus } from "lucide-react";
import { GL } from "../landingTheme";
import { Section, SectionHeading } from "../parts";
import { FAQ } from "../content";

/**
 * The FAQ accordion.
 *
 * The rows are styled the same way as the module accordion on purpose, so the page
 * reads as one design. They are written out again here rather than shared, because
 * the two hold different content shapes and two small readable files beat one
 * component with a variant prop.
 */
export function FaqSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Section>
      <SectionHeading align="center">Frequently asked questions</SectionHeading>

      <Stack gap={1.25} sx={{ mt: 4, maxWidth: 900, mx: "auto" }}>
        {FAQ.map((item, i) => {
          const open = expanded === i;
          const panelId = `faq-panel-${i}`;

          return (
            <Box
              key={item.q}
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
                onClick={() => setExpanded(open ? null : i)}
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
                <Typography
                  component="span"
                  sx={{ fontSize: 16, fontWeight: 600, color: GL.heading }}
                >
                  {item.q}
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

              {open && (
                <Box id={panelId} sx={{ padding: "0 22px 22px" }}>
                  <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: GL.body }}>
                    {item.a}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>
    </Section>
  );
}

export default FaqSection;
