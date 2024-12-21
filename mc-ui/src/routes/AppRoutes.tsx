import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SendVerificationEmail from '../pages/SendVerificationEmail';
import EmailVerification from '../pages/EmailVerification';
import Home from '../pages/Home';
import Navbar from '../components/NavBar/NavBar';
import NotificationPage from '../pages/Notification';
import ChatPage from '../pages/Chat';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home />
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
        path="/profile"
        element={
          <PrivateRoute>
            <Navbar/> 
          </PrivateRoute>
        }
      />


      <Route
        path="/notification"
        element={
          <PrivateRoute>
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <div className='p-0 h-full w-screen overflow-hidden'>
              <NotificationPage/> 
              </div>
            </div>
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <div className="h-screen w-screen grid grid-cols-1 grid-rows-[72px_1fr] overflow-hidden">
              <Navbar />
              <ChatPage />
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;