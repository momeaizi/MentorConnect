import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Card, Result, Button } from 'antd';
import { publicApi } from '../services/api';
import { isAxiosError } from 'axios';
import { useAuth } from '../providers/AuthProvider';
import { Loader2 } from 'lucide-react'
import { Logo } from '../components/Logo';

const EmailVerification: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      setError(null);
      try {
        const res = await publicApi.get(`/auth/verify/${token}`);
        const { access_token } = res.data;
        login(access_token);

        setSuccess(true);

      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.response?.data?.message || "An unexpected error occurred.");
        } else {
          setError('The verification link is invalid or has expired.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-6 space-y-6 text-center">
            <Loader2 className="w-16 h-16  animate-spin mx-auto" />
            <p>Please wait while we verify your account. This may take a few moments.</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
          <Result
            status="error"
            title="Verification Error"
            subTitle={error}
            extra={[
              <Button key="retry" onClick={() => navigate('/')}>
                Return to Login
              </Button>,
            ]}
          />
      );
    }

    if (success) {
      <Result
            status="success"
            title="mail Verification Successful"
            subTitle="Your email address has been successfully verified! You can now access all the features and services associated with your account. Thank you for verifying your email."
            extra={[
              <Button key="retry" onClick={() => navigate('/home')}>
                Go to Home
              </Button>,
            ]}
          />
    }
  }




  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg flex justify-center items-center">
        <Logo />
        <h2 className="text-2xl text-center text-custom">Verifying Your Account</h2>
        {renderContent()}
      </Card>
    </div >
  );
};

export default EmailVerification;

