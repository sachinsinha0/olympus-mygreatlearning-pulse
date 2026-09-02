import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import { GL } from "../landingTheme";
import { DarkHeading, Section } from "../parts";
import { GL_SITE, PG_SECTION } from "../content";

/**
 * The cross sell to Great Learning's catalogue.
 *
 * These leads came from the sales team, so the deeper programmes belong on the page.
 * Our story is on the left and Great Learning's own categories are on the right, each
 * one a real outbound link to the live site rather than a route.
 *
 * It used to be a single featured programme card. That was a dead end for a lead who
 * wants data science or management, and it read as though Great Learning ran one
 * course. The tiles are the homepage's own "Know more about" grid: its category
 * names, its programme counts, and the real domain paths from its navigation.
 *
 * The programme page's headline numbers used to sit under the heading. They went with
 * the card, because they belong to that one programme and would read as claims about
 * the whole catalogue once the programme they describe is no longer on screen.
 */
function CategoryTile({ name, count, path }: { name: string; count: string; path: string }) {
  return (
    <Box
      component="a"
      href={`${GL_SITE}${path}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        border: `1px solid ${GL.darkBorder}`,
        borderRadius: "10px",
        px: 2.25,
        py: 2,
        textDecoration: "none",
        transition: "border-color 160ms ease, background-color 160ms ease",
        "&:hover": {
          borderColor: "rgba(255, 255, 255, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
        },
        "&:hover .tile-arrow": { color: "#ffffff" },
        "&:focus-visible": { outline: "2px solid #ffffff", outlineOffset: "2px" },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#ffffff", lineHeight: 1.35 }}>
          {name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: GL.darkBody, mt: 0.25 }}>{count}</Typography>
      </Box>
      {/* Points off the page, because every one of these leaves the prototype. */}
      <Box
        aria-hidden
        className="tile-arrow"
        sx={{
          display: "flex",
          flexShrink: 0,
          color: GL.darkBody,
          transition: "color 160ms ease",
        }}
      >
        <ArrowUpRight size={18} />
      </Box>
    </Box>
  );
}

export function PgProgramSection() {
  return (
    <Section bg={GL.dark}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.15fr" },
          gap: { xs: 5, md: 8 },
          alignItems: "center",
        }}
      >
        <Box>
          <DarkHeading>{PG_SECTION.title}</DarkHeading>
          <Typography
            sx={{ fontSize: 16, lineHeight: 1.65, color: GL.darkBody, mt: 2.5, maxWidth: 460 }}
          >
            {PG_SECTION.body}
          </Typography>

          {/* Secondary, not primary. Start Free Trial is the one filled button on the
              page, and a second one here would put a twelve month programme and a
              fortnight trial in the same weight. */}
          <Button
            variant="outlined"
            component="a"
            href={GL_SITE}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 4,
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.45)",
              "&:hover": {
                borderColor: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {PG_SECTION.cta}
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {PG_SECTION.categories.map((category) => (
            <CategoryTile key={category.path} {...category} />
          ))}
        </Box>
      </Box>
    </Section>
  );
}

export default PgProgramSection;
