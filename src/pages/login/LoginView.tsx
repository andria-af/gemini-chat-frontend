import {
  Box,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import robotGemini from "../../assets/robot-gemini.png";
import { ButtonPrimary } from "../../components/ButtonPrimary";

type LoginViewProps = {
  username: string;
  loading: boolean;
  error: string;
  mode: "light" | "dark";
  onUsernameChange: (value: string) => void;
  onToggleTheme: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function LoginView({
  username,
  loading,
  error,
  mode,
  onUsernameChange,
  onToggleTheme,
  onSubmit,
}: LoginViewProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          py: 4,
        }}
      >
        <IconButton
          onClick={onToggleTheme}
          sx={{
            position: "absolute",
            top: 24,
            right: 0,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          {mode === "light" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: -1,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box
              component="img"
              src={robotGemini}
              alt="Robô Gemini"
              sx={{
                width: 180,
                maxWidth: "55%",
                filter: (theme) =>
                  theme.palette.mode === "dark"
                    ? "drop-shadow(0 10px 24px rgba(0,0,0,0.45))"
                    : "drop-shadow(0 10px 20px rgba(15,23,42,0.18))",
              }}
            />
          </Box>

          <Paper
            sx={{
              width: "100%",
              p: 4,
              pt: 5,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 20px 50px rgba(0,0,0,0.35)"
                  : "0 20px 50px rgba(15,23,42,0.08)",
              backdropFilter: "blur(8px)",
            }}
            elevation={0}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              mb={1}
              textAlign="center"
            >
              Chat com Gemini
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              textAlign="center"
            >
              Entre com seu nome de usuário para iniciar uma conversa.
            </Typography>

            <Box component="form" onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Nome de usuário"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                margin="normal"
              />

              {error && (
                <Typography color="error" variant="body2" mt={1}>
                  {error}
                </Typography>
              )}

              <ButtonPrimary
                fullWidth
                type="submit"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </ButtonPrimary>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}