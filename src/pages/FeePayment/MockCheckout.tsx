import { useEffect, useMemo, useState } from "react";
import { Box, Button, ButtonBase, IconButton, InputBase, Modal, Stack, Typography } from "@mui/material";
import { ChevronRight, CreditCard, Ellipsis, Landmark, QrCode, Timer, User, X } from "lucide-react";
import { formatMoney, formatPhoneForCheckout, type Currency, type PaymentMode } from "../../lib/fees/fees";
import type { CheckoutRequest } from "./PaymentsDialog";
import { ConfirmingSheet } from "./ConfirmingSheet";

/**
 * Stand-in for the Razorpay hosted checkout, in test mode. It is a third-party
 * surface, so it keeps its own light palette whatever the app's colour mode.
 */
type Method = "upi" | "card" | "netbanking";

const METHOD_MODE: Record<Method, PaymentMode> = { upi: "UPI", card: "Credit Card", netbanking: "Netbanking" };

const C = {
  navy: "#0c2a66",
  navy2: "#16408f",
  ink: "#1d2433",
  muted: "#5b6478",
  line: "#e3e6ee",
  panel: "#f4f6fa",
  blue: "#3168f5",
};

const CONFIRM_MS = 2800;
const QR_SECONDS = 12 * 60;

type Props = {
  request: CheckoutRequest | null;
  currency: Currency;
  onDismiss: () => void;
  onSuccess: (mode: PaymentMode) => void;
};

