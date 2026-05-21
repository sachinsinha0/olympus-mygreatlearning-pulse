import { Box, Divider, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { CourseItem } from "../../lib/pulse/types";
import { getSectionsForModule } from "../../lib/pulse/courseItems";
import { useLearningProgress } from "../../lib/pulse/learningProgress";

type Overview = CourseItem & { type: "overview" };

const READING_MAX_WIDTH = 720;

export function OverviewSurface({ item }: { item: Overview }) {
  const { moduleId } = useParams<{ moduleId: string }>();
  const sections = moduleId ? getSectionsForModule(moduleId) : [];
  const allItems = sections.flatMap((s) => s.items ?? []);
  const tocItems = allItems.filter((i) => i.id !== item.id);

  const segmentCount = item.topics.length;
  const quizCount = allItems.filter((i) => i.type === "tyu").length;
  const demoCount = allItems.filter((i) => i.type === "video" && /demo|hands-on/i.test(i.title)).length;
  const readingCount = allItems.filter((i) => i.type === "reading").length;

  const meta: string[] = [];
  if (item.estimatedMinutes) meta.push(`${item.estimatedMinutes} min`);
  if (segmentCount) meta.push(`${segmentCount} ${segmentCount === 1 ? "topic" : "topics"}`);
  if (quizCount) meta.push(`${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"}`);
  if (demoCount) meta.push(`${demoCount} hands-on`);
  if (readingCount) meta.push(`${readingCount} ${readingCount === 1 ? "reading" : "readings"}`);

  return (
    <Box sx={{ maxWidth: READING_MAX_WIDTH, mx: "auto", py: { xs: 1, md: 2 } }}>
      <Eyebrow>{item.moduleLabel}</Eyebrow>
      <Title>{item.moduleTitle}</Title>
      {item.summary && <Summary>{item.summary}</Summary>}
      <MetaRow parts={meta} />
      <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: "outlineVariant.main" }} />

      <Section heading="About this module">
        <Prose>{item.description}</Prose>
      </Section>

      <SectionSpacer />

      <Section heading="Learning objectives">
        <Typography
          sx={{
            fontSize: 15,
            color: "text.secondary",
            lineHeight: 1.55,
            mt: -0.5,
            mb: 0.5,
            letterSpacing: "-0.2px",
          }}
        >
          By the end of this module, you will be able to:
        </Typography>
        <Stack gap={1.25}>
          {item.objectives.map((o, i) => (
            <Stack key={i} direction="row" gap={1.5} alignItems="baseline">
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "primary.main",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.2px",
                  flexShrink: 0,
                  minWidth: 24,
                  lineHeight: 1.6,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  color: "text.primary",
                  lineHeight: 1.6,
                  letterSpacing: "-0.2px",
                }}
              >
                {o}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Section>

      <SectionSpacer />

      <Section heading="Module outline">
        <Stack gap={{ xs: 2.5, md: 3 }} sx={{ mt: 0.5 }}>
          {item.topics.map((topic, i) => (
            <Stack key={i} direction="row" gap={{ xs: 2, md: 3 }} alignItems="baseline">
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "text.primary",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.2px",
                  flexShrink: 0,
                  minWidth: 32,
                  lineHeight: 1.4,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Typography>
              <Stack gap={0.5} sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.4,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {topic.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    color: "text.secondary",
                    lineHeight: 1.55,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {topic.description}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Section>

      {tocItems.length > 0 && (
        <>
          <SectionSpacer />
          <Section heading="Module contents">
            <ModuleTOC items={tocItems} moduleId={moduleId ?? ""} />
          </Section>
        </>
      )}

      <SectionSpacer />

      <Section heading="Prerequisites">
        <Prose>{item.prerequisites}</Prose>
      </Section>
    </Box>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "1.6px",
        textTransform: "uppercase",
        color: "primary.main",
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h1"
      sx={{
        fontSize: { xs: 26, md: 32 },
        fontWeight: 700,
        lineHeight: { xs: "32px", md: "40px" },
        letterSpacing: { xs: "-0.5px", md: "-0.6px" },
        color: "text.primary",
        textWrap: "balance",
      }}
    >
      {children}
    </Typography>
  );
}

function Summary({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        mt: 2,
        fontSize: { xs: 16, md: 17 },
        lineHeight: 1.55,
        color: "text.secondary",
        letterSpacing: "-0.2px",
      }}
    >
      {children}
    </Typography>
  );
}

function MetaRow({ parts }: { parts: string[] }) {
  if (parts.length === 0) return null;
  return (
    <Typography
      sx={{
        mt: 2,
        fontSize: 13,
        fontWeight: 500,
        color: "text.secondary",
        letterSpacing: "-0.1px",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {parts.join(" · ")}
    </Typography>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Stack gap={2}>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 18, md: 20 },
          fontWeight: 600,
          letterSpacing: "-0.3px",
          color: "text.primary",
          lineHeight: 1.35,
        }}
      >
        {heading}
      </Typography>
      {children}
    </Stack>
  );
}

function SectionSpacer() {
  return <Box sx={{ height: { xs: 32, md: 48 } }} />;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 16,
        lineHeight: 1.625,
        color: "text.primary",
        letterSpacing: "-0.2px",
      }}
    >
      {children}
    </Typography>
  );
}

function ModuleTOC({ items, moduleId }: { items: CourseItem[]; moduleId: string }) {
  const navigate = useNavigate();
  const { hasItemCompleted } = useLearningProgress();
  return (
    <Stack sx={{ mt: 0.5 }} role="list">
      {items.map((it, i) => {
        const done = hasItemCompleted(it.id);
        return (
          <Box
            key={it.id}
            component="button"
            role="listitem"
            onClick={() => navigate(`/pulse/modules/${moduleId}/items/${it.id}`)}
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: { xs: 16, md: 24 },
              width: "100%",
              border: "none",
              background: "transparent",
              textAlign: "left",
              py: 1.75,
              px: 0,
              borderTop: i === 0 ? `1px solid ${theme.palette.outlineVariant.main}` : "none",
              borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 120ms ease",
              "&:hover .toc-title": { color: theme.palette.primary.main },
              "&:focus-visible": {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: -2,
                borderRadius: "4px",
              },
            })}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "text.secondary",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.4px",
                flexShrink: 0,
                minWidth: 28,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </Typography>
            <Typography
              className="toc-title"
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: 15,
                fontWeight: 500,
                color: "text.primary",
                letterSpacing: "-0.2px",
                transition: "color 120ms ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {it.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                letterSpacing: "-0.1px",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {tocMeta(it)}
            </Typography>
            {done && (
              <Box sx={{ color: "text.secondary", display: "flex", flexShrink: 0 }} aria-label="Completed">
                <Check size={16} strokeWidth={2.25} />
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

function tocMeta(item: CourseItem): string {
  if (item.type === "video") {
    const isDemo = /demo|hands-on/i.test(item.title);
    const minMatch = item.duration?.match(/(\d+)\s*Min/i);
    const mins = minMatch ? `${minMatch[1]} min` : null;
    if (isDemo) return mins ? `Hands-on · ${mins}` : "Hands-on";
    return mins ? `Video · ${mins}` : "Video";
  }
  if (item.type === "tyu") {
    const q = item.questions ?? parseInt(item.size?.match(/\d+/)?.[0] ?? "5", 10);
    return `Quiz · ${q} Qs`;
  }
  if (item.type === "reading") return "Reading";
  return "";
}
