// ─────────────────────────────────────────────────────────────────────────────
// Prototype index — one link to compare/share all three Program Support
// pre-chat interaction prototypes. Hand someone /program_support/proto and they
// can click through A / B / C.
// ─────────────────────────────────────────────────────────────────────────────
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquareText, ListChecks, ListOrdered, type LucideIcon } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";

type Proto = {
  key: string;
  path: string;
  label: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  ready: boolean;
};

const PROTOS: Proto[] = [
  {
    key: "a",
    path: "/program_support/proto/a",
    label: "A",
    title: "Composer-first + suggestions",
    desc: "Land on the input with the project as a chip; help-types are optional, tappable suggestions below (Claude / ChatGPT style). Tap to add, or just type and send.",
    Icon: MessageSquareText,
    ready: true,
  },
  {
    key: "b",
    path: "/program_support/proto/b",
    label: "B",
    title: "Guided steps",
    desc: "Pick the project, then a dedicated \"What kind of help?\" step before composing. More structured and explicit, one choice per screen.",
    Icon: ListChecks,
    ready: true,
  },
  {
    key: "c",
    path: "/program_support/proto/c",
    label: "C",
    title: "Stepper wizard",
    desc: "A form-style wizard with a numbered stepper and Back / Continue: Project → Help type (optional) → Your question. Modelled on the dev playground's \"New session\" modal.",
    Icon: ListOrdered,
    ready: true,
  },
];

export function ProtoIndex() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <Box sx={{ flex: 1, width: "100%", maxWidth: 720, mx: "auto", px: 3, pt: { xs: 5, md: 8 }, pb: 8 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "primary.main", opacity: 0.85, textAlign: "center" }}>
          Glaide · Program Support
        </Typography>
        <Typography component="h1" sx={{ mt: 1, fontSize: { xs: 26, md: 32 }, fontWeight: 600, letterSpacing: "-0.8px", color: "text.primary", textAlign: "center" }}>
          Pre-chat prototypes
        </Typography>
        <Typography sx={{ mt: 1.25, fontSize: 15, color: "text.secondary", textAlign: "center", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}>
          Three takes on the same flow. Open each, compare, and we'll finalise one.
        </Typography>

        <Stack gap={1.5} sx={{ mt: { xs: 4, md: 5 } }}>
          {PROTOS.map(({ key, path, label, title, desc, Icon, ready }) => (
            <Box
              key={key}
              component="button"
              type="button"
              onClick={() => navigate(path)}
              sx={{
                appearance: "none", font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
                display: "flex", alignItems: "center", gap: 2,
                border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "18px",
                bgcolor: "background.paper", px: 2.5, py: 2.25,
                boxShadow: "0 1px 2px rgba(16,24,64,0.04)",
                transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)", boxShadow: (t) => `0 10px 28px -12px ${alpha(t.palette.primary.main, 0.45)}` },
                "&:hover .go": { transform: "translateX(3px)", color: (t) => t.palette.primary.main },
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: "14px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: (t) => alpha(t.palette.primary.main, ready ? 0.1 : 0.05), color: ready ? "primary.main" : "text.secondary" }}>
                <Icon size={22} strokeWidth={2} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", color: "text.secondary" }}>{label}</Typography>
                  <Typography sx={{ fontSize: 16.5, fontWeight: 600, letterSpacing: "-0.3px", color: "text.primary" }}>{title}</Typography>
                  {!ready && (
                    <Box sx={{ px: 0.875, py: 0.125, borderRadius: 999, bgcolor: "surfaceContainer.low", fontSize: 11, fontWeight: 600, color: "text.secondary" }}>Soon</Box>
                  )}
                </Stack>
                <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary", lineHeight: 1.5 }}>{desc}</Typography>
              </Box>
              <Box className="go" sx={{ display: "flex", flexShrink: 0, color: "text.secondary", transition: "transform 160ms ease, color 160ms ease" }}>
                <ArrowRight size={20} strokeWidth={2} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
