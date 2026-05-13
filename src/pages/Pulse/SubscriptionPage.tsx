import { Box, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../../components/TopNav/TopNav";

export function SubscriptionPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", pt: 3, pb: 6 }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={0.75}
          onClick={() => navigate("/pulse")}
          sx={{
            mb: 3,
            cursor: "pointer",
            color: "text.secondary",
            width: "fit-content",
            "&:hover": { color: "primary.main" },
          }}
        >
          <ArrowLeft size={16} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.2px" }}>
            Back to Pulse
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", color: "text.primary", mb: 1 }}>
          Manage Subscription
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Subscription details coming soon.
        </Typography>
      </Box>
    </Box>
  );
}
