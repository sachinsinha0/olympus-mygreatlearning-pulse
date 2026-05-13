import { Typography, type TypographyProps } from "@mui/material";
import type { ReactNode } from "react";

export function SectionHeading({ children, sx, ...rest }: { children: ReactNode } & TypographyProps) {
  return (
    <Typography variant="h5" sx={{ color: "text.primary", ...sx }} {...rest}>
      {children}
    </Typography>
  );
}
