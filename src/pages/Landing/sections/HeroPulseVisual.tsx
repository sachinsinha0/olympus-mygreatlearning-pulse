import { Box, keyframes } from "@mui/material";
import { GL } from "../landingTheme";

/**
 * The hero visual: the AI ecosystem arranged around a beating pulse.
 *
 * This replaced a photograph that a square frame could only ever show 36% of. The
 * animation is not decoration picked off a shelf. The product is called Pulse and its
 * pitch is a cadence, so the one thing that moves is a pulse ring leaving the centre,
 * and the things around it are the real labs the modules cover, the same logo assets
 * the onboarding carousel and the labs wall already use.
 *
 * Restraint rules, so it reads as designed rather than generated:
 * - No 3D library. The whole thing is CSS transforms, and it costs no bundle weight.
 * - No gradients, no glow. The pulse is a hairline ring fading out, the guides are
 *   plain bordered circles.
 * - Positions are hand placed and deterministic, not randomised per render.
 * - The drift is slow and small, and everything freezes under prefers-reduced-motion.
 */

const pulseRing = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  70%  { opacity: 0.08; }
  100% { transform: translate(-50%, -50%) scale(16); opacity: 0; }
`;

const drift = keyframes`
  from { transform: translate(-50%, -50%) translateY(2px); }
  to   { transform: translate(-50%, -50%) translateY(-4px); }
`;

type LogoChip = {
  slug: string;
  label: string;
  /** Chip centre, percent of the panel. Hand placed on two rough rings. */
  top: string;
  left: string;
  size: number;
  driftDuration: number;
  driftDelay: number;
};

const CHIPS: LogoChip[] = [
  { slug: "openai", label: "OpenAI", top: "13%", left: "50%", size: 48, driftDuration: 5.4, driftDelay: 0 },
  { slug: "claude", label: "Claude", top: "24%", left: "77%", size: 52, driftDuration: 6.1, driftDelay: 0.7 },
  { slug: "googlegemini", label: "Gemini", top: "51%", left: "88%", size: 46, driftDuration: 4.8, driftDelay: 1.3 },
  { slug: "cursor", label: "Cursor", top: "79%", left: "75%", size: 40, driftDuration: 5.8, driftDelay: 0.4 },
  { slug: "huggingface", label: "Hugging Face", top: "88%", left: "47%", size: 44, driftDuration: 5.1, driftDelay: 1.8 },
  { slug: "githubcopilot", label: "GitHub Copilot", top: "77%", left: "21%", size: 42, driftDuration: 6.4, driftDelay: 0.9 },
  { slug: "perplexity", label: "Perplexity", top: "50%", left: "11%", size: 44, driftDuration: 5.6, driftDelay: 2.2 },
  { slug: "anthropic", label: "Anthropic", top: "23%", left: "22%", size: 40, driftDuration: 4.9, driftDelay: 1.5 },
];

/** The static guide circles the chips sit on, as a fraction of the panel. */
const GUIDE_RINGS = ["42%", "66%", "90%"];

export function HeroPulseVisual() {
  return (
    <Box
      role="img"
      aria-label="The AI labs Pulse covers, arranged around a pulse: OpenAI, Claude, Gemini, Cursor, Hugging Face, GitHub Copilot, Perplexity and Anthropic"
      sx={{
        position: "relative",
        aspectRatio: "1 / 1",
        width: "100%",
        backgroundColor: "#EEF3FC",
        border: `1px solid ${GL.border}`,
        borderRadius: "8px",
        overflow: "hidden",
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {/* Guide rings. Plain hairline circles, not glow. */}
      {GUIDE_RINGS.map((d) => (
        <Box
          key={d}
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: d,
            height: d,
            borderRadius: "999px",
            border: "1px solid rgba(25, 106, 229, 0.12)",
          }}
        />
      ))}

      {/* The pulse. A dot, and two rings leaving it on the product's beat. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 14,
          height: 14,
          borderRadius: "999px",
          backgroundColor: GL.blue,
        }}
      />
      {[0, 1.6].map((delay) => (
        <Box
          key={delay}
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 22,
            height: 22,
            borderRadius: "999px",
            border: `1.5px solid ${GL.blue}`,
            transform: "translate(-50%, -50%)",
            animation: `${pulseRing} 3.2s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      {/* The labs. Real logo assets, hand placed, drifting slowly. */}
      {CHIPS.map((chip) => (
        <Box
          key={chip.slug}
          aria-hidden
          sx={{
            position: "absolute",
            top: chip.top,
            left: chip.left,
            transform: "translate(-50%, -50%)",
            width: chip.size,
            height: chip.size,
            borderRadius: "999px",
            backgroundColor: "#ffffff",
            border: `1px solid ${GL.border}`,
            boxShadow: "0 2px 10px rgba(16, 24, 40, 0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `${drift} ${chip.driftDuration}s ease-in-out ${chip.driftDelay}s infinite alternate`,
          }}
        >
          <Box
            component="img"
            src={`/brand-logos/${chip.slug}.png`}
            alt=""
            loading="lazy"
            sx={{ width: "58%", height: "58%", objectFit: "contain", display: "block" }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default HeroPulseVisual;
