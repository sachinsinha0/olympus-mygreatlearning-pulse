import { Box, Card, Stack, Typography } from "@mui/material";
import sampleCertificate from "../../assets/sample-certificate.png";

export function CertificateBlock() {
  return (
    <Card sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack gap={2}>
        <Box
          sx={(theme) => ({
            width: "100%",
            borderRadius: 1.5,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.surfaceContainer.lowest,
          })}
        >
          <Box
            component="img"
            src={sampleCertificate}
            alt="Sample Pulse certificate of completion"
            sx={{ display: "block", width: "100%", height: "auto" }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: "text.primary", mb: 0.5 }}>
            Earn a Pulse certificate
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Finish all segments, the Test Your Understanding checks, and the hands-on demo to
            unlock a verifiable Pulse certificate you can share to LinkedIn.
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