export function MockCheckout({ request, currency, onDismiss, onSuccess }: Props) {
  const open = !!request;
  const methods: Method[] = request?.channel === "netbanking" ? ["netbanking"] : ["upi", "card"];
  const [method, setMethod] = useState<Method>("upi");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!request) return;
    setMethod(request.channel === "netbanking" ? "netbanking" : "upi");
    setConfirming(false);
  }, [request]);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => onSuccess(METHOD_MODE[method]), CONFIRM_MS);
    return () => clearTimeout(t);
  }, [confirming, method, onSuccess]);

  if (!request) return null;
  const price = formatMoney(request.amount, currency, { western: true });

  return (
    <Modal open={open} onClose={confirming ? undefined : onDismiss} slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.6)" } } }}>
      <Box sx={{ outline: "none" }}>
        <TestModeRibbon />
        <Box
          role="dialog"
          aria-label="Checkout"
          sx={{
            position: "fixed",
            inset: { xs: 0, md: "auto" },
            left: { md: "50%" },
            top: { md: "50%" },
            transform: { md: "translate(-50%, -50%)" },
            width: { xs: "100%", md: "min(1000px, calc(100vw - 48px))" },
            height: { xs: "100%", md: "min(582px, calc(100vh - 48px))" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: { md: "12px" },
            overflow: "hidden",
            bgcolor: C.navy,
            fontFamily: "Inter, system-ui, sans-serif",
            color: C.ink,
          }}
        >
          <Merchant price={price} phone={request.phone} />

          <Box sx={{ flex: 1, minHeight: 0, m: { md: 1 }, ml: { md: 0 }, bgcolor: "#fff", borderRadius: { md: "10px" }, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
            <Stack direction="row" alignItems="center" sx={{ px: 2, height: 56, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}>
              <Typography sx={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 600, color: C.ink, pl: 5 }}>Payment Options</Typography>
              <IconButton aria-label="More" size="small" sx={{ color: C.muted }}>
                <Ellipsis size={18} />
              </IconButton>
              <IconButton aria-label="Close checkout" size="small" onClick={onDismiss} disabled={confirming} sx={{ color: C.muted }}>
                <X size={18} />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              <Stack sx={{ width: { xs: "100%", sm: 240 }, flexShrink: 0, borderRight: { sm: `1px solid ${C.line}` }, py: 1 }}>
                {methods.map((m) => (
                  <MethodRow key={m} method={m} active={m === method} onClick={() => setMethod(m)} />
                ))}
              </Stack>
              <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {method === "upi" && <UpiPane seed={request.amount} />}
                {method === "card" && <CardPane />}
                {method === "netbanking" && <NetbankingPane />}
                <Box sx={{ flex: 1 }} />
                <Button
                  variant="contained"
                  onClick={() => setConfirming(true)}
                  sx={{ mt: 3, height: 48, borderRadius: "8px", bgcolor: C.blue, fontSize: 15, fontWeight: 600, "&:hover": { bgcolor: "#2357dc" } }}
                >
                  Pay {price}
                </Button>
              </Box>
            </Stack>

          </Box>

          {confirming && <ConfirmingSheet />}
        </Box>
      </Box>
    </Modal>
  );
}

function Merchant({ price, phone }: { price: string; phone: string }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 300 },
        flexShrink: 0,
        p: 2,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, md: 2 },
        background: `linear-gradient(160deg, ${C.navy2} 0%, ${C.navy} 55%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Box sx={{ width: 44, height: 44, borderRadius: "8px", bgcolor: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 600 }}>G</Box>
        <Typography noWrap sx={{ fontSize: 19, fontWeight: 600, minWidth: 0 }}>
          Great Learning Education Services
        </Typography>
      </Stack>
      <Box sx={{ bgcolor: "rgba(255,255,255,0.94)", color: C.ink, borderRadius: "8px", px: 2, py: { xs: 1.5, md: 2 } }}>
        <Typography sx={{ fontSize: 14, color: C.muted }}>Price Summary</Typography>
        <Typography sx={{ fontSize: 26, fontWeight: 700, mt: 0.5, letterSpacing: "0.3px" }}>{price}</Typography>
      </Box>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ bgcolor: "rgba(255,255,255,0.94)", color: C.ink, borderRadius: "8px", px: 1.5, py: 1.5 }}>
        <User size={18} color={C.blue} />
        <Typography noWrap sx={{ flex: 1, minWidth: 0, fontSize: 14 }}>
          Using as {formatPhoneForCheckout(phone)}
        </Typography>
        <ChevronRight size={18} color={C.muted} />
      </Stack>
      <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
      <Typography sx={{ fontSize: 13, opacity: 0.7, display: { xs: "none", md: "block" } }}>
        Secured by <b style={{ fontStyle: "italic" }}>Razorpay</b>
      </Typography>
      {/* Decorative skyline, a nod to the hosted checkout's illustration */}
      <Box aria-hidden sx={{ display: { xs: "none", md: "block" }, position: "absolute", right: -40, bottom: -40, width: 260, height: 220, opacity: 0.35, background: `repeating-linear-gradient(90deg, ${C.navy2} 0 40px, transparent 40px 52px)`, transform: "skewY(-20deg)" }} />
    </Box>
  );
}

const METHOD_META: Record<Method, { label: string; hint: string; Icon: typeof QrCode }> = {
  upi: { label: "UPI", hint: "GPay · PhonePe · Paytm", Icon: QrCode },
  card: { label: "Cards", hint: "Visa · Mastercard · RuPay", Icon: CreditCard },
  netbanking: { label: "Netbanking", hint: "All Indian banks", Icon: Landmark },
};

function MethodRow({ method, active, onClick }: { method: Method; active: boolean; onClick: () => void }) {
  const { label, hint, Icon } = METHOD_META[method];
  return (
    <ButtonBase
      onClick={onClick}
      sx={{ justifyContent: "flex-start", gap: 1.5, px: 2.5, py: 2, textAlign: "left", bgcolor: active ? C.panel : "transparent", borderLeft: `3px solid ${active ? C.blue : "transparent"}` }}
    >
      <Icon size={20} color={active ? C.blue : C.muted} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{label}</Typography>
        <Typography noWrap sx={{ fontSize: 12, color: C.muted }}>
          {hint}
        </Typography>
      </Box>
    </ButtonBase>
  );
}

function UpiPane({ seed }: { seed: number }) {
  const [left, setLeft] = useState(QR_SECONDS);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>UPI QR</Typography>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ fontSize: 13, color: C.muted, bgcolor: C.panel, px: 1.25, py: 0.5, borderRadius: "999px" }}>
          <Timer size={14} /> {mm}:{ss}
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap={3} sx={{ mt: 2, p: 2, bgcolor: C.panel, borderRadius: "10px" }}>
        <FakeQr seed={seed} />
        <Typography sx={{ fontSize: 14, color: C.muted }}>Scan the QR using any UPI App</Typography>
      </Stack>
      <Typography sx={{ fontSize: 12, color: C.muted, mt: 2 }}>Test mode: no app needed. Press Pay to simulate a successful scan.</Typography>
    </>
  );
}

/** A deterministic QR-looking grid. Not scannable, on purpose. */
function FakeQr({ seed }: { seed: number }) {
  const N = 21;
  const cells = useMemo(() => {
    let x = Math.floor(seed) % 2147483647 || 1;
    const rand = () => (x = (x * 48271) % 2147483647) / 2147483647;
    const finder = (r: number, c: number) =>
      [[0, 0], [0, N - 7], [N - 7, 0]].some(([fr, fc]) => {
        const dr = r - fr, dc = c - fc;
        if (dr < 0 || dc < 0 || dr > 6 || dc > 6) return false;
        return dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
      });
    const inFinderZone = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
    const out: [number, number][] = [];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) if (inFinderZone(r, c) ? finder(r, c) : rand() > 0.55) out.push([r, c]);
    return out;
  }, [seed]);
  return (
    <Box component="svg" viewBox={`-1 -1 ${N + 2} ${N + 2}`} sx={{ width: 132, height: 132, bgcolor: "#fff", borderRadius: "6px", flexShrink: 0 }} aria-label="UPI QR code">
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={C.ink} />
      ))}
    </Box>
  );
}

function Field({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: 12, color: C.muted, mb: 0.5 }}>{label}</Typography>
      <InputBase
        fullWidth
        defaultValue={defaultValue}
        placeholder={placeholder}
        sx={{ border: `1px solid ${C.line}`, borderRadius: "8px", px: 1.5, height: 44, fontSize: 15, color: C.ink, "&.Mui-focused": { borderColor: C.blue } }}
      />
    </Box>
  );
}

function CardPane() {
  return (
    <Stack gap={2}>
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Add a new card</Typography>
      <Field label="Card Number" defaultValue="4111 1111 1111 1111" />
      <Stack direction="row" gap={2}>
        <Field label="Expiry (MM / YY)" defaultValue="12 / 30" />
        <Field label="CVV" defaultValue="123" />
      </Stack>
      <Field label="Card Holder's Name" placeholder="Name on card" />
      <Typography sx={{ fontSize: 12, color: C.muted }}>Test mode: the test card above always succeeds.</Typography>
    </Stack>
  );
}

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank"];

function NetbankingPane() {
  const [bank, setBank] = useState(BANKS[1]);
  return (
    <>
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Popular Banks</Typography>
      <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
        {BANKS.map((b) => (
          <ButtonBase
            key={b}
            onClick={() => setBank(b)}
            sx={{ height: 64, borderRadius: "8px", border: `1px solid ${b === bank ? C.blue : C.line}`, bgcolor: b === bank ? "#eef3ff" : "#fff", fontSize: 14, fontWeight: 600, color: C.ink, gap: 1 }}
          >
            <Landmark size={16} color={b === bank ? C.blue : C.muted} />
            {b}
          </ButtonBase>
        ))}
      </Box>
    </>
  );
}

function TestModeRibbon() {
  return (
    <Box aria-hidden sx={{ position: "fixed", top: 0, right: 0, width: 200, height: 200, overflow: "hidden", zIndex: 2, pointerEvents: "none" }}>
      <Box
        sx={{
          position: "absolute",
          top: 44,
          right: -56,
          width: 260,
          transform: "rotate(45deg)",
          bgcolor: "#e5484d",
          color: "#fff",
          textAlign: "center",
          py: 0.75,
          fontSize: 15,
          fontWeight: 600,
          border: "1px dashed rgba(255,255,255,0.7)",
          outline: "3px solid #e5484d",
        }}
      >
        Test Mode
      </Box>
    </Box>
  );
}
