import { useState } from 'react';
import type { FormProps } from 'antd';
import { Form, Input, Button } from 'antd';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { isAxiosError } from '../types/api';
import { FireFilled } from '@ant-design/icons';
import "../assets/styles/navBar.css";


type FieldType = {
  username?: string;
  password?: string;
};


const LoginForm = ({ closeModal }: LoginProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      setTimeout(() => navigate('/'), 400);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data?.message == "Verify Your Email" && error.response?.data?.email) {
          navigate(`/send-verification-email?email=${error.response?.data?.email}`);
        }
        else {
          setErrorMessage(error.response?.data?.message || 'An error occurred.');
        }
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
          className="w-full h-[40px] text-lg rounded-lg bg-gradient-to-r from-pink-500 to-red-500 shadow-none"
          type="primary"
          htmlType="submit"
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
      <div className="flex items-center mb-4">
        <FireFilled style={{ color: "#eb2f96" }} className="logo-navbar-fire-icon mr-2" />
        <h1 className="text-4xl font-bold text-white">
          <span className="italic text-3xl font-extrabold font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Matcha
          </span>
        </h1>
      </div>

      <p className="text-2xl mb-6">Login to your account</p>
      <LoginForm closeModal={closeModal} />
    </div>
  );
}

export default Login;