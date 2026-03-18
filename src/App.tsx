import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getUser } from './utils/auth';
import LoginPage from './pages/Loginpage';
import ChatPage from './pages/ChatPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}