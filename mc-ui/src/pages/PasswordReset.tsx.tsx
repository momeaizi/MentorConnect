import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicApi } from '../services/api';
import { Form, Input, Button, Card, Result } from 'antd';
import axios from 'axios';
import { FireFilled } from '@ant-design/icons';

const PasswordReset: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();


  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await publicApi.post(`/auth/reset-password/${token}`, {
        new_password: values.password
      });
      setSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An unexpected error occurred.');
      } else {
        setError('Failed to reset password. Please try again.');
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
          title="Password Reset Failed"
          subTitle={error}
          extra={[
            <Button key="retry" onClick={() => setError(null)}>
              Try Again
            </Button>,
          ]}
        />
      );
    }

    if (success) {
      return (
        <Result
          status="success"
          title="Password Reset Successful"
          subTitle="Your password has been successfully reset."
          extra={[
            <Button key="home" onClick={() => navigate('/')}>
              Go to Login
            </Button>,
          ]}
        />
      );
    }

    return (
      <Form
        name="resetPassword"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        className='w-full'
      >
        <Form.Item
          name="password"
          label={<span className="text-base text-[#D1D1D6]">Password</span>}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Password"
            className="w-full h-10 px-3 py-2 text-sm bg-base border border-custom rounded"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={<span className="text-base text-[#D1D1D6]">Confirm Password</span>}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm Password"
            className="w-full h-10 px-3 py-2 text-sm bg-base border border-custom rounded"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className={`w-full h-10 text-lg rounded-lg shadow-none bg-gradient-to-r from-pink-500 to-red-500 text-custom font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-custom inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save New Password'
            )}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-base">
      <Card className="w-full max-w-lg p-0">
        <div className="flex justify-center items-center mb-4">
          <FireFilled style={{ color: "#eb2f96" }} className="logo-navbar-fire-icon mr-2" />
          <h1 className="text-4xl font-bold text-white">
            <span className="italic text-3xl font-extrabold font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Matcha
            </span>
          </h1>
        </div>
        <h2 className="text-2xl text-center mb-6 text-custom">Reset your password</h2>
        {renderContent()}
      </Card>
    </div>
  );
};

export default PasswordReset;

