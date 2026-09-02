import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { AccordionRow, Section, SectionHeading } from "../parts";
import { FAQ } from "../content";

/**
 * The FAQ accordion.
 *
 * The rows are AccordionRow, the same component the module list uses, so the two
 * cannot drift apart again. They were written out separately until the module rows
 * gained hover and focus states and these silently did not.
 */
export function FaqSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Section>
      <SectionHeading align="center">Frequently asked questions</SectionHeading>

      <Stack gap={1.25} sx={{ mt: 4, maxWidth: 900, mx: "auto" }}>
        {FAQ.map((item, i) => {
          const open = expanded === i;
          return (
            <AccordionRow
              key={item.q}
              title={item.q}
              open={open}
              onToggle={() => setExpanded(open ? null : i)}
              panelId={`faq-panel-${i}`}
            >
              <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: GL.body }}>
                {item.a}
              </Typography>
            </AccordionRow>
          );
        })}
      </Stack>
    </Section>
  );
}

export default FaqSection;
