import { useState } from "react";
import { Box, Button, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import { CalendarClock, ArrowRight } from "lucide-react";
import { ActivityRow, type ActivityType } from "./ActivityRow";
import data from "../../mocks/activities.json";

type Activity = { id: string; type: ActivityType; category: string; title: string; when: string; action: string };

export function ActivitiesSummary() {
  const [tab, setTab] = useState<"active" | "completed">("active");
  const active = data.active as Activity[];
  return (
    <Stack gap={2} sx={{ mt: 4 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px", color: "text.primary" }}>
        Learning Activities
      </Typography>

      <Box>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-around",
            },
            "& .MuiTab-root": { minWidth: 120, px: 2 },
          }}
        >
          <Tab value="active" label="Active" />
          <Tab value="completed" label="Completed" />
        </Tabs>
        <Divider />
      </Box>

      <Stack direction="row" alignItems="center" gap={1} sx={{ color: "text.primary" }}>
        <CalendarClock size={14} />
        <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: "16px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
          ONGOING ACTIVITIES ({active.length})
        </Typography>
      </Stack>

      <Stack gap={1.5}>
        {active.map((a) => (
          <ActivityRow key={a.id} {...a} />
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        <Button
          variant="text"
          disableRipple
          endIcon={<ArrowRight size={16} />}
          sx={{
            color: "primary.main",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.4px",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          View All Activities
        </Button>
      </Box>
    </Stack>
  );
}
