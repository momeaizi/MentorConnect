import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../services/api';
import { isAxiosError } from 'axios';

const EmailVerification: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {

      console.log(token);

      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        await api.get(`/auth/verify/${token}`);
        navigate('/');

      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.response?.data?.message);
        } else {
          setError('The verification link is invalid or has expired.');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-custom text-2xl">Verifying your email...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 rounded-lg shadow-md max-w-md w-full border border-custom">
          <h2 className="text-2xl font-bold  mb-4">Verification Error</h2>
          <p className="text-custom mb-4">{error}</p>
          <button
            className="w-full h-[40px] text-lg rounded-lg bg-gradient-to-r from-pink-500 to-red-500 shadow-none"
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null; // This will not be rendered as the component will redirect on success
};

export default EmailVerification;

