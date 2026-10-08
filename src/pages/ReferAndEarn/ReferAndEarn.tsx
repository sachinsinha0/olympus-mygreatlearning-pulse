import { useEffect, useState } from "react";
import { Box, Button, Divider, FormControlLabel, Link, Radio, RadioGroup, Stack, Tooltip, Typography } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import { ChevronRight, DollarSign, Info, PhoneOutgoing, SmilePlus, UserPlus, type LucideIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import coins from "../../assets/referral-coins.png";
import { OlympusShell } from "../../components/common/OlympusShell";
import { track } from "../../lib/analytics";
import {
  REFERRAL_CATEGORIES,
  REFERRAL_FAQS,
  REFERRAL_HISTORY,
  REFERRAL_STEPS,
  type ReferralCategory,
  type ReferralHistoryItem,
  type ReferralStep,
} from "../../lib/referral/content";
import { buildReferralLink, formatReferredOn, STATUS_LABEL } from "../../lib/referral/referral";
import { referralOffer } from "../../lib/referral/offer";
import { cardSx, CollapsibleSection, FaqList, SectionTitle } from "./parts";
import { ReferralLinkDialog } from "./ReferralLinkDialog";

/** The learner's id, as carried in their referral link. Prototype value. */
const LMS_USER_ID = 49254;

/**
 * /refer_and_earn — clone of Olympus' Refer & Earn page. Pick a program for
 * your friend, get a share link; how it works, referral history and FAQs.
 */
export function ReferAndEarn() {
  const [category, setCategory] = useState<ReferralCategory>("My Program");
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    track("GL:ReferAndEarn_Viewed");
  }, []);

  const referFriend = () => {
    setLink(buildReferralLink(category, LMS_USER_ID, Date.now()));
    track("GL:ReferAndEarn_LinkGenerated", { category });
  };

  return (
    <OlympusShell maxWidth={1088} sx={{ pt: { xs: 2, md: 3 } }}>
      <Breadcrumbs />
      <Hero />

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* Left: refer a friend, then help & support */}
        <Box sx={cardSx}>
          <Box component="section" aria-labelledby="refer-a-friend-title">
            <SectionTitle id="refer-a-friend-title" title="Refer a friend" subtitle="Select an ideal program for your friend" />
            <RadioGroup
              aria-labelledby="refer-a-friend-title"
              value={category}
              onChange={(e) => setCategory(e.target.value as ReferralCategory)}
              sx={{ mt: 2, gap: 0.5 }}
            >
              {REFERRAL_CATEGORIES.map((c) => (
                <FormControlLabel
                  key={c}
                  value={c}
                  control={<Radio size="small" sx={{ p: 1, "& .MuiSvgIcon-root": { fontSize: 22 } }} />}
                  label={c}
                  sx={{ m: 0, "& .MuiFormControlLabel-label": { fontSize: 16, lineHeight: "24px", color: "text.primary" } }}
                />
              ))}
            </RadioGroup>
            <Typography sx={{ mt: 2, fontSize: 12, lineHeight: "16px", letterSpacing: "-0.2px", color: "text.secondary" }}>
              Note: Not sure what your friend's preferences are? No worries! One of our team members will connect with them to recommend the ideal program or degree
            </Typography>
            <Button variant="contained" onClick={referFriend} sx={{ mt: 3, height: 48, px: 3, fontSize: 16, fontWeight: 500, letterSpacing: 0, borderRadius: "4px" }}>
              Refer Friend
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <CollapsibleSection title="Help & Support" subtitle="Frequently asked questions about our referral program">
            <FaqList faqs={REFERRAL_FAQS} />
          </CollapsibleSection>
        </Box>

        {/* Right: how it works, then referral history */}
        <Box sx={cardSx}>
          <CollapsibleSection title="How it works?" subtitle="Learn more about our referral program">
            <Stack component="ol" gap={4} sx={{ m: 0, mt: 3, p: 0, listStyle: "none" }}>
              {REFERRAL_STEPS.map((step, i) => (
                <Step key={step.title} step={step} n={i + 1} />
              ))}
            </Stack>
          </CollapsibleSection>

          <Divider sx={{ my: 3 }} />

          <CollapsibleSection title="Referral history" subtitle="Referrals you have done until now">
            <Stack gap={1.5} sx={{ mt: 2 }}>
              {REFERRAL_HISTORY.length ? (
                REFERRAL_HISTORY.map((r) => <HistoryCard key={r.email} item={r} />)
              ) : (
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Referrals you make will show up here.</Typography>
              )}
            </Stack>
          </CollapsibleSection>
        </Box>
      </Box>

      <ReferralLinkDialog link={link} category={category} onClose={() => setLink(null)} />
    </OlympusShell>
  );
}

