import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import { saveUser } from "../../utils/auth";
import { useThemeMode } from "../../context/ThemeModeContext";
import { LoginView } from "./LoginView";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Informe um nome de usuário");
      return;
    }

    try {
      setLoading(true);
      const user = await login({ username: username.trim() });
      saveUser(user);
      navigate("/chat");
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginView
      username={username}
      loading={loading}
      error={error}
      mode={mode}
      onUsernameChange={setUsername}
      onToggleTheme={toggleMode}
      onSubmit={handleSubmit}
    />
  );
}