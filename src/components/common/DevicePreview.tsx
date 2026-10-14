import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Command, Monitor, RotateCcwSquare, Smartphone, Tablet, type LucideIcon } from "lucide-react";

/**
 * Prototype tool: preview the app at phone, tablet or desktop size.
 *
 * Phone and tablet render the app in a same-origin iframe of that size, so the
 * real media queries (MUI breakpoints, useMediaQuery) respond as they would on
 * the device. The framed app reports its route back, so a reload keeps the page,
 * and ⌘K is forwarded so the Dev Panel still opens inside the device.
 *
 * Desktop is simply the browser window, with no frame.
 */

type Device = "mobile" | "tablet" | "desktop";

const DEVICES: { id: Device; label: string; Icon: LucideIcon; size?: [number, number] }[] = [
  { id: "mobile", label: "Mobile", Icon: Smartphone, size: [390, 844] },
  { id: "tablet", label: "Tablet", Icon: Tablet, size: [820, 1180] },
  { id: "desktop", label: "Desktop", Icon: Monitor },
];

const STORAGE_KEY = "pulse:device-preview";
const LOCATION_MESSAGE = "device-preview:location";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Bezel and screen corner radius per device, in px. */
const FRAME = { mobile: { bezel: 10, radius: 44 }, tablet: { bezel: 14, radius: 28 } } as const;
/** Space around the device on the stage, and the caption under it. */
const STAGE_PAD = 32;
const CAPTION = 36;

type Saved = { device: Device; landscape: boolean };

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Saved>;
      if (DEVICES.some((d) => d.id === parsed.device)) return { device: parsed.device!, landscape: !!parsed.landscape };
    }
  } catch {
    // Private window or blocked storage: start on desktop.
  }
  return { device: "desktop", landscape: false };
}

function isFramed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function DevicePreview({ children }: { children: ReactNode }) {
  // Decided once: a page is either the stage or the app inside it.
  const [framed] = useState(isFramed);
  if (framed) {
    return (
      <>
        <LocationReporter />
        {children}
      </>
    );
  }
  return <DeviceStage>{children}</DeviceStage>;
}

/** Inside the frame: tell the stage where we are, so its URL follows along. */
function LocationReporter() {
  const location = useLocation();
  useEffect(() => {
    const href = location.pathname + location.search + location.hash;
    window.parent.postMessage({ type: LOCATION_MESSAGE, href }, window.location.origin);
  }, [location]);
  return null;
}

