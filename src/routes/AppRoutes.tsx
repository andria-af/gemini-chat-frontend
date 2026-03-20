import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from "../pages/login/LoginPage";
import ChatPage from '../pages/chat/ChatPage';



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