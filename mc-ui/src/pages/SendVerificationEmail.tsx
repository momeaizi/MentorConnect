import React, { useState, useEffect } from 'react';
import { Button, message, Typography, Card, Result } from 'antd';
import { MailOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../services/api';
import { isAxiosError } from '../types/api';

const { Title, Paragraph, Text } = Typography;

const SendVerificationEmail: React.FC = () => {
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
      const res = await api.post('/auth/verify_account', { email });

      // In a real application, you would make an API call here
      // const response = await api.sendVerificationEmail(email);

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

  if (email === null) {
    return (
      <Result
        status="error"
        title="Missing Email Address"
        subTitle="No email address was provided in the URL. Please check the link and try again."
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg flex justify-center items-center">
        <Title level={2} className="text-center">
          Send Verification Email
        </Title>
        <Paragraph className="text-center">
          Click the button below to send a verification email to:
        </Paragraph>
        <Paragraph className="text-center">
          <Text strong>{email}</Text>
        </Paragraph>
        {sent ? (
          <Result
            status="success"
            title="Verification Email Sent"
            subTitle="Please check your inbox and follow the instructions in the email to verify your account."
            extra={[
              <Button key="home" onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>,
            ]}
          />
        ) : (
          <Button
            className="w-full max-w-96 h-10 text-lg rounded-lg bg-gradient-to-r from-pink-500 to-red-500 shadow-none"
            type="primary"
            icon={loading ? <LoadingOutlined /> : <MailOutlined />}
            loading={loading}
            onClick={sendVerificationEmail}
            block
          >
            Send Verification Email
          </Button>
        )}
      </Card>
    </div>
  );
};

export default SendVerificationEmail;
