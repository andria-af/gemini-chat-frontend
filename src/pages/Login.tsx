import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  function handleEnter() {
    navigate('/chat');
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" mb={3} fontWeight={700}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          placeholder="Digite seu username"
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2, py: 1.4, borderRadius: 2 }}
          onClick={handleEnter}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}