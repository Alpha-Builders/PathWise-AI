import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../..//api/client';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== retypePassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(api.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('firstName', data.user.first_name);
      localStorage.setItem('lastName', data.user.last_name);

      navigate('/select-path', { replace: true });
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
        <div className="w-full max-w-lg p-8 rounded-xl" style={{ background: 'rgba(19, 21, 27, 0.4)', backdropFilter: 'blur(10px)' }}>

          <h1 className="text-white text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-gray-300 text-center mb-6">Sign up to get started</p>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-3">
              <input
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-green-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-green-300"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-green-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-green-300"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-green-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-green-300"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-transparent border border-green-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-green-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showRetypePassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-transparent border border-green-500 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:border-green-300"
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showRetypePassword ? '🙈' : '👁'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-300 text-center mt-5">
            Already have an account?{' '}
            <Link to="/auth" className="text-green-400 hover:text-green-300">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;