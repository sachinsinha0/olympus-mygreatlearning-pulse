import { useState } from "react";
import { Box, Button, Dialog, Stack, Typography, useTheme } from "@mui/material";
import { ChevronRight, X } from "lucide-react";

export function AskPulseAIBar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const tint = theme.palette.primary.light;

  return (
    <>
      <Box
        component="button"
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          width: "100%",
          height: 50,
          alignItems: "center",
          gap: 1.5,
          px: 2,
          mt: 2,
          border: "none",
          borderRadius: "8px",
          bgcolor: tint,
          color: accent,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          transition: "filter 120ms ease",
          "&:hover": { filter: "brightness(0.97)" },
        }}
      >
        <GlaideIcon color={accent} />
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: accent,
            flex: 1,
            letterSpacing: "-0.2px",
          }}
        >
          Got any doubts? Get instant answers from Glaide!
        </Typography>
        <ChevronRight size={20} color={accent} />
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: { xs: "calc(100% - 32px)", sm: 420 },
            maxWidth: 420,
            m: 2,
          },
        }}
      >
        <Box sx={{ p: { xs: 3, md: 3.5 }, position: "relative" }}>
          <Box
            component="button"
            onClick={() => setOpen(false)}
            sx={(t) => ({
              position: "absolute",
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: "8px",
              border: "none",
              bgcolor: "transparent",
              color: t.palette.text.primary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { bgcolor: t.palette.action.hover },
            })}
            aria-label="Close"
          >
            <X size={18} />
          </Box>
          <Stack gap={2} alignItems="center" sx={{ textAlign: "center", pt: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                bgcolor: tint,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GlaideIcon size={32} color={accent} />
            </Box>
            <Stack gap={0.75}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "text.primary" }}>
                Glaide · Coming soon
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5 }}>
                Ask follow-up questions, get clarifications, and explore ideas without leaving the module.
              </Typography>
            </Stack>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              onClick={() => setOpen(false)}
              sx={{ height: 44, borderRadius: "10px", textTransform: "none", fontSize: 15, fontWeight: 600, mt: 0.5 }}
            >
              Got it
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}

function GlaideIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 25" fill="none">
      <g clipPath="url(#clip0_1205_35934)">
        <path d="M23.3515 8.54955C23.0499 8.54955 22.7985 8.75603 22.7255 9.03348H22.1223C22.0007 7.89946 21.0374 7.01709 19.865 7.01709C18.6115 7.01709 18.5947 8.02851 18.5947 9.27545C18.5947 10.5224 18.6115 11.5338 19.865 11.5338C21.1185 11.5338 22.0882 10.5659 22.1304 9.35611H22.7255C22.7985 9.63356 23.0499 9.84004 23.3515 9.84004C23.7099 9.84004 24.0001 9.55129 24.0001 9.19479C24.0001 8.8383 23.7099 8.54955 23.3515 8.54955Z" fill={color} />
        <path d="M4.2973 7.01709C3.12649 7.01709 2.16162 7.89946 2.04 9.03348H1.27459C1.20162 8.75603 0.95027 8.54955 0.648649 8.54955C0.29027 8.54955 0 8.8383 0 9.19479C0 9.55129 0.29027 9.84004 0.648649 9.84004C0.95027 9.84004 1.20162 9.63356 1.27459 9.35611H2.03189C2.07568 10.5659 3.07135 11.5338 4.2973 11.5338C5.52324 11.5338 5.56757 10.5224 5.56757 9.27545C5.56757 8.02851 5.55081 7.01709 4.2973 7.01709Z" fill={color} />
        <path d="M9.40559 10.9692C9.94295 10.9692 10.3786 10.2831 10.3786 9.43676C10.3786 8.5904 9.94295 7.9043 9.40559 7.9043C8.86823 7.9043 8.43262 8.5904 8.43262 9.43676C8.43262 10.2831 8.86823 10.9692 9.40559 10.9692Z" fill={color} />
        <path d="M14.4324 10.9692C14.9698 10.9692 15.4054 10.2831 15.4054 9.43676C15.4054 8.5904 14.9698 7.9043 14.4324 7.9043C13.8951 7.9043 13.4595 8.5904 13.4595 9.43676C13.4595 10.2831 13.8951 10.9692 14.4324 10.9692Z" fill={color} />
        <path d="M7.45946 2.90361C8.2655 2.90361 8.91892 2.25361 8.91892 1.4518C8.91892 0.649994 8.2655 0 7.45946 0C6.65342 0 6 0.649994 6 1.4518C6 2.25361 6.65342 2.90361 7.45946 2.90361Z" fill={color} />
        <path d="M7.45968 2.09713C7.81792 2.09713 8.10833 1.80825 8.10833 1.45189C8.10833 1.09553 7.81792 0.806641 7.45968 0.806641C7.10145 0.806641 6.81104 1.09553 6.81104 1.45189C6.81104 1.80825 7.10145 2.09713 7.45968 2.09713Z" fill={color} />
        <path d="M6.9228 5.08123C7.41739 5.68292 5.67577 7.42025 5.67577 9.5173C5.67577 11.6143 7.29739 13.5501 8.75685 13.5501C10.2163 13.5501 10.865 11.2917 11.8379 11.2917C12.8109 11.2917 13.7839 13.5501 15.4055 13.5501C17.0271 13.5501 18.1623 11.1304 18.1623 9.5173C18.1623 7.90418 18.4866 5.00058 12.0001 5.00058C8.75685 5.00058 7.45955 2.5809 7.45955 2.5809L8.79415 1.70337C8.79415 1.70337 9.56766 3.54877 11.8379 3.54877C14.1082 3.54877 19.6217 3.22615 19.6217 9.5173C19.6217 15.8084 14.4325 15.6471 11.5136 15.6471C8.59469 15.6471 4.21631 14.8406 4.21631 9.67861C4.21631 6.61369 6.06171 4.03271 6.9228 5.08123Z" fill={color} />
        <path d="M2.59131 18.3088C6.23996 19.3396 9.39563 21.0189 12.081 23.3095H12.1589C14.8443 21.0189 17.9983 19.3396 21.6486 18.3088" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1205_35934">
          <rect width="24" height="24.6" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
}
