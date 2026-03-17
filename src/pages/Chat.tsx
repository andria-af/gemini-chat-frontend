import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

export function Chat() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Histórico
          </Typography>
        </Box>

        <Divider />

        <List sx={{ flex: 1, overflowY: 'auto' }}>
          <ListItemButton>
            <ListItemText
              primary="Conversa 1"
              secondary="Primeira conversa"
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemText
              primary="Conversa 2"
              secondary="Segunda conversa"
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemText
              primary="Conversa 3"
              secondary="Terceira conversa"
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Área principal */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Chat
          </Typography>
        </Box>

        {/* Mensagens */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: 500,
              alignSelf: 'flex-start',
              borderRadius: 3,
            }}
          >
            <Typography variant="body1">
              Olá, esta é uma mensagem do assistente.
            </Typography>
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: 500,
              alignSelf: 'flex-end',
              borderRadius: 3,
            }}
          >
            <Typography variant="body1">
              Esta é uma mensagem do usuário.
            </Typography>
          </Paper>
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Digite sua mensagem..."
            variant="outlined"
          />
          <Button variant="contained" sx={{ px: 4, borderRadius: 2 }}>
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}