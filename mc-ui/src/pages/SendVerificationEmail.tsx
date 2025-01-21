import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Result } from 'antd';
import { MailOutlined, LoadingOutlined } from '@ant-design/icons';
import { publicApi } from '../services/api';
import { isAxiosError } from '../types/api';
import { Logo } from '../components/Logo';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const SendVerificationEmail: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    setEmail(emailParam);

    if (!emailParam) {
      setError("No email address was provided in the URL. Please check the link and try again.");
    }
  }, []);

  const sendVerificationEmail = async () => {

    setError(null);
    setLoading(true);
    try {
      await publicApi.post('/auth/verify_account', { email });

      setSent(true);
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <Result
          status="error"
          title="Verification Email Error"
          subTitle={error}
          extra={[
            <Button key="login" onClick={() => navigate('/')}>
              Return to Login
            </Button>,
          ]}
        />
      );
    }

    if (sent) {
      return (
        <Result
          status="success"
          title="Verification Email Sent"
          subTitle="Please check your inbox and follow the instructions in the email to verify your account."
          extra={[
            <Button key="login" onClick={() => navigate('/')}>
              Return to Login
            </Button>,
          ]}
        />
      );
    }

    return (
      <>
        <Paragraph className="text-center mt-6">
          Click the button below to send a verification email to:
        </Paragraph>
        <Paragraph className="text-center">
          <Text strong>{email}</Text>
        </Paragraph><Button
          className="w-full max-w-96 h-10 text-lg rounded-lg bg-gradient-to-r from-pink-500 to-red-500 "
          type="primary"
          icon={loading ? <LoadingOutlined /> : <MailOutlined />}
          loading={loading}
          onClick={sendVerificationEmail}
          block
        >
          Send Verification Email
        </Button>
      </>
    );

  }



  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg flex justify-center items-center">
        <Logo />
        <h2 className="text-2xl text-center text-custom">Send Verification Email</h2>
        {renderContent()}
      </Card>
    </div >
  );
};

export default SendVerificationEmail;
