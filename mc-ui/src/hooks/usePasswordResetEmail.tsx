import { useState } from 'react';
import axios from 'axios';
import { publicApi } from '../services/api';
import { message } from 'antd';

export const usePasswordResetEmail = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    try {
      await publicApi.post('/auth/forgot-password', { email });
      message.success('Password reset email sent successfully!');
      setSent(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'An error occurred while sending the password reset email.');
      } else {
        message.error('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, sent, sendResetEmail };
};

