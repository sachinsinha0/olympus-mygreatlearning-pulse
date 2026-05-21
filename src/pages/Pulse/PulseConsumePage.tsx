import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Button, Dialog, Drawer, Stack, Typography } from "@mui/material";
import { BookOpen, CheckCircle, List as ListIcon, SquarePen } from "lucide-react";
import { TopNav } from "../../components/TopNav/TopNav";
import { ConsumeHeader } from "../../components/pulse/ConsumeHeader";
import { ConsumePlayer } from "../../components/pulse/ConsumePlayer";
import { ConsumeRail } from "../../components/pulse/ConsumeRail";
import { ConsumeMobileFAB } from "../../components/pulse/ConsumeMobileFAB";
import { NotesPanel } from "../../components/pulse/NotesPanel";
import { VideoSummaryPanel } from "../../components/pulse/VideoSummaryPanel";
import {
  getDefaultItemId,
  getItem,
  getNeighbors,
  getSectionForItem,
  getSectionsForModule,
} from "../../lib/pulse/courseItems";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const allIssues = issuesData as PulseIssue[];
const TOP_NAV_HEIGHT = 64;
const RAIL_WIDTH = 430;
const STRIP_WIDTH = 72;

export function PulseConsumePage() {
  const { moduleId, itemId } = useParams<{ moduleId: string; itemId?: string }>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { hasStarted, markStarted } = useLearningProgress();
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);
  const [railOpenDesktop, setRailOpenDesktop] = useState(true);
  const [activePanel, setActivePanel] = useState<"learning" | "notes" | "summary">("learning");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const togglePanel = (panel: "learning" | "notes" | "summary") => {
    if (railOpenDesktop && activePanel === panel) {
      setRailOpenDesktop(false);
      return;
    }
    setActivePanel(panel);
    setRailOpenDesktop(true);
  };

  const pulseModule = useMemo(() => allIssues.find((m) => m.id === moduleId), [moduleId]);
  const sections = useMemo(() => (moduleId ? getSectionsForModule(moduleId) : []), [moduleId]);

  useEffect(() => {
    if (moduleId) markStarted(moduleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  useEffect(() => {
    if (activePanel === "summary" && item && item.type !== "video") {
      setActivePanel("learning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  useEffect(() => {
    if (params.get("trial") === "started") {
      const t = setTimeout(() => setTrialDialogOpen(true), 1000);
      const next = new URLSearchParams(params);
      next.delete("trial");
      setParams(next, { replace: true });
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToItem = useCallback(
    (nextItemId: string) => {
      if (!pulseModule) return;
      navigate(`/pulse/modules/${pulseModule.id}/items/${nextItemId}`);
      setDrawerOpen(false);
    },
    [navigate, pulseModule],
  );

  if (!pulseModule) {
    return <Navigate to="/pulse" replace />;
  }

  if (!itemId) {
    const defaultId = getDefaultItemId(pulseModule.id, hasStarted(pulseModule.id));
    if (defaultId) return <Navigate to={`/pulse/modules/${pulseModule.id}/items/${defaultId}`} replace />;
    return <Navigate to="/pulse" replace />;
  }

  const item = getItem(pulseModule.id, itemId);
  if (!item) {
    const defaultId = getDefaultItemId(pulseModule.id, hasStarted(pulseModule.id));
    if (!defaultId) return <Navigate to="/pulse" replace />;
    return <Navigate to={`/pulse/modules/${pulseModule.id}/items/${defaultId}`} replace />;
  }

  const section = getSectionForItem(pulseModule.id, item.id);
  const { prev, next } = getNeighbors(pulseModule.id, item.id);
  const isDocument = item.type === "overview";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box
        sx={{
          display: "flex",
          minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
          height: { md: isDocument ? `calc(100vh - ${TOP_NAV_HEIGHT}px)` : undefined },
          alignItems: "stretch",
        }}
      >
        {/* Main column — header + content. Card wrapper only for the overview document. */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: { md: isDocument ? "hidden" : undefined },
          }}
        >
          <ConsumeHeader
            module={pulseModule}
            item={item}
            prev={prev}
            next={next}
            onBack={() => navigate("/pulse")}
            onPrev={prev ? () => goToItem(prev.id) : undefined}
            onNext={next ? () => goToItem(next.id) : undefined}
            onRailToggle={() => setDrawerOpen(true)}
          />
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              px: { xs: 2, md: 4 },
              pt: 0,
              pb: { xs: 14, md: isDocument ? 2 : 4 },
              overflow: { md: isDocument ? "hidden" : undefined },
            }}
          >
            {isDocument ? (
              <Box
                sx={(theme) => ({
                  width: "100%",
                  maxWidth: 1080,
                  mx: "auto",
                  height: { md: "100%" },
                  bgcolor: { md: theme.palette.background.paper },
                  borderRadius: { md: "12px" },
                  border: { md: `1px solid ${theme.palette.outlineVariant.main}` },
                  overflowY: { md: "auto" },
                  px: { xs: 0, md: 3 },
                  py: { xs: 0, md: 5 },
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.18) transparent",
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.18)",
                    borderRadius: 999,
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(0,0,0,0.32)",
                  },
                })}
              >
                <ConsumePlayer item={item} />
              </Box>
            ) : (
              <Box sx={{ width: "100%", maxWidth: 1080, mx: "auto" }}>
                <ConsumePlayer item={item} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Right rail — desktop, edge-to-edge, sticky full-height */}
        <Box
          sx={(theme) => ({
            display: { xs: "none", md: railOpenDesktop ? "flex" : "none" },
            flexDirection: "column",
            width: RAIL_WIDTH,
            flexShrink: 0,
            borderLeft: `1px solid ${theme.palette.outlineVariant.main}`,
            bgcolor: theme.palette.background.default,
            position: "sticky",
            top: TOP_NAV_HEIGHT,
            alignSelf: "flex-start",
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            overflow: "hidden",
          })}
        >
          {activePanel === "notes" ? (
            <NotesPanel onClose={() => setRailOpenDesktop(false)} />
          ) : activePanel === "summary" && item.type === "video" ? (
            <VideoSummaryPanel item={item} onClose={() => setRailOpenDesktop(false)} />
          ) : (
            <ConsumeRail
              sections={sections}
              activeItemId={item.id}
              activeSectionId={section?.id}
              onItemSelect={goToItem}
              onClose={() => setRailOpenDesktop(false)}
            />
          )}
        </Box>

        {/* Far-right icon strip — always visible on md+ */}
        <Box
          sx={(theme) => ({
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            width: STRIP_WIDTH,
            flexShrink: 0,
            borderLeft: `1px solid ${theme.palette.outlineVariant.main}`,
            bgcolor: theme.palette.background.default,
            position: "sticky",
            top: TOP_NAV_HEIGHT,
            alignSelf: "flex-start",
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            py: 2,
            gap: 1,
          })}
        >
          <StripButton
            icon={<ListIcon size={22} />}
            active={railOpenDesktop && activePanel === "learning"}
            ariaLabel={
              railOpenDesktop && activePanel === "learning"
                ? "Close learning panel"
                : "Open learning panel"
            }
            onClick={() => togglePanel("learning")}
          />
          <StripSeparator />
          <StripButton
            icon={<SquarePen size={22} />}
            active={railOpenDesktop && activePanel === "notes"}
            ariaLabel={
              railOpenDesktop && activePanel === "notes" ? "Close notes panel" : "Open notes panel"
            }
            onClick={() => togglePanel("notes")}
          />
          <StripButton
            icon={<BookOpen size={22} />}
            active={railOpenDesktop && activePanel === "summary"}
            ariaLabel={
              railOpenDesktop && activePanel === "summary"
                ? "Close video summary"
                : "Open video summary"
            }
            onClick={item.type === "video" ? () => togglePanel("summary") : undefined}
            disabled={item.type !== "video"}
          />
        </Box>
      </Box>

      {/* Mobile drawer rail */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, maxWidth: 400 } }}
      >
        <Box sx={{ width: { xs: "100vw", sm: 400 }, maxWidth: 400, height: "100%" }}>
          <ConsumeRail
            sections={sections}
            activeItemId={item.id}
            activeSectionId={section?.id}
            onItemSelect={goToItem}
            onClose={() => setDrawerOpen(false)}
          />
        </Box>
      </Drawer>

      <ConsumeMobileFAB
        onPrev={() => prev && goToItem(prev.id)}
        onNext={() => next && goToItem(next.id)}
        hasPrev={!!prev}
        hasNext={!!next}
        hidden={drawerOpen}
      />
      <TrialStartedDialog open={trialDialogOpen} onClose={() => setTrialDialogOpen(false)} />
    </Box>
  );
}

