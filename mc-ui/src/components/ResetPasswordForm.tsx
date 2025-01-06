import React from 'react';
import { Form, Input, Button } from 'antd';

interface ResetPasswordFormProps {
  onFinish: (values: { email: string }) => void;
  loading: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onFinish, loading }) => {
  return (
    <Form
      name="resetPassword"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      requiredMark={false}
    >
      <div className="text-base text-[#D1D1D6] mb-3">
        Enter your user account's email address and we will send you a password reset link.
      </div>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input
          className="w-full h-10 px-3 py-2 text-sm bg-base border border-custom rounded"
          placeholder="Enter your email"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading}
          className={`w-full h-10 text-lg rounded-lg shadow-none bg-gradient-to-r from-pink-500 to-red-500 text-custom font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-custom inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <div className='flex justify-center items-center'>
              <svg className="w-5 h-5 inline-block mr-2 text-custom" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Password Reset Email
            </div>
          )}
        </Button>
      </Form.Item>
    </Form>
  );
};

