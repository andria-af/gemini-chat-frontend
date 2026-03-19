import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/Loginpage';


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