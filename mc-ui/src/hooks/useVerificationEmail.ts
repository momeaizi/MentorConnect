import { useState, useEffect } from 'react';
import { message } from 'antd';
import { publicApi } from '../services/api';
import { isAxiosError } from '../types/api';

export const useVerificationEmail = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    setEmail(emailParam);
  }, []);

  const sendVerificationEmail = async () => {
    if (!email) {
      message.error('No email address provided');
      return;
    }

    setLoading(true);
    try {
      await publicApi.post('/auth/verify_account', { email });
      message.success('Verification email sent successfully!');
      setSent(true);
    } catch (error) {
      if (isAxiosError(error)) {
        message.error(error.response?.data?.message || 'An error occurred.');
      } else {
        message.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { email, loading, sent, sendVerificationEmail };
};

