import { Box, Stack, Typography } from "@mui/material";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GL } from "../landingTheme";
import { Section } from "../parts";
import { FOOTER_COLUMNS, FOOTER_CONTACT } from "../content";
import logo from "../../../assets/gl-logo.svg";

/**
 * The Great Learning site footer.
 *
 * Four columns of the real site's links, then the wordmark, the regional contact
 * details and the social row on the right. Degrees and Quick Links share the third
 * column, which is how the live footer stacks them: Degrees has two links and would
 * otherwise leave most of a column empty.
 *
 * gl-logo.svg is a dark blue wordmark and there is no light variant, so it is
 * inverted here rather than duplicated as a second file. The filter takes a
 * single-colour mark to pure white and nothing else in it changes.
 *
 * None of the links go anywhere in a prototype, so they are plain text with a default
 * cursor rather than anchors that dead-end.
 */
const SOCIALS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Youtube, label: "YouTube" },
  { Icon: Instagram, label: "Instagram" },
];

function LinkColumn({ heading, links }: { heading: string; links: string[] }) {
  return (
    <Box>
      <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 600, color: "#ffffff" }}>
        {heading}
      </Typography>
      <Stack gap={1.75} sx={{ mt: 2.5 }}>
        {links.map((link) => (
          <Typography
            key={link}
            sx={{ fontSize: 15, lineHeight: 1.45, color: GL.darkBody, cursor: "default" }}
          >
            {link}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function LandingFooter() {
  const [trending, browse, degrees, quick] = FOOTER_COLUMNS;

  return (
    <Section bg={GL.dark} py={{ xs: 6, md: 8 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1.9fr 1.1fr 1fr 1.2fr" },
          gap: { xs: 5, md: 6 },
        }}
      >
        <LinkColumn {...trending} />
        <LinkColumn {...browse} />

        {/* Degrees is two links, so the live footer puts Quick Links under it rather
            than giving each a column of its own. */}
        <Stack gap={5}>
          <LinkColumn {...degrees} />
          <LinkColumn {...quick} />
        </Stack>

        <Box>
          <Box
            component="img"
            src={logo}
            alt="Great Learning"
            sx={{ height: 44, display: "block", filter: "brightness(0) invert(1)" }}
          />

          <Stack gap={2.5} sx={{ mt: 4 }}>
            {FOOTER_CONTACT.map((group) => (
              <Box key={group.label}>
                <Typography sx={{ fontSize: 15, color: "#ffffff" }}>{group.label}</Typography>
                <Stack gap={1.5} sx={{ mt: 1.75 }}>
                  {group.rows.map((row) => (
                    <Stack key={row.value} direction="row" alignItems="center" gap={1.5}>
                      <Box aria-hidden sx={{ color: "#ffffff", display: "flex", flexShrink: 0 }}>
                        {row.kind === "mail" ? <Mail size={18} /> : <Phone size={18} />}
                      </Box>
                      <Typography sx={{ fontSize: 15, color: GL.darkBody, cursor: "default" }}>
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          {/* The extra bottom padding keeps the fixed CTA bar clear of the last row
              of the page. Section only exposes a symmetric py, so it is set here
              rather than on the band. */}
          <Stack direction="row" gap={1.5} sx={{ mt: 5, pb: { xs: 10, sm: 4 } }}>
            {SOCIALS.map(({ Icon, label }) => (
              <Box
                key={label}
                aria-label={label}
                role="img"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "999px",
                  backgroundColor: "#ffffff",
                  color: GL.dark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "default",
                }}
              >
                <Icon size={18} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Section>
  );
}

export default LandingFooter;
