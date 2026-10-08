import { useEffect, useState } from "react";
import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { Check, Copy, ThumbsUp, X } from "lucide-react";
import { track } from "../../lib/analytics";

/**
 * "Thanks for referring your friend!" — the share-link dialog prod opens from
 * Refer Friend: thumbs-up badge, a line of help text and the link with Copy.
 */
export function ReferralLinkDialog({ link, category, onClose }: { link: string | null; category: string; onClose: () => void }) {
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (link) setCopied("idle");
  }, [link]);

  useEffect(() => {
    if (copied === "idle") return;
    const t = window.setTimeout(() => setCopied("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied("copied");
      track("GL:ReferAndEarn_LinkCopied", { category });
    } catch {
      setCopied("failed");
    }
  };

  return (
    <Dialog
      open={!!link}
      onClose={onClose}
      aria-labelledby="referral-link-title"
      PaperProps={{ sx: { width: 444, maxWidth: "calc(100% - 32px)", m: 2, p: 3, borderRadius: "8px", textAlign: "center", position: "relative" } }}
    >
      <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ position: "absolute", top: 12, right: 12, color: "text.secondary" }}>
        <X size={18} />
      </IconButton>
      <Box sx={{ width: 104, height: 104, mx: "auto", borderRadius: "50%", bgcolor: "primary.light", color: "text.primary", display: "grid", placeItems: "center" }}>
        <ThumbsUp size={52} strokeWidth={1.6} />
      </Box>
      <Typography id="referral-link-title" component="h2" sx={{ mt: 3, fontSize: 20, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px", color: "text.primary" }}>
        Thanks for referring your friend!
      </Typography>
      <Typography sx={{ mt: 1, fontSize: 14, lineHeight: "20px", color: "text.secondary" }}>
        Please share this link with your friend to help them get started, after which we will contact them shortly
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{ mt: 2, height: 60, pl: 1.5, pr: 1, border: 1, borderColor: "outlineVariant.main", borderRadius: "8px", textAlign: "left" }}
      >
        <Typography noWrap title={link ?? undefined} sx={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: "20px", color: "text.primary" }}>
          {link}
        </Typography>
        <Button
          onClick={copy}
          size="small"
          startIcon={copied === "copied" ? <Check size={14} /> : <Copy size={14} />}
          sx={{ flexShrink: 0, height: 32, px: 1, fontSize: 13, fontWeight: 500, color: copied === "failed" ? "error.main" : "primary.main" }}
        >
          {copied === "copied" ? "Copied" : copied === "failed" ? "Couldn't copy" : "Copy"}
        </Button>
      </Stack>
      <Box component="span" role="status" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {copied === "copied" ? "Referral link copied" : copied === "failed" ? "Couldn't copy the referral link" : ""}
      </Box>
    </Dialog>
  );
}
