import { useState } from 'react';
import {
  Form,
  Input,
  Button
} from 'antd';
import { publicApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { isAxiosError } from '../types/api';
import { FireFilled } from '@ant-design/icons';


interface CreateAccountFormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}


const CreateAccountForm = ({ closeModal }: CreateAccountProps) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: CreateAccountFormValues) => {
    try {
      const res = await publicApi.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      const { access_token } = res.data;

      closeModal();
      login(access_token);
      setTimeout(() => navigate('/home'), 400);
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
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ width: '100%', maxWidth: 315 }}
      requiredMark={false}
      autoComplete="off"
      scrollToFirstError
    >
      <div className="text-base text-[#D1D1D6] mb-2">Username</div>
      <Form.Item
        name="username"
        tooltip="What do you want others to call you?"
        rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
      >
        <Input
          placeholder="username"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '18px',
            borderRadius: '10px'
          }}
        />
      </Form.Item>

      <div className="text-base text-[#D1D1D6] mb-2">Email</div>
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
          placeholder="E-mail"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '18px',
            borderRadius: '10px'
          }}
        />
      </Form.Item>

      <div className="text-base text-[#D1D1D6] mb-2">Password</div>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          placeholder="Password"
          style={{
            width: '100%',
            height: '40px',
            fontSize: '18px',
            borderRadius: '10px'
          }}
        />
      </Form.Item>

      <div className="text-base text-[#D1D1D6] mb-2">Confirm Password</div>
      <Form.Item
        name="confirm"
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
          style={{
            width: '100%',
            height: '40px',
            fontSize: '18px',
            borderRadius: '10px'
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
          Create account
        </Button>

      </Form.Item>
    </Form>
  );
};


interface CreateAccountProps {
  closeModal: () => void;
}



const CreateAccount = ({ closeModal }: CreateAccountProps) => {
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
      <p className="text-2xl mb-6">Create an account</p>
      <CreateAccountForm closeModal={closeModal} />
    </div>
  );
}

export default CreateAccount;
