import React from 'react';
import {
  Form,
  Input,
  Button
} from 'antd';


interface CreateAccountFormValues {
  username: string;
  email: string;
  password: string;
  confirm: string;
}



const CreateAccountForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: CreateAccountFormValues) => {
    console.log('Received values of form: ', values);
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
          Create account
        </Button>

      </Form.Item>
    </Form>
  );
};





const CreateAccount = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="flex items-center text-4xl font-bold text-white">
        <span className="italic text-3xl font-extrabold	font-sans bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">Matcha</span>
      </h1>
      <p className="text-2xl mb-6">Create an account</p>
      <CreateAccountForm />
    </div>
  );
}

export default CreateAccount;