function DeviceStage({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState(loadSaved);
  const [menuOpen, setMenuOpen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const update = useCallback((next: Partial<Saved>) => {
    setSaved((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Not remembered across reloads; the preview still works.
      }
      return merged;
    });
  }, []);

  const spec = DEVICES.find((d) => d.id === saved.device)!;
  const framedDevice = spec.size ? (spec.id as "mobile" | "tablet") : null;

  // The iframe loads the page you were on when the frame appeared, then navigates on its own.
  // Switching phone and tablet only resizes it, so the page and its state stay.
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  useEffect(() => {
    if (framedDevice && frameSrc === null) setFrameSrc(location.pathname + location.search + location.hash);
    if (!framedDevice && frameSrc !== null) setFrameSrc(null);
  }, [framedDevice, frameSrc, location]);

  // Keep this window's URL in step with the frame (replace, so Back still works inside the frame).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; href?: string };
      if (data?.type !== LOCATION_MESSAGE || typeof data.href !== "string") return;
      const here = window.location.pathname + window.location.search + window.location.hash;
      if (data.href !== here) navigate(data.href, { replace: true });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  // ⌘K on the stage opens the Dev Panel inside the device.
  useEffect(() => {
    if (!framedDevice) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const win = frameRef.current?.contentWindow;
        win?.focus();
        win?.dispatchEvent(new Event("dev-panel:open"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [framedDevice]);

  return (
    <>
      {framedDevice && frameSrc !== null ? (
        <DeviceFrame
          frameRef={frameRef}
          device={framedDevice}
          label={spec.label}
          size={spec.size!}
          landscape={saved.landscape}
          src={frameSrc}
        />
      ) : (
        children
      )}
      <DeviceMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        device={saved.device}
        landscape={saved.landscape}
        onDevice={(device) => update({ device })}
        onRotate={() => update({ landscape: !saved.landscape })}
        onDevPanel={() => {
          setMenuOpen(false);
          const win = framedDevice ? frameRef.current?.contentWindow : window;
          win?.dispatchEvent(new Event("dev-panel:open"));
        }}
      />
    </>
  );
}

type DeviceFrameProps = {
  frameRef: React.Ref<HTMLIFrameElement>;
  device: "mobile" | "tablet";
  label: string;
  size: [number, number];
  landscape: boolean;
  src: string;
};

/** The device, scaled down to fit the window when it is taller than the screen. */
function DeviceFrame({ frameRef, device, label, size, landscape, src }: DeviceFrameProps) {
  const reduceMotion = useReducedMotion();
  const [w, h] = landscape ? [size[1], size[0]] : size;
  const { bezel, radius } = FRAME[device];
  const outerW = w + bezel * 2;
  const outerH = h + bezel * 2;

  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => {
      const availW = window.innerWidth - STAGE_PAD * 2;
      const availH = window.innerHeight - STAGE_PAD * 2 - CAPTION;
      setScale(Math.min(1, availW / outerW, availH / outerH));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [outerW, outerH]);

  const morph = reduceMotion ? { duration: 0 } : { duration: 0.42, ease: EASE_OUT };

  return (
    <Box
      sx={(t) => ({
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        bgcolor: t.palette.mode === "dark" ? "#0d0f13" : "#e9ebef",
        // Faint dot grid, so the stage reads as a workspace and not a page.
        backgroundImage: `radial-gradient(${alpha(t.palette.text.primary, t.palette.mode === "dark" ? 0.08 : 0.07)} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      })}
    >
      {/* Layout box at the scaled size, so the caption sits right under the device. */}
      <Stack alignItems="center" gap={1.5}>
        <motion.div
          initial={false}
          animate={{ width: outerW * scale, height: outerH * scale }}
          transition={morph}
          style={{ position: "relative" }}
        >
          <motion.div
            initial={false}
            animate={{ width: outerW, height: outerH, borderRadius: radius + bezel, scale }}
            transition={morph}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top left",
              padding: bezel,
              boxSizing: "border-box",
              background: "linear-gradient(160deg, #2a2d34 0%, #16181d 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.08), 0 1px 2px rgba(15,23,42,0.16), 0 24px 48px -12px rgba(15,23,42,0.32), 0 48px 96px -24px rgba(15,23,42,0.24)",
            }}
          >
            <motion.div
              initial={false}
              animate={{ borderRadius: radius }}
              transition={morph}
              style={{ width: "100%", height: "100%", overflow: "hidden", background: "#fff", isolation: "isolate" }}
            >
              <iframe
                ref={frameRef}
                src={src}
                title={`${label} preview`}
                style={{ display: "block", width: "100%", height: "100%", border: 0 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        <Typography sx={{ fontSize: 12, lineHeight: "16px", color: "text.secondary", fontVariantNumeric: "tabular-nums", height: CAPTION - 12 }}>
          {label}, {w} × {h}
          {scale < 1 && ` at ${Math.round(scale * 100)}%`}
        </Typography>
      </Stack>
    </Box>
  );
}

type DeviceMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
  landscape: boolean;
  onDevice: (device: Device) => void;
  onRotate: () => void;
  onDevPanel: () => void;
};

/** Low-key button in the bottom-left corner; opens the size menu above it. */
function DeviceMenu({ open, onOpenChange, device, landscape, onDevice, onRotate, onDevPanel }: DeviceMenuProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = DEVICES.find((d) => d.id === device)!;
  const CurrentIcon = current.Icon;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };
    // A click inside the iframe never reaches this window, so close when it takes focus.
    const onBlur = () => window.setTimeout(() => document.activeElement?.tagName === "IFRAME" && onOpenChange(false));
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onBlur);
    };
  }, [open, onOpenChange]);

  return (
    <Box
      ref={rootRef}
      sx={{
        position: "fixed",
        left: { xs: 12, sm: 20 },
        bottom: { xs: 12, sm: 20 },
        // Above the app's own FABs and drawers, below nothing: this is a prototype tool.
        zIndex: 1600,
        "@media print": { display: "none" },
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            style={{ position: "absolute", left: 0, bottom: 52, transformOrigin: "bottom left" }}
          >
            <Box
              role="menu"
              aria-label="Preview size"
              sx={(t) => ({
                width: 252,
                p: 0.75,
                borderRadius: "14px",
                bgcolor: t.palette.mode === "dark" ? "#1c1f25" : "#ffffff",
                border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.06), 0 12px 32px -8px rgba(15,23,42,0.22)",
              })}
            >
              <Typography sx={{ px: 1.25, pt: 0.75, pb: 1, fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
                Preview size
              </Typography>
              {DEVICES.map(({ id, label, Icon, size }) => {
                const selected = id === device;
                const dims = size ? (landscape ? `${size[1]} × ${size[0]}` : `${size[0]} × ${size[1]}`) : "Full window";
                return (
                  <MenuRow
                    key={id}
                    role="menuitemradio"
                    aria-checked={selected}
                    selected={selected}
                    onClick={() => {
                      onDevice(id);
                      onOpenChange(false);
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                    <Box component="span" sx={{ flex: 1, fontWeight: selected ? 600 : 500 }}>
                      {label}
                    </Box>
                    <Box component="span" sx={{ fontSize: 12, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
                      {dims}
                    </Box>
                    <Box component="span" sx={{ width: 16, display: "grid", placeItems: "center", color: "primary.main" }}>
                      {selected && <Check size={16} strokeWidth={2.25} aria-hidden />}
                    </Box>
                  </MenuRow>
                );
              })}
              <Box sx={(t) => ({ height: "1px", mx: 1, my: 0.75, bgcolor: alpha(t.palette.text.primary, 0.08) })} />
              <MenuRow role="menuitemcheckbox" aria-checked={landscape} disabled={device === "desktop"} onClick={onRotate}>
                <RotateCcwSquare size={18} strokeWidth={1.75} aria-hidden />
                <Box component="span" sx={{ flex: 1 }}>
                  {landscape ? "Portrait" : "Landscape"}
                </Box>
              </MenuRow>
              <MenuRow role="menuitem" onClick={onDevPanel}>
                <Command size={18} strokeWidth={1.75} aria-hidden />
                <Box component="span" sx={{ flex: 1 }}>
                  Prototype controls
                </Box>
                <Box component="kbd" sx={{ fontFamily: "inherit", fontSize: 12, color: "text.secondary" }}>
                  ⌘K
                </Box>
              </MenuRow>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <ButtonBase
        ref={triggerRef}
        onClick={() => onOpenChange(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Preview size: ${current.label}`}
        sx={(t) => ({
          width: 44,
          height: 44,
          borderRadius: "50%",
          color: "#fff",
          bgcolor: "#1c1f25",
          boxShadow: `inset 0 0 0 1px ${alpha("#fff", 0.1)}, 0 4px 14px -2px rgba(15,23,42,0.35)`,
          // Quiet until you reach for it.
          opacity: open ? 1 : 0.5,
          transition: `opacity 200ms, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
          "&:hover, &:focus-visible": { opacity: 1 },
          "&:focus-visible": { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
          "&:active": { transform: "scale(0.94)" },
        })}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={device}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            style={{ display: "grid", placeItems: "center" }}
          >
            <CurrentIcon size={20} strokeWidth={1.75} />
          </motion.span>
        </AnimatePresence>
      </ButtonBase>
    </Box>
  );
}

function MenuRow({
  selected = false,
  disabled = false,
  children,
  ...rest
}: {
  selected?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick: () => void;
  role: string;
  "aria-checked"?: boolean;
}) {
  return (
    <ButtonBase
      {...rest}
      disabled={disabled}
      sx={(t) => ({
        width: "100%",
        minHeight: 40,
        px: 1.25,
        gap: 1.25,
        justifyContent: "flex-start",
        textAlign: "left",
        borderRadius: "8px",
        fontSize: 14,
        color: "text.primary",
        bgcolor: selected ? alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.16 : 0.08) : "transparent",
        transition: "background-color 120ms",
        "&:hover": { bgcolor: selected ? alpha(t.palette.primary.main, 0.12) : alpha(t.palette.text.primary, 0.05) },
        "&.Mui-focusVisible": { bgcolor: alpha(t.palette.text.primary, 0.08) },
        "&.Mui-disabled": { color: "text.disabled" },
      })}
    >
      {children}
    </ButtonBase>
  );
}
