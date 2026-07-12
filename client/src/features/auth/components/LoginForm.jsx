import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// 1. Define the validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const LoginForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  // 2. Initialize the form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 3. Handle submission
  const onSubmit = async (data) => {
    try {
      setError('');
      const response = await loginUser(data);
      
      // Save to global store
      setCredentials(response.user, response.accessToken);
      
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">AssetFlow Login</h2>
      
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input 
          {...register('email')}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          placeholder="admin@company.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input 
          type="password"
          {...register('password')}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
