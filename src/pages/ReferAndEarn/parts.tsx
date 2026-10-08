import { useId, useState, type ReactNode } from "react";
import { Box, ButtonBase, Collapse, Divider, Link, Stack, Typography } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { ChevronDown, ChevronUp } from "lucide-react";
import { REFERRAL_REWARDS, type Faq } from "../../lib/referral/content";
import { formatReward, splitEmails } from "../../lib/referral/referral";

/** The white cards on the prod page: 8px radius, soft two-layer shadow, 24px padding. */
export const cardSx = {
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06)",
  p: 3,
} as const;

export const headingSx = { fontSize: 24, fontWeight: 600, lineHeight: "28px", letterSpacing: "-0.4px", color: "text.primary" } as const;
export const subheadingSx = { fontSize: 14, lineHeight: "20px", color: "text.secondary", mt: 1 } as const;

export function SectionTitle({ title, subtitle, id }: { title: string; subtitle: string; id?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography id={id} component="h2" sx={headingSx}>
        {title}
      </Typography>
      <Typography sx={subheadingSx}>{subtitle}</Typography>
    </Box>
  );
}

/** A card section whose header toggles it open, like prod's How it works / Help & Support / Referral history. */
export function CollapsibleSection({ title, subtitle, children, sx }: { title: string; subtitle: string; children: ReactNode; sx?: SxProps<Theme> }) {
  const [open, setOpen] = useState(true);
  const regionId = useId();
  return (
    <Box component="section" sx={sx}>
      <ButtonBase
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={regionId}
        sx={{ width: "100%", justifyContent: "space-between", alignItems: "flex-start", textAlign: "left", gap: 2, borderRadius: "8px" }}
      >
        <SectionTitle title={title} subtitle={subtitle} />
        <Box sx={{ color: "primary.main", display: "flex", mt: "2px", mr: 0.5 }}>{open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}</Box>
      </ButtonBase>
      <Collapse in={open} id={regionId}>
        {children}
      </Collapse>
    </Box>
  );
}

/** Renders a paragraph with any email addresses as mailto links. */
function WithEmailLinks({ text }: { text: string }) {
  return (
    <>
      {splitEmails(text).map((part, i) =>
        part.email ? (
          <Link key={i} href={`mailto:${part.text}`} underline="hover" sx={{ overflowWrap: "anywhere" }}>
            {part.text}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

/** FAQ list. One answer open at a time; the first is open on load, as on prod. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  return (
    <Stack sx={{ mt: 2 }}>
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        const answerId = `${baseId}-${i}`;
        return (
          <Box
            key={faq.q}
            sx={(t) => ({
              borderRadius: "8px",
              border: `1px solid ${open ? t.palette.primary.main : "transparent"}`,
              transition: "border-color 160ms ease",
              "& + &": { mt: 1 },
            })}
          >
            <ButtonBase
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              aria-controls={answerId}
              sx={(t) => ({
                width: "100%",
                p: 2,
                gap: 2,
                justifyContent: "space-between",
                alignItems: "flex-start",
                textAlign: "left",
                borderRadius: "8px",
                "&:hover": { bgcolor: open ? "transparent" : alpha(t.palette.text.primary, 0.04) },
              })}
            >
              <Typography component="span" sx={{ fontSize: 16, fontWeight: 500, lineHeight: "28px", color: "text.primary" }}>
                {faq.q}
              </Typography>
              <Box sx={{ color: open ? "primary.main" : "text.primary", display: "flex", mt: "4px", flexShrink: 0 }}>
                {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Box>
            </ButtonBase>
            <Collapse in={open} id={answerId}>
              <Box sx={{ px: 2, pb: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Stack gap={1}>
                  {faq.a.map((para) => (
                    <Typography key={para} sx={{ fontSize: 16, lineHeight: "24px", color: "text.secondary" }}>
                      <WithEmailLinks text={para} />
                    </Typography>
                  ))}
                </Stack>
                {faq.rewardsTable && <RewardsTable />}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
}

/** Rewards per program. Prod shows this as an image; here it's a real, scrollable table. */
function RewardsTable() {
  const head = { px: 1, py: 1, fontSize: 10.5, fontWeight: 600, lineHeight: "13px", letterSpacing: "0.3px", textTransform: "uppercase", color: "text.secondary", textAlign: "center", verticalAlign: "bottom" } as const;
  const cell = { px: 1, py: 1.25, fontSize: 13, lineHeight: "18px", color: "text.primary", textAlign: "center", fontVariantNumeric: "tabular-nums" } as const;
  return (
    <Box
      tabIndex={0}
      role="region"
      aria-label="Referral rewards by program"
      sx={{ mt: 2, maxHeight: 420, overflow: "auto", border: 1, borderColor: "outlineVariant.main", borderRadius: "8px", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}
    >
      <Box component="table" sx={{ width: "100%", minWidth: 400, borderCollapse: "collapse", tableLayout: "fixed" }}>
        {/* Narrow, fixed money columns leave the rest of the width to the program name. */}
        <colgroup>
          <col style={{ width: 40 }} />
          <col />
          <col style={{ width: 66 }} />
          <col style={{ width: 66 }} />
          <col style={{ width: 72 }} />
        </colgroup>
        <Box component="thead" sx={{ position: "sticky", top: 0, bgcolor: "surfaceContainer.high", zIndex: 1 }}>
          <tr>
            <Box component="th" scope="col" sx={head}>
              No.
            </Box>
            <Box component="th" scope="col" sx={{ ...head, textAlign: "left" }}>
              Program name
            </Box>
            <Box component="th" scope="col" sx={head}>
              Friend gets
            </Box>
            <Box component="th" scope="col" sx={head}>
              You get (new)
            </Box>
            <Box component="th" scope="col" sx={head}>
              You get (existing)
            </Box>
          </tr>
        </Box>
        <tbody>
          {REFERRAL_REWARDS.map((r, i) => (
            <Box
              component="tr"
              key={r.program}
              sx={(t) => ({ bgcolor: i % 2 ? alpha(t.palette.primary.main, 0.035) : "transparent", borderTop: `1px solid ${t.palette.outlineVariant.main}` })}
            >
              <Box component="td" sx={{ ...cell, color: "text.secondary" }}>
                {i + 1}
              </Box>
              <Box component="th" scope="row" sx={{ ...cell, fontWeight: 400, textAlign: "left", fontSize: 12.5 }}>
                {r.program}
              </Box>
              <Box component="td" sx={{ ...cell, color: r.friend === null ? "text.secondary" : "text.primary", whiteSpace: "nowrap" }}>
                {formatReward(r.friend)}
              </Box>
              <Box component="td" sx={cell}>
                {formatReward(r.newUser)}
              </Box>
              <Box component="td" sx={cell}>
                {formatReward(r.existingUser)}
              </Box>
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}
