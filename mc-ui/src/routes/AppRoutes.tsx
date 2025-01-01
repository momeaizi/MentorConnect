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

const AppRoutes = () => {
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
          element={<Home />}
        />
        <Route
          path="/profiles/:username"
          element={
            <UserProfilePage />
          }
        />
        <Route
          path="/chat"
          element={
            <div>chat</div>
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