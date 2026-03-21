import { Alert, Snackbar } from '@mui/material';

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export function AppSnackbar({
  open,
  message,
  severity = 'info',
  onClose,
}: AppSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}