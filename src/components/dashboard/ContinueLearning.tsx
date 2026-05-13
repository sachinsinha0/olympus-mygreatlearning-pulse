import { Stack, Typography } from "@mui/material";
import { CourseWidget } from "./CourseWidget";
import data from "../../mocks/continueLearning.json";

export function ContinueLearning() {
  return (
    <Stack gap={2}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px", color: "text.primary" }}>
        Continue Learning
      </Typography>
      <Stack gap={1.5}>
        {data.map((c) => (
          <CourseWidget
            key={c.id}
            title={c.title}
            moduleLabel={c.moduleLabel}
            cta={c.cta}
            pattern={c.pattern}
            thumbBg={c.thumbBg}
          />
        ))}
      </Stack>
    </Stack>
  );
}
