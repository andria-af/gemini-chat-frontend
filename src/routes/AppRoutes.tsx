import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/Loginpage';
import { ChatPage } from '../pages/ChatPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}