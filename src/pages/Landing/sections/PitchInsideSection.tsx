import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn, EyebrowRule } from "../parts";
import { INTRO_PITCH, TOPIC_ROWS } from "../content";

/**
 * Beat three of the onboarding pitch: what is actually inside.
 *
 * The slide scrolls the topic vocabulary past as pills, so the pills are this
 * section's payload. They used to sit under the module accordion, which gave the
 * same list two homes on one page.
 *
 * The pills are still, where the slide scrolls them. A scrolling row is a device for
 * a slide that a reader watches; on a page they are reading, eighteen words moving
 * sideways are eighteen words that are harder to read. So the interest here comes
 * from how the block is built rather than from movement.
 *
 * Three things do that work. The pills sit in a white panel, which gives the cluster
 * an edge on a grey ground and rhymes with the cards in the beat above. They run from
 * a flush left edge, so a short last line reads as a list that ended rather than a
 * word left stranded, which is what centring them did. And the product's two groups
 * stay two groups, so the block has a break in the middle rather than one long drift.
 *
 * Mirrored split, payload left and text right, so the pair of split sections does
 * not read as one repeated template. On phones the order swaps back, because a
 * heading should introduce its own payload rather than follow it.
 */

/**
 * A topic. Pale on the panel's white, which is the way round that lets eighteen of
 * them sit together without eighteen borders competing.
 *
 * Not hoverable and not clickable, because it is not a control. A hover state here
 * would promise a destination that does not exist.
 */
function TopicPill({ label }: { label: string }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        backgroundColor: "#F2F4F7",
        border: "1px solid #EAECF0",
        borderRadius: "999px",
        px: { xs: 1.75, md: 2 },
        py: { xs: 0.875, md: 1 },
        fontSize: { xs: 13.5, md: 15 },
        fontWeight: 500,
        lineHeight: 1.2,
        color: GL.heading,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}

export function PitchInsideSection() {
  const { label, title, body } = INTRO_PITCH.inside;

  return (
    <Box component="section" sx={{ bgcolor: GL.pale, py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              order: { xs: 2, md: 1 },
              backgroundColor: "#ffffff",
              border: `1px solid ${GL.border}`,
              borderRadius: "16px",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.08)",
              px: { xs: 2.5, md: 3.5 },
              py: { xs: 3.5, md: 4.5 },
            }}
          >
            {/* The product's two groups, kept as two. The gap between them is wider
                than the gap inside them, which is what makes them read as two. */}
            <Stack gap={{ xs: 2.5, md: 3.5 }}>
              {TOPIC_ROWS.map((row, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: { xs: 1, md: 1.25 },
                  }}
                >
                  {row.map((topic) => (
                    <TopicPill key={topic} label={topic} />
                  ))}
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <EyebrowRule label={label} />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, md: 31 },
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.6px",
                color: GL.heading,
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.65, color: GL.body }}>
              {body}
            </Typography>
          </Box>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default PitchInsideSection;
