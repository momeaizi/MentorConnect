
import React, { FC, useState } from 'react';
import type { FormProps } from 'antd';
import { Form, Input, Button } from 'antd';
import axios, { AxiosError } from 'axios';
import api from '@/apis/api';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

type FieldType = {
  username?: string;
  password?: string;
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

const LoginForm: FC = ({ closeModal }: LoginProps) => {
  const router = useRouter();
  const { login } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const res = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      const { access_token } = res.data;

      closeModal();
      login(access_token);
      setTimeout(() => router.push('/home'), 400);
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };


  return (
    <Form
      name="login"
      layout="vertical"
      style={{ width: '100%', maxWidth: 315 }}
      onFinish={onFinish}
      autoComplete="off"
      requiredMark={false}
    >
      <div className="text-base text-[#D1D1D6] mb-2">Username</div>
      <Form.Item<FieldType>
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input
          placeholder="Enter your username"
          style={{
            height: '40px',
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </Form.Item>

      <div className="flex justify-between">
        <div className="text-base text-[#D1D1D6] mb-2">Password</div>
        <div className="text-base text-[#70707B] hover:text-[#ec4899] mb-2 cursor-pointer " onClick={() => { console.log('clicked') }}>Forgot ?</div>
      </div>
      <Form.Item<FieldType>
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
          placeholder="Enter your password"
          style={{
            height: '40px',
            fontSize: '16px',
            borderRadius: '8px',
          }}
        />
      </Form.Item>

      {errorMessage && <div className="mb-[16px] text-base text-red-400">{errorMessage}</div>}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '18px',
            borderRadius: '10px',
            boxShadow: 'none',
          }}
        >
          Login now
        </Button>

      </Form.Item>
    </Form>
  );
};


interface LoginProps {
  closeModal: () => void;
}



const Login = ({ closeModal }: LoginProps) => {
  return (

    <div className="flex flex-col justify-center items-center">
      <h1 className="flex items-center text-4xl font-bold text-white">
        <span className="italic text-3xl font-extrabold	font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Matcha</span>
      </h1>
      <p className="text-2xl mb-6">Login to your account</p>
      <LoginForm closeModal={closeModal}/>
    </div>
  );
}

export default Login;