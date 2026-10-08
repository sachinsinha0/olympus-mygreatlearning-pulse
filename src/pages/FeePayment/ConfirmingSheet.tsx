import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { EASE_OUT } from "./motion";

/**
 * Razorpay's "Confirming Payment" sheet, rebuilt from a screenshot of the hosted
 * checkout in test mode. The sheet rises over the lower part of the payment
 * options panel while everything else dims. The scene: a coin flying right on
 * a blue speed trail, spinning, with speed dashes streaming backwards past it.
 *
 * Geometry is in CSS px measured off the 1440px-wide capture; the scene is
 * 688 x 160 and scales with the sheet.
 */

const INK = "#0d1321";
const SUB = "#2a2f3a";
const MUTED = "#64748b";

const W = 688;
const H = 160;
const CY = 75; // centre line of trail and coin
const COIN_X = 362;

/* Every moving animation is a single interval (see motion.ts); fades that
   need several stops run as a separate, linear opacity animation. */
const riseIn = keyframes`
  from { transform: translateY(100%); }
  to { transform: none; }
`;
const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const trailIn = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;
const coinIn = keyframes`
  from { transform: translateX(-300px); }
  to { transform: none; }
`;
const coinSpin = keyframes`
  from { transform: scaleX(1); }
  to { transform: scaleX(0.28); }
`;
const trailBreathe = keyframes`
  from { transform: scaleY(1); }
  to { transform: scaleY(1.07); }
`;
const streamMove = keyframes`
  from { transform: translateX(70px); }
  to { transform: translateX(-70px); }
`;
const streamFade = keyframes`
  0% { opacity: 0; }
  25% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
`;

/** Dash pairs from the capture: a short solid dash, then a longer faint one. */
const DASHES: { x: number; y: number; short?: number; long?: number; tone?: "ghost" }[] = [
  { x: 53, y: 18, short: 18, long: 37 },
  { x: 47, y: 136, short: 18, long: 38 },
  { x: 148, y: 51, short: 15, long: 22, tone: "ghost" },
  { x: 316, y: 122, long: 40, tone: "ghost" },
  { x: 380, y: 39, short: 40 },
  { x: 437, y: 24, short: 18, long: 38 },
  { x: 436, y: 7, short: 3, long: 22, tone: "ghost" },
  { x: 390, y: 136, short: 44 },
  { x: 437, y: 142, short: 4, long: 37 },
  { x: 596, y: 75, long: 40, tone: "ghost" },
  { x: 627, y: 124, short: 17, long: 38 },
  { x: 671, y: 89, short: 17 },
];

/** Thin white highlights inside the trail, streaming back like the dashes. */
const STREAKS = [
  { x: 0, y: 66, w: 44 },
  { x: 180, y: 83, w: 46 },
  { x: 240, y: 79, w: 40 },
  { x: 318, y: 78, w: 26 },
];

const motionOk = (animation: string) => ({ "@media (prefers-reduced-motion: no-preference)": { animation } });

const INTRO_MS = 150;

