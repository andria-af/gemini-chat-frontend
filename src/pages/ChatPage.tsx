import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createConversation,
  getConversationMessages,
  getUserConversations,
} from "../services/conversation.service";
import { sendMessage } from "../services/chat.service";
import type { IConversation } from "../types/conversation";
import type { IMessage } from "../types/message";
import { AppSnackbar } from "../components/AppSnackbar";
import { clearUser, getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../context/ThemeModeContext";
import { socket } from "../services/socket";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const user = getUser();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const joinedConversationRef = useRef<string | null>(null);

  const { mode, toggleMode } = useThemeMode();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    loadConversations(user.id);
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAssistantTyping]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    if (joinedConversationRef.current !== selectedConversation.id) {
      socket.emit("joinConversation", {
        conversationId: selectedConversation.id,
      });
      joinedConversationRef.current = selectedConversation.id;
    }
  }, [selectedConversation]);

  useEffect(() => {
    function handleMessageCreated(payload: { message: IMessage }) {
      if (payload.message.conversationId !== selectedConversation?.id) return;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === payload.message.id);
        if (exists) return prev;

        const withoutTemp =
          payload.message.role === "user"
            ? prev.filter(
                (msg) =>
                  !(
                    msg.id.startsWith("temp-user-") &&
                    msg.content === payload.message.content
                  ),
              )
            : prev;

        return [...withoutTemp, payload.message];
      });
    }

    function handleAssistantTyping(payload: {
      conversationId: string;
      status: boolean;
    }) {
      if (payload.conversationId !== selectedConversation?.id) return;
      setIsAssistantTyping(payload.status);
    }

    socket.on("messageCreated", handleMessageCreated);
    socket.on("assistantTyping", handleAssistantTyping);

    return () => {
      socket.off("messageCreated", handleMessageCreated);
      socket.off("assistantTyping", handleAssistantTyping);
    };
  }, [selectedConversation]);

  async function loadConversations(userId: string) {
    try {
      setLoadingConversations(true);
      const data = await getUserConversations(userId);
      setConversations(data);
    } catch {
      showError("Não foi possível carregar as conversas.");
    } finally {
      setLoadingConversations(false);
    }
  }

  async function handleCreateConversation() {
    if (!user) return;

    const newConversation = await createConversation({
      userId: user.id,
      title: "Nova conversa",
    });

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
    setInput("");
    setIsAssistantTyping(false);
  }

  async function handleSelectConversation(conversation: IConversation) {
    try {
      setSelectedConversation(conversation);
      setLoadingMessages(true);
      setIsAssistantTyping(false);
      const data = await getConversationMessages(conversation.id);
      setMessages(data);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage() {
    if (
      !selectedConversation ||
      !input.trim() ||
      isSubmittingMessage ||
      isAssistantTyping
    ) {
      return;
    }

    const content = input.trim();
    setInput("");
    setIsSubmittingMessage(true);

    const optimisticUserMessage: IMessage = {
      id: `temp-user-${Date.now()}`,
      conversationId: selectedConversation.id,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        content,
      });

      const updatedConversations = await getUserConversations(user!.id);
      setConversations(updatedConversations);

      const updatedSelected = updatedConversations.find(
        (conversation) => conversation.id === selectedConversation.id,
      );

      if (updatedSelected) {
        setSelectedConversation(updatedSelected);
      }
    } catch {
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticUserMessage.id),
      );
      showError("Não foi possível enviar a mensagem.");
    } finally {
      setIsSubmittingMessage(false);
    }
  }

  function handleLogout() {
    clearUser();
    navigate("/");
  }

  function showError(message: string) {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  return (
    <Box sx={{ minHeight: "100vh", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          height: "calc(100vh - 32px)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            borderRight: { md: "1px solid" },
            borderColor: "divider",
            p: 2,
          }}
        >
          <Stack spacing={2} mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Conversas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuário: {user?.username}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="contained" onClick={handleCreateConversation}>
                Nova
              </Button>

              <Button variant="outlined" onClick={handleLogout}>
                Sair
              </Button>

              <Button variant="outlined" onClick={toggleMode}>
                {mode === "light" ? "Tema escuro" : "Tema claro"}
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

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
                  onClick={() => handleSelectConversation(conversation)}
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

        <Box
          sx={{ p: 3, display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          {!selectedConversation ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Selecione ou crie uma conversa para começar.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {selectedConversation.title || "Conversa"}
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

              <Stack direction="row" spacing={2} mt={2}>
                <TextField
                  fullWidth
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={
                    !input.trim() || isSubmittingMessage || isAssistantTyping
                  }
                >
                  Enviar
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Paper>

      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="error"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}