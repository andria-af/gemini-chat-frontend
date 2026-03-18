import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { saveUser } from '../utils/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Informe um nome de usuário');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ username: username.trim() });
      saveUser(user);
      navigate('/chat');
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ width: '100%', p: 4, borderRadius: 3 }} elevation={3}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Chat com Gemini
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Entre com seu nome de usuário para iniciar uma conversa.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3, height: 48 }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}