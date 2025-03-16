import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope as Hospital, Loader2 } from 'lucide-react';
import Input from '../common/Input';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  credential: string;
  password: string;
}

const schema = z.object({
  credential: z.string().min(1, 'Registration number or email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const HospitalLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiMessage, setApiMessage] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiMessage(null);

    try {
      const response = await fetch('https://diseases-backend-pi.vercel.app/api/v1/hospital/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('API Response:', result); // Log full response for debugging

      // Check if login was successful based on status code and optional success flag
      if (response.ok) {
        setApiMessage({ type: 'success', message: 'Welcome back! Login successful.' });

        // Extract token and hospital_id with fallback
        const token = result.token || result.data?.token;
        const hospitalId = result.hospital_id || result.data?.hospital_id;

        // Store token and hospital_id if present
        if (token) {
          localStorage.setItem('authToken', token);
          console.log('Stored authToken:', token);
        } else {
          console.warn('No token returned from API');
        }

        if (hospitalId) {
          localStorage.setItem('hospital_id', hospitalId);
          console.log('Stored hospital_id:', hospitalId);
        } else {
          console.warn('No hospital_id returned from API');
        }

        // Navigate after a short delay
        setTimeout(() => {
          navigate('/hospital/dashboard');
        }, 1000);
      } else {
        // Handle API error response
        setApiMessage({
          type: 'error',
          message: result.message || 'Invalid credentials',
        });
        console.log('Login failed:', result.message);
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Login error:', error);
      setApiMessage({
        type: 'error',
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <Hospital className="h-12 w-12 text-blue-900" />
            <h1 className="mt-3 text-3xl font-bold text-blue-900">Hospital Login</h1>
            <p className="mt-2 text-gray-600">Access the Disease Surveillance System</p>
          </div>

          {apiMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                apiMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {apiMessage.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Registration Number or Email"
              {...register('credential')}
              error={errors.credential?.message}
              placeholder="Enter registration number or email"
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-900 hover:text-blue-800">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-blue-900 text-white rounded-lg font-medium 
                       hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <a href="/hospital/register" className="font-medium text-blue-900 hover:text-blue-800">
                Register here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalLoginForm;