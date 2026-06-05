import { useState } from "react";
import { Box, Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import data from "../../mocks/programSupport.json";

type Course = { course: string; projects: string[] };
const courses = (data.projectPicker.courses as Course[]) ?? [];

const selectSx = {
  borderRadius: "10px",
  fontSize: 14,
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
};

const labelSx = { fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.5 };

// "Other" path: cascading Course -> Project selects rendered inside a bot
// message. Confirming posts the choice back as the learner's message.
export function ProjectForm({ onConfirm }: { onConfirm: (course: string, project: string) => void }) {
  const [course, setCourse] = useState("");
  const [project, setProject] = useState("");
  const projects = courses.find((c) => c.course === course)?.projects ?? [];

  return (
    <Stack gap={1.5} sx={{ mt: 1.5, maxWidth: 420 }}>
      <Box>
        <Typography sx={labelSx}>Course</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={course}
          onChange={(e) => {
            setCourse(e.target.value);
            setProject("");
          }}
          sx={selectSx}
        >
          <MenuItem value="" disabled>
            Select a course
          </MenuItem>
          {courses.map((c) => (
            <MenuItem key={c.course} value={c.course} sx={{ fontSize: 14 }}>
              {c.course}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box>
        <Typography sx={labelSx}>Project</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={project}
          disabled={!course}
          onChange={(e) => setProject(e.target.value)}
          sx={selectSx}
        >
          <MenuItem value="" disabled>
            Select a project
          </MenuItem>
          {projects.map((p) => (
            <MenuItem key={p} value={p} sx={{ fontSize: 14 }}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button
        variant="contained"
        disableElevation
        disabled={!course || !project}
        onClick={() => onConfirm(course, project)}
        sx={{
          alignSelf: "flex-start",
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          borderRadius: "8px",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          minHeight: 38,
          px: 2.5,
          "&:hover": { bgcolor: "primary.main" },
          "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary" },
        }}
      >
        Continue
      </Button>
    </Stack>
  );
}
