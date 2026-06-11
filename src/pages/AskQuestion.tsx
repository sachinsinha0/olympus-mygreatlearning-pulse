import { Box, Stack, Typography, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  BookOpen,
  Briefcase,
  Folder,
  ListVideo,
  Video,
  MessagesSquare,
  ClipboardList,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import data from "../mocks/programSupport.json";

// Static lucide lookup so icon names from JSON resolve without dynamic import.
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  BookOpen,
  Briefcase,
  Folder,
  ListVideo,
  Video,
  MessagesSquare,
  ClipboardList,
  MessageSquare,
};

// One distinct extended-palette colorContainer/onColorContainer pair per category (no repeats).
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  fee: { bg: "#ffdcc0", color: "#2d1600" }, // warning
  olympus: { bg: "#ebddff", color: "#250059" }, // deepPurple
  career: { bg: "#cae6ff", color: "#001e30" }, // lightBlue
  projects: { bg: "#dee0ff", color: "#00105c" }, // indigo
  material: { bg: "#ffd9dc", color: "#400011" }, // rose
  sessions: { bg: "#ffdf9e", color: "#261a00" }, // amber
  quizzes: { bg: "#ffd6fe", color: "#35003f" }, // purple
  other: { bg: "#a1efff", color: "#001f25" }, // cyan
  feedback: { bg: "#ffd8eb", color: "#3b002c" }, // pink (pastel)
};

type Category = { key: string; label: string; icon: string; items: string[] };
const categories = data.categories as Category[];

export function AskQuestion() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box
        sx={{
          flex: 1,
          width: { xs: "100%", lg: "calc(100% - 352px)" },
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, md: 3, lg: 0 },
          pt: { xs: 3, md: 4 },
          pb: 8,
        }}
      >
        {/* Back + title */}
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={() => navigate("/program_support")}
            aria-label="Back to Support"
            sx={{ color: "text.primary", ml: -1 }}
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
            How can we help you?
          </Typography>
        </Stack>

        {/* Category cards */}
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {categories.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? MessageSquare;
            const colors = CATEGORY_COLORS[c.key] ?? { bg: "#cae6ff", color: "#001e30" };
            return (
              <Box
                key={c.key}
                component="button"
                type="button"
                onClick={() =>
                  navigate("/program_support/chat", {
                    state: { kind: "category", categoryKey: c.key, label: c.label },
                  })
                }
                sx={{
                  appearance: "none",
                  font: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  border: "1px solid",
                  borderColor: "outlineVariant.main",
                  borderRadius: "16px",
                  bgcolor: "background.paper",
                  p: { xs: 2.5, md: 3 },
                  transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                    boxShadow: (t) => `0 10px 28px -12px ${alpha(t.palette.primary.main, 0.4)}`,
                  },
                  "&:focus-visible": {
                    outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.75}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: colors.bg,
                      color: colors.color,
                    }}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.3px", color: "text.primary" }}>
                    {c.label}
                  </Typography>
                </Stack>

                <Stack component="ul" gap={1.25} sx={{ listStyle: "none", m: 0, mt: 2.25, p: 0, pl: 0.5 }}>
                  {c.items.map((it) => (
                    <Stack key={it} component="li" direction="row" alignItems="flex-start" gap={1.25}>
                      <Box
                        aria-hidden
                        sx={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, mt: "9px", bgcolor: "text.secondary", opacity: 0.6 }}
                      />
                      <Typography sx={{ fontSize: 15, lineHeight: 1.5, color: "text.secondary" }}>{it}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.default",
          borderTop: 1,
          borderColor: "outlineVariant.main",
          py: 2.5,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          © 2026 All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
