import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SendVerificationEmail from '../pages/SendVerificationEmail';
import EmailVerification from '../pages/EmailVerification';
import Home from '../pages/Home';
import Navbar from '../components/NavBar/NavBar';

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
          // <PrivateRoute>
          <div>
              <Navbar/>  
          </div>
          // </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;