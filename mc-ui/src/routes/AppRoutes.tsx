import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SendVerificationEmail from '../pages/SendVerificationEmail';
import EmailVerification from '../pages/EmailVerification';
import Home from '../pages/Home';
import SendPasswordResetEmail from '../pages/SendPasswordResetEmail';
import PasswordReset from '../pages/PasswordReset.tsx';
import LandingPage from '../pages/landingPage.tsx';
import PublicRoute from './PublicRoute.tsx';
import UserProfilePage from '../pages/UserProfilePage.tsx';
import NotFound from '../pages/NotFound.tsx';
import Navbar from '../components/NavBar/NavBar';
import NotificationPage from '../pages/Notification';
import ChatPage from '../pages/Chat';
import HistoryPage from '../pages/History';
import FavoriePage from '../pages/Favorie';
import ProfilePage from '../pages/ProfilePage';
import { useAuth } from '../providers/AuthProvider.tsx';
import '../assets/styles/chat.css'

const AppRoutes = () => {
  const { payload } = useAuth();
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route
          path="/"
          element={
            <LandingPage />
          }
        />
        <Route
          path="/send-reset-password-email"
          element={
            <SendPasswordResetEmail />
          }
        />
        <Route
          path="/send-verification-email"
          element={
            <SendVerificationEmail />
          }
        />
        <Route
          path="/verify-email/:token"
          element={
            <EmailVerification />
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PasswordReset />
          }
        />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route
          path="/home"
          element={
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <div className='p-0 h-full w-screen overflow-x-hidden'>
                <Home />
              </div>
            </div>
          }
        />
        <Route
          path="/profiles/:username"
          element={
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <div className='p-0 h-full w-screen overflow-x-hidden'>
                <UserProfilePage />
              </div>
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div className={`h-screen w-screen ${(payload?.is_complete) ? "grid grid-cols-1 grid-rows-[72px_1fr]" : ""} overflow-hidden`}>
              {payload?.is_complete && <Navbar />}
              <div className='p-0 h-full w-screen overflow-x-hidden'>
                <ProfilePage />
              </div>
            </div>
          }
        />


        <Route
          path="/notification"
          element={
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <div className='p-0 h-full w-screen overflow-hidden'>
                <NotificationPage />
              </div>
            </div>
          }
        />

        <Route
          path="/chat"
          element={

            <div className="chat-app-route-parent overflow-hidden">
              <div className="chat-app-navbar">
                <Navbar />
              </div>
              <ChatPage />
            </div>

          }
        />

        <Route
          path="/history"
          element={

            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <HistoryPage />
            </div>

          }
        />

        <Route
          path="/favorie"
          element={

            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <FavoriePage />
            </div>

          }
        />

      </Route>
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;