function Breadcrumbs() {
  return (
    <Stack component="nav" aria-label="Breadcrumb" direction="row" alignItems="center" gap={1} sx={{ fontSize: 16, lineHeight: "24px" }}>
      <Link component={RouterLink} to="/" underline="hover" sx={{ color: "text.secondary" }}>
        Dashboard
      </Link>
      <Box component={ChevronRight} size={16} sx={{ color: "text.secondary" }} aria-hidden />
      <Box component="span" aria-current="page" sx={{ color: "primary.main" }}>
        Refer &amp; Earn
      </Box>
    </Stack>
  );
}

function heroColors(t: Theme) {
  const dark = t.palette.mode === "dark";
  return {
    bg: dark ? alpha("#FF9800", 0.1) : "#ffeee3",
    border: dark ? alpha("#FF9800", 0.22) : "#fbe1cf",
    reward: dark ? "#ffcf8a" : "#9a5a07",
  };
}

/** Prod bakes this banner into one image; here the copy is real text beside the coins. */
function Hero() {
  return (
    <Box
      component="section"
      aria-labelledby="refer-earn-title"
      sx={(t) => ({
        mt: 2,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 3,
        minHeight: { md: 216 },
        px: { xs: 2.5, md: 4.25 },
        py: { xs: 3, md: 3 },
        bgcolor: heroColors(t).bg,
        border: `1px solid ${heroColors(t).border}`,
        borderRadius: "8px",
      })}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography id="refer-earn-title" component="h1" sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.8px", color: "text.primary" }}>
          Refer &amp; Earn Up to{" "}
          <Box component="span" sx={(t) => ({ color: heroColors(t).reward })}>
            ${referralOffer.maxReward}
          </Box>
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: { xs: 15, md: 17 }, lineHeight: 1.4, color: "text.secondary" }}>
          Get epic rewards once your referred friend enrolls in Great Learning programs &amp; degrees
        </Typography>
        <Typography sx={{ mt: { xs: 2, md: 3.5 }, fontSize: 12.5, letterSpacing: "0.3px", color: "text.secondary" }}>*Terms &amp; Conditions Apply.</Typography>
      </Box>
      <Box
        component="img"
        src={coins}
        alt=""
        sx={{ width: { xs: 84, sm: 120, md: 152 }, height: "auto", aspectRatio: "309 / 305", flexShrink: 0, mr: { md: 1.5 } }}
      />
    </Box>
  );
}

const STEP_ICON: Record<ReferralStep["icon"], LucideIcon> = {
  refer: UserPlus,
  accept: SmilePlus,
  call: PhoneOutgoing,
  reward: DollarSign,
};

function Step({ step, n }: { step: ReferralStep; n: number }) {
  const Icon = STEP_ICON[step.icon];
  return (
    <Stack component="li" direction="row" gap={2} alignItems="center">
      <Box sx={(t) => ({ width: 64, height: 64, flexShrink: 0, borderRadius: "8px", bgcolor: alpha(t.palette.primary.main, 0.08), color: "text.primary", display: "grid", placeItems: "center" })}>
        <Icon size={24} strokeWidth={1.75} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, lineHeight: "14px", letterSpacing: "1px", textTransform: "uppercase", color: "primary.main" }}>Step {n}</Typography>
        <Typography component="h3" sx={{ mt: 0.5, fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "text.primary" }}>
          {step.title}
        </Typography>
        <Typography sx={{ mt: 0.25, fontSize: 14, lineHeight: "20px", color: "text.secondary" }}>{step.body}</Typography>
      </Box>
    </Stack>
  );
}

function HistoryCard({ item }: { item: ReferralHistoryItem }) {
  return (
    <Box sx={{ p: 2, border: 1, borderColor: "outlineVariant.main", borderRadius: "8px" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: "24px", color: "text.primary" }}>{item.name}</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 12, lineHeight: "16px", letterSpacing: "-0.2px", color: "text.secondary", overflowWrap: "anywhere" }}>
            {item.email} - {formatReferredOn(item.referredOn)}
          </Typography>
        </Box>
        <Box
          component="span"
          sx={(t) => ({
            flexShrink: 0,
            px: 1.5,
            height: 30,
            display: "inline-flex",
            alignItems: "center",
            fontSize: 12,
            lineHeight: "16px",
            letterSpacing: "-0.2px",
            color: t.palette.extended.warning.color,
            border: `1px solid ${alpha(t.palette.extended.warning.color, 0.55)}`,
            borderRadius: "8px",
            whiteSpace: "nowrap",
          })}
        >
          {STATUS_LABEL[item.status]}
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: "28px", letterSpacing: "-0.4px", color: "text.primary" }}>${item.reward}</Typography>
        <Tooltip title="Reward will be credited once your friend enrols in a program" arrow>
          <Box component="button" type="button" aria-label="About this reward" sx={{ all: "unset", cursor: "help", display: "flex", color: "text.secondary", borderRadius: "50%", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}>
            <Info size={18} />
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );
}