export function ConfirmingSheet() {
  return (
    <>
      {/* Dims the whole checkout behind the sheet. */}
      <Box aria-hidden sx={[{ position: "absolute", inset: 0, bgcolor: "rgba(9, 14, 28, 0.55)", zIndex: 1 }, motionOk(`${fade} 220ms ${EASE_OUT} both`)]} />

      <Box
        role="status"
        aria-live="polite"
        sx={[
          {
            position: "absolute",
            zIndex: 2,
            left: { xs: 0, md: 300 },
            right: { xs: 0, md: 8 },
            bottom: { xs: 0, md: 8 },
            // Phones get a content-height bottom sheet; desktop matches the capture.
            height: { xs: "auto", md: "calc((100% - 16px) * 0.63)" },
            minHeight: { md: 340 },
            bgcolor: "#fff",
            borderRadius: { xs: "16px 16px 0 0", md: "16px 16px 10px 10px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            textAlign: "center",
          },
          motionOk(`${riseIn} 420ms ${EASE_OUT} both`),
        ]}
      >
        <Typography sx={{ mt: "36px", fontSize: 24, fontWeight: 700, lineHeight: "32px", letterSpacing: "-0.6px", color: INK }}>
          Confirming Payment
        </Typography>
        <Typography sx={{ mt: "22px", fontSize: 16, lineHeight: "22px", color: SUB }}>This will only take a few seconds.</Typography>

        <Box
          component="svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          sx={{ mt: "24px", width: "100%", maxWidth: W, height: "auto", display: "block", overflow: "visible", flexShrink: 0 }}
        >
          <defs>
            <linearGradient id="rzp-trail" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#a3bdfa" />
              <stop offset="0.55" stopColor="#b3c9fb" />
              <stop offset="1" stopColor="#c2d4fc" />
            </linearGradient>
            <linearGradient id="rzp-band" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#7d9df8" />
              <stop offset="1" stopColor="#97b3fa" />
            </linearGradient>
            <linearGradient id="rzp-face" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ffd84a" />
              <stop offset="1" stopColor="#ffbf0f" />
            </linearGradient>
          </defs>

          {/* Speed dashes, streaming backwards. */}
          {DASHES.map((d, i) => {
            const solid = d.tone === "ghost" ? "#e9effd" : "#c5d5fb";
            const faint = d.tone === "ghost" ? "#f2f5fe" : "#e3ebfd";
            const dur = 900 + (i % 4) * 160;
            const delay = INTRO_MS + ((i * 137) % 700);
            return (
              <Box
                key={i}
                component="g"
                sx={[
                  { transformBox: "fill-box" },
                  motionOk(`${streamMove} ${dur}ms linear ${delay}ms infinite, ${streamFade} ${dur}ms linear ${delay}ms infinite`),
                ]}
              >
                <g transform={`translate(${d.x} ${d.y}) skewX(-24)`}>
                  {d.short ? <rect width={d.short} height={6} rx={1} fill={solid} /> : null}
                  {d.long ? <rect x={(d.short ?? 0) + (d.short ? 5 : 0)} width={d.long} height={6} rx={1} fill={faint} /> : null}
                </g>
              </Box>
            );
          })}

          {/* The trail: a horn that flares out to the left edge and narrows into the coin. */}
          <Box
            component="g"
            sx={[
              { transformBox: "view-box", transformOrigin: `0 ${CY}px` },
              motionOk(`${trailIn} 640ms ${EASE_OUT} ${INTRO_MS}ms both`),
            ]}
          >
            <Box
              component="path"
              d={`M0 17 C 70 46, 170 60, ${COIN_X} 63 L ${COIN_X} 87 C 170 90, 70 104, 0 135 Z`}
              fill="url(#rzp-trail)"
              sx={[
                { transformBox: "fill-box", transformOrigin: "right center" },
                motionOk(`${trailBreathe} 700ms ease-in-out ${INTRO_MS + 640}ms infinite alternate`),
              ]}
            />
            <path d={`M0 64 C 120 72, 230 74, ${COIN_X} 74 L ${COIN_X} 84 C 230 84, 120 88, 0 96 Z`} fill="url(#rzp-band)" opacity={0.75} />
            {/* Core line, with a white edge above it. */}
            <path d={`M0 76 L ${COIN_X} 77 L ${COIN_X} 82 L 0 84 Z`} fill="#2f5cff" />
            <rect x={0} y={73} width={COIN_X} height={1.4} fill="#fff" opacity={0.95} />
            {STREAKS.map((s, i) => (
              <Box
                key={i}
                component="rect"
                x={s.x}
                y={s.y}
                width={s.w}
                height={1.2}
                rx={0.6}
                fill="#fff"
                sx={[
                  { transformBox: "fill-box" },
                  motionOk(`${streamMove} ${700 + i * 120}ms linear ${INTRO_MS + 400 + i * 90}ms infinite, ${streamFade} ${700 + i * 120}ms linear ${INTRO_MS + 400 + i * 90}ms infinite`),
                ]}
              />
            ))}
          </Box>

          {/* The coin flies in along the trail, then spins in place. */}
          <Box component="g" sx={motionOk(`${coinIn} 640ms ${EASE_OUT} ${INTRO_MS}ms both`)}>
            <Box
              component="g"
              sx={[
                { transformBox: "fill-box", transformOrigin: "center" },
                motionOk(`${coinSpin} 560ms ease-in-out ${INTRO_MS + 640}ms infinite alternate`),
              ]}
            >
              {/* Edge thickness, showing on the trailing side. */}
              <ellipse cx={COIN_X - 4} cy={CY} rx={20} ry={41} fill="#f0a500" />
              <ellipse cx={COIN_X + 1} cy={CY} rx={20} ry={41} fill="#ffcb1f" />
              <ellipse cx={COIN_X + 1} cy={CY} rx={20} ry={41} fill="none" stroke="#ffe168" strokeWidth={2.5} />
              <ellipse cx={COIN_X + 2} cy={CY} rx={14} ry={32} fill="url(#rzp-face)" stroke="#f2b100" strokeWidth={1.5} />
              {/* Diagonal shine across the face. */}
              <path d={`M ${COIN_X + 9} ${CY - 26} L ${COIN_X + 14} ${CY - 14} L ${COIN_X + 2} ${CY + 30} L ${COIN_X - 4} ${CY + 24} Z`} fill="#ffe27a" opacity={0.55} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />
        <Typography sx={{ mt: { xs: "28px", md: 0 }, mb: "18px", fontSize: 15, lineHeight: "20px", color: MUTED, display: "flex", alignItems: "center", gap: 0.5 }}>
          Secured by
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", fontWeight: 800, fontStyle: "italic", color: "#072654", fontSize: 17, letterSpacing: "-0.3px" }}>
            <Box component="span" aria-hidden sx={{ width: 7, height: 14, mr: "3px", bgcolor: "#3395ff", transform: "skewX(-20deg)", borderRadius: "1px" }} />
            Razorpay
          </Box>
        </Typography>
      </Box>
    </>
  );
}
