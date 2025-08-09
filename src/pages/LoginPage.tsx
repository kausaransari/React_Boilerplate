import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { Form, Input, Button } from 'antd';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const from = location.state?.from?.pathname || '/dashboard';

  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      // Set form error on password field if login error from backend
      form.setFields([
        {
          name: 'password',
          errors: [error],
        },
      ]);
    }
  }, [error, form]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      if (result) {
        navigate(from, { replace: true });
      }
    } catch {
      // error handled via redux slice and effect above
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[500px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email cannot be blank' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password cannot be blank' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary-600 hover:text-primary-500 font-medium"
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
