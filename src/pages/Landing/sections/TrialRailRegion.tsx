import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { ContentColumn } from "../parts";
import { TrialRailCard } from "./TrialRailCard";

/** Card width, and the gutter the sections underneath must leave clear for it. */
export const RAIL_WIDTH = 400;
export const RAIL_GUTTER = RAIL_WIDTH + 48;

/**
 * Holds the trial card alongside the sections it should travel past.
 *
 * A sticky element can only travel inside its own parent, so a card that lives in
 * one section stops at that section's edge. On the real course pages the lead form
 * carries on past several sections, so the card is positioned over this whole region
 * instead of inside any one part of it.
 *
 * The overlay is absolute rather than a shared grid column because the sections
 * underneath paint full bleed backgrounds, dark then white, which a grid would clip.
 * They each leave RAIL_GUTTER clear on the right from lg up so nothing runs beneath
 * the card.
 *
 * `pointerEvents` is off on the overlay and back on for the card, so the empty space
 * around it does not swallow clicks meant for the sections underneath.
 */
export function TrialRailRegion({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ position: "relative" }}>
      {children}

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <ContentColumn sx={{ height: "100%", pt: 9 }}>
          <Box
            sx={{
              position: "sticky",
              top: 96,
              width: RAIL_WIDTH,
              ml: "auto",
              pointerEvents: "auto",
            }}
          >
            <TrialRailCard />
          </Box>
        </ContentColumn>
      </Box>
    </Box>
  );
}

export default TrialRailRegion;
