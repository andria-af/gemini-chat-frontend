import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ReactMarkdown from "react-markdown";
import type { RefObject } from "react";
import type { IConversation } from "../../types/conversation";
import type { IMessage } from "../../types/message";
import { AppSnackbar } from "../../components/AppSnackbar";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { appBackgrounds, appShadows } from "../../theme/theme";

type ChatViewProps = {
  user: { username: string } | null;
  mode: "light" | "dark";
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  messages: IMessage[];
  input: string;
  loadingConversations: boolean;
  loadingMessages: boolean;
  isSubmittingMessage: boolean;
  isAssistantTyping: boolean;
  isNewChat: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  bottomRef: RefObject<HTMLDivElement | null>;
  onToggleTheme: () => void;
  onCreateConversation: () => void;
  onSelectConversation: (conversation: IConversation) => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onLogout: () => void;
  onCloseSnackbar: () => void;
};

export function ChatView({
  user,
  mode,
  conversations,
  selectedConversation,
  messages,
  input,
  loadingConversations,
  loadingMessages,
  isSubmittingMessage,
  isAssistantTyping,
  snackbarOpen,
  snackbarMessage,
  bottomRef,
  onToggleTheme,
  onCreateConversation,
  onSelectConversation,
  onInputChange,
  onSendMessage,
  onLogout,
  onCloseSnackbar,
  isNewChat,
}: ChatViewProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 2,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? appBackgrounds.dark
            : appBackgrounds.light,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "calc(100vh - 32px)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          overflow: "hidden",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? appShadows.darkCard
              : appShadows.lightCard,
          backdropFilter: "blur(8px)",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            borderRight: { md: "1px solid" },
            borderColor: "divider",
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Stack spacing={2}>
            <ButtonPrimary fullWidth onClick={onCreateConversation}>
              Novo chat
            </ButtonPrimary>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Conversas
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", mt: 2, pr: 0.5 }}>
            <List disablePadding>
              {loadingConversations ? (
                <Typography variant="body2">Carregando conversas...</Typography>
              ) : conversations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conversa ainda.
                </Typography>
              ) : (
                conversations.map((conversation) => (
                  <ListItemButton
                    key={conversation.id}
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                    sx={{ borderRadius: 2, mb: 1 }}
                  >
                    <ListItemText
                      primary={conversation.title || "Sem título"}
                      secondary={new Date(
                        conversation.updatedAt,
                      ).toLocaleString()}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Usuário: {user?.username}
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={onToggleTheme}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  boxShadow: 1,
                }}
              >
                {mode === "light" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>

              <ButtonPrimary onClick={onLogout} sx={{ flex: 1, minHeight: 40 }}>
                Sair
              </ButtonPrimary>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {!selectedConversation && !isNewChat ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Stack spacing={3} sx={{ width: "100%", maxWidth: 720 }}>
                <Typography variant="h4" fontWeight={500} textAlign="center">
                  O que você gostaria de saber?
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    pl: 1.5,
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.default",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small">
                      <AddRoundedIcon />
                    </IconButton>

                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Pergunte alguma coisa"
                      value={input}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          onSendMessage();
                        }
                      }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />

                    <IconButton
                      onClick={onSendMessage}
                      disabled={
                        !input.trim() ||
                        isSubmittingMessage ||
                        isAssistantTyping
                      }
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "action.disabledBackground",
                          color: "action.disabled",
                        },
                      }}
                    >
                      <SendRoundedIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          ) : (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {selectedConversation?.title || "Nova conversa"}
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pr: 1,
                }}
              >
                {loadingMessages ? (
                  <Typography>Carregando mensagens...</Typography>
                ) : messages.length === 0 ? (
                  <Typography color="text.secondary">
                    Ainda não há mensagens nesta conversa.
                  </Typography>
                ) : (
                  messages.map((message) => (
                    <Paper
                      key={message.id}
                      sx={{
                        p: 2,
                        alignSelf:
                          message.role === "user" ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        borderRadius: 3,
                      }}
                      variant="outlined"
                    >
                      <Typography variant="caption" display="block" mb={0.5}>
                        {message.role === "user" ? "Você" : "Gemini"}
                      </Typography>

                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Paper>
                  ))
                )}

                {isAssistantTyping && (
                  <Paper
                    sx={{
                      p: 2,
                      alignSelf: "flex-start",
                      maxWidth: "75%",
                      borderRadius: 3,
                    }}
                    variant="outlined"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />
                      <Typography>Gemini está respondendo...</Typography>
                    </Stack>
                  </Paper>
                )}

                <div ref={bottomRef} />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 1,
                  pl: 1.5,
                  borderRadius: 999,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.default",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small">
                    <AddRoundedIcon />
                  </IconButton>

                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                      }
                    }}
                    slotProps={{
                      input: {
                        disableUnderline: true,
                      },
                    }}
                  />

                  <IconButton
                    onClick={onSendMessage}
                    disabled={
                      !input.trim() || isSubmittingMessage || isAssistantTyping
                    }
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                        color: "action.disabled",
                      },
                    }}
                  >
                    <SendRoundedIcon />
                  </IconButton>
                </Stack>
              </Paper>
            </>
          )}
        </Box>
      </Paper>

      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="error"
        onClose={onCloseSnackbar}
      />
    </Box>
  );
}
