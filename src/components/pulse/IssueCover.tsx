import { Box, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { Sparkles, Code2, Search, Brain, MessageSquare, Image as ImageIcon, ShieldCheck, Activity, BookOpen, Lightbulb, Plug } from "lucide-react";
import type { CoverColor, PulseIssue, TopicTag } from "../../lib/pulse/types";
import { glLight } from "../../theme/tokens";
import { useUnitLabel } from "../../lib/pulse/terminology";

const TAG_ICON: Record<TopicTag, typeof Sparkles> = {
  agents: Sparkles,
  "code-gen": Code2,
  rag: Search,
  evals: Brain,
  prompting: MessageSquare,
  multimodal: ImageIcon,
  reasoning: Lightbulb,
  mcp: Plug,
  safety: ShieldCheck,
  ops: Activity,
  foundations: BookOpen,
};

const TAG_LABEL: Record<TopicTag, string> = {
  agents: "Agents",
  "code-gen": "Code",
  rag: "Retrieval",
  evals: "Evals",
  prompting: "Prompting",
  multimodal: "Multimodal",
  reasoning: "Reasoning",
  mcp: "MCP",
  safety: "Safety",
  ops: "Ops",
  foundations: "Foundations",
};

const COLOR_KEY: Record<CoverColor, keyof Theme["palette"]["extended"] | "primary"> = {
  primary: "primary",
  teal: "teal",
  deepPurple: "deepPurple",
  warning: "amber",
  rose: "deepPurple",
  lightBlue: "teal",
  lightGreen: "lightGreen",
  amber: "amber",
  indigo: "primary",
  orange: "amber",
};

type Variant = "default" | "featured" | "small" | "editorial";

const ASPECT: Record<Variant, string> = {
  default: "16/10",
  featured: "16/9",
  small: "16/10",
  editorial: "16/10",
};

export function IssueCover({ issue, variant = "default" }: { issue: PulseIssue; variant?: Variant }) {
  const Icon = TAG_ICON[issue.tags[0] ?? "foundations"];
  const key = COLOR_KEY[issue.coverColor];
  const unit = useUnitLabel();

  if (variant === "editorial") {
    return <EditorialCover issue={issue} colorKey={key} />;
  }

  const color =
    key === "primary"
      ? glLight.light.primary
      : glLight.extended[key as keyof typeof glLight.extended].color;
  const container =
    key === "primary"
      ? glLight.light.primaryContainer
      : glLight.extended[key as keyof typeof glLight.extended].colorContainer;
  const onCover = glLight.light.onPrimaryContainer;

  return (
    <Box
      sx={{
        aspectRatio: ASPECT[variant],
        width: "100%",
        borderRadius: variant === "small" ? "8px" : "10px",
        background: `linear-gradient(135deg, ${container} 0%, ${color} 140%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        p: variant === "featured" ? 3 : variant === "small" ? 1.25 : 2,
        color: onCover,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "-30%",
          right: "-15%",
          width: "70%",
          height: "140%",
          opacity: 0.18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={variant === "featured" ? 260 : variant === "small" ? 80 : 140} strokeWidth={1.25} />
      </Box>
      <Typography
        sx={{
          fontSize: variant === "featured" ? 12 : 10,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          opacity: 0.85,
          position: "relative",
        }}
      >
        {unit.numbered(issue.issueNumber)}
      </Typography>
      {variant !== "small" && (
        <Box sx={{ position: "relative", textAlign: "right" }}>
          <Icon size={variant === "featured" ? 28 : 20} strokeWidth={2} />
        </Box>
      )}
    </Box>
  );
}

function EditorialCover({
  issue,
  colorKey,
}: {
  issue: PulseIssue;
  colorKey: keyof Theme["palette"]["extended"] | "primary";
}) {
  const unit = useUnitLabel();
  const issueLabel = String(issue.issueNumber).padStart(2, "0");
  const tagLabel = TAG_LABEL[issue.tags[0] ?? "foundations"];
  const layout = issue.issueNumber % 3;

  const isPrimary = colorKey === "primary";
  const color = isPrimary
    ? glLight.light.primary
    : glLight.extended[colorKey as keyof typeof glLight.extended].color;
  const container = isPrimary
    ? glLight.light.primaryContainer
    : glLight.extended[colorKey as keyof typeof glLight.extended].colorContainer;
  const onSurface = glLight.light.onPrimaryContainer;

  const hasImage = Boolean(issue.coverImageUrl);
  const textColor = hasImage ? glLight.fixed.white : onSurface;

  return (
    <Box
      sx={{
        aspectRatio: ASPECT.editorial,
        width: "100%",
        borderRadius: "14px",
        position: "relative",
        overflow: "hidden",
        background: container,
        color: textColor,
        containerType: "inline-size",
        "--cover-color": color,
        "--cover-container": container,
      }}
    >
      {hasImage && (
        <>
          <Box
            component="img"
            src={issue.coverImageUrl}
            alt=""
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.05) brightness(0.85)",
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background: color,
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background: container,
              mixBlendMode: "screen",
              opacity: 0.25,
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%)`,
            }}
          />
        </>
      )}

      {!hasImage && (
      <Box
        component="svg"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <filter id={`paper-${issue.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
          </filter>
        </defs>

        {layout === 0 && (
          <g opacity="0.6">
            <path
              d="M 280 -20 Q 360 60 380 160 Q 360 240 260 270"
              fill="none"
              stroke="var(--cover-color)"
              strokeWidth="1.2"
              opacity="0.45"
            />
            <path
              d="M 310 -20 Q 390 80 410 170"
              fill="none"
              stroke="var(--cover-color)"
              strokeWidth="0.8"
              opacity="0.3"
            />
          </g>
        )}

        {layout === 1 && (
          <>
            <rect x="20" y="20" width="360" height="210" fill="none" stroke="var(--cover-color)" strokeWidth="1" opacity="0.35" />
            <rect x="26" y="26" width="348" height="198" fill="none" stroke="var(--cover-color)" strokeWidth="0.5" opacity="0.2" />
          </>
        )}

        {layout === 2 && (
          <g opacity="0.18">
            <path
              d="M 0 200 Q 80 140 160 180 T 320 170 T 480 190"
              fill="none"
              stroke="var(--cover-color)"
              strokeWidth="1.4"
            />
            <path
              d="M 0 220 Q 100 185 200 215 T 400 210"
              fill="none"
              stroke="var(--cover-color)"
              strokeWidth="0.8"
            />
            <path
              d="M 0 240 Q 100 215 200 235 T 400 232"
              fill="none"
              stroke="var(--cover-color)"
              strokeWidth="0.5"
            />
          </g>
        )}

        <rect width="400" height="250" filter={`url(#paper-${issue.id})`} />
      </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          p: "6cqw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "clamp(8px, 2.6cqw, 11px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: 0.7,
            }}
          >
            {tagLabel}
          </Typography>
          <Typography
            sx={{
              fontSize: "clamp(8px, 2.6cqw, 11px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: 0.5,
            }}
          >
            Pulse
          </Typography>
        </Box>

        {layout === 0 && (
          <Typography
            sx={{
              fontSize: "clamp(14px, 6.8cqw, 30px)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: hasImage ? "0 1px 12px rgba(0,0,0,0.25)" : "none",
            }}
          >
            {issue.title}
          </Typography>
        )}

        {layout === 1 && (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5cqw",
              px: "8cqw",
            }}
          >
            <Box
              sx={{
                width: "30%",
                height: "1px",
                background: "var(--cover-color)",
                opacity: 0.4,
              }}
            />
            <Typography
              sx={{
                fontSize: "clamp(14px, 7cqw, 32px)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: hasImage ? "0 1px 12px rgba(0,0,0,0.25)" : "none",
              }}
            >
              {issue.title}
            </Typography>
            <Box
              sx={{
                width: "30%",
                height: "1px",
                background: "var(--cover-color)",
                opacity: 0.4,
              }}
            />
          </Box>
        )}

        {layout === 2 && (
          <Typography
            sx={{
              fontSize: "clamp(14px, 6.8cqw, 30px)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: hasImage ? "0 1px 12px rgba(0,0,0,0.25)" : "none",
            }}
          >
            {issue.title}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "clamp(8px, 2.6cqw, 11px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: 0.7,
            }}
          >
            {unit.numbered(issue.issueNumber)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
