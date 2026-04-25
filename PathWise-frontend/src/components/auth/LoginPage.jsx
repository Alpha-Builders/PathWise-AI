import React, { useState } from 'react';
import { Link, useNavigate } from 
'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { api } from '../../api/client';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(api.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Login failed.');
      }

      console.log("Saving token:", data.token)
      localStorage.setItem('token', data.token);
      localStorage.setItem('firstName', data.user.first_name);
      localStorage.setItem('lastName', data.user.last_name);

      navigate('/select-path');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-4 relative" style={{ background: '#101727' }}>
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '15%', width: '400px', height: '200px', background: '#01742B', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.3, zIndex: 1 }} />
      <div className="absolute pointer-events-none" style={{ top: '60%', right: '10%', width: '300px', height: '150px', background: '#01742B', borderRadius: '50%', filter: 'blur(70px)', opacity: 0.2, zIndex: 1 }} />

      <nav className="flex items-center justify-between px-12 py-4 relative overflow-hidden w-full max-w-[95%] mx-auto mb-8" style={{ background: 'rgba(19, 21, 27, 0.03)', backdropFilter: 'blur(7.4px)', borderRadius: '17px', zIndex: 10 }}>
        <div className="text-green-400 font-bold text-xl">PathWise AI</div>
        <Link to="/" className="text-white hover:text-green-400 transition-colors duration-200 flex items-center space-x-2">
          <span>🏠</span><span>Home</span>
        </Link>
      </nav>

      <div className="flex items-center justify-center min-h-[70vh] relative z-10">
        <div className="w-full max-w-md p-8 relative overflow-hidden" style={{ background: 'rgba(19, 21, 27, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '20px' }}>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your PathWise AI account</p>
          </div>

          <div className="space-y-6">
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;