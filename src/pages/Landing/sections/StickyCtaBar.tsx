import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { STICKY_BAR } from "../content";

/**
 * The bar that follows the lead down the page once the hero has scrolled away.
 *
 * The bar appears once the hero has scrolled away. The threshold is measured from the
 * hero itself rather than hardcoded, because the hero is roughly 1070px tall on a
 * phone and roughly 640px on a desktop. One fixed number showed the bar while the
 * hero's own two buttons were still on screen, which read as duplicate calls to
 * action. The measurement is taken on mount and on resize, never on scroll, so the
 * scroll handler stays cheap and never forces a layout.
 *
 * The bar stays mounted at all times and slides on a transform, so it never pops in.
 */
export function StickyCtaBar() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [threshold, setThreshold] = useState(600);

  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById("landing-hero");
      setThreshold(hero ? hero.offsetTop + hero.offsetHeight : 600);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const goToLogin = () => navigate("/ai-pulse/login");

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        backgroundColor: "#ffffff",
        // A full width hairline separating a fixed bar from the page, not a card accent.
        borderTop: `1px solid ${GL.border}`,
        boxShadow: "0 -4px 20px rgba(16,24,40,0.08)",
        py: 1.5,
        transform: show ? "translateY(0)" : "translateY(110%)",
        // `visibility` is what takes the parked bar out of the tab order. Without it a
        // Tab sweep at the top of the page lands on two buttons nobody can see. It is
        // delayed to the end of the slide on the way out so the transform still shows.
        visibility: show ? "visible" : "hidden",
        transition: show
          ? "transform 220ms ease, visibility 0s"
          : "transform 220ms ease, visibility 0s linear 220ms",
        // While it is parked off screen it must not swallow clicks near the bottom edge.
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          maxWidth: GL.maxWidth,
          mx: "auto",
          px: { xs: 2.5, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: GL.heading, lineHeight: 1.3 }}>
            {STICKY_BAR.name}
          </Typography>
          <Typography sx={{ fontSize: 13, color: GL.body }}>{STICKY_BAR.meta}</Typography>
        </Box>

        <Stack direction="row" gap={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            onClick={goToLogin}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              minHeight: 44,
              padding: "10px 20px",
              fontSize: 15,
            }}
          >
            {STICKY_BAR.secondaryCta}
          </Button>
          <Button
            variant="contained"
            onClick={goToLogin}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minHeight: 44,
              padding: "10px 20px",
              fontSize: 15,
            }}
          >
            {STICKY_BAR.primaryCta}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default StickyCtaBar;
