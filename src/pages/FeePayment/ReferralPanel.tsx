import { useEffect, type MouseEvent } from "react";
import { Box, Button, Typography } from "@mui/material";
import { alpha, darken, type SxProps, type Theme } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import coins from "../../assets/referral-coins.png";
import { track } from "../../lib/analytics";
import { formatReward, type ReferralOffer } from "../../lib/fees/referral";
import { EASE_OUT } from "./motion";

/**
 * Refer & Earn side panel for the thank-you page. Ported from the approved
 * payment result page (gl-payment-page src/components/ReferralBanner.tsx).
 * Colours are the Olympus orange 50/100 and warning 160p tones.
 */
function referralColors(t: Theme) {
  const dark = t.palette.mode === "dark";
  return {
    bg: dark ? alpha("#FF9800", 0.1) : "#FFF3E0",
    glow: dark ? alpha("#FF9800", 0.2) : "#FFE0B2",
    border: dark ? alpha("#FF9800", 0.28) : "#FFE0B2",
    reward: dark ? "#FFEBCC" : "#7A5114",
  };
}

type Props = {
  offer: ReferralOffer;
  /** Program name, for analytics. */
  program: string;
  sx?: SxProps<Theme>;
};

export function ReferralPanel({ offer, program, sx }: Props) {
  useEffect(() => {
    track("GL:FeePaymentReferral_Shown", { program, maxReward: offer.maxReward });
  }, [program, offer.maxReward]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    track("GL:FeePaymentReferral_Clicked", { program, maxReward: offer.maxReward });
    if (!offer.url) e.preventDefault();
  };

  // The whole panel is one link; the button inside is only its visual call to action.
  return (
    <Box
      component="a"
      href={offer.url ?? "#"}
      onClick={onClick}
      aria-labelledby="referral-title"
      sx={[
        (t) => {
          const c = referralColors(t);
          return {
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: { xs: 3, sm: 4 },
            borderRadius: "8px",
            border: `1px solid ${c.border}`,
            color: "text.primary",
            textDecoration: "none",
            // Warm glow sits behind the coins.
            background: `radial-gradient(circle at 18% 10%, ${c.glow} 0%, transparent 46%), ${c.bg}`,
            transition: `box-shadow 320ms ${EASE_OUT}`,
            "&:hover": { boxShadow: "0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)" },
            "&:focus-visible": { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
            "& .referral-art": { transition: `transform 480ms ${EASE_OUT}` },
            "& .referral-arrow": { transition: `transform 320ms ${EASE_OUT}` },
            "&:hover .referral-art": { transform: "translateY(-4px) rotate(-4deg)" },
            "&:hover .referral-cta": { bgcolor: darken(t.palette.primary.main, 0.25) },
            "&:hover .referral-arrow": { transform: "translateX(4px)" },
            "&:active .referral-cta": { transform: "scale(0.98)" },
            "@media (prefers-reduced-motion: reduce)": {
              "& .referral-art, & .referral-arrow": { transition: "none" },
              "&:hover .referral-art, &:hover .referral-arrow": { transform: "none" },
            },
            "@media print": { display: "none" },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="img"
        src={coins}
        alt=""
        className="referral-art"
        sx={{ display: "block", width: { xs: 88, sm: 104 }, height: "auto", aspectRatio: "309 / 305" }}
      />

      <Typography id="referral-title" component="h2" sx={{ fontSize: 24, fontWeight: 600, lineHeight: "28px", letterSpacing: "-0.4px", mt: 3, textWrap: "balance" }}>
        Refer a friend, earn up to{" "}
        <Box component="span" sx={(t) => ({ color: referralColors(t).reward })}>
          {formatReward(offer)}
        </Box>
      </Typography>
      <Typography sx={{ fontSize: 14, lineHeight: "20px", color: "text.secondary", mt: 2, maxWidth: "40ch" }}>
        Your friend gets a fee waiver when they join a Great Learning program, and you earn a reward.
      </Typography>
      <Button
        component="span"
        variant="contained"
        className="referral-cta"
        endIcon={<ArrowRight size={20} className="referral-arrow" />}
        tabIndex={-1}
        aria-hidden
        sx={{
          mt: 4,
          height: 42,
          px: 2.75,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0,
          textTransform: "none",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          boxShadow: "0 3px 1px -2px rgba(0,0,0,0.1), 0 2px 2px 0 rgba(0,0,0,0.07), 0 1px 5px 0 rgba(0,0,0,0.06)",
        }}
      >
        Refer a Friend
      </Button>

      <Typography component="p" sx={{ fontSize: 12, lineHeight: "20px", letterSpacing: "0.4px", color: "text.secondary", mt: 4 }}>
        Reward amount depends on the program your friend joins. T&C apply.
      </Typography>
    </Box>
  );
}
