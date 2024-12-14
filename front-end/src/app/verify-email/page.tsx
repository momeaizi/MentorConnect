"use client"
import React, { useEffect } from 'react';
import { Card, Typography, Button, message } from 'antd';
import api from '@/apis/api';
import { useAuthContext } from '@/context/AuthContext';
const { Title, Paragraph } = Typography;

export default function UnverifiedUser() {
  const { user } = useAuthContext();
  const sendVerification = async () => {
    console.log(user);
    try {
      const res = await api.post('/auth/verify_account', {
        username: user.username,
      });
      
      message.success('Verification email sent successfully');
    } catch (error) {
      message.error('Failed to send verification email');
    }
  };

  useEffect(() => {
    // sendVerification();
    console.log('HERE!');
  }, []);

  return (
    <Card style={{ width: 350 }}>
      <Title level={4}>Email Verification Required</Title>
      <Paragraph style={{ textAlign: 'center' }}>
        Please verify your email address to access this page. Check your inbox for a verification link.
      </Paragraph>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary" onClick={sendVerification} className="bg-gradient-to-r from-pink-500 to-red-500 shadow-none">
          Resend Verification Email
        </Button>
      </div>
    </Card>
  );
}

