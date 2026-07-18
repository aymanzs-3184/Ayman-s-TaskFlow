import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-xl p-8">

        <div className="text-center mb-8">
          <img src="/taskflow-icon.svg" alt="TaskFlow" className="w-11 h-11 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your TaskFlow account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password}
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-150"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}