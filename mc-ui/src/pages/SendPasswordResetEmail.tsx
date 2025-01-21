import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Result, Button } from 'antd';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { usePasswordResetEmail } from '../hooks/usePasswordResetEmail';
import { Logo } from '../components/Logo';

const SendPasswordResetEmail: React.FC = () => {
  const navigate = useNavigate();
  const { loading, sent, sendResetEmail } = usePasswordResetEmail();

  const handleFinish = (values: { email: string }) => {
    sendResetEmail(values.email);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-base">
      <Card className="w-full max-w-lg">
        <Logo />
        <h2 className="text-2xl text-center mb-6 text-custom">Reset your password</h2>
        {sent ? (
          <Result
            status="success"
            title="Password Reset Email Sent"
            subTitle="Please check your inbox and follow the instructions in the email to reset your password."
            extra={[
              <Button key="home" onClick={() => navigate('/')} className="bg-gradient-to-r from-pink-500 to-red-500 text-white border-none">
                Return to Login
              </Button>,
            ]}
          />
        ) : (
          <ResetPasswordForm onFinish={handleFinish} loading={loading} />
        )}
      </Card>
    </div>
  );
};

export default SendPasswordResetEmail;

