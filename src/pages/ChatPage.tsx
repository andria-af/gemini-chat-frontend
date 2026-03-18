import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { getUser } from '../utils/auth';
import {
  createConversation,
  getConversationMessages,
  getUserConversations,
} from '../services/conversation.service';
import type { IConversation } from '../types/conversation';
import type { IMessage } from '../types/message';

export default function ChatPage() {
  const user = getUser();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadConversations(user.id);
  }, [user?.id]);

  async function loadConversations(userId: string) {
    try {
      setLoadingConversations(true);
      const data = await getUserConversations(userId);
      setConversations(data);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function handleCreateConversation() {
    if (!user) return;

    const newConversation = await createConversation({
      userId: user.id,
      title: 'Nova conversa',
    });

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
  }

  async function handleSelectConversation(conversation: IConversation) {
    try {
      setSelectedConversation(conversation);
      setLoadingMessages(true);
      const data = await getConversationMessages(conversation.id);
      setMessages(data);
    } finally {
      setLoadingMessages(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          height: 'calc(100vh - 32px)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        <Box sx={{ borderRight: { md: '1px solid' }, borderColor: 'divider', p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Conversas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.username}
              </Typography>
            </Box>

            <Button variant="contained" onClick={handleCreateConversation}>
              Nova
            </Button>
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
                    primary={conversation.title || 'Sem título'}
                    secondary={new Date(conversation.updatedAt).toLocaleString()}
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </Box>

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          {!selectedConversation ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">
                Selecione ou crie uma conversa para começar.
              </Typography>
            </Box>
          ) : loadingMessages ? (
            <Typography>Carregando mensagens...</Typography>
          ) : (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {selectedConversation.title || 'Conversa'}
              </Typography>

              {messages.length === 0 ? (
                <Typography color="text.secondary">
                  Ainda não há mensagens nesta conversa.
                </Typography>
              ) : (
                messages.map((message) => (
                  <Paper
                    key={message.id}
                    sx={{
                      p: 2,
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      borderRadius: 3,
                    }}
                    variant="outlined"
                  >
                    <Typography variant="caption" display="block" mb={0.5}>
                      {message.role === 'user' ? 'Você' : 'Gemini'}
                    </Typography>
                    <Typography>{message.content}</Typography>
                  </Paper>
                ))
              )}
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}