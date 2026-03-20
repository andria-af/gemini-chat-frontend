import { useEffect, useRef, useState } from "react";
import { clearUser, getUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../context/ThemeModeContext";
import { socket } from "../../services/socket";
import {
  createConversation,
  getConversationMessages,
  getUserConversations,
} from "../../services/conversation.service";
import { sendMessage } from "../../services/chat.service";
import type { IConversation } from "../../types/conversation";
import type { IMessage } from "../../types/message";
import { ChatView } from "./ChatView";

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

    try {
      const newConversation = await createConversation({
        userId: user.id,
        title: "Nova conversa",
      });

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setMessages([]);
      setInput("");
      setIsAssistantTyping(false);
    } catch {
      showError("Não foi possível criar uma nova conversa.");
    }
  }

  async function handleSelectConversation(conversation: IConversation) {
    try {
      setSelectedConversation(conversation);
      setLoadingMessages(true);
      setIsAssistantTyping(false);
      const data = await getConversationMessages(conversation.id);
      setMessages(data);
    } catch {
      showError("Não foi possível carregar as mensagens.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function ensureConversationBeforeSend() {
    if (selectedConversation || !user) return selectedConversation;

    const newConversation = await createConversation({
      userId: user.id,
      title: "Nova conversa",
    });

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
    setIsAssistantTyping(false);

    return newConversation;
  }

  async function handleSendMessage() {
    if (!input.trim() || isSubmittingMessage || isAssistantTyping || !user) {
      return;
    }

    const content = input.trim();
    setInput("");
    setIsSubmittingMessage(true);

    let activeConversation = selectedConversation;

    try {
      activeConversation = await ensureConversationBeforeSend();

      if (!activeConversation) {
        throw new Error("Conversation not created");
      }

      const conversationId = activeConversation.id;

      const optimisticUserMessage: IMessage = {
        id: `temp-user-${Date.now()}`,
        conversationId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMessage]);

      await sendMessage({
        conversationId,
        content,
      });

      const updatedConversations = await getUserConversations(user.id);
      setConversations(updatedConversations);

      const updatedSelected = updatedConversations.find(
        (conversation) => conversation.id === conversationId,
      );

      if (updatedSelected) {
        setSelectedConversation(updatedSelected);
      }
    } catch {
      setMessages((prev) =>
        prev.filter((msg) => !msg.id.startsWith("temp-user-")),
      );
      showError("Não foi possível enviar a mensagem.");
      setInput(content);
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
    <ChatView
      user={user}
      mode={mode}
      conversations={conversations}
      selectedConversation={selectedConversation}
      messages={messages}
      input={input}
      loadingConversations={loadingConversations}
      loadingMessages={loadingMessages}
      isSubmittingMessage={isSubmittingMessage}
      isAssistantTyping={isAssistantTyping}
      snackbarOpen={snackbarOpen}
      snackbarMessage={snackbarMessage}
      bottomRef={bottomRef}
      onToggleTheme={toggleMode}
      onCreateConversation={handleCreateConversation}
      onSelectConversation={handleSelectConversation}
      onInputChange={setInput}
      onSendMessage={handleSendMessage}
      onLogout={handleLogout}
      onCloseSnackbar={() => setSnackbarOpen(false)}
    />
  );
}