function StripButton({
  icon,
  active,
  ariaLabel,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  active?: boolean;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      sx={(theme) => ({
        width: 40,
        height: 40,
        borderRadius: "10px",
        border: "none",
        bgcolor: active ? theme.palette.primary.light : "transparent",
        color: disabled
          ? theme.palette.text.disabled
          : active
          ? theme.palette.primary.main
          : theme.palette.text.primary,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 120ms ease, color 120ms ease",
        "&:hover":
          !disabled && onClick
            ? {
                bgcolor: active ? theme.palette.primary.light : theme.palette.action.hover,
              }
            : undefined,
      })}
    >
      {icon}
    </Box>
  );
}

function StripSeparator() {
  return (
    <Box
      sx={(theme) => ({
        width: 24,
        height: "1px",
        my: 0.5,
        flexShrink: 0,
        bgcolor: theme.palette.outlineVariant.main,
      })}
    />
  );
}

function TrialStartedDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: { xs: "14px", md: "16px" },
          m: { xs: 1.5, md: 2 },
          width: { xs: "calc(100% - 24px)", md: 440 },
          maxWidth: { md: 440 },
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 4, md: 4.5 }, pb: { xs: 3, md: 3.5 } }}>
        <Stack alignItems="center" gap={2.25}>
          <Box
            sx={(theme) => ({
              color: theme.palette.extended.success.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <CheckCircle size={64} strokeWidth={1.75} />
          </Box>
          <Stack gap={1} sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 24 },
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                color: "text.primary",
              }}
            >
              Your free trial has started
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5, letterSpacing: "-0.2px" }}>
              You have 30 days of full access to AI Pulse. Dive in and apply what you learn.
            </Typography>
          </Stack>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            onClick={onClose}
            sx={{
              mt: 0.5,
              height: 46,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.2px",
              textTransform: "none",
              borderRadius: "10px",
            }}
          >
            Start learning
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
