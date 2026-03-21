import Button, { type ButtonProps } from "@mui/material/Button";

export function ButtonPrimary({
  children,
  sx,
  ...props
}: ButtonProps) {
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        height: 48,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.04em",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #2f3747 0%, #48546b 100%)"
            : "linear-gradient(135deg, #d9dee7 0%, #bfc8d6 100%)",
        color: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.common.white
            : "#1f2937",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.12)"
            : "rgba(31,41,55,0.10)",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 10px 24px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 14px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.06)"
              : "0 14px 28px rgba(15,23,42,0.16), 0 0 0 1px rgba(148,163,184,0.18)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #394255 0%, #55627c 100%)"
              : "linear-gradient(135deg, #e3e8ef 0%, #cfd7e3 100%)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
        "&:disabled": {
          opacity: 0.65,